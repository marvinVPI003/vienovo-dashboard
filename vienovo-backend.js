const express = require('express');
const cors = require('cors');
const axios = require('axios');
const path = require('path');
const app = express();

app.use(cors());
app.use(express.static(path.join(__dirname)));

const CSV_URLS = {
  mrDaily: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRx7S_rqgygPQifVep4DtnDFK8gGjAPVbrzCq6sCJcTF6omIGXb73iK8mQZoZjOgUq8CnZ9t7fR_2a/pub?gid=749345665&single=true&output=csv',
  mrWeekly: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRx7S_rqgygPQifVep4DtnDFK8gGjAPVbrzCq6sCJcTF6omIGXb73iK8mQZoZjOgUq8CnZ9t7fR_2a/pub?gid=1593513492&single=true&output=csv',
  pcDaily: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRx7S_rqgygPQifVep4DtnDFK8gGjAPVbrzCq6sCJcTF6omIGXb73iK8mQZoZjOgUq8CnZ9t7fR_2a/pub?gid=180375750&single=true&output=csv',
  mcosDaily: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRx7S_rqgygPQifVep4DtnDFK8gGjAPVbrzCq6sCJcTF6omIGXb73iK8mQZoZjOgUq8CnZ9t7fR_2a/pub?gid=960402999&single=true&output=csv',
  downtime: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRRx7S_rqgygPQifVep4DtnDFK8gGjAPVbrzCq6sCJcTF6omIGXb73iK8mQZoZjOgUq8CnZ9t7fR_2a/pub?gid=2030930278&single=true&output=csv'
};

function parseCSV(csv) {
  const lines = csv.trim().split('\n');
  const headers = lines[0].split(',').map(h => h.trim());
  const data = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const values = lines[i].split(',');
    const row = {};
    headers.forEach((h, idx) => {
      row[h] = values[idx] ? values[idx].trim() : '';
    });
    row._raw = values;
    data.push(row);
  }
  return data;
}

function colToIdx(col) {
  let result = 0;
  for (let i = 0; i < col.length; i++) {
    result = result * 26 + (col.charCodeAt(i) - 'A'.charCodeAt(0) + 1);
  }
  return result - 1;
}

function getCellValue(row, colLetter) {
  if (!row || !row._raw) return '';
  const idx = colToIdx(colLetter);
  return row._raw[idx] || '';
}

async function fetchCSV(url) {
  const response = await axios.get(url, { timeout: 15000 });
  return parseCSV(response.data);
}

function getLatestDataWithOutput(dataForPlant) {
  for (let i = dataForPlant.length - 1; i >= 0; i--) {
    const row = dataForPlant[i];
    const pellet = parseFloat(getCellValue(row, 'BB')) || 0;
    const crumble = parseFloat(getCellValue(row, 'BC')) || 0;
    const mash = parseFloat(getCellValue(row, 'BD')) || 0;
    const totalOutput = pellet + crumble + mash;
    if (totalOutput > 0 || i === 0) {
      return row;
    }
  }
  return {};
}

function calculateDailyProduction(mrDaily, plants) {
  const dailyData = [];
  const seen = new Set();

  for (let i = mrDaily.length - 1; i >= 0; i--) {
    const row = mrDaily[i];
    const plant = row.Plant || '';
    const date = row.Date || '';
    const key = `${plant}-${date}`;

    if (seen.has(key)) continue;
    seen.add(key);

    if (plants.includes(plant)) {
      const vietop = parseFloat(getCellValue(row, 'AZ')) || 0;
      const mixgrain = parseFloat(getCellValue(row, 'BA')) || 0;
      const pellet = parseFloat(getCellValue(row, 'BB')) || 0;
      const crumble = parseFloat(getCellValue(row, 'BC')) || 0;
      const mash = parseFloat(getCellValue(row, 'BD')) || 0;
      const total = vietop + mixgrain + pellet + crumble + mash;

      dailyData.push({
        plant,
        date,
        vietop,
        mixgrain,
        pellet,
        crumble,
        mash,
        total,
        capacity: parseFloat(getCellValue(row, 'BN')) || 0,
        rejection: parseFloat(getCellValue(row, 'BT')) || 0,
        remillReject: parseFloat(getCellValue(row, 'BS')) || 0,
        shrinkage: parseFloat(getCellValue(row, 'CB')) || 0,
        lossGain: parseFloat(getCellValue(row, 'CC')) || 0,
        kwh: parseFloat(getCellValue(row, 'CE')) || 0,
        kwhTon: parseFloat(getCellValue(row, 'CF')) || 0,
        fuel: parseFloat(getCellValue(row, 'CG')) || 0,
        fuelTon: parseFloat(getCellValue(row, 'CH')) || 0,
        coal: parseFloat(getCellValue(row, 'CK')) || 0,
        coalTon: parseFloat(getCellValue(row, 'CJ')) || 0,
        rmVarQty: parseFloat(getCellValue(row, 'CL')) || 0,
        rmVarPct: parseFloat(getCellValue(row, 'CM')) || 0
      });
    }
  }

  return dailyData;
}

