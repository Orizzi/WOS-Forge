#!/usr/bin/env node
// Inspect Pet Data sheet structure
const ExcelJS = require('exceljs');
const path = require('path');
const INPUT = path.resolve('src/assets/resource_data.xlsx');

(async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  const worksheet = workbook.getWorksheet('Pet Data');
  
  if (!worksheet) {
    console.error('Pet Data sheet not found');
    process.exit(1);
  }

  console.log('=== Pet Data Sheet ===');
  console.log('Row count:', worksheet.rowCount);
  console.log('Column count:', worksheet.columnCount);
  console.log('\nFirst 10 rows:\n');
  
  let rowNum = 0;
  worksheet.eachRow((row, idx) => {
    if (idx > 10) return;
    rowNum++;
    console.log(`Row ${idx}:`, row.values);
  });
  
  console.log('\n=== Cell Details for First Data Row (Row 4) ===');
  const row4 = worksheet.getRow(4);
  row4.eachCell((cell, colNumber) => {
    console.log(`Col ${colNumber} (${cell.address}):`, {
      type: cell.type,
      value: cell.value,
      text: cell.text,
      result: cell.result
    });
  });
})();
