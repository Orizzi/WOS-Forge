(function () {
  'use strict';

  function buildCostIndex(costRows) {
    if (!Array.isArray(costRows)) return [];
    return costRows.map((row) => ({
      building: row.building,
      level: row.level,
      fc: Number(row.fc) || 0,
      rfc: Number(row.rfc) || 0
    }));
  }

  function sumRange(costIndex, buildingName, fromLevel, toLevel, levelsArray) {
    if (!costIndex || !buildingName || !Array.isArray(levelsArray)) return null;
    const fromIndex = levelsArray.indexOf(fromLevel);
    const toIndex = levelsArray.indexOf(toLevel);
    if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) return null;

    const levelsToUpgrade = levelsArray.slice(fromIndex, toIndex + 1);
    let totalFC = 0;
    let totalRFC = 0;

    levelsToUpgrade.forEach((lvl) => {
      const row = costIndex.find((r) => r.building === buildingName && r.level === lvl);
      if (!row) return;
      totalFC += row.fc || 0;
      totalRFC += row.rfc || 0;
    });

    return { normalFC: totalFC, refineFC: totalRFC };
  }

  window.WOSCalcs = window.WOSCalcs || {};
  window.WOSCalcs.fireCrystals = {
    buildCostIndex,
    sumRange
  };
})();