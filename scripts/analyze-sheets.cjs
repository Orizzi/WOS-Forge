#!/usr/bin/env node
/*
Analyze exported CSV sheets (src/assets/sheets/*.csv) and classify by purpose.
Heuristics:
- If headers include meat/wood/coal/iron → base-resources
- If headers include fire_crystals/refined_crystals or columns 12/14 in xlsx mapping → fire-crystals
- If headers include power (with FC1..FC10 somewhere) → power
- Otherwise: unknown
*/

const fs = require('fs');
const path = require('path');

const DIR = path.resolve('src/assets/sheets');

function readFirstLines(file, n=6){
  const text = fs.readFileSync(file, 'utf8');
  return text.split(/\r?\n/).slice(0,n).join('\n');
}

function classify(content){
  const lower = content.toLowerCase();
  const has = (w)=> lower.includes(w);
  if(has('meat') && has('wood') && has('coal') && has('iron')) return 'base-resources';
  if(has('fire_crystals') || has('refined_crystals') || has('fire crystals') || has('refined fc')) return 'fire-crystals';
  if(has('power') && (has('fc1') || has('fc2') || has('fc10'))) return 'power';
  return 'unknown';
}

function main(){
  if(!fs.existsSync(DIR)){
    console.error('Directory not found:', DIR);
    process.exit(1);
  }
  const files = fs.readdirSync(DIR).filter(f=>f.endsWith('.csv'));
  if(files.length===0){
    console.warn('No CSV files to analyze in', DIR);
    return;
  }
  const report = [];
  for(const f of files){
    const p = path.join(DIR, f);
    const head = readFirstLines(p);
    report.push({ file: f, type: classify(head) });
  }
  console.log('\nSheet classification:');
  for(const r of report){
    console.log(`- ${r.file}: ${r.type}`);
  }
}

if(require.main === module){
  main();
}
