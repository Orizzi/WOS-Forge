#!/usr/bin/env node
/*
Generate a JS file that exposes building power by milestone level as window.BuildingPowerMap
Source: src/assets/building_power.csv with header: building,level,power
*/
const fs = require('fs');
const path = require('path');

const INPUT = path.resolve('src/assets/building_power.csv');
const OUTPUT_JS = path.resolve('src/Scripts/building-power.js');

function parseCsv(text){
  const lines = text.split(/\r?\n/).filter(l => l.trim().length>0);
  if(lines.length<2) return [];
  const header = lines[0].split(',').map(h=>h.trim().toLowerCase());
  const bi = header.indexOf('building');
  const li = header.indexOf('level');
  const pi = header.indexOf('power');
  const rows = [];
  for(let i=1;i<lines.length;i++){
    const parts = lines[i].split(',');
    if(parts.length < 3) continue;
    const b = (parts[bi]||'').trim();
    const lvl = (parts[li]||'').trim();
    const p = parseInt(parts[pi],10);
    if(!b || !lvl || isNaN(p)) continue;
    rows.push({building:b, level:lvl, power:p});
  }
  return rows;
}

function buildMap(rows){
  const map = {};
  rows.forEach(r=>{
    if(!map[r.building]) map[r.building] = {};
    map[r.building][r.level] = r.power;
  });
  return map;
}

function main(){
  if(!fs.existsSync(INPUT)){
    console.error(`Input CSV not found: ${INPUT}`);
    process.exit(1);
  }
  const text = fs.readFileSync(INPUT,'utf8');
  const rows = parseCsv(text);
  const map = buildMap(rows);
  const js = `/* Auto-generated: Building Power Map */\n(function(){\n  try { window.BuildingPowerMap = ${JSON.stringify(map, null, 2)}; } catch(_) {}\n})();\n`;
  fs.writeFileSync(OUTPUT_JS, js, 'utf8');
  console.log(`Wrote JS power map to ${OUTPUT_JS} with ${rows.length} entries.`);
}

if(require.main === module){
  try { main(); } catch(e){ console.error(e); process.exit(1);}  
}
