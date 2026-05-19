/**
 * VIENOVO PRODUCTION DASHBOARD - GOOGLE APPS SCRIPT v2
 * Fetches and aggregates data from 4 sheets: MR daily, PC daily, MCOS daily, Downtime
 * Serves data as JSON via public web endpoint
 *
 * SETUP:
 * 1. Go to script.google.com
 * 2. Create new project
 * 3. Replace ALL code in Code.gs with this script
 * 4. Replace SHEET_ID with your spreadsheet ID
 * 5. Click Deploy > New deployment > Web app > Execute as [your account] > Anyone
 * 6. Copy the deployment URL to use in dashboard HTML
 */

// ============================================================================
// CONFIGURATION - UPDATE THESE VALUES
// ============================================================================

const SHEET_ID = '1MbE-tRIBo7uqSxaOMgeDP1BttzHvfGevtrcOQruInsk'; // Your Google Sheet ID

// Sheet names (must match exactly - case sensitive)
const SHEET_NAMES = {
  mr: 'MR daily',
  pc: 'PC daily',
  mcos: 'MCOS daily',
  downtime: 'Downtime'
};

// Column mappings (0-indexed)
const MR_COLUMNS = {
  year: 0,
  plant: 1,
  date: 2,
  week: 3,
  month: 4,
  totalVolume: 5,
  pelletVolume: 6,
  crumbleVolume: 7,
  remillReject: 8
};

const PC_COLUMNS = {
  year: 0,
  plant: 1,
  date: 2,
  week: 3,
  volumeMT: 4,
  variableCost: 5,
  fixedCost: 6,
  mcos: 7,
  mcosPerTon: 8,
  rollsDie: 9,
  fuel: 10,
  powerRate: 11
};

const DOWNTIME_COLUMNS = {
  plant: 0,
  date: 1,
  weekNum: 2,
  month: 3,
  workingHours: 4,
  scheduledOper: 5,
  scheduledDowntime: 6,
  unscheduledDowntime: 7,
  equipmentDowntimePercent: 8,
  equipmentDowntime: 9
};

// ============================================================================
// MAIN HANDLER
// ============================================================================

function doGet(e) {
  try {
    const ss = SpreadsheetApp.openById(SHEET_ID);

    // Get all sheet data
    const mrData = getSheetData(ss, SHEET_NAMES.mr);
    const pcData = getSheetData(ss, SHEET_NAMES.pc);
    const mcosData = getSheetData(ss, SHEET_NAMES.mcos);
    const downtimeData = getSheetData(ss, SHEET_NAMES.downtime);

    if (!mrData || mrData.length === 0) {
      return errorResponse('MR daily sheet is empty or not found');
    }

    // Process data
    const processedMR = processMRData(mrData);
    const processedPC = processPCData(pcData);
    const processedDowntime = processDowntimeData(downtimeData);

    // Get latest data by plant and date
    const latestData = getLatestRecords(processedMR, processedPC, processedDowntime);

    // Build response
    const response = {
      success: true,
      timestamp: new Date().toISOString(),
      data_status: {
        mr_records: processedMR.length,
        pc_records: processedPC.length,
        downtime_records: processedDowntime.length
      },
      plants: ['NATIONAL', 'AC', 'PFMIS', 'HOREB', 'ARGAO', 'BUKID', 'CCPC', 'SOUTH'],
      latest: latestData,
      daily_summary: getDailySummary(processedMR, processedPC, latestData),
      weekly_summary: getWeeklySummary(processedMR),
      monthly_summary: getMonthlySummary(processedMR)
    };

    return ContentService.createTextOutput(JSON.stringify(response))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error: ' + error.toString());
    return errorResponse('Error: ' + error.toString());
  }
}

// ============================================================================
// DATA RETRIEVAL
// ============================================================================

function getSheetData(ss, sheetName) {
  try {
    const sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      Logger.log('Sheet not found: ' + sheetName);
      return [];
    }
    const range = sheet.getDataRange();
    return range.getValues();
  } catch (e) {
    Logger.log('Error getting sheet data for ' + sheetName + ': ' + e);
    return [];
  }
}

