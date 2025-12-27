#!/usr/bin/env node
// List all sheet names in src/assets/resource_data.xlsx
const ExcelJS = require('exceljs');
const path = require('path');
const INPUT = path.resolve('src/assets/resource_data.xlsx');
(async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  console.log('Sheet names:');
  workbook.worksheets.forEach(ws => console.log(ws.name));
})();
