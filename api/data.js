const axios = require('axios');

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

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  try {
    const [mrDaily, mrWeekly, pcDaily, mcosDaily, downtime] = await Promise.all([
      fetchCSV(CSV_URLS.mrDaily),
      fetchCSV(CSV_URLS.mrWeekly),
      fetchCSV(CSV_URLS.pcDaily),
      fetchCSV(CSV_URLS.mcosDaily),
      fetchCSV(CSV_URLS.downtime)
    ]);

    const plants = ['AC', 'PFMIS', 'HOREB', 'ARGAO', 'BUKID', 'CCPC', 'SOUTH'];
    const plantData = {};

    plants.forEach(plant => {
      const mrDataForPlant = mrDaily.filter(r => r.Plant && r.Plant.includes(plant));
      const pcDataForPlant = pcDaily.filter(r => r.Plant && r.Plant.includes(plant));
      const mcosDataForPlant = mcosDaily.filter(r => r.Plant && r.Plant.includes(plant));

      const mrLatest = mrDataForPlant[mrDataForPlant.length - 1] || {};
      const pcLatest = pcDataForPlant[pcDataForPlant.length - 1] || {};
      const mcosLatest = mcosDataForPlant[mcosDataForPlant.length - 1] || {};

      const vietop = parseFloat(getCellValue(mrLatest, 'AZ')) || 0;
      const mixgrain = parseFloat(getCellValue(mrLatest, 'BA')) || 0;
      const pelletVol = parseFloat(getCellValue(mrLatest, 'BB')) || 0;
      const crumbleVol = parseFloat(getCellValue(mrLatest, 'BC')) || 0;
      const mashVol = parseFloat(getCellValue(mrLatest, 'BD')) || 0;
      const totalOutput = vietop + mixgrain + pelletVol + crumbleVol + mashVol;

      plantData[plant] = {
        output: totalOutput,
        capacity: parseFloat(getCellValue(mrLatest, 'BN')) || 0,
        rejection: parseFloat(getCellValue(mrLatest, 'BT')) || 0,
        quality: 100 - (parseFloat(getCellValue(mrLatest, 'BT')) || 0),
        remillReject: parseFloat(getCellValue(mrLatest, 'BS')) || 0,
        shrinkage: parseFloat(getCellValue(mrLatest, 'CB')) || 0,
        lossGain: parseFloat(getCellValue(mrLatest, 'CC')) || 0,
        kwh: parseFloat(getCellValue(mrLatest, 'CE')) || 0,
        kwhTon: parseFloat(getCellValue(mrLatest, 'CF')) || 0,
        fuel: parseFloat(getCellValue(mrLatest, 'CG')) || 0,
        fuelTon: parseFloat(getCellValue(mrLatest, 'CH')) || 0,
        rmVarQty: parseFloat(getCellValue(mrLatest, 'CL')) || 0,
        rmVarPct: parseFloat(getCellValue(mrLatest, 'CM')) || 0,
        costPerTon: parseFloat(getCellValue(pcLatest, 'BH')) || 0,
        fixedCost: parseFloat(getCellValue(pcLatest, 'BD')) || 0,
        variableCost: parseFloat(getCellValue(pcLatest, 'BF')) || 0,
        costBreakdown: {
          rental: getCellValue(pcLatest, 'K'),
          spareParts: getCellValue(pcLatest, 'M'),
          manpowerDirect: getCellValue(pcLatest, 'Q'),
          power: getCellValue(pcLatest, 'U'),
          fuel: getCellValue(pcLatest, 'Y'),
          coal: getCellValue(pcLatest, 'AC'),
          manpowerAgency: getCellValue(pcLatest, 'AJ'),
          others: getCellValue(pcLatest, 'AP')
        },
        productMix: {
          pellet: { tph: parseFloat(getCellValue(mcosLatest, 'AD')) || 0, cost: parseFloat(getCellValue(mcosLatest, 'AQ')) || 0 },
          miniPellet: { tph: parseFloat(getCellValue(mcosLatest, 'V')) || 0, cost: parseFloat(getCellValue(mcosLatest, 'AO')) || 0 },
          microPellet: { tph: parseFloat(getCellValue(mcosLatest, 'Z')) || 0, cost: parseFloat(getCellValue(mcosLatest, 'AP')) || 0 },
          crumble: { tph: parseFloat(getCellValue(mcosLatest, 'AH')) || 0, cost: parseFloat(getCellValue(mcosLatest, 'AR')) || 0 },
          mash: { tph: parseFloat(getCellValue(mcosLatest, 'AL')) || 0, cost: parseFloat(getCellValue(mcosLatest, 'AS')) || 0 }
        }
      };
    });

    const weeklyLatest = mrWeekly[mrWeekly.length - 1] || {};
    const oee = {
      total: parseFloat(getCellValue(weeklyLatest, 'CR')) || 0,
      performance: parseFloat(getCellValue(weeklyLatest, 'CW')) || 0,
      quality: parseFloat(getCellValue(weeklyLatest, 'CX')) || 0,
      availability: parseFloat(getCellValue(weeklyLatest, 'CY')) || 0
    };

    const downtimeData = downtime.map(r => ({
      plant: r.Plant || '',
      date: r.Date || '',
      issue: r.Issue || '',
      duration: parseFloat(r['Total Downtime, hr'] || 0)
    }));

    res.status(200).json({ plantData, oee, downtime: downtimeData });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}
