#!/usr/bin/env node
/*
Extract charm upgrade costs from the 'Charms Data' sheet and write to CSV.
Expected columns: Level, Guides, Designs, Secrets, Power, SvS Points
Output: src/assets/charms_costs.csv with header: level,guides,designs,secrets,power,svsPoints
*/

const fs = require('fs');
const path = require('path');
const XLSX = require('xlsx');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/charms_costs.csv');
const SHEET_NAME = 'Charms Data';

function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  const wb = XLSX.readFile(INPUT);
  const ws = wb.Sheets[SHEET_NAME];
  if (!ws) {
    console.error('Sheet not found:', SHEET_NAME);
    process.exit(1);
  }

  const rows = XLSX.utils.sheet_to_json(ws, { defval: '', raw: true });
  if (!rows || rows.length === 0) {
    console.error('No rows found in sheet:', SHEET_NAME);
    process.exit(1);
  }

  const out = [];
  for (const r of rows) {
    // Columns: 'Charm Upgrade Costs' (Level), __EMPTY (Guides), __EMPTY_1 (Designs), __EMPTY_2 (Secrets), __EMPTY_3 (Power), __EMPTY_4 (SvS Points)
    const level = r['Charm Upgrade Costs'];
    if (typeof level !== 'number' || level <= 0) continue; // skip header or invalid

    const guides = Number(r.__EMPTY) || 0;
    const designs = Number(r.__EMPTY_1) || 0;
    const secrets = Number(r.__EMPTY_2) || 0;
    const power = Number(r.__EMPTY_3) || 0;
    const svsPoints = Number(r.__EMPTY_4) || 0;

    out.push({ level, guides, designs, secrets, power, svsPoints });
  }

  // Write CSV
  const header = 'level,guides,designs,secrets,power,svsPoints';
  const lines = [header];
  for (const r of out) lines.push(`${r.level},${r.guides},${r.designs},${r.secrets},${r.power},${r.svsPoints}`);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Extracted ${out.length} charm levels to ${OUTPUT}`);
}

if (require.main === module) main();