// ============================================================================
// DATA PROCESSING
// ============================================================================

function processMRData(data) {
  const result = [];

  // Skip header row (row 0)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    // Skip empty rows
    if (!row[MR_COLUMNS.plant]) continue;

    const record = {
      year: row[MR_COLUMNS.year] || new Date().getFullYear(),
      plant: String(row[MR_COLUMNS.plant]).toUpperCase().trim(),
      date: row[MR_COLUMNS.date] || '',
      week: row[MR_COLUMNS.week] || 0,
      month: row[MR_COLUMNS.month] || '',
      totalVolume: parseFloat(row[MR_COLUMNS.totalVolume]) || 0,
      pelletVolume: parseFloat(row[MR_COLUMNS.pelletVolume]) || 0,
      crumbleVolume: parseFloat(row[MR_COLUMNS.crumbleVolume]) || 0,
      remillReject: parseFloat(row[MR_COLUMNS.remillReject]) || 0
    };

    if (record.plant) {
      result.push(record);
    }
  }

  return result;
}

function processPCData(data) {
  const result = [];

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (!row[PC_COLUMNS.plant]) continue;

    const record = {
      year: row[PC_COLUMNS.year] || new Date().getFullYear(),
      plant: String(row[PC_COLUMNS.plant]).toUpperCase().trim(),
      date: row[PC_COLUMNS.date] || '',
      week: row[PC_COLUMNS.week] || 0,
      volumeMT: parseFloat(row[PC_COLUMNS.volumeMT]) || 0,
      variableCost: parseFloat(row[PC_COLUMNS.variableCost]) || 0,
      fixedCost: parseFloat(row[PC_COLUMNS.fixedCost]) || 0,
      mcos: parseFloat(row[PC_COLUMNS.mcos]) || 0,
      mcosPerTon: parseFloat(row[PC_COLUMNS.mcosPerTon]) || 0,
      rollsDie: parseFloat(row[PC_COLUMNS.rollsDie]) || 0,
      fuel: parseFloat(row[PC_COLUMNS.fuel]) || 0,
      powerRate: parseFloat(row[PC_COLUMNS.powerRate]) || 0
    };

    if (record.plant) {
      result.push(record);
    }
  }

  return result;
}

function processDowntimeData(data) {
  const result = [];

  // Skip header row
  for (let i = 1; i < data.length; i++) {
    const row = data[i];

    if (!row[DOWNTIME_COLUMNS.plant]) continue;

    const record = {
      plant: String(row[DOWNTIME_COLUMNS.plant]).toUpperCase().trim(),
      date: row[DOWNTIME_COLUMNS.date] || '',
      weekNum: row[DOWNTIME_COLUMNS.weekNum] || 0,
      month: row[DOWNTIME_COLUMNS.month] || '',
      workingHours: parseFloat(row[DOWNTIME_COLUMNS.workingHours]) || 0,
      scheduledOper: parseFloat(row[DOWNTIME_COLUMNS.scheduledOper]) || 0,
      scheduledDowntime: parseFloat(row[DOWNTIME_COLUMNS.scheduledDowntime]) || 0,
      unscheduledDowntime: parseFloat(row[DOWNTIME_COLUMNS.unscheduledDowntime]) || 0,
      equipmentDowntimePercent: parseFloat(row[DOWNTIME_COLUMNS.equipmentDowntimePercent]) || 0,
      equipmentDowntime: parseFloat(row[DOWNTIME_COLUMNS.equipmentDowntime]) || 0
    };

    if (record.plant) {
      result.push(record);
    }
  }

  return result;
}

// ============================================================================
// DATA AGGREGATION
// ============================================================================

