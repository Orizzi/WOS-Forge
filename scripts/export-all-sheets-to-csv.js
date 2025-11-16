#!/usr/bin/env node
/*
Export every worksheet in src/assets/resource_data.xlsx to CSV files.
Outputs to src/assets/sheets/<sheet-name>.csv
Also normalizes names for filesystem safety.
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUT_DIR = path.resolve('src/assets/sheets');

function safeName(name){
  return String(name)
    .trim()
    .replace(/[\\/:*?"<>|]+/g, '-')
    .replace(/\s+/g, ' ')
    .replace(/\s/g, '_');
}

function csvEscape(field){
  if(field == null) return '';
  const s = String(field);
  if(/[",\n]/.test(s)){
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

async function main(){
  if(!fs.existsSync(INPUT)){
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);

  let count=0;
  for(const ws of workbook.worksheets){
    const rows = [];
    for(let r=1; r<=ws.rowCount; r++){
      const row = ws.getRow(r);
      const line = [];
      for(let c=1; c<=row.cellCount; c++){
        const val = row.getCell(c).value;
        // ExcelJS may return objects for rich text; coerce nicely
        let outVal = '';
        if(typeof val === 'object' && val && val.text){
          outVal = val.text;
        } else if(typeof val === 'object' && val && val.result != null){
          outVal = val.result;
        } else if(typeof val === 'object' && val && val.richText){
          outVal = val.richText.map(x=>x.text).join('');
        } else {
          outVal = val == null ? '' : val;
        }
        line.push(csvEscape(outVal));
      }
      // Trim trailing empties
      while(line.length && line[line.length-1] === '') line.pop();
      rows.push(line.join(','));
    }
    const outPath = path.join(OUT_DIR, safeName(ws.name)+'.csv');
    fs.writeFileSync(outPath, rows.join('\n'), 'utf8');
    console.log('Exported sheet →', outPath);
    count++;
  }
  console.log(`Done. Exported ${count} sheets to ${OUT_DIR}`);
}

if(require.main === module){
  main().catch(err => { console.error('Error:', err); process.exit(1); });
}
