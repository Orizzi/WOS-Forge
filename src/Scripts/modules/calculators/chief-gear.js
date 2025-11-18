(function () {
  'use strict';

  const GEAR_LEVELS = [
    'Green','Green 1','Blue','Blue 1','Blue 2','Blue 3',
    'Purple','Purple 1','Purple 2','Purple 3',
    'Purple T1','Purple T1 1','Purple T1 2','Purple T1 3',
    'Gold','Gold 1','Gold 2','Gold 3',
    'Gold T1','Gold T1 1','Gold T1 2','Gold T1 3',
    'Gold T2','Gold T2 1','Gold T2 2','Gold T2 3',
    'Red','Red 1','Red 2','Red 3',
    'Red T1','Red T1 1','Red T1 2','Red T1 3',
    'Red T2','Red T2 1','Red T2 2','Red T2 3',
    'Red T3','Red T3 1','Red T3 2','Red T3 3',
    'Red T4','Red T4 1','Red T4 2','Red T4 3'
  ];

  function buildDefaultCosts() {
    const costs = {};
    GEAR_LEVELS.forEach((level, index) => {
      const base = (index + 1) * 10;
      costs[level] = {
        hardenedAlloy: base,
        polishingSolution: base,
        designPlans: Math.floor(index / 2) + 1,
        lunarAmber: Math.floor(index / 6),
        power: 0,
        svsPoints: (index + 1) * 100
      };
    });
    return costs;
  }

  function buildCostTableFromCsv(csv) {
    if (!csv || !Array.isArray(csv.rows) || !Array.isArray(csv.header)) return buildDefaultCosts();
    const lowerHeader = csv.header.map((h) => (h || '').toLowerCase());
    const idx = {
      level: lowerHeader.indexOf('gear level') >= 0 ? lowerHeader.indexOf('gear level') : lowerHeader.indexOf('level'),
      alloy: lowerHeader.indexOf('hardened alloy') >= 0 ? lowerHeader.indexOf('hardened alloy') : lowerHeader.indexOf('hardenedalloy'),
      solution: lowerHeader.indexOf('polishing solution') >= 0 ? lowerHeader.indexOf('polishing solution') : lowerHeader.indexOf('polishingsolution'),
      plans: lowerHeader.indexOf('design plans') >= 0 ? lowerHeader.indexOf('design plans') : lowerHeader.indexOf('designplans'),
      amber: lowerHeader.indexOf('lunar amber') >= 0 ? lowerHeader.indexOf('lunar amber') : lowerHeader.indexOf('lunaramber'),
      power: lowerHeader.indexOf('power'),
      svsPoints: lowerHeader.indexOf('svspoints') >= 0 ? lowerHeader.indexOf('svspoints') : lowerHeader.indexOf('svs points')
    };
    if (idx.level === -1) return buildDefaultCosts();

    const table = {};
    csv.rows.forEach((row) => {
      const levelName = row[idx.level]?.trim();
      if (!levelName || !GEAR_LEVELS.includes(levelName)) return;
      table[levelName] = {
        hardenedAlloy: parseFloat(row[idx.alloy]) || 0,
        polishingSolution: parseFloat(row[idx.solution]) || 0,
        designPlans: parseFloat(row[idx.plans]) || 0,
        lunarAmber: parseFloat(row[idx.amber]) || 0,
        power: parseFloat(row[idx.power]) || 0,
        svsPoints: parseFloat(row[idx.svsPoints]) || 0
      };
    });

    const applied = Object.keys(table).length;
    return applied > 0 ? table : buildDefaultCosts();
  }

  function sumCosts(costs, fromLevel, toLevel) {
    const fromIndex = GEAR_LEVELS.indexOf(fromLevel);
    const toIndex = GEAR_LEVELS.indexOf(toLevel);
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null;

    const totals = {
      hardenedAlloy: 0,
      polishingSolution: 0,
      designPlans: 0,
      lunarAmber: 0,
      power: 0,
      svsPoints: 0
    };

    for (let i = fromIndex + 1; i <= toIndex; i++) {
      const level = GEAR_LEVELS[i];
      const cost = costs[level];
      if (!cost) continue;
      totals.hardenedAlloy += cost.hardenedAlloy;
      totals.polishingSolution += cost.polishingSolution;
      totals.designPlans += cost.designPlans;
      totals.lunarAmber += cost.lunarAmber;
      totals.power += cost.power;
      totals.svsPoints += cost.svsPoints;
    }

    return totals;
  }

  window.WOSCalcs = window.WOSCalcs || {};
  window.WOSCalcs.chiefGear = {
    GEAR_LEVELS,
    buildDefaultCosts,
    buildCostTableFromCsv,
    sumCosts
  };
})();