app.get('/api/data', async (req, res) => {
  try {
    const [mrDaily, mrWeekly, pcDaily, mcosDaily, downtimeRaw] = await Promise.all([
      fetchCSV(CSV_URLS.mrDaily),
      fetchCSV(CSV_URLS.mrWeekly),
      fetchCSV(CSV_URLS.pcDaily),
      fetchCSV(CSV_URLS.mcosDaily),
      fetchCSV(CSV_URLS.downtime)
    ]);

    const plants = ['AC', 'PFMIS', 'HOREB', 'ARGAO', 'BUKID', 'CCPC', 'SOUTH'];
    const operatingPlants = ['AC', 'PFMIS', 'HOREB', 'ARGAO', 'BUKID'];
    const tollingPlants = ['CCPC', 'SOUTH'];

    const plantData = {};
    const dailyProduction = calculateDailyProduction(mrDaily, plants);

    plants.forEach(plant => {
      const mrDataForPlant = mrDaily.filter(r => r.Plant && r.Plant.includes(plant));
      const pcDataForPlant = pcDaily.filter(r => r.Plant && r.Plant.includes(plant));
      const mcosDataForPlant = mcosDaily.filter(r => r.Plant && r.Plant.includes(plant));

      const mrLatest = getLatestDataWithOutput(mrDataForPlant);
      const pcLatest = pcDataForPlant[pcDataForPlant.length - 1] || {};
      const mcosLatest = mcosDataForPlant[mcosDataForPlant.length - 1] || {};

      const vietop = parseFloat(getCellValue(mrLatest, 'AZ')) || 0;
      const mixgrain = parseFloat(getCellValue(mrLatest, 'BA')) || 0;
      const pelletVol = parseFloat(getCellValue(mrLatest, 'BB')) || 0;
      const crumbleVol = parseFloat(getCellValue(mrLatest, 'BC')) || 0;
      const mashVol = parseFloat(getCellValue(mrLatest, 'BD')) || 0;
      const totalOutput = vietop + mixgrain + pelletVol + crumbleVol + mashVol;

      plantData[plant] = {
        plant,
        isOperating: operatingPlants.includes(plant),
        isTolling: tollingPlants.includes(plant),
        production: {
          vietop,
          mixgrain,
          pellet: pelletVol,
          crumble: crumbleVol,
          mash: mashVol,
          total: totalOutput,
          completeFeedTotal: pelletVol + crumbleVol + mashVol
        },
        quality: {
          capacity: parseFloat(getCellValue(mrLatest, 'BN')) || 0,
          rejectionRate: parseFloat(getCellValue(mrLatest, 'BT')) || 0,
          quality: 100 - (parseFloat(getCellValue(mrLatest, 'BT')) || 0),
          remillReject: parseFloat(getCellValue(mrLatest, 'BS')) || 0,
          shrinkage: parseFloat(getCellValue(mrLatest, 'CB')) || 0,
          lossGain: parseFloat(getCellValue(mrLatest, 'CC')) || 0
        },
        utilities: {
          kwh: parseFloat(getCellValue(mrLatest, 'CE')) || 0,
          kwhTon: parseFloat(getCellValue(mrLatest, 'CF')) || 0,
          fuel: parseFloat(getCellValue(mrLatest, 'CG')) || 0,
          fuelTon: parseFloat(getCellValue(mrLatest, 'CH')) || 0,
          coal: parseFloat(getCellValue(mrLatest, 'CK')) || 0,
          coalTon: parseFloat(getCellValue(mrLatest, 'CJ')) || 0
        },
        variance: {
          rmVarQty: parseFloat(getCellValue(mrLatest, 'CL')) || 0,
          rmVarPct: parseFloat(getCellValue(mrLatest, 'CM')) || 0
        },
        cost: operatingPlants.includes(plant) ? {
          costPerTon: parseFloat(getCellValue(pcLatest, 'BH')) || 0,
          fixedCost: parseFloat(getCellValue(pcLatest, 'BD')) || 0,
          variableCost: parseFloat(getCellValue(pcLatest, 'BF')) || 0,
          breakdown: {
            rental: parseFloat(getCellValue(pcLatest, 'K')) || 0,
            spareParts: parseFloat(getCellValue(pcLatest, 'M')) || 0,
            manpowerDirect: parseFloat(getCellValue(pcLatest, 'Q')) || 0,
            power: parseFloat(getCellValue(pcLatest, 'U')) || 0,
            fuel: parseFloat(getCellValue(pcLatest, 'Y')) || 0,
            coal: parseFloat(getCellValue(pcLatest, 'AC')) || 0,
            manpowerAgency: parseFloat(getCellValue(pcLatest, 'AJ')) || 0,
            others: parseFloat(getCellValue(pcLatest, 'AP')) || 0
          }
        } : {
          costPerTon: parseFloat(getCellValue(pcLatest, 'BH')) || 0,  // Tolling rate
          breakdown: { tollingRate: parseFloat(getCellValue(pcLatest, 'BH')) || 0 }
        },
        productMix: {
          pellet: { tph: parseFloat(getCellValue(mcosLatest, 'AD')) || 0, costPerTon: parseFloat(getCellValue(mcosLatest, 'AQ')) || 0 },
          miniPellet: { tph: parseFloat(getCellValue(mcosLatest, 'V')) || 0, costPerTon: parseFloat(getCellValue(mcosLatest, 'AO')) || 0 },
          microPellet: { tph: parseFloat(getCellValue(mcosLatest, 'Z')) || 0, costPerTon: parseFloat(getCellValue(mcosLatest, 'AP')) || 0 },
          crumble: { tph: parseFloat(getCellValue(mcosLatest, 'AH')) || 0, costPerTon: parseFloat(getCellValue(mcosLatest, 'AR')) || 0 },
          mash: { tph: parseFloat(getCellValue(mcosLatest, 'AL')) || 0, costPerTon: parseFloat(getCellValue(mcosLatest, 'AS')) || 0 }
        }
      };
    });

    // OEE from weekly data
    const weeklyLatest = mrWeekly[mrWeekly.length - 1] || {};
    const oee = {
      total: parseFloat(getCellValue(weeklyLatest, 'CR')) || 0,
      performance: parseFloat(getCellValue(weeklyLatest, 'CW')) || 0,
      quality: parseFloat(getCellValue(weeklyLatest, 'CX')) || 0,
      availability: parseFloat(getCellValue(weeklyLatest, 'CY')) || 0
    };

    // Downtime processing
    const downtimeData = downtimeRaw
      .filter(r => r.Plant && plants.includes(r.Plant.trim()))
      .map(r => ({
        plant: r.Plant || '',
        date: r.Date || '',
        issue: r.Issue || '',
        duration: parseFloat(r['Total Downtime, hr'] || 0)
      }))
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    // Calculate downtime summary
    const downtimeSummary = {
      scheduled: 0,
      unscheduled: 0,
      changeover: 0,
      major: 0
    };

    downtimeData.forEach(dt => {
      if (dt.issue && dt.issue.toLowerCase().includes('scheduled')) downtimeSummary.scheduled += dt.duration;
      if (dt.issue && dt.issue.toLowerCase().includes('unscheduled')) downtimeSummary.unscheduled += dt.duration;
      if (dt.issue && dt.issue.toLowerCase().includes('changeover')) downtimeSummary.changeover += dt.duration;
      if (dt.duration > 4) downtimeSummary.major += dt.duration;
    });

    // National aggregates
    let nationalOutput = 0;
    let nationalCapacity = 0;
    let nationalQuality = 0;
    let plantCount = 0;

    Object.values(plantData).forEach(p => {
      nationalOutput += p.production.total;
      nationalCapacity += p.quality.capacity;
      nationalQuality += p.quality.quality;
      plantCount++;
    });

    const national = {
      output: nationalOutput,
      capacity: nationalCapacity / plantCount,
      quality: nationalQuality / plantCount,
      oee: oee.total
    };

    res.json({
      national,
      plantData,
      dailyProduction,
      oee,
      downtime: downtimeData,
      downtimeSummary,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
