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
const SHEETS_DIR = path.resolve('src/assets/sheets');

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
  // Fallback: scan exported CSV sheets for a Power column
  if((!rows || rows.length === 0) && fs.existsSync(SHEETS_DIR)){
    try {
      const fallback = scanCsvSheetsForPower(SHEETS_DIR);
      if(fallback && fallback.length) rows = fallback;
    } catch (e) {
      // ignore
    }
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

// -------- CSV fallback scanner ---------
function scanCsvSheetsForPower(dir){
  const files = fs.readdirSync(dir).filter(f => f.toLowerCase().endsWith('.csv'));
  const out = [];
  for(const file of files){
    const full = path.join(dir, file);
    const text = fs.readFileSync(full, 'utf8');
    if(!/power/i.test(text)) continue; // quick filter
    const rows = text.split(/\r?\n/).map(l=>l.split(','));
    if(rows.length === 0) continue;

    // Heuristic A: long form with headers building, level, power
    const headerIdx = findHeaderRow(rows, ['building','level','power']);
    if(headerIdx !== -1){
      const header = rows[headerIdx].map(x=>x.toLowerCase().trim());
      const bi = header.indexOf('building');
      const li = header.indexOf('level');
      const pi = header.indexOf('power');
      for(let r=headerIdx+1;r<rows.length;r++){
        const rr = rows[r]; if(!rr || rr.length === 0) continue;
        const b = (rr[bi]||'').trim();
        const lvl = (rr[li]||'').trim().toUpperCase();
        const p = Number((rr[pi]||'').replace(/[^0-9.-]/g,''))||0;
        if(b && /^FC(10|[1-9])$/.test(lvl) && p>0) out.push({ building: normalizeBuilding(b), level: lvl, power: p });
      }
      continue;
    }

    // Heuristic B: wide form: first row with FC1..FC10 columns, first column = building name, some column named Power beneath
    const fcColsRow = findRowWithFcLabels(rows);
    if(fcColsRow !== -1){
      const labels = rows[fcColsRow];
      const fcCols = [];
      labels.forEach((v, idx) => {
        const t = String(v||'').trim().toUpperCase();
        if(/^FC(10|[1-9])$/.test(t)) fcCols.push({ level: t, col: idx });
      });
      if(fcCols.length >= 5){
        // Assume next rows have building names and a column explicitly labeled 'Power' somewhere below; try direct values in those cells
        for(let r=fcColsRow+1;r<rows.length;r++){
          const rr = rows[r]; if(!rr || rr.length === 0) continue;
          const building = (rr[0]||'').trim();
          if(!building) continue;
          for(const {level, col} of fcCols){
            const p = Number(String(rr[col]||'').replace(/[^0-9.-]/g,''))||0;
            if(p>0) out.push({ building: normalizeBuilding(building), level, power: p });
          }
        }
      }
    }
  }
  return dedupePowerRows(out);
}

function findHeaderRow(rows, keys){
  for(let i=0;i<Math.min(rows.length,10);i++){
    const lower = rows[i].map(x=>String(x||'').toLowerCase().trim());
    if(keys.every(k=>lower.includes(k))) return i;
  }
  return -1;
}

function findRowWithFcLabels(rows){
  for(let i=0;i<Math.min(rows.length,15);i++){
    const hasFc = rows[i].some(x => /^FC(10|[1-9])$/i.test(String(x||'').trim()));
    if(hasFc) return i;
  }
  return -1;
}

function normalizeBuilding(name){
  const n = String(name).trim();
  const map = new Map([
    ['infantry','Infantry Camp'],
    ['marksman','Marksman Camp'],
    ['lancer','Lancer Camp'],
  ]);
  const lower = n.toLowerCase();
  for(const [k,v] of map){ if(lower.startsWith(k)) return v; }
  return n;
}

function dedupePowerRows(arr){
  const key = r => `${r.building}|${r.level}`;
  const seen = new Map();
  for(const r of arr){
    const k = key(r);
    if(!seen.has(k) || (seen.get(k)?.power||0) < r.power) seen.set(k, r);
  }
  return Array.from(seen.values());
}
