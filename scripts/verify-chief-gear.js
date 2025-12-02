// verify-chief-gear.js
// Node.js script to validate Chief Gear costs by summing CSV rows
// Picks random FROM/TO pairs and reports totals, including Red T2 -> Red T3

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const unified = path.join(ROOT, 'src/assets/chief_gear_unified.csv');
const legacy = path.join(ROOT, 'src/assets/chief_gear_costs.csv');

const GEAR_LEVELS = [
  "Locked",
  "Green", "Green 1",
  "Blue", "Blue 1", "Blue 2", "Blue 3",
  "Purple", "Purple 1", "Purple 2", "Purple 3",
  "Purple T1", "Purple T1 1", "Purple T1 2", "Purple T1 3",
  "Gold", "Gold 1", "Gold 2", "Gold 3",
  "Gold T1", "Gold T1 1", "Gold T1 2", "Gold T1 3",
  "Gold T2", "Gold T2 1", "Gold T2 2", "Gold T2 3",
  "Red", "Red 1", "Red 2", "Red 3",
  "Red T1", "Red T1 1", "Red T1 2", "Red T1 3",
  "Red T2", "Red T2 1", "Red T2 2", "Red T2 3",
  "Red T3", "Red T3 1", "Red T3 2", "Red T3 3",
  "Red T4", "Red T4 1", "Red T4 2", "Red T4 3"
];

const CSV_LEVEL_TO_UI = {
  "Locked": "Locked",
  "Uncommon": "Green",
  "Uncommon (1-Star)": "Green 1",
  "Rare": "Blue",
  "Rare (1-Star)": "Blue 1",
  "Rare (2-Star)": "Blue 2",
  "Rare (3-Star)": "Blue 3",
  "Epic": "Purple",
  "Epic (1-Star)": "Purple 1",
  "Epic (2-Star)": "Purple 2",
  "Epic (3-Star)": "Purple 3",
  "Epic T1": "Purple T1",
  "Epic T1 (1-Star)": "Purple T1 1",
  "Epic T1 (2-Star)": "Purple T1 2",
  "Epic T1 (3-Star)": "Purple T1 3",
  "Mythic": "Gold",
  "Mythic (1-Star)": "Gold 1",
  "Mythic (2-Star)": "Gold 2",
  "Mythic (3-Star)": "Gold 3",
  "Mythic T1": "Gold T1",
  "Mythic T1 (1-Star)": "Gold T1 1",
  "Mythic T1 (2-Star)": "Gold T1 2",
  "Mythic T1 (3-Star)": "Gold T1 3",
  "Mythic T2": "Gold T2",
  "Mythic T2 (1-Star)": "Gold T2 1",
  "Mythic T2 (2-Star)": "Gold T2 2",
  "Mythic T2 (3-Star)": "Gold T2 3",
  "Legendary": "Red",
  "Legendary (1-Star)": "Red 1",
  "Legendary (2-Star)": "Red 2",
  "Legendary (3-Star)": "Red 3",
  "Legendary T1": "Red T1",
  "Legendary T1 (1-Star)": "Red T1 1",
  "Legendary T1 (2-Star)": "Red T1 2",
  "Legendary T1 (3-Star)": "Red T1 3",
  "Legendary T2": "Red T2",
  "Legendary T2 (1-Star)": "Red T2 1",
  "Legendary T2 (2-Star)": "Red T2 2",
  "Legendary T2 (3-Star)": "Red T2 3",
  "Legendary T3": "Red T3",
  "Legendary T3 (1-Star)": "Red T3 1",
  "Legendary T3 (2-Star)": "Red T3 2",
  "Legendary T3 (3-Star)": "Red T3 3",
  "Legendary T4": "Red T4",
  "Legendary T4 (1-Star)": "Red T4 1",
  "Legendary T4 (2-Star)": "Red T4 2",
  "Legendary T4 (3-Star)": "Red T4 3"
};

function toInternalLevel(name){
  if(!name) return name;
  const t = String(name).trim();
  if(GEAR_LEVELS.includes(t)) return t;
  return CSV_LEVEL_TO_UI[t] || t;
}

