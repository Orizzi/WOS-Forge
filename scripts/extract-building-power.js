#!/usr/bin/env node
/*
Extract building power per major level (FC1..FC10) from resource_data.xlsx
and write to src/assets/building_power.csv with columns:
  building,level,power

Heuristics:
- Prefer a sheet named 'Building Power' (case-insensitive). It may be either:
  A) already in long form with headers building, level, power; or
  B) wide form with one row per building and columns FC1..FC10.
- If that sheet is missing, attempt to derive power from per-building sheets
  when a column header 'Power' exists at major-level rows (FC1..FC10).
- If none found, keep existing CSV untouched and exit with a warning.
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/building_power.csv');

const BUILDING_SHEETS = [
  'Furnace', 'Embassy', 'Command Center', 'Infirmary',
  'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
];

function writeCsv(rows){
  const header = 'building,level,power';
  const lines = [header, ...rows.map(r => `${r.building},${r.level},${r.power}`)];
  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Wrote ${rows.length} power rows to ${OUTPUT}`);
}

async function trySheetLongForm(ws){
  // Detect columns by header names in first 5 rows
  let buildingCol=null, levelCol=null, powerCol=null, headerRowIdx=null;
  for (let r=1; r<=5; r++){
    const row = ws.getRow(r);
    let hits=0;
    row.eachCell((cell, cidx) => {
      const v = String(cell.value || '').trim().toLowerCase();
      if(v === 'building'){ buildingCol = cidx; hits++; }
      if(v === 'level'){ levelCol = cidx; hits++; }
      if(v === 'power'){ powerCol = cidx; hits++; }
    });
    if(hits >= 2) { headerRowIdx = r; break; }
  }
  if(!levelCol || !powerCol || !buildingCol) return null;
  const out=[];
  for(let r=headerRowIdx+1; r<=ws.rowCount; r++){
    const row = ws.getRow(r);
    const building = String(row.getCell(buildingCol).value || '').trim();
    const level = String(row.getCell(levelCol).value || '').trim();
    const power = Number(row.getCell(powerCol).value) || 0;
    if(!building || !level) continue;
    if(!/^FC(10|[1-9])$/.test(level)) continue; // only major levels
    out.push({ building, level, power });
  }
  return out.length ? out : null;
}

async function trySheetWideForm(ws){
  // Expect header row containing FC1..FC10 and first column as Building name
  let headerRowIdx = null;
  let levelCols = []; // [{level:'FC1', col: idx}, ...]

  for(let r=1; r<=6; r++){
    const row = ws.getRow(r);
    const labels = [];
    row.eachCell((cell, cidx)=>{
      const v = String(cell.value || '').trim();
      if(/^FC(10|[1-9])$/i.test(v)) labels.push({ level: v.toUpperCase(), col: cidx });
    });
    if(labels.length >= 5){ headerRowIdx = r; levelCols = labels; break; }
  }
  if(!headerRowIdx || levelCols.length === 0) return null;

  // Find building column: the first non-empty cell in header row that's not FC*
  let buildingCol = null;
  const row = ws.getRow(headerRowIdx);
  row.eachCell((cell, cidx)=>{
    const v = String(cell.value || '').trim();
    if(v && !/^FC(10|[1-9])$/i.test(v) && buildingCol === null){ buildingCol = cidx; }
  });
  if(!buildingCol) buildingCol = 1; // fallback

  const out = [];
  for(let r=headerRowIdx+1; r<=ws.rowCount; r++){
    const rr = ws.getRow(r);
    const building = String(rr.getCell(buildingCol).value || '').trim();
    if(!building) continue;
    for(const {level, col} of levelCols){
      const power = Number(rr.getCell(col).value) || 0;
      if(power>0) out.push({ building, level, power });
    }
  }
  return out.length ? out : null;
}

async function deriveFromBuildingSheets(workbook){
  // Look for a column named 'Power' and read FC1..FC10 major rows
  const out = [];
  for(const sheetName of BUILDING_SHEETS){
    const ws = workbook.getWorksheet(sheetName);
    if(!ws) continue;
    // Find header row
    let powerCol = null, buildingCol = null, levelCol = null, headerRowIdx = null;
    for(let r=1; r<=8; r++){
      const row = ws.getRow(r);
      row.eachCell((cell, cidx)=>{
        const v = String(cell.value || '').trim().toLowerCase();
        if(v === 'power') powerCol = cidx;
        if(v === 'building') buildingCol = cidx;
        if(v === 'level') levelCol = cidx;
      });
      if(powerCol) { headerRowIdx = r; break; }
    }
    if(!powerCol){ continue; }

    for(let r=headerRowIdx+1; r<=ws.rowCount; r++){
      const row = ws.getRow(r);
      const level = String(row.getCell(levelCol || 2).value || '').trim();
      if(!/^FC(10|[1-9])$/.test(level)) continue; // major only
      const power = Number(row.getCell(powerCol).value) || 0;
      if(power>0) out.push({ building: sheetName, level, power });
    }
  }
  return out.length ? out : null;
}

async function main(){
  if(!fs.existsSync(INPUT)){
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);

  // Try to find a sheet for power
  const sheet = workbook.worksheets.find(ws => /building\s*power/i.test(ws.name));
  let rows = null;
  if(sheet){
    rows = await trySheetLongForm(sheet) || await trySheetWideForm(sheet);
  }
  if(!rows){
    rows = await deriveFromBuildingSheets(workbook);
  }
  if(!rows || rows.length === 0){
    console.warn('Building power could not be extracted automatically. Existing CSV left unchanged.');
    process.exit(0);
  }

  // Normalize building names to match app expectations
  const nameMap = new Map([
    ['infantry','Infantry Camp'],
    ['marksman','Marksman Camp'],
    ['lancer','Lancer Camp'],
  ]);
  for(const r of rows){
    const key = r.building.toString().trim();
    const lower = key.toLowerCase();
    if(nameMap.has(lower)) r.building = nameMap.get(lower);
  }

  writeCsv(rows);
}

if(require.main === module){
  main().catch(err => { console.error('Error:', err); process.exit(1); });
}
