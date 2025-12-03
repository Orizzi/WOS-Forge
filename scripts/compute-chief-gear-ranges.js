// compute-chief-gear-ranges.js
// Uses aggregated loader logic (like the app) to compute totals for selected ranges

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const csvPath = path.join(ROOT, 'src/assets/chief_gear_costs.csv');

const GEAR_LEVELS = [
  'Locked',
  'Green', 'Green 1',
  'Blue', 'Blue 1', 'Blue 2', 'Blue 3',
  'Purple', 'Purple 1', 'Purple 2', 'Purple 3',
  'Purple T1', 'Purple T1 1', 'Purple T1 2', 'Purple T1 3',
  'Gold', 'Gold 1', 'Gold 2', 'Gold 3',
  'Gold T1', 'Gold T1 1', 'Gold T1 2', 'Gold T1 3',
  'Gold T2', 'Gold T2 1', 'Gold T2 2', 'Gold T2 3',
  'Red', 'Red 1', 'Red 2', 'Red 3',
  'Red T1', 'Red T1 1', 'Red T1 2', 'Red T1 3',
  'Red T2', 'Red T2 1', 'Red T2 2', 'Red T2 3',
  'Red T3', 'Red T3 1', 'Red T3 2', 'Red T3 3',
  'Red T4', 'Red T4 1', 'Red T4 2', 'Red T4 3'
];

const CSV_LEVEL_TO_UI = {
  'Locked': 'Locked',
  'Uncommon': 'Green',
  'Uncommon (1-Star)': 'Green 1',
  'Rare': 'Blue',
  'Rare (1-Star)': 'Blue 1',
  'Rare (2-Star)': 'Blue 2',
  'Rare (3-Star)': 'Blue 3',
  'Epic': 'Purple',
  'Epic (1-Star)': 'Purple 1',
  'Epic (2-Star)': 'Purple 2',
  'Epic (3-Star)': 'Purple 3',
  'Epic T1': 'Purple T1',
  'Epic T1 (1-Star)': 'Purple T1 1',
  'Epic T1 (2-Star)': 'Purple T1 2',
  'Epic T1 (3-Star)': 'Purple T1 3',
  'Mythic': 'Gold',
  'Mythic (1-Star)': 'Gold 1',
  'Mythic (2-Star)': 'Gold 2',
  'Mythic (3-Star)': 'Gold 3',
  'Mythic T1': 'Gold T1',
  'Mythic T1 (1-Star)': 'Gold T1 1',
  'Mythic T1 (2-Star)': 'Gold T1 2',
  'Mythic T1 (3-Star)': 'Gold T1 3',
  'Mythic T2': 'Gold T2',
  'Mythic T2 (1-Star)': 'Gold T2 1',
  'Mythic T2 (2-Star)': 'Gold T2 2',
  'Mythic T2 (3-Star)': 'Gold T2 3',
  'Legendary': 'Red',
  'Legendary (1-Star)': 'Red 1',
  'Legendary (2-Star)': 'Red 2',
  'Legendary (3-Star)': 'Red 3',
  'Legendary T1': 'Red T1',
  'Legendary T1 (1-Star)': 'Red T1 1',
  'Legendary T1 (2-Star)': 'Red T1 2',
  'Legendary T1 (3-Star)': 'Red T1 3',
  'Legendary T2': 'Red T2',
  'Legendary T2 (1-Star)': 'Red T2 1',
  'Legendary T2 (2-Star)': 'Red T2 2',
  'Legendary T2 (3-Star)': 'Red T2 3',
  'Legendary T3': 'Red T3',
  'Legendary T3 (1-Star)': 'Red T3 1',
  'Legendary T3 (2-Star)': 'Red T3 2',
  'Legendary T3 (3-Star)': 'Red T3 3',
  'Legendary T4': 'Red T4',
  'Legendary T4 (1-Star)': 'Red T4 1',
  'Legendary T4 (2-Star)': 'Red T4 2',
  'Legendary T4 (3-Star)': 'Red T4 3'
};

