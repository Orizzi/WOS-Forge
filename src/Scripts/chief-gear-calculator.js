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
  
  // Gear levels in order (46 levels total)
  const GEAR_LEVELS = [
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

  // Gear types
  const GEAR_TYPES = ['helmet', 'chestplate', 'ring', 'watch', 'pants', 'staff'];

  /**
   * costs: Resource table
   * Stores how much it costs to upgrade TO level N
   * Will be loaded from chief_gear_costs.csv if available
   */
  const costs = {};
  
  // Initialize costs with default values
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

  /**
   * Load chief gear costs from CSV and override defaults
   */
  async function loadChiefGearCostsFromCsv(url = 'assets/chief_gear_costs.csv') {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return;
      
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const idx = {
        level: header.indexOf('gear level') >= 0 ? header.indexOf('gear level') : header.indexOf('level'),
        alloy: header.indexOf('hardened alloy') >= 0 ? header.indexOf('hardened alloy') : header.indexOf('hardenedalloy'),
        solution: header.indexOf('polishing solution') >= 0 ? header.indexOf('polishing solution') : header.indexOf('polishingsolution'),
        plans: header.indexOf('design plans') >= 0 ? header.indexOf('design plans') : header.indexOf('designplans'),
        amber: header.indexOf('lunar amber') >= 0 ? header.indexOf('lunar amber') : header.indexOf('lunaramber'),
        power: header.indexOf('power'),
        svsPoints: header.indexOf('svspoints') >= 0 ? header.indexOf('svspoints') : header.indexOf('svs points')
      };

      let applied = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < 6) continue;
        
        const levelName = parts[idx.level]?.trim();
        if (!levelName || !GEAR_LEVELS.includes(levelName)) continue;
        
        costs[levelName] = {
          hardenedAlloy: parseFloat(parts[idx.alloy]) || 0,
          polishingSolution: parseFloat(parts[idx.solution]) || 0,
          designPlans: parseFloat(parts[idx.plans]) || 0,
          lunarAmber: parseFloat(parts[idx.amber]) || 0,
          power: parseFloat(parts[idx.power]) || 0,
          svsPoints: parseFloat(parts[idx.svsPoints]) || 0
        };
        applied++;
      }
      
      if (applied > 0) {
        console.info(`[Chief Gear] Applied ${applied} cost overrides from CSV.`);
      }
    } catch (e) {
      console.warn('[Chief Gear] CSV override skipped:', e.message || e);
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
    const fromIndex = GEAR_LEVELS.indexOf(fromLevel);
    const toIndex = GEAR_LEVELS.indexOf(toLevel);
    
    if(fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex){
      return null;
    }
    
    let totals = {
      hardenedAlloy: 0,
      polishingSolution: 0,
      designPlans: 0,
      lunarAmber: 0,
      power: 0,
      svsPoints: 0
    };
    
    for(let i = fromIndex + 1; i <= toIndex; i++){
      const level = GEAR_LEVELS[i];
      const cost = costs[level];
      if(cost){
        totals.hardenedAlloy += cost.hardenedAlloy;
        totals.polishingSolution += cost.polishingSolution;
        totals.designPlans += cost.designPlans;
        totals.lunarAmber += cost.lunarAmber;
        totals.power += cost.power;
        totals.svsPoints += cost.svsPoints;
      }
    }
    
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
    
    // If TO is set but FROM is empty, auto-fill FROM with first level (Green)
    if(!startVal && finishVal){
      startSelect.value = GEAR_LEVELS[0]; // Set to "Green"
      return; // Re-run validation will happen via event
    }
    
    if(!startVal || !finishVal) return;
    
    const startIdx = GEAR_LEVELS.indexOf(startVal);
    const finishIdx = GEAR_LEVELS.indexOf(finishVal);
    
    // If FROM > TO, adjust TO to match FROM (maintains FROM ≤ TO invariant)
    if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
      finishSelect.value = startVal;
    }
    
    // Disable TO options that are less than FROM (allow equality)
    Array.from(finishSelect.options).forEach(opt => {
      if(!opt.value) return;
      const optIdx = GEAR_LEVELS.indexOf(opt.value);
      opt.disabled = (optIdx !== -1 && startIdx !== -1 && optIdx < startIdx);
    });
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
      hardenedAlloy: parseInt(document.getElementById('inventory-alloy')?.value) || 0,
      polishingSolution: parseInt(document.getElementById('inventory-solution')?.value) || 0,
      designPlans: parseInt(document.getElementById('inventory-plans')?.value) || 0,
      lunarAmber: parseInt(document.getElementById('inventory-amber')?.value) || 0
    };

    // Collect all gear upgrades
    const gearResults = [];
    let grand = {
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
        to,
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
    let tableHtml = `<div class="results-wrap">
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
            </tr>
          </thead>
          <tbody>`;

    gearResults.forEach(g => {
      const gearName = t(g.name.charAt(0).toUpperCase() + g.name.slice(1)) || g.name;
      tableHtml += `<tr>
          <td>${gearName}</td>
          <td>${g.from}</td>
          <td>${g.to}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/hardened-alloy.png" alt=""> ${formatNumber(g.costs.hardenedAlloy)}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/polishing-solution.png" alt=""> ${formatNumber(g.costs.polishingSolution)}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/design-plans.png" alt=""> ${formatNumber(g.costs.designPlans)}</td>
          <td><img class="res-icon" src="assets/resources/chief-gear/lunar-amber.png" alt=""> ${formatNumber(g.costs.lunarAmber)}</td>
        </tr>`;
    });

    tableHtml += `</tbody>
          <tfoot>
            <tr class="totals-row">
              <td colspan="3">${t('totals') || 'Totals'}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/hardened-alloy.png" alt=""> ${formatNumber(grand.hardenedAlloy)}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/polishing-solution.png" alt=""> ${formatNumber(grand.polishingSolution)}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/design-plans.png" alt=""> ${formatNumber(grand.designPlans)}</td>
              <td><img class="res-icon" src="assets/resources/chief-gear/lunar-amber.png" alt=""> ${formatNumber(grand.lunarAmber)}</td>
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
    
    gearSelects.forEach(s => { s.value = ''; });
    
    const batchControls = Array.from(document.querySelectorAll('select[id$="-from"], select[id$="-to"]'));
    batchControls.forEach(b => { b.value = ''; });
    
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
        const startIdx = GEAR_LEVELS.indexOf(String(value));
        const finishIdx = GEAR_LEVELS.indexOf(finishSel.value);
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
          startSel.value = GEAR_LEVELS[0]; // "Green"
        }
        // If FROM > TO, adjust FROM to match TO
        const startIdx = GEAR_LEVELS.indexOf(startSel.value);
        const finishIdx = GEAR_LEVELS.indexOf(String(value));
        if(startIdx !== -1 && finishIdx !== -1 && startIdx > finishIdx){
          startSel.value = String(value);
        }
        // Update disabled states
        validateLevels(startSel, finishSel);
      }
    });
    calculateAll();
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
          calculateAll();
        });
        finishSel.addEventListener('change', () => {
          validateLevels(startSel, finishSel);
          calculateAll();
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
      invAlloy.addEventListener('input', calculateAll);
      invAlloy.addEventListener('change', calculateAll);
    }
    if(invSolution){
      enforceDigitsLimit(invSolution, 7);
      invSolution.addEventListener('input', calculateAll);
      invSolution.addEventListener('change', calculateAll);
    }
    if(invPlans){
      enforceDigitsLimit(invPlans, 6);
      invPlans.addEventListener('input', calculateAll);
      invPlans.addEventListener('change', calculateAll);
    }
    if(invAmber){
      enforceDigitsLimit(invAmber, 5);
      invAmber.addEventListener('input', calculateAll);
      invAmber.addEventListener('change', calculateAll);
    }

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