function parseCsv(file){
  const text = fs.readFileSync(file, 'utf8');
  const lines = text.split(/\r?\n/).filter(l=>l.trim().length>0);
  const header = lines[0].split(',').map(h=>h.trim().toLowerCase());
  const idx = {
    level: header.indexOf('level') !== -1 ? header.indexOf('level') : header.indexOf('gearlevel'),
    alloy: header.indexOf('hardenedalloy') !== -1 ? header.indexOf('hardenedalloy') : header.indexOf('alloy'),
    solution: header.indexOf('polishingsolution') !== -1 ? header.indexOf('polishingsolution') : header.indexOf('polish'),
    plans: header.indexOf('designplans') !== -1 ? header.indexOf('designplans') : header.indexOf('plans'),
    amber: header.indexOf('lunaramber') !== -1 ? header.indexOf('lunaramber') : header.indexOf('amber'),
    power: header.indexOf('power'),
    svsPoints: header.indexOf('svspoints')
  };
  const costs = {};
  for(let i=1;i<lines.length;i++){
    const parts = lines[i].split(',');
    const rawLevel = (parts[idx.level]||'').trim();
    const level = toInternalLevel(rawLevel);
    if(!level || !GEAR_LEVELS.includes(level)) continue;
    costs[level] = {
      hardenedAlloy: parseFloat(parts[idx.alloy])||0,
      polishingSolution: parseFloat(parts[idx.solution])||0,
      designPlans: parseFloat(parts[idx.plans])||0,
      lunarAmber: parseFloat(parts[idx.amber])||0,
      power: idx.power!==-1 ? (parseFloat(parts[idx.power])||0) : 0,
      svsPoints: idx.svsPoints!==-1 ? (parseFloat(parts[idx.svsPoints])||0) : 0
    };
  }
  return costs;
}

function sumCosts(costs, fromLevel, toLevel){
  const fromIdx = GEAR_LEVELS.indexOf(fromLevel);
  const toIdx = GEAR_LEVELS.indexOf(toLevel);
  if(fromIdx===-1 || toIdx===-1 || fromIdx>=toIdx) return null;
  const totals = {hardenedAlloy:0, polishingSolution:0, designPlans:0, lunarAmber:0, power:0, svsPoints:0};
  let final = null;
  for(let i=fromIdx+1;i<=toIdx;i++){
    const level = GEAR_LEVELS[i];
    const c = costs[level];
    if(!c) continue;
    totals.hardenedAlloy += c.hardenedAlloy;
    totals.polishingSolution += c.polishingSolution;
    totals.designPlans += c.designPlans;
    totals.lunarAmber += c.lunarAmber;
    totals.svsPoints += c.svsPoints;
    final = c;
  }
  totals.power = final ? (final.power||0) : 0;
  return totals;
}

function fmt(n){ return Number(n||0).toLocaleString('en-US'); }

function pickRandomPairs(n){
  const pairs=[];
  for(let i=0;i<n;i++){
    const a = Math.floor(Math.random()*GEAR_LEVELS.length);
    const b = Math.floor(Math.random()*GEAR_LEVELS.length);
    const from = Math.min(a,b);
    const to = Math.max(a,b);
    if(from===to) continue;
    pairs.push({from: GEAR_LEVELS[from], to: GEAR_LEVELS[to]});
  }
  return pairs;
}

function main(){
  let file = fs.existsSync(unified) ? unified : (fs.existsSync(legacy) ? legacy : null);
  if(!file){
    console.error('No chief gear CSV found.');
    process.exit(1);
  }
  let costs = parseCsv(file);
  // Fallback to legacy if unified produced no levels
  if(Object.keys(costs).length === 0 && fs.existsSync(legacy)){
    costs = parseCsv(legacy);
    file = legacy;
  }
  if(Object.keys(costs).length === 0){
    console.error('Parsed 0 levels from CSV. Check headers and data in', file);
    process.exit(1);
  }
  const special = {from:'Red T2', to:'Red T3'};
  const res = sumCosts(costs, special.from, special.to);
  console.log('Red T2 -> Red T3 totals:');
  console.log({
    hardenedAlloy: fmt(res?.hardenedAlloy),
    polishingSolution: fmt(res?.polishingSolution),
    designPlans: fmt(res?.designPlans),
    lunarAmber: fmt(res?.lunarAmber),
    power: fmt(res?.power),
    svsPoints: fmt(res?.svsPoints)
  });

  const randoms = pickRandomPairs(10);
  console.log('\nRandom checks:');
  randoms.forEach(p=>{
    const r = sumCosts(costs, p.from, p.to);
    if(!r){
      console.log(`${p.from} -> ${p.to}: invalid`);
    }else{
      console.log(`${p.from} -> ${p.to}: alloy=${fmt(r.hardenedAlloy)}, polish=${fmt(r.polishingSolution)}, plans=${fmt(r.designPlans)}, amber=${fmt(r.lunarAmber)}`);
    }
  });
}

if(require.main===module){
  main();
}