function fmt(n){ return Number(n||0).toLocaleString('en-US'); }

function loadCsvRows(file){
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0);
  const header = lines[0].split(',').map(h=>h.trim());
  const col = Object.fromEntries(header.map((h,i)=>[h.toLowerCase(), i]));
  const rows = [];
  for(let i=1;i<lines.length;i++){
    const parts = lines[i].split(',');
    const name = (parts[col['gearlevel']] || parts[col['level']] || '').trim();
    if(!name) continue;
    rows.push({
      name,
      ui: CSV_LEVEL_TO_UI[name] || null,
      alloy: Number(parts[col['alloy']]||0),
      polish: Number(parts[col['polish']]||0),
      plans: Number(parts[col['plans']]||0),
      amber: Number(parts[col['amber']]||0),
      power: Number(parts[col['power']]||0),
      svs: Number(parts[col['svspoints']]||0)
    });
  }
  return rows;
}

function aggregatePerCanonical(rows){
  const out = {};
  let pending = {alloy:0, polish:0, plans:0, amber:0, svs:0};
  for(const r of rows){
    if(!r.ui || !GEAR_LEVELS.includes(r.ui)){
      pending.alloy += r.alloy; pending.polish += r.polish; pending.plans += r.plans; pending.amber += r.amber; pending.svs += r.svs;
      continue;
    }
    out[r.ui] = {
      hardenedAlloy: pending.alloy + r.alloy,
      polishingSolution: pending.polish + r.polish,
      designPlans: pending.plans + r.plans,
      lunarAmber: pending.amber + r.amber,
      power: r.power,
      svsPoints: pending.svs + r.svs
    };
    pending = {alloy:0, polish:0, plans:0, amber:0, svs:0};
  }
  return out;
}

function sumAggregated(costs, from, to){
  const fromIdx = GEAR_LEVELS.indexOf(from);
  const toIdx = GEAR_LEVELS.indexOf(to);
  if(fromIdx===-1 || toIdx===-1 || fromIdx>=toIdx) return null;
  const t = {hardenedAlloy:0, polishingSolution:0, designPlans:0, lunarAmber:0, power:0, svsPoints:0};
  for(let i=fromIdx+1;i<=toIdx;i++){
    const lvl = GEAR_LEVELS[i];
    const c = costs[lvl];
    if(!c) continue;
    t.hardenedAlloy += c.hardenedAlloy;
    t.polishingSolution += c.polishingSolution;
    t.designPlans += c.designPlans;
    t.lunarAmber += c.lunarAmber;
    t.svsPoints += c.svsPoints;
    if(i===toIdx) t.power = c.power || 0;
  }
  return t;
}

function main(){
  const rows = loadCsvRows(csvPath);
  const agg = aggregatePerCanonical(rows);

  // Allow CLI pairs: node script "Red->Red 1" "Red 1->Red 2" ...
  const cliPairs = process.argv.slice(2).map(s=>{
    const [from, to] = String(s).split('->').map(v=>v.trim());
    return from && to ? {from, to} : null;
  }).filter(Boolean);

  const pairs = cliPairs.length ? cliPairs : [
    {from:'Locked', to:'Red T4 3'},
    {from:'Green 1', to:'Blue 2'},
    {from:'Blue 3', to:'Purple T1'},
    {from:'Gold', to:'Red'},
    {from:'Gold T2 3', to:'Red'},
    {from:'Red', to:'Red 3'},
    {from:'Red T1 3', to:'Red T2'},
    {from:'Red T2', to:'Red T3'}
  ];

  const results = pairs.map(p=>{
    const r = sumAggregated(agg, p.from, p.to);
    return {
      from:p.from, to:p.to,
      hardenedAlloy: fmt(r?.hardenedAlloy),
      polishingSolution: fmt(r?.polishingSolution),
      designPlans: fmt(r?.designPlans),
      lunarAmber: fmt(r?.lunarAmber),
      power: fmt(r?.power),
      svsPoints: fmt(r?.svsPoints)
    };
  });

  console.table(results);
}

if(require.main===module){
  main();
}
