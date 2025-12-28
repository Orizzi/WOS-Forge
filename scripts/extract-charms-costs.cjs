#!/usr/bin/env node
/*
Extract charm upgrade costs from the 'Charms Data' sheet and write to CSV.
Expected columns: Level, Guides, Designs, Secrets, Power, SvS Points
Output: src/assets/charms_costs.csv with header: level,guides,designs,secrets,power,svsPoints
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/charms_costs.csv');
const SHEET_NAME = 'Charms Data';

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  const worksheet = workbook.getWorksheet(SHEET_NAME);
  if (!worksheet) {
    console.error('Sheet not found:', SHEET_NAME);
    process.exit(1);
  }

  const out = [];
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber <= 3) return; // Skip headers (rows 1-3)
    
    const values = row.values; // values array is 1-indexed
    // Columns: 3=Level, 4=Guides, 5=Designs, 6=Secrets, 7=Power, 8=SvS Points
    const level = values[3];
    if (typeof level !== 'number' || level <= 0) return; // skip invalid

    const guides = Number(values[4]) || 0;
    const designs = Number(values[5]) || 0;
    const secrets = Number(values[6]) || 0;
    const power = Number(values[7]) || 0;
    const svsPoints = Number(values[8]) || 0;

    out.push({ level, guides, designs, secrets, power, svsPoints });
  });
  
  if (out.length === 0) {
    console.error('No valid rows found in sheet:', SHEET_NAME);
    process.exit(1);
  }

  // Write CSV
  const header = 'level,guides,designs,secrets,power,svsPoints';
  const lines = [header];
  for (const r of out) lines.push(`${r.level},${r.guides},${r.designs},${r.secrets},${r.power},${r.svsPoints}`);

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Extracted ${out.length} charm levels to ${OUTPUT}`);
}

if (require.main === module) main().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
