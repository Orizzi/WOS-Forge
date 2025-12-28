#!/usr/bin/env node
// Inspect Heroes and Chief & Hero Data sheets to understand expert data structure
const ExcelJS = require('exceljs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');

(async () => {
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);

  console.log('\n=== HEROES SHEET ===');
  const heroesSheet = workbook.getWorksheet('Heroes');
  if (heroesSheet) {
    console.log(`Rows: ${heroesSheet.rowCount}, Columns: ${heroesSheet.columnCount}`);
    console.log('\nFirst 10 rows:');
    for (let i = 1; i <= Math.min(10, heroesSheet.rowCount); i++) {
      const row = heroesSheet.getRow(i);
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        values.push(cell.value);
      });
      console.log(`Row ${i}:`, values);
    }
  } else {
    console.log('Heroes sheet not found');
  }

  console.log('\n=== CHIEF & HERO DATA SHEET ===');
  const chiefHeroSheet = workbook.getWorksheet('Chief & Hero Data');
  if (chiefHeroSheet) {
    console.log(`Rows: ${chiefHeroSheet.rowCount}, Columns: ${chiefHeroSheet.columnCount}`);
    console.log('\nFirst 10 rows:');
    for (let i = 1; i <= Math.min(10, chiefHeroSheet.rowCount); i++) {
      const row = chiefHeroSheet.getRow(i);
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        values.push(cell.value);
      });
      console.log(`Row ${i}:`, values);
    }
  } else {
    console.log('Chief & Hero Data sheet not found');
  }

  console.log('\n=== DAWN ACADEMY SHEET ===');
  const dawnSheet = workbook.getWorksheet('Dawn Academy');
  if (dawnSheet) {
    console.log(`Rows: ${dawnSheet.rowCount}, Columns: ${dawnSheet.columnCount}`);
    console.log('\nFirst 10 rows:');
    for (let i = 1; i <= Math.min(10, dawnSheet.rowCount); i++) {
      const row = dawnSheet.getRow(i);
      const values = [];
      row.eachCell({ includeEmpty: true }, (cell, colNum) => {
        values.push(cell.value);
      });
      console.log(`Row ${i}:`, values);
    }
  } else {
    console.log('Dawn Academy sheet not found');
  }
})();
