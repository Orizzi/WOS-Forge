// compare-chief-gear-to-csv.js
// Compares app step costs (using canonical UI levels) vs. summing all CSV rows between anchors

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

function buildAnchors(rows){
  // For each UI level, anchor at the first CSV row that maps exactly to it
  const anchors = {};
  rows.forEach((r, idx)=>{
    if(!r.ui) return;
    if(GEAR_LEVELS.includes(r.ui) && anchors[r.ui] === undefined){
      anchors[r.ui] = idx;
    }
  });
  return anchors;
}

function sumSection(rows, fromIdxExclusive, toIdxInclusive){
  const out = {alloy:0, polish:0, plans:0, amber:0, power:0, svs:0};
  if(fromIdxExclusive==null || toIdxInclusive==null) return out;
  for(let i=fromIdxExclusive+1;i<=toIdxInclusive;i++){
    const r = rows[i];
    out.alloy += r.alloy;
    out.polish += r.polish;
    out.plans += r.plans;
    out.amber += r.amber;
    out.svs += r.svs;
    // By app convention, power = final level only
    if(i===toIdxInclusive) out.power = r.power;
  }
  return out;
}

function main(){
  if(!fs.existsSync(csvPath)){
    console.error('Missing CSV at', csvPath);
    process.exit(1);
  }
  const rows = loadCsvRows(csvPath);
  const anchors = buildAnchors(rows);

  // Build app step costs (single-row per target UI level)
  const appCosts = {};
  Object.entries(anchors).forEach(([ui, idx])=>{
    const r = rows[idx];
    appCosts[ui] = {alloy:r.alloy, polish:r.polish, plans:r.plans, amber:r.amber, power:r.power, svs:r.svs};
  });

  // Build aggregated app costs (new loader behavior: sum intermediate rows until next anchor)
  const aggregatedCosts = {};
  let pending = {alloy:0, polish:0, plans:0, amber:0, svs:0};
  for(let i=0;i<rows.length;i++){
    const r = rows[i];
    if(!r.ui || !GEAR_LEVELS.includes(r.ui)){
      pending.alloy += r.alloy; pending.polish += r.polish; pending.plans += r.plans; pending.amber += r.amber; pending.svs += r.svs;
      continue;
    }
    aggregatedCosts[r.ui] = {
      alloy: pending.alloy + r.alloy,
      polish: pending.polish + r.polish,
      plans: pending.plans + r.plans,
      amber: pending.amber + r.amber,
      power: r.power,
      svs: pending.svs + r.svs
    };
    pending = {alloy:0, polish:0, plans:0, amber:0, svs:0};
  }

  // Compare each adjacent UI step: expected (sum of CSV rows between anchors) vs app (single row)
  const diffs = [];
  for(let i=1;i<GEAR_LEVELS.length;i++){
    const prev = GEAR_LEVELS[i-1];
    const curr = GEAR_LEVELS[i];
    const prevIdx = anchors[prev];
    const currIdx = anchors[curr];
    if(prevIdx===undefined || currIdx===undefined) continue;
    const expected = sumSection(rows, prevIdx, currIdx); // sum all rows in between
    const app = appCosts[curr] || {alloy:0,polish:0,plans:0,amber:0,power:0,svs:0};
    const delta = {
      step: `${prev} -> ${curr}`,
      expected,
      app,
      diff: {
        alloy: expected.alloy - app.alloy,
        polish: expected.polish - app.polish,
        plans: expected.plans - app.plans,
        amber: expected.amber - app.amber,
        power: expected.power - app.power,
        svs: expected.svs - app.svs
      },
      skippedRows: rows.slice(prevIdx+1, currIdx).map(r=>r.name)
    };
    diffs.push(delta);
  }

  // Print only mismatches
  const mismatches = diffs.filter(d => d.diff.alloy||d.diff.polish||d.diff.plans||d.diff.amber||d.diff.svs);
  console.log(`Checked ${diffs.length} adjacent steps. Mismatches: ${mismatches.length}`);
  mismatches.slice(0, 15).forEach(d => {
    console.log(`\n${d.step}`);
    console.log(`  Expected (sum CSV): alloy=${fmt(d.expected.alloy)}, polish=${fmt(d.expected.polish)}, plans=${fmt(d.expected.plans)}, amber=${fmt(d.expected.amber)}, svs=${fmt(d.expected.svs)}`);
    console.log(`  App (single row):   alloy=${fmt(d.app.alloy)}, polish=${fmt(d.app.polish)}, plans=${fmt(d.app.plans)}, amber=${fmt(d.app.amber)}, svs=${fmt(d.app.svs)}`);
    console.log(`  DIFF:                alloy=${fmt(d.diff.alloy)}, polish=${fmt(d.diff.polish)}, plans=${fmt(d.diff.plans)}, amber=${fmt(d.diff.amber)}, svs=${fmt(d.diff.svs)}`);
    if(d.skippedRows.length){
      console.log(`  Skipped rows: ${d.skippedRows.join(' | ')}`);
    }
  });

  // Write full report
  const outPath = path.join(ROOT, 'scripts/chief-gear-diff-report.csv');
  const header = 'from,to,expected_alloy,expected_polish,expected_plans,expected_amber,expected_svs,app_alloy,app_polish,app_plans,app_amber,app_svs,delta_alloy,delta_polish,delta_plans,delta_amber,delta_svs,skipped';
  const lines = [header];
  diffs.forEach(d => {
    lines.push([
      d.step.split(' -> ')[0], d.step.split(' -> ')[1],
      d.expected.alloy, d.expected.polish, d.expected.plans, d.expected.amber, d.expected.svs,
      d.app.alloy, d.app.polish, d.app.plans, d.app.amber, d.app.svs,
      d.diff.alloy, d.diff.polish, d.diff.plans, d.diff.amber, d.diff.svs,
      '"'+d.skippedRows.join('; ')+'"'
    ].join(','));
  });
  fs.writeFileSync(outPath, lines.join('\n'), 'utf8');
  console.log(`\nWrote detailed diff to ${outPath}`);

  // Verify aggregated costs equal expected sums
  let aggMismatch = 0;
  for(let i=1;i<GEAR_LEVELS.length;i++){
    const prev = GEAR_LEVELS[i-1];
    const curr = GEAR_LEVELS[i];
    const prevIdx = anchors[prev];
    const currIdx = anchors[curr];
    if(prevIdx===undefined || currIdx===undefined) continue;
    const expected = sumSection(rows, prevIdx, currIdx);
    const agg = aggregatedCosts[curr] || {alloy:0,polish:0,plans:0,amber:0,power:0,svs:0};
    if(expected.alloy!==agg.alloy || expected.polish!==agg.polish || expected.plans!==agg.plans || expected.amber!==agg.amber || expected.svs!==agg.svs){
      aggMismatch++;
    }
  }
  console.log(`Aggregated loader check: ${aggMismatch===0 ? 'OK (all steps match expected sums)' : (aggMismatch+' mismatches')}`);
}

if(require.main===module){
  main();
}
