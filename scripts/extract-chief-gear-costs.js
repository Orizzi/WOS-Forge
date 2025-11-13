/**
 * extract-chief-gear-costs.js
 * Extracts chief gear costs from 'New Chief Gear Data' sheet
 * Outputs CSV for chief-gear-calculator.js to load at runtime
 */

const xlsx = require('xlsx');
const fs = require('fs');
const path = require('path');

// Paths
const workbookPath = path.resolve(__dirname, '../src/assets/resource_data.xlsx');
const outputCsvPath = path.resolve(__dirname, '../src/assets/chief_gear_costs.csv');

// Read workbook
const workbook = xlsx.readFile(workbookPath);
const sheetName = 'New Chief Gear Data';

if (!workbook.SheetNames.includes(sheetName)) {
  console.error(`Sheet '${sheetName}' not found in workbook.`);
  process.exit(1);
}

const sheet = workbook.Sheets[sheetName];
const data = xlsx.utils.sheet_to_json(sheet, { header: 1, defval: '' });

// Header is at row index 2, data starts at row index 3
// Columns: [empty cols], Gear Level, #, Alloy, Polish, Plans, Amber, Power, SvS Points
const headerRow = 2;
const dataStartRow = 3;

const gearLevelIdx = 3;
const numberIdx = 4;
const alloyIdx = 5;
const polishIdx = 6;
const plansIdx = 7;
const amberIdx = 8;
const powerIdx = 9;
const svsPointsIdx = 10;

// Extract rows
const rows = [];
for (let i = dataStartRow; i < data.length; i++) {
  const row = data[i];
  const gearLevel = String(row[gearLevelIdx] || '').trim();
  const number = row[numberIdx] || 0;
  const alloy = row[alloyIdx] || 0;
  const polish = row[polishIdx] || 0;
  const plans = row[plansIdx] || 0;
  const amber = row[amberIdx] || 0;
  const power = row[powerIdx] || 0;
  const svsPoints = row[svsPointsIdx] || 0;

  // Skip empty rows or rows without a gear level
  if (!gearLevel || gearLevel === '' || gearLevel === 'Locked') continue;

  rows.push({
    gearLevel,
    number,
    alloy,
    polish,
    plans,
    amber,
    power,
    svsPoints
  });
}

console.log(`Extracted ${rows.length} chief gear levels from '${sheetName}' sheet.`);

// Write CSV
const csvLines = [
  'gearLevel,number,alloy,polish,plans,amber,power,svsPoints',
  ...rows.map(r => `${r.gearLevel},${r.number},${r.alloy},${r.polish},${r.plans},${r.amber},${r.power},${r.svsPoints}`)
];

fs.writeFileSync(outputCsvPath, csvLines.join('\n'), 'utf8');
console.log(`Extracted ${rows.length} chief gear levels to ${outputCsvPath}`);
