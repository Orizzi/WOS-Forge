#!/usr/bin/env node
/*
Extract F30 → FC10 base resource costs from building sheets of resource_data.xlsx
and write src/assets/resource_costs.csv with columns:
  building,level,meat,wood,coal,iron
Assumes the workbook sheet structure where:
  - Column ' 1 ' holds level labels like '30-1', 'FC1', 'FC1-1', ..., 'FC10'
  - Columns ' 3 ', ' 5 ', ' 7 ', ' 9 ' hold Meat, Wood, Coal, Iron totals respectively
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/resource_costs.csv');

const BUILDING_SHEETS = [
  'Furnace', 'Embassy', 'Command Center', 'Infirmary',
  'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
];
// Note: War Academy starts at FC1 in-game (no F30/30-x rows); keep it in the list for FC1+.

function getAllowedKeys() {
  const keys = ['30-1','30-2','30-3','30-4'];
  for (let n = 1; n <= 9; n++) {
    const base = `FC${n}`;
    keys.push(base);
    for (let s = 1; s <= 4; s++) keys.push(`${base}-${s}`);
  }
  keys.push('FC10');
  return new Set(keys);
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  const allowed = getAllowedKeys();
  const out = [];

  for (const sheetName of BUILDING_SHEETS) {
    const worksheet = workbook.getWorksheet(sheetName);
    if (!worksheet) {
      console.warn('Sheet missing, skipping:', sheetName);
      continue;
    }
    
    const rows = [];
    worksheet.eachRow((row, rowNumber) => {
      const rowData = {};
      row.eachCell((cell, colNumber) => {
        rowData[colNumber] = cell.value;
      });
      rows.push(rowData);
    });
    
    if (!rows || rows.length === 0) continue;

    // Discover column indices (1-based in ExcelJS)
    let levelCol = null, meatCol = null, woodCol = null, coalCol = null, ironCol = null;

    // pass 1: detect columns by header names
    for (const r of rows) {
      for (const [colIdx, v] of Object.entries(r)) {
        const val = String(v || '').trim().toLowerCase();
        if (!levelCol && (val === 'fc1' || val === 'fc2' || val.startsWith('fc') || val.startsWith('30-'))) levelCol = colIdx;
        if (!meatCol && val === 'meat') meatCol = colIdx;
        if (!woodCol && val === 'wood') woodCol = colIdx;
        if (!coalCol && val === 'coal') coalCol = colIdx;
        if (!ironCol && val === 'iron') ironCol = colIdx;
      }
    }

    // Fallbacks: try common numeric columns (ExcelJS uses 1-based indexing)
    meatCol = meatCol || '3';
    woodCol = woodCol || '5';
    coalCol = coalCol || '7';
    ironCol = ironCol || '9';

    if (!levelCol || !meatCol || !woodCol || !coalCol || !ironCol) {
      console.warn('Could not map columns for sheet:', sheetName, { levelCol, meatCol, woodCol, coalCol, ironCol });
      continue;
    }

    for (const r of rows) {
      const level = r[levelCol];
      if (typeof level !== 'string') continue;
      if (!allowed.has(level)) continue;
      const meat = Number(r[meatCol]) || 0;
      const wood = Number(r[woodCol]) || 0;
      const coal = Number(r[coalCol]) || 0;
      const iron = Number(r[ironCol]) || 0;
      out.push({ building: sheetName, level, meat, wood, coal, iron });
    }
  }

  // Write CSV
  const header = 'building,level,meat,wood,coal,iron';
  const lines = [header];
  for (const r of out) lines.push(`${r.building},${r.level},${r.meat},${r.wood},${r.coal},${r.iron}`);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Extracted ${out.length} rows to ${OUTPUT}`);
}

if (require.main === module) main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
