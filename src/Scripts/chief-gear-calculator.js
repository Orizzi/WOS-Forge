// Add event listeners to all batch inputs to auto-save profile on any change
const chiefGearBatchInputs = Array.from(document.querySelectorAll('select[id$="-batch-from"], select[id$="-batch-to"]'));
chiefGearBatchInputs.forEach(batchInput => {
  batchInput.addEventListener('change', () => {
    // [Chief Gear] Batch input changed: removed for production
    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      ProfilesModule.autoSaveCurrentProfile();
      // [Chief Gear] Profile auto-saved after batch input change: removed for production
    }
  });
});
/**
 * ====== CHIEF GEAR CALCULATOR MODULE ======
 *
 * This module calculates the total resources needed to upgrade chief gear
 * from one level to another.
 *
 * Structure adapted from Charms Calculator for consistency
 */

const ChiefGearCalculatorModule = (function(){
  const validator = window.InputValidation;

  function safeInventory(value){
    if(validator && typeof validator.numberOrZero === 'function'){
      return validator.numberOrZero(value, { min: 0, max: 999999999, fallback: 0 });
    }
    const n = parseInt(value, 10);
    if(Number.isNaN(n) || !Number.isFinite(n)) return 0;
    return Math.max(0, n);
  }

  // Gear levels in order (46 levels total)
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

  // Map CSV gear level names to calculator option values
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

  const UI_LEVEL_DISPLAY = {};
  Object.entries(CSV_LEVEL_TO_UI).forEach(([csvName, uiName]) => {
    if (!UI_LEVEL_DISPLAY[uiName]) UI_LEVEL_DISPLAY[uiName] = csvName;
  });
  UI_LEVEL_DISPLAY.Locked = 'Locked';

  // Gear types
  const GEAR_TYPES = ['helmet', 'chestplate', 'ring', 'watch', 'pants', 'staff'];

  /**
   * costs: Resource table
   * Stores how much it costs to upgrade TO level N
   * Will be loaded from chief_gear_costs.csv if available
   */
  const costs = {};

  function toInternalLevel(levelName) {
    if (!levelName) return levelName;
    const trimmed = levelName.trim();
    if (GEAR_LEVELS.includes(trimmed)) return trimmed;
    return CSV_LEVEL_TO_UI[trimmed] || trimmed;
  }

  function displayLevel(levelName) {
    const normalized = toInternalLevel(levelName);
    return UI_LEVEL_DISPLAY[normalized] || normalized;
  }

  function escapeRegex(value){
    return String(value || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function setRegexConstraint(element, allowedLevels){
    if(!element) return;
    const levels = Array.isArray(allowedLevels) && allowedLevels.length > 0 ? allowedLevels : [];
    if(levels.length === 0){
      element.removeAttribute('data-level-regex');
      element.setCustomValidity('');
      return;
    }
    const pattern = `^(${levels.map(escapeRegex).join('|')})$`;
    element.setAttribute('data-level-regex', pattern);
    const regex = new RegExp(pattern);
    const value = toInternalLevel(element.value);
    if(value && !regex.test(value)){
      element.setCustomValidity('Invalid range selected');
    } else {
      element.setCustomValidity('');
    }
  }

  function applyRegexForPair(startSelect, finishSelect){
    if(startSelect){
      const finishIdx = finishSelect ? GEAR_LEVELS.indexOf(toInternalLevel(finishSelect.value)) : -1;
      const allowedStart = finishIdx === -1 ? GEAR_LEVELS.slice() : GEAR_LEVELS.slice(0, finishIdx + 1);
      setRegexConstraint(startSelect, allowedStart);
    }
    if(finishSelect){
      const startIdx = startSelect ? GEAR_LEVELS.indexOf(toInternalLevel(startSelect.value)) : -1;
      const allowedFinish = startIdx === -1 ? GEAR_LEVELS.slice() : GEAR_LEVELS.slice(startIdx);
      setRegexConstraint(finishSelect, allowedFinish);
    }
  }

  // Initialize costs with default values
  GEAR_LEVELS.forEach((level, index) => {
    if (level === 'Locked') {
      costs[level] = {
        hardenedAlloy: 0,
        polishingSolution: 0,
        designPlans: 0,
        lunarAmber: 0,
        power: 0,
        svsPoints: 0
      };
      return;
    }

    const adjIndex = Math.max(0, index - 1);
    const base = (adjIndex + 1) * 10;
    costs[level] = {
      hardenedAlloy: base,
      polishingSolution: base,
      designPlans: Math.floor(adjIndex / 2) + 1,
      lunarAmber: Math.floor(adjIndex / 6),
      power: 0,
      svsPoints: (adjIndex + 1) * 100
    };
  });

  async function loadChiefGearCostsFromCsv(primaryUrl = 'assets/chief_gear_unified.csv') {
    // Supports both unified and legacy extractor CSVs. Falls back if parsing fails.
    async function tryLoad(url) {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (!res.ok) return 0;
        const text = await res.text();
        const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
        if (lines.length === 0) return 0;

        const header = lines[0].split(',').map(h => h.trim().toLowerCase());
        // Accept multiple header variants
        const idx = {
          level: header.indexOf('level') !== -1 ? header.indexOf('level') : header.indexOf('gearlevel'),
          alloy: header.indexOf('hardenedalloy') !== -1 ? header.indexOf('hardenedalloy') : header.indexOf('alloy'),
          solution: header.indexOf('polishingsolution') !== -1 ? header.indexOf('polishingsolution') : header.indexOf('polish'),
          plans: header.indexOf('designplans') !== -1 ? header.indexOf('designplans') : header.indexOf('plans'),
          amber: header.indexOf('lunaramber') !== -1 ? header.indexOf('lunaramber') : header.indexOf('amber'),
          power: header.indexOf('power'),
          svsPoints: header.indexOf('svspoints') !== -1 ? header.indexOf('svspoints') : header.indexOf('svspoints')
        };
        if (idx.level === -1 || idx.alloy === -1 || idx.solution === -1 || idx.plans === -1 || idx.amber === -1) {
          return 0;
        }

        // Collect rows in order, including rows that don't map to canonical levels (e.g., Status steps)
        const parsedRows = [];
        for (let i = 1; i < lines.length; i++) {
          const parts = lines[i].split(',');
          if (parts.length < 1) continue;
          const rawLevel = (parts[idx.level] || '').trim();
          if (!rawLevel) continue;
          const uiLevel = toInternalLevel(rawLevel);
          parsedRows.push({
            raw: rawLevel,
            ui: uiLevel,
            isCanonical: !!uiLevel && GEAR_LEVELS.includes(uiLevel),
            hardenedAlloy: parseFloat(parts[idx.alloy]) || 0,
            polishingSolution: parseFloat(parts[idx.solution]) || 0,
            designPlans: parseFloat(parts[idx.plans]) || 0,
            lunarAmber: parseFloat(parts[idx.amber]) || 0,
            power: idx.power !== -1 ? (parseFloat(parts[idx.power]) || 0) : 0,
            svsPoints: idx.svsPoints !== -1 ? (parseFloat(parts[idx.svsPoints]) || 0) : 0
          });
        }

        // Fold: sum any non-canonical (e.g., Status) rows into the next canonical UI level
        let applied = 0;
        let pending = { hardenedAlloy:0, polishingSolution:0, designPlans:0, lunarAmber:0, svsPoints:0 };
        let lastCanonical = null;
        for (const row of parsedRows) {
          if (!row.isCanonical) {
            // Accumulate pending between anchors
            pending.hardenedAlloy += row.hardenedAlloy;
            pending.polishingSolution += row.polishingSolution;
            pending.designPlans += row.designPlans;
            pending.lunarAmber += row.lunarAmber;
            pending.svsPoints += row.svsPoints;
            continue;
          }

          // Canonical step: assign sum(pending + this row) to this canonical level
          const total = {
            hardenedAlloy: pending.hardenedAlloy + row.hardenedAlloy,
            polishingSolution: pending.polishingSolution + row.polishingSolution,
            designPlans: pending.designPlans + row.designPlans,
            lunarAmber: pending.lunarAmber + row.lunarAmber,
            // Power convention: final target level only (from this row)
            power: row.power || 0,
            svsPoints: pending.svsPoints + row.svsPoints
          };

          // Respect defined levels only
          if (GEAR_LEVELS.includes(row.ui)) {
            costs[row.ui] = total;
            applied++;
          }

          // Reset pending for next segment
          pending = { hardenedAlloy:0, polishingSolution:0, designPlans:0, lunarAmber:0, svsPoints:0 };
          lastCanonical = row.ui;
        }

        if (applied > 0) {
          console.info(`[Chief Gear] Applied ${applied} aggregated cost overrides from ${url}.`);
        }
        return applied;
      } catch (e) {
        console.warn('[Chief Gear] CSV override skipped for', url, ':', e.message || e);
        try {
          document.dispatchEvent(new CustomEvent('csv-load-failed', {
            detail: { calculator: 'Chief Gear', url, message: e?.message || String(e) }
          }));
        } catch(_err) { /* noop */ }
        return 0;
      }
    }

    // Try unified first, then fallback to legacy extractor output
    const appliedPrimary = await tryLoad(primaryUrl);
    if (appliedPrimary > 0) return;
    const legacyUrl = 'assets/chief_gear_costs.csv';
    const appliedLegacy = await tryLoad(legacyUrl);
    if (appliedLegacy === 0) {
      try {
        document.dispatchEvent(new CustomEvent('csv-load-failed', {
          detail: {
            calculator: 'Chief Gear',
            url: `${primaryUrl} (fallback: ${legacyUrl})`,
            message: 'No CSV overrides applied.'
          }
        }));
      } catch(_e) { /* noop */ }
    }
  }

  // Render a label with a local icon
  function labelWithIcon(key){
    if(window.IconHelper){
      return window.IconHelper.label(key, k=>k.charAt(0).toUpperCase()+k.slice(1).replace(/-/g, ' '));
    }
    const map = {
      'hardened-alloy': 'assets/resources/chief-gear/hardened-alloy.png',
      'polishing-solution': 'assets/resources/chief-gear/polishing-solution.png',
      'design-plans': 'assets/resources/chief-gear/design-plans.png',
      'lunar-amber': 'assets/resources/chief-gear/lunar-amber.png'
    };
    const url = map[key];
    if(!url) return key;
    const pretty = key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' ');
    return `<img class="res-icon" src="${url}" alt="${pretty}" onerror="this.style.display='none'"> ${pretty}`;
  }

  // Custom label helper: "Total <Name>" with icon
  function totalLabelWithIcon(key){
    const t = window.I18n ? window.I18n.t : (k)=>k;
    const translated = t(key);
    if(window.IconHelper){
      return window.IconHelper.label(key, ()=>t('total')+' '+translated);
    }
    const map = {
      'hardened-alloy': 'assets/resources/chief-gear/hardened-alloy.png',
      'polishing-solution': 'assets/resources/chief-gear/polishing-solution.png',
      'design-plans': 'assets/resources/chief-gear/design-plans.png',
      'lunar-amber': 'assets/resources/chief-gear/lunar-amber.png'
    };
    const url = map[key];
    if(!url) return t('total')+' '+translated;
    return `<img class="res-icon" src="${url}" alt="${translated}" onerror="this.style.display='none'"> ${t('total')} ${translated}`;
  }

  /**
   * sumCosts(fromLevel, toLevel)
   * Calculates the total cost to upgrade from one level to another
   *
   * @param {string} fromLevel - Starting level (e.g. "Blue 1")
   * @param {string} toLevel - Target level (e.g. "Purple T1 2")
   * @returns {object} Total costs or null if invalid
   */
  function sumCosts(fromLevel, toLevel){
    const normFrom = toInternalLevel(fromLevel);
    const normTo = toInternalLevel(toLevel);
    const fromIndex = GEAR_LEVELS.indexOf(normFrom);
    const toIndex = GEAR_LEVELS.indexOf(normTo);

    if(fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex){
      return null;
    }

    const totals = {
      hardenedAlloy: 0,
      polishingSolution: 0,
      designPlans: 0,
      lunarAmber: 0,
      power: 0,
      svsPoints: 0
    };
    let finalLevelCost = null;

    for(let i = fromIndex + 1; i <= toIndex; i++){
      const level = GEAR_LEVELS[i];
      const cost = costs[level];
      if(cost){
        totals.hardenedAlloy += cost.hardenedAlloy;
        totals.polishingSolution += cost.polishingSolution;
        totals.designPlans += cost.designPlans;
        totals.lunarAmber += cost.lunarAmber;
        totals.svsPoints += cost.svsPoints;
        finalLevelCost = cost;
      }
    }

    totals.power = finalLevelCost ? (finalLevelCost.power || 0) : 0;

    return totals;
  }

  /**
   * validateLevels(startSelect, finishSelect)
   * Ensures TO is greater-than-or-equal to FROM (TO ≥ FROM)
   * Disables only options in TO that are less than FROM
   * Auto-fills FROM if TO is selected without FROM
   */
  function validateLevels(startSelect, finishSelect){
    const startVal = startSelect.value;
    const finishVal = finishSelect.value;

    // If TO is set but FROM is empty, auto-fill FROM with first level (Locked)
    if(!startVal && finishVal){
      startSelect.value = GEAR_LEVELS[0]; // Set to "Locked"
      applyRegexForPair(startSelect, finishSelect);
      return; // Re-run validation will happen via event
    }

    if(!startVal || !finishVal){
      applyRegexForPair(startSelect, finishSelect);
      return;
    }

    const normalizedStart = toInternalLevel(startVal);
    const normalizedFinish = toInternalLevel(finishVal);
    const startIdx = GEAR_LEVELS.indexOf(normalizedStart);
    const finishIdx = GEAR_LEVELS.indexOf(normalizedFinish);

    // If FROM > TO, adjust TO to match FROM (maintains FROM ≤ TO invariant)
    if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
      finishSelect.value = startVal;
    }

    // Disable TO options that are less than FROM (allow equality)
    Array.from(finishSelect.options).forEach(opt => {
      if(!opt.value) return;
      const optIdx = GEAR_LEVELS.indexOf(toInternalLevel(opt.value));
      opt.disabled = (optIdx !== -1 && startIdx !== -1 && optIdx < startIdx);
    });
    applyRegexForPair(startSelect, finishSelect);
  }

  /**
   * formatNumber(n)
   * Formats a number with thousand separators
   */
  function formatNumber(n){
    return n.toLocaleString();
  }

  /**
   * calculateAll()
   * Main calculation function - finds all gear inputs and computes totals
   * Displays results in a formatted table
   */
  function calculateAll(){
    const out = document.getElementById('calculation-results');
    if(!out) return;

    const t = window.I18n ? window.I18n.t : (key)=>key;

    // Collect inventory
    const inventory = {
      hardenedAlloy: safeInventory(document.getElementById('inventory-alloy')?.value),
      polishingSolution: safeInventory(document.getElementById('inventory-solution')?.value),
      designPlans: safeInventory(document.getElementById('inventory-plans')?.value),
      lunarAmber: safeInventory(document.getElementById('inventory-amber')?.value)
    };

    // Collect all gear upgrades
    const gearResults = [];
    const grand = {
      hardenedAlloy: 0,
      polishingSolution: 0,
      designPlans: 0,
      lunarAmber: 0,
      power: 0,
      svsPoints: 0
    };

    // For each gear type, find the FROM/TO selects
    GEAR_TYPES.forEach(gear => {
      const startSel = document.getElementById(`${gear}-start`);
      const finishSel = document.getElementById(`${gear}-finish`);

      if(!startSel || !finishSel) return;

      const from = startSel.value;
      const to = finishSel.value;

      if(!from || !to) return;

      const costs = sumCosts(from, to);
      if(!costs) return;

      gearResults.push({
        name: gear,
        from,
        fromDisplay: displayLevel(from),
        to,
        toDisplay: displayLevel(to),
        costs
      });

      // Accumulate totals
      grand.hardenedAlloy += costs.hardenedAlloy;
      grand.polishingSolution += costs.polishingSolution;
      grand.designPlans += costs.designPlans;
      grand.lunarAmber += costs.lunarAmber;
      grand.power += costs.power;
      grand.svsPoints += costs.svsPoints;
    });

    // Check if any calculations exist
    const hasCalculations = grand.hardenedAlloy > 0 || grand.polishingSolution > 0 ||
                           grand.designPlans > 0 || grand.lunarAmber > 0;

    // Gap messages (similar to Charms)
    function gapHtml(label, total, inv){
      const gap = total - inv; // positive = need more, negative/zero = will have left

      // Don't show gap message if there are no calculations
      if (!hasCalculations) {
        return `
          <div class="total-line">
            <p><strong>${label}:</strong> ${formatNumber(total)}</p>
          </div>`;
      }

      const cls = gap > 0 ? 'deficit' : 'surplus';
      const text = gap > 0
        ? `⚠ ${t('need-more')} ${formatNumber(gap)} ${t('more')}`
        : `✅ ${t('will-have')} ${formatNumber(Math.abs(gap))} ${t('left')}`;
      return `
        <div class="total-line">
          <p><strong>${label}:</strong> ${formatNumber(total)}</p>
          <div class="gap-line ${cls}" aria-label="After inventory: ${text}">${text}</div>
        </div>`;
    }

    // Build totals HTML
    const totalsHtml = `
      <div class="result-totals" aria-live="polite">
        ${gapHtml(totalLabelWithIcon('hardened-alloy'), grand.hardenedAlloy, inventory.hardenedAlloy)}
        ${gapHtml(totalLabelWithIcon('polishing-solution'), grand.polishingSolution, inventory.polishingSolution)}
        ${gapHtml(totalLabelWithIcon('design-plans'), grand.designPlans, inventory.designPlans)}
        ${gapHtml(totalLabelWithIcon('lunar-amber'), grand.lunarAmber, inventory.lunarAmber)}
        <p class="summary-pill power-pill" style="background: var(--accent-secondary); color: white;"><strong>${t('total-power') || 'Total Power'}:</strong> ${formatNumber(grand.power)}</p>
        <p class="summary-pill svs-pill" style="background: var(--accent); color: white;"><strong>${t('total-svs-points') || 'Total SvS Points'}:</strong> ${formatNumber(grand.svsPoints)}</p>
      </div>`;

    // If no calculations, just show totals and exit
    if(!hasCalculations){
      out.innerHTML = totalsHtml;
      return;
    }

    // Build table HTML
    let tableHtml = `<div class="results-wrap table-responsive">
        <table class="results-table">
          <thead>
            <tr>
              <th>${t('slot') || 'Slot'}</th>
              <th>${t('from') || 'FROM'}</th>
              <th>${t('to') || 'TO'}</th>
              <th>${labelWithIcon('hardened-alloy')}</th>
              <th>${labelWithIcon('polishing-solution')}</th>
              <th>${labelWithIcon('design-plans')}</th>
              <th>${labelWithIcon('lunar-amber')}</th>
              <th>${t('power') || 'Power'}</th>
              <th>${t('svs-points') || 'SvS Points'}</th>
            </tr>
          </thead>
          <tbody>`;

    gearResults.forEach(g => {
      const gearName = t(g.name.charAt(0).toUpperCase() + g.name.slice(1)) || g.name;
      tableHtml += `<tr>
          <td>${gearName}</td>
          <td>${g.fromDisplay}</td>
          <td>${g.toDisplay}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/hardened-alloy.png" alt=""> ${formatNumber(g.costs.hardenedAlloy)}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/polishing-solution.png" alt=""> ${formatNumber(g.costs.polishingSolution)}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/design-plans.png" alt=""> ${formatNumber(g.costs.designPlans)}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/lunar-amber.png" alt=""> ${formatNumber(g.costs.lunarAmber)}</td>
          <td>${formatNumber(g.costs.power)}</td>
          <td>${formatNumber(g.costs.svsPoints)}</td>
        </tr>`;
    });

    tableHtml += `</tbody>
          <tfoot>
            <tr class="totals-row">
              <td>${t('totals') || 'Totals'}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/hardened-alloy.png" alt=""> ${formatNumber(grand.hardenedAlloy)}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/polishing-solution.png" alt=""> ${formatNumber(grand.polishingSolution)}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/design-plans.png" alt=""> ${formatNumber(grand.designPlans)}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/lunar-amber.png" alt=""> ${formatNumber(grand.lunarAmber)}</td>
              <td>${formatNumber(grand.power)}</td>
              <td>${formatNumber(grand.svsPoints)}</td>
            </tr>
          </tfoot>
        </table>
      </div>`;

    out.innerHTML = totalsHtml + tableHtml;

    // Make the table sortable
    if(typeof TableSortModule !== 'undefined'){
      TableSortModule.makeTableSortable(document.querySelector('.results-table'));
    }
  }

  /**
   * applyBatch(gear, which, value)
   * Quick-set feature: Sets the FROM or TO select for a specific gear type
   *
   * @param {string} gear - Gear type ('helmet', 'chestplate', etc)
   * @param {string} which - 'from' for start selects, 'to' for finish selects
   * @param {string} value - The level to set
   */
  function applyBatch(gear, which, value){
    const suffix = which === 'from' ? '-start' : '-finish';
    const select = document.getElementById(gear + suffix);

    if(!select) return;

    select.value = String(value);

    // Validate cross-levels
    if(which === 'to'){
      const startSel = document.getElementById(gear + '-start');
      if(startSel){
        const startIdx = GEAR_LEVELS.indexOf(startSel.value);
        const finishIdx = GEAR_LEVELS.indexOf(value);
        if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
          startSel.value = String(value);
        }
        validateLevels(startSel, select);
      }
    }

    if(which === 'from'){
      const finishSel = document.getElementById(gear + '-finish');
      if(finishSel){
        const startIdx = GEAR_LEVELS.indexOf(value);
        const finishIdx = GEAR_LEVELS.indexOf(finishSel.value);
        if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
          finishSel.value = String(value);
        }
        validateLevels(select, finishSel);
      }
    }

    calculateAll();
    // Save profile after all DOM updates
    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
    }
  }

  /**
   * resetGear()
   * Clears all gear values back to empty
   */
  function resetGear(){
    const gearSelects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
      .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));

    gearSelects.forEach(s => { s.value = GEAR_LEVELS[0]; });

    const batchControls = Array.from(document.querySelectorAll('select[id$="-from"], select[id$="-to"]'));
    batchControls.forEach(b => { b.value = GEAR_LEVELS[0]; });

    const startSelects = Array.from(document.querySelectorAll('select[id$="-start"]'))
      .filter(s => !s.id.endsWith('-from'));

    startSelects.forEach(startSel => {
      const base = startSel.id.replace(/-start$/, '');
      const finishSel = document.getElementById(base + '-finish');
      if(finishSel){
        Array.from(finishSel.options).forEach(opt => { opt.disabled = false; });
      }
    });

    calculateAll();
    // Save profile after all DOM updates
    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
    }
  }

  /**
   * enforceDigitsLimit(input, maxDigits)
   * Limits input to a maximum number of digits
   */
  function enforceDigitsLimit(input, maxDigits){
    const limit = (e) => {
      let v = e.target.value.replace(/\D/g, '');
      if(v.length > maxDigits) v = v.slice(0, maxDigits);
      e.target.value = v;
    };
    input.addEventListener('input', limit);
    input.addEventListener('change', limit);
    input.addEventListener('keyup', limit);
  }

  // Global batch apply (sets all gear start or finish values)
  function applyGlobalBatch(which, value){
    if(!value) return;
    GEAR_TYPES.forEach(gear => {
      const startSel = document.getElementById(`${gear}-start`);
      const finishSel = document.getElementById(`${gear}-finish`);

      if(!startSel || !finishSel) return;

      if(which === 'from'){
        // Setting FROM
        startSel.value = String(value);
        // If FROM > TO, adjust TO to match FROM
        const startIdx = GEAR_LEVELS.indexOf(toInternalLevel(String(value)));
        const finishIdx = GEAR_LEVELS.indexOf(toInternalLevel(finishSel.value));
        if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
          finishSel.value = String(value);
        }
        // Update disabled states
        validateLevels(startSel, finishSel);
      } else {
        // Setting TO
        finishSel.value = String(value);
        // If FROM is empty when setting TO, auto-fill FROM with first level
        if(!startSel.value){
          startSel.value = GEAR_LEVELS[0]; // "Locked"
        }
        // If FROM > TO, adjust FROM to match TO
        const startIdx = GEAR_LEVELS.indexOf(toInternalLevel(startSel.value));
        const finishIdx = GEAR_LEVELS.indexOf(toInternalLevel(String(value)));
        if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
          startSel.value = String(value);
        }
        // Update disabled states
        validateLevels(startSel, finishSel);
      }
    });
    calculateAll();
  }

  function attachResultAutoUpdateListeners(){
    const fields = document.querySelectorAll('input, select, textarea');
    fields.forEach(field => {
      const tag = field.tagName.toLowerCase();
      const type = (field.type || '').toLowerCase();
      if(tag === 'button' || type === 'button' || type === 'submit' || type === 'reset') return;
      if(field.dataset.cgAutoUpdate === '1') return;
      const handler = () => calculateAll();
      field.addEventListener('input', handler);
      field.addEventListener('change', handler);
      field.dataset.cgAutoUpdate = '1';
    });
  }

  /**
   * initialize()
   * Sets up all event listeners and loads CSV data
   */
  async function initialize(){
    await loadChiefGearCostsFromCsv();

    // Reset button
    const resetBtn = document.getElementById('chief-gear-reset');
    if(resetBtn){
      resetBtn.addEventListener('click', resetGear);
    }

    // Global batch controls
    const globalFrom = document.getElementById('gear-batch-from');
    const globalTo = document.getElementById('gear-batch-to');
    if(globalFrom && globalTo){
      // Apply initial validation to batch controls
      validateLevels(globalFrom, globalTo);

      globalFrom.addEventListener('change', () => {
        validateLevels(globalFrom, globalTo);
        applyGlobalBatch('from', globalFrom.value);
        calculateAll();
        // Save profile after all DOM updates
        if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
          setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
        }
      });
      globalTo.addEventListener('change', () => {
        validateLevels(globalFrom, globalTo);
        applyGlobalBatch('to', globalTo.value);
        calculateAll();
        // Save profile after all DOM updates
        if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
          setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
        }
      });
    }

    // Individual gear selects
    GEAR_TYPES.forEach(gear => {
      const startSel = document.getElementById(`${gear}-start`);
      const finishSel = document.getElementById(`${gear}-finish`);

      if(startSel && finishSel){
        // Apply initial validation
        validateLevels(startSel, finishSel);

        startSel.addEventListener('change', () => {
          validateLevels(startSel, finishSel);
        });
        finishSel.addEventListener('change', () => {
          validateLevels(startSel, finishSel);
        });
      }
    });

    // Inventory inputs
    const invAlloy = document.getElementById('inventory-alloy');
    const invSolution = document.getElementById('inventory-solution');
    const invPlans = document.getElementById('inventory-plans');
    const invAmber = document.getElementById('inventory-amber');

    if(invAlloy){
      enforceDigitsLimit(invAlloy, 7);
    }
    if(invSolution){
      enforceDigitsLimit(invSolution, 7);
    }
    if(invPlans){
      enforceDigitsLimit(invPlans, 6);
    }
    if(invAmber){
      enforceDigitsLimit(invAmber, 5);
    }

    attachResultAutoUpdateListeners();

    // Initial calculation
    calculateAll();

    console.info('[Chief Gear Calculator] Initialized');
  }

  // Auto-initialize when DOM is ready
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', initialize);
  } else {
    initialize();
  }

  // Public API
  return {
    calculateAll,
    resetGear,
    applyBatch,
    sumCosts,
    validateLevels
  };

})();

// Global export
window.ChiefGearCalculator = ChiefGearCalculatorModule;
