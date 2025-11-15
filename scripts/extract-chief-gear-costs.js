/**
 * extract-chief-gear-costs.js
 * Extracts chief gear costs from 'New Chief Gear Data' sheet
 * Outputs CSV for chief-gear-calculator.js to load at runtime
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

// Paths
const workbookPath = path.resolve(__dirname, '../src/assets/resource_data.xlsx');
const outputCsvPath = path.resolve(__dirname, '../src/assets/chief_gear_costs.csv');

async function main() {
  // Read workbook
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);
  const sheetName = 'New Chief Gear Data';

  const worksheet = workbook.getWorksheet(sheetName);
  if (!worksheet) {
    console.error(`Sheet '${sheetName}' not found in workbook.`);
    process.exit(1);
  }

  // Header is at row 3, data starts at row 4 (1-based)
  // Columns: [empty cols], Gear Level (4), # (5), Alloy (6), Polish (7), Plans (8), Amber (9), Power (10), SvS Points (11)
  const dataStartRow = 4;

  const gearLevelIdx = 4;
  const numberIdx = 5;
  const alloyIdx = 6;
  const polishIdx = 7;
  const plansIdx = 8;
  const amberIdx = 9;
  const powerIdx = 10;
  const svsPointsIdx = 11;

  // Extract rows
  const rows = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < dataStartRow) return;
    
    const values = row.values; // 1-indexed array
    const gearLevel = String(values[gearLevelIdx] || '').trim();
    const number = values[numberIdx] || 0;
    const alloy = values[alloyIdx] || 0;
    const polish = values[polishIdx] || 0;
    const plans = values[plansIdx] || 0;
    const amber = values[amberIdx] || 0;
    const power = values[powerIdx] || 0;
    const svsPoints = values[svsPointsIdx] || 0;

    // Skip empty rows or rows without a gear level
    if (!gearLevel || gearLevel === '' || gearLevel === 'Locked') return;

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
  });

  console.log(`Extracted ${rows.length} chief gear levels from '${sheetName}' sheet.`);

  // Write CSV
  const csvLines = [
    'gearLevel,number,alloy,polish,plans,amber,power,svsPoints',
    ...rows.map(r => `${r.gearLevel},${r.number},${r.alloy},${r.polish},${r.plans},${r.amber},${r.power},${r.svsPoints}`)
  ];

  fs.writeFileSync(outputCsvPath, csvLines.join('\n'), 'utf8');
  console.log(`Extracted ${rows.length} chief gear levels to ${outputCsvPath}`);
}

if (require.main === module) main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
