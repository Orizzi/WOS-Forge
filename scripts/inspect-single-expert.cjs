#!/usr/bin/env node
// Inspect a single expert sheet (e.g., Cyrille) to understand the data structure
const ExcelJS = require('exceljs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const EXPERT_NAME = process.argv[2] || 'Cyrille';

(async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);

  console.log(`\n=== ${EXPERT_NAME.toUpperCase()} SHEET ===`);
  const expertSheet = workbook.getWorksheet(EXPERT_NAME);
  
  if (!expertSheet) {
    console.log(`Sheet "${EXPERT_NAME}" not found`);
    console.log('\nAvailable expert sheets:');
    ['Cyrille', 'Agnes', 'Holger', 'Romulus', 'Fabian', 'Baldur'].forEach(name => {
      const sheet = workbook.getWorksheet(name);
      if (sheet) console.log(`  - ${name}`);
    });
    return;
  }

  console.log(`Rows: ${expertSheet.rowCount}, Columns: ${expertSheet.columnCount}\n`);
  
  // Show first 20 rows to get a full picture
  for (let i = 1; i <= Math.min(25, expertSheet.rowCount); i++) {
    const row = expertSheet.getRow(i);
    const values = [];
    row.eachCell({ includeEmpty: false }, (cell, colNum) => {
      let val = cell.value;
      if (val && typeof val === 'object' && val.formula) {
        val = val.result !== undefined ? val.result : `[formula]`;
      }
      values.push(`[${colNum}]: ${val}`);
    });
    if (values.length > 0) {
      console.log(`Row ${i}:`);
      values.forEach(v => console.log(`  ${v}`));
    }
  }
})();