function getLatestRecords(mrData, pcData, downtimeData) {
  const latestByPlant = {};

  // Get latest MR record for each plant
  for (const record of mrData) {
    const plant = record.plant;
    if (!latestByPlant[plant] || new Date(record.date) > new Date(latestByPlant[plant].date || 0)) {
      latestByPlant[plant] = {
        ...record,
        pc: {},
        downtime: {}
      };
    }
  }

  // Merge PC data
  for (const record of pcData) {
    const plant = record.plant;
    if (latestByPlant[plant] &&
        (!latestByPlant[plant].pc.date || new Date(record.date) > new Date(latestByPlant[plant].pc.date))) {
      latestByPlant[plant].pc = record;
    }
  }

  // Merge Downtime data
  for (const record of downtimeData) {
    const plant = record.plant;
    if (latestByPlant[plant] &&
        (!latestByPlant[plant].downtime.date || new Date(record.date) > new Date(latestByPlant[plant].downtime.date))) {
      latestByPlant[plant].downtime = record;
    }
  }

  // Add NATIONAL summary
  latestByPlant['NATIONAL'] = calculateNationalSummary(latestByPlant);

  return latestByPlant;
}

function calculateNationalSummary(latestByPlant) {
  const operatingPlants = ['AC', 'PFMIS', 'HOREB', 'ARGAO', 'BUKID'];
  let totalVolume = 0;
  let totalCost = 0;
  let totalDowntime = 0;
  let count = 0;

  for (const plant of operatingPlants) {
    if (latestByPlant[plant]) {
      totalVolume += latestByPlant[plant].totalVolume || 0;
      totalCost += (latestByPlant[plant].pc?.mcos || 0);
      totalDowntime += (latestByPlant[plant].downtime?.unscheduledDowntime || 0);
      count++;
    }
  }

  return {
    plant: 'NATIONAL',
    totalVolume: totalVolume,
    pelletVolume: 0,
    crumbleVolume: 0,
    remillReject: 0,
    pc: {
      mcos: totalCost,
      mcosPerTon: count > 0 ? totalCost / count : 0
    },
    downtime: {
      unscheduledDowntime: totalDowntime
    }
  };
}

function getDailySummary(mrData, pcData, latestData) {
  const summary = {};

  for (const plant in latestData) {
    summary[plant] = {
      date: latestData[plant].date,
      production: {
        total: latestData[plant].totalVolume,
        pellet: latestData[plant].pelletVolume,
        crumble: latestData[plant].crumbleVolume,
        remill: latestData[plant].remillReject
      },
      costs: latestData[plant].pc || {},
      downtime: latestData[plant].downtime || {}
    };
  }

  return summary;
}

function getWeeklySummary(mrData) {
  const byWeek = {};

  for (const record of mrData) {
    const key = record.plant + '_W' + record.week + '_' + record.month;
    if (!byWeek[key]) {
      byWeek[key] = [];
    }
    byWeek[key].push(record);
  }

  const summary = {};
  for (const key in byWeek) {
    const records = byWeek[key];
    const totalVolume = records.reduce((sum, r) => sum + (r.totalVolume || 0), 0);

    summary[key] = {
      plant: records[0].plant,
      week: records[0].week,
      month: records[0].month,
      totalVolume: totalVolume,
      averageDailyVolume: totalVolume / records.length,
      daysData: records.length
    };
  }

  return summary;
}

function getMonthlySummary(mrData) {
  const byMonth = {};

  for (const record of mrData) {
    const key = record.plant + '_' + record.month;
    if (!byMonth[key]) {
      byMonth[key] = [];
    }
    byMonth[key].push(record);
  }

  const summary = {};
  for (const key in byMonth) {
    const records = byMonth[key];
    const totalVolume = records.reduce((sum, r) => sum + (r.totalVolume || 0), 0);

    summary[key] = {
      plant: records[0].plant,
      month: records[0].month,
      totalVolume: totalVolume,
      averageDailyVolume: totalVolume / records.length,
      daysData: records.length
    };
  }

  return summary;
}

// ============================================================================
// UTILITIES
// ============================================================================

function errorResponse(message) {
  return ContentService.createTextOutput(JSON.stringify({
    success: false,
    error: message,
    timestamp: new Date().toISOString()
  })).setMimeType(ContentService.MimeType.JSON);
}
