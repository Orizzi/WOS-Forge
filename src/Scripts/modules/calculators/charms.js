(function () {
  'use strict';

  const DEFAULT_COSTS = {
    0: { guides: 5, designs: 5, secrets: 0, power: 205700, svsPoints: 625 },
    1: { guides: 40, designs: 15, secrets: 0, power: 288000, svsPoints: 1250 },
    2: { guides: 60, designs: 40, secrets: 0, power: 370000, svsPoints: 3125 },
    3: { guides: 80, designs: 100, secrets: 0, power: 452000, svsPoints: 8750 },
    4: { guides: 100, designs: 200, secrets: 0, power: 576000, svsPoints: 11250 },
    5: { guides: 120, designs: 300, secrets: 0, power: 700000, svsPoints: 12500 },
    6: { guides: 140, designs: 400, secrets: 0, power: 824000, svsPoints: 12500 },
    7: { guides: 200, designs: 400, secrets: 0, power: 948000, svsPoints: 13000 },
    8: { guides: 300, designs: 400, secrets: 0, power: 1072000, svsPoints: 14000 },
    9: { guides: 420, designs: 420, secrets: 0, power: 1196000, svsPoints: 15000 },
    10:{ guides: 560, designs: 420, secrets: 0, power: 1320000, svsPoints: 16000 },
    11:{ guides: 580, designs: 450, secrets: 15, power: 1536000, svsPoints: 17000 },
    12:{ guides: 580, designs: 450, secrets: 30, power: 1752000, svsPoints: 18000 },
    13:{ guides: 600, designs: 500, secrets: 45, power: 1968000, svsPoints: 19000 },
    14:{ guides: 600, designs: 500, secrets: 70, power: 2184000, svsPoints: 20000 },
    15:{ guides: 650, designs: 550, secrets: 100, power: 2400000, svsPoints: 21000 }
  };

  function cloneCosts(costs) {
    return JSON.parse(JSON.stringify(costs));
  }

  function buildCostTableFromCsv(csv) {
    if (!csv || !Array.isArray(csv.rows) || !Array.isArray(csv.header)) return cloneCosts(DEFAULT_COSTS);
    const lowerHeader = csv.header.map((h) => (h || '').toLowerCase());
    const idx = {
      level: lowerHeader.indexOf('level'),
      guides: lowerHeader.indexOf('guides'),
      designs: lowerHeader.indexOf('designs'),
      secrets: lowerHeader.indexOf('secrets'),
      power: lowerHeader.indexOf('power'),
      svsPoints: lowerHeader.indexOf('svspoints')
    };
    if (Object.values(idx).some((v) => v === -1)) return cloneCosts(DEFAULT_COSTS);

    const table = {};
    csv.rows.forEach((row) => {
      const level = parseInt(row[idx.level], 10);
      if (Number.isNaN(level)) return;
      table[level] = {
        guides: parseInt(row[idx.guides], 10) || 0,
        designs: parseInt(row[idx.designs], 10) || 0,
        secrets: parseInt(row[idx.secrets], 10) || 0,
        power: parseInt(row[idx.power], 10) || 0,
        svsPoints: parseInt(row[idx.svsPoints], 10) || 0
      };
    });

    return Object.keys(table).length > 0 ? table : cloneCosts(DEFAULT_COSTS);
  }

  function sumCosts(costs, from, to) {
    const total = { guides: 0, designs: 0, secrets: 0, power: 0, svsPoints: 0 };
    const a = Number(from);
    const b = Number(to);
    if (Number.isNaN(a) || Number.isNaN(b) || b <= a) return total;

    for (let lvl = a + 1; lvl <= b; lvl++) {
      const c = costs[lvl];
      if (!c) continue;
      total.guides += c.guides || 0;
      total.designs += c.designs || 0;
      total.secrets += c.secrets || 0;
      total.svsPoints += c.svsPoints || 0;
    }

    const target = costs[b];
    total.power = target && typeof target.power === 'number' ? target.power : 0;
    return total;
  }

  function sumAll(costs, pairs) {
    return pairs.reduce(
      (acc, pair) => {
        const res = sumCosts(costs, pair.from, pair.to);
        acc.guides += res.guides;
        acc.designs += res.designs;
        acc.secrets += res.secrets;
        acc.power += res.power;
        acc.svsPoints += res.svsPoints;
        return acc;
      },
      { guides: 0, designs: 0, secrets: 0, power: 0, svsPoints: 0 }
    );
  }

  window.WOSCalcs = window.WOSCalcs || {};
  window.WOSCalcs.charms = {
    DEFAULT_COSTS,
    cloneCosts,
    buildCostTableFromCsv,
    sumCosts,
    sumAll
  };
})();