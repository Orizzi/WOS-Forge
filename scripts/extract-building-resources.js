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
const XLSX = require('xlsx');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/resource_costs.csv');

const BUILDING_SHEETS = [
  'Furnace', 'Embassy', 'Command Center', 'Infirmary',
  'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
];

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

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  const wb = XLSX.readFile(INPUT);
  const allowed = getAllowedKeys();
  const out = [];

  for (const sheetName of BUILDING_SHEETS) {
    const ws = wb.Sheets[sheetName];
    if (!ws) {
      console.warn('Sheet missing, skipping:', sheetName);
      continue;
    }
    const rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: true });
    if (!rows || rows.length === 0) continue;

    // Discover column keys
    let levelKey = null, meatKey = null, woodKey = null, coalKey = null, ironKey = null;

    // pass 1: detect keys by header names
    for (const r of rows) {
      for (const [k, v] of Object.entries(r)) {
        const val = String(v).trim().toLowerCase();
        if (!levelKey && (val === 'fc1' || val === 'fc2' || val.startsWith('fc') || val.startsWith('30-'))) levelKey = k;
        if (!meatKey && val === 'meat') meatKey = k;
        if (!woodKey && val === 'wood') woodKey = k;
        if (!coalKey && val === 'coal') coalKey = k;
        if (!ironKey && val === 'iron') ironKey = k;
      }
    }

    // Fallbacks: if resource keys not found by header names, try common numeric columns
    const fallbackNums = [' 3 ', '__EMPTY_3', '3'];
    meatKey = meatKey || fallbackNums.find(k => rows[0].hasOwnProperty(k));
    const fallbackWood = [' 5 ', '__EMPTY_5', '5'];
    woodKey = woodKey || fallbackWood.find(k => rows[0].hasOwnProperty(k));
    const fallbackCoal = [' 7 ', '__EMPTY_7', '7'];
    coalKey = coalKey || fallbackCoal.find(k => rows[0].hasOwnProperty(k));
    const fallbackIron = [' 9 ', '__EMPTY_9', '9'];
    ironKey = ironKey || fallbackIron.find(k => rows[0].hasOwnProperty(k));

    if (!levelKey || !meatKey || !woodKey || !coalKey || !ironKey) {
      console.warn('Could not map columns for sheet:', sheetName, { levelKey, meatKey, woodKey, coalKey, ironKey });
      continue;
    }

    for (const r of rows) {
      const level = r[levelKey];
      if (typeof level !== 'string') continue;
      if (!allowed.has(level)) continue;
      const meat = Number(r[meatKey]) || 0;
      const wood = Number(r[woodKey]) || 0;
      const coal = Number(r[coalKey]) || 0;
      const iron = Number(r[ironKey]) || 0;
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

if (require.main === module) main();
