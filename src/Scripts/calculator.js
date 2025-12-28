// Add event listeners to all batch inputs to auto-save profile on any change
const allBatchInputs = Array.from(document.querySelectorAll('select[id$="-batch-from"], select[id$="-batch-to"]'));
allBatchInputs.forEach(batchInput => {
  batchInput.addEventListener('change', () => {
    // [Charms] Batch input changed: removed for production
    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      ProfilesModule.autoSaveCurrentProfile();
      // [Charms] Profile auto-saved after batch input change: removed for production
    }
  });
});
/**
 * ====== CHARMS CALCULATOR MODULE ======
 *
 * This module calculates the total resources needed to upgrade charms
 * from one level to another.
 *
 * How it works:
 * 1. The 'costs' object stores how much each level upgrade costs
 * 2. When you select a FROM and TO level, sumCosts() adds up all costs between them
 * 3. calculateAll() finds all charm inputs, runs sumCosts for each, and shows results
 * 4. The results table is made sortable so you can click headers to sort
 */

const CalculatorModule = (function(){
  // Costs are now loaded solely from charms_unified.csv
  const costs = {};

  const LOCKED_LEVEL = -1;
  const MAX_CHARM_LEVEL = 16;
  const CHARM_LEVEL_VALUES = [LOCKED_LEVEL];
  for (let lvl = 1; lvl <= MAX_CHARM_LEVEL; lvl++) {
    CHARM_LEVEL_VALUES.push(lvl);
  }
  const LOCKED_VALUE = LOCKED_LEVEL.toString();
  const validator = window.InputValidation;

  function safeLevel(value, fallback = LOCKED_LEVEL) {
    if (validator && typeof validator.toInt === 'function') {
      return validator.toInt(value, { min: LOCKED_LEVEL, max: MAX_CHARM_LEVEL, fallback });
    }
    const n = parseInt(value, 10);
    if (Number.isNaN(n)) return fallback;
    return Math.max(LOCKED_LEVEL, Math.min(MAX_CHARM_LEVEL, n));
  }

  function safeInventory(value) {
    if (validator && typeof validator.numberOrZero === 'function') {
      return validator.numberOrZero(value, { min: 0, max: 999999999, fallback: 0 });
    }
    const n = parseInt(value, 10);
    if (Number.isNaN(n) || !Number.isFinite(n)) return 0;
    return Math.max(0, n);
  }

  function isLockedValue(value) {
    return Number(value) === LOCKED_LEVEL;
  }

  function formatLevelLabel(value) {
    return isLockedValue(value) ? (window.I18n?.t('locked') || 'Locked') : value;
  }

  function escapeRegex(value){
    return String(value).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  function setRegexConstraint(element, allowedValues){
    if(!element) return;
    const allowed = allowedValues.map(v => escapeRegex(String(v)));
    if(allowed.length === 0){
      element.removeAttribute('data-level-regex');
      element.setCustomValidity('');
      return;
    }
    const pattern = `^(${allowed.join('|')})$`;
    element.setAttribute('data-level-regex', pattern);
    const regex = new RegExp(pattern);
    if(element.value && !regex.test(element.value)){
      element.setCustomValidity('Invalid level selection');
    } else {
      element.setCustomValidity('');
    }
  }

  function applyRegexForPair(startSelect, finishSelect){
    if(startSelect){
      const finishVal = safeLevel(finishSelect?.value, MAX_CHARM_LEVEL);
      const allowedStart = CHARM_LEVEL_VALUES.filter(v => v <= finishVal);
      setRegexConstraint(startSelect, allowedStart);
    }
    if(finishSelect){
      const startVal = safeLevel(startSelect?.value, LOCKED_LEVEL);
      const allowedFinish = CHARM_LEVEL_VALUES.filter(v => v >= startVal);
      setRegexConstraint(finishSelect, allowedFinish);
    }
  }

  /**
   * Load charm costs from CSV and override defaults (optional)
   */
  async function loadCharmCostsFromCsv(url = 'assets/charms_unified.csv') {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) return;
      const text = await res.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) return;
      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const idx = {
        level: header.indexOf('level'),
        guides: header.indexOf('guides'),
        designs: header.indexOf('designs'),
        secrets: header.indexOf('secrets'),
        power: header.indexOf('power'),
        svsPoints: header.indexOf('svspoints')
      };
      if (Object.values(idx).some(v => v === -1)) return;

      let applied = 0;
      for (let i = 1; i < lines.length; i++) {
        const parts = lines[i].split(',');
        if (parts.length < header.length) continue;
        const level = parseInt(parts[idx.level], 10);
        if (isNaN(level)) continue;
        costs[level] = {
          guides: parseInt(parts[idx.guides], 10) || 0,
          designs: parseInt(parts[idx.designs], 10) || 0,
          secrets: parseInt(parts[idx.secrets], 10) || 0,
          power: parseInt(parts[idx.power], 10) || 0,
          svsPoints: parseInt(parts[idx.svsPoints], 10) || 0
        };
        applied++;
      }
      if (applied > 0) {
        console.info(`[Charms] Applied ${applied} cost overrides from CSV.`);
      }
    } catch (e) {
      console.warn('[Charms] CSV override skipped:', e.message || e);
      try {
        document.dispatchEvent(new CustomEvent('csv-load-failed', {
          detail: { calculator: 'Charms', url, message: e.message || String(e) }
        }));
      } catch(_err) {}
    }
  }

  // Render a label with a local icon (delegates to global IconHelper if available)
  function labelWithIcon(key){
    if(window.IconHelper){
      return window.IconHelper.label(key, k=>k.charAt(0).toUpperCase()+k.slice(1));
    }
    const map = {
      guides: '../src/assets/resources/charms/guides.png',
      designs: '../src/assets/resources/charms/designs.png',
      secrets: '../src/assets/resources/charms/secrets.png'
    };
    const url = map[key];
    if(!url) return key;
    const pretty = key.charAt(0).toUpperCase() + key.slice(1);
    return `<img class="res-icon" src="${url}" alt="${pretty}" onerror="this.style.display='none'"> ${pretty}`;
  }

  // Custom label helper: "Total <Name>" with icon
  function totalLabelWithIcon(key){
    const t = window.I18n?.t || (k => k);
    const resourceName = t(key) || (key.charAt(0).toUpperCase() + key.slice(1));
    const totalText = t('total') || 'Total';

    if(window.IconHelper){
      return window.IconHelper.label(key, () => `${totalText} ${resourceName}`);
    }
    const map = {
      guides: '../src/assets/resources/charms/guides.png',
      designs: '../src/assets/resources/charms/designs.png',
      secrets: '../src/assets/resources/charms/secrets.png'
    };
    const url = map[key];
    const text = `${totalText} ${resourceName}`;
    if(!url) return text;
    return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
  }

  /**
   * estimateDaysNeeded(totals)
   * Rough estimate of days needed to gather resources
   * Assumptions (adjust as needed):
   * - 100 guides/day
   * - 50 designs/day
   * - 10 secrets/day
   * Returns the max days among the three resources.
   */
  // Removed estimateDaysNeeded (no longer shown in UI)
  // function estimateDaysNeeded(totals){ ... }

  /**
   * sumCosts(from, to)
   * Calculates total cost from one level to another
   * Example: sumCosts(0, 5) = costs from level 1, 2, 3, 4, 5
   *
   * NOTE: The 'from' level is EXCLUSIVE (not included)
   *       The 'to' level is INCLUSIVE (included)
   * This matches the game's upgrade system.
   *
   * @param {number} from - Starting level
   * @param {number} to - Ending level
   * @returns {object} Object with guides, designs, secrets, power, svsPoints total
   */
  function sumCosts(from, to){
    const total = { guides: 0, designs: 0, secrets: 0, power: 0, svsPoints: 0 };
    const a = Number(from);
    const b = Number(to);

    // If invalid (to <= from), return 0 cost
    if(isNaN(a) || isNaN(b) || b <= a) return total;

    // Loop from (from+1) to (to), adding up all costs (EXCEPT power)
    for(let lvl = a + 1; lvl <= b; lvl++){
      const c = costs[lvl];
      if(!c) continue;
      total.guides += c.guides || 0;
      total.designs += c.designs || 0;
      total.secrets += c.secrets || 0;
      total.svsPoints += c.svsPoints || 0;
    }

    // Power is NOT accumulated; it should reflect the latest upgrade's power only
    const target = costs[b];
    total.power = target && typeof target.power === 'number' ? target.power : 0;

    return total;
  }

  /**
   * formatNumber(n)
   * Makes big numbers readable with commas
   * Example: 1000 → "1,000"
   */
  function formatNumber(n){
    return n.toLocaleString();
  }

  /**
   * calculateAll()
   * Main calculation function
   *
   * This runs whenever you change any charm level.
   * It:
   * 1. Finds all charm input pairs (FROM and TO)
   * 2. Calculates cost for each pair
   * 3. Sums all costs together
   * 4. Displays results in a table
   * 5. Makes the table sortable
   */
  function calculateAll(){
    // Find all 'FROM' selects (they end with '-start')
    // Example: 'hat-charm-1-start', 'ring-charm-2-start'
    const starts = Array.from(document.querySelectorAll('select[id$="-start"]'));

    const grand = { guides: 0, designs: 0, secrets: 0, power: 0, svsPoints: 0 };  // Grand total
    const details = [];  // Array to store each charm's cost

    // Detect which equipment types are in batch mode
    // Check if all charms of a type have the same from/to values (indicating batch was used)
    const batchTypes = ['hat','chestplate','ring','watch','pants','staff'];
    const batchModeByType = {}; // Track batch mode per equipment type

    batchTypes.forEach(type => {
      const typeSelects = Array.from(document.querySelectorAll(`select[id^="${type}-charm-"][id$="-start"]`));
      if(typeSelects.length > 1){
        const firstFrom = typeSelects[0]?.value;
        const firstTo = document.getElementById(typeSelects[0]?.id.replace('-start', '-finish'))?.value;
        const allSameFrom = typeSelects.every(s => s.value === firstFrom);
        const allSameTo = typeSelects.every(s => {
          const finishId = s.id.replace('-start', '-finish');
          const finishSel = document.getElementById(finishId);
          return finishSel && finishSel.value === firstTo;
        });
        const firstFromValue = Number(firstFrom);
        const firstToValue = Number(firstTo);
        const bothLocked = isLockedValue(firstFromValue) && isLockedValue(firstToValue);
        if(allSameFrom && allSameTo && !bothLocked){
          batchModeByType[type] = true;
        }
      }
    });

    // For each FROM select, find its matching TO select
    starts.forEach(startSel => {
      // Get the base ID by removing '-start'
      // 'hat-charm-1-start' → 'hat-charm-1'
      const base = startSel.id.slice(0, -6);

      // Find the matching TO select
      // 'hat-charm-1' + '-finish' → 'hat-charm-1-finish'
      const finishSel = document.getElementById(base + '-finish');
      if(!finishSel) return;

      // Get the FROM and TO values as numbers
      const range = validator?.sanitizeRange
        ? validator.sanitizeRange(startSel.value, finishSel.value, { min: LOCKED_LEVEL, max: MAX_CHARM_LEVEL, fallbackStart: LOCKED_LEVEL })
        : null;
      const from = range ? range.start : safeLevel(startSel.value, LOCKED_LEVEL);
      const to = range ? range.end : safeLevel(finishSel.value, from);

      // Calculate cost for this charm
      const sum = sumCosts(from, to);

      // If cost > 0, save it for display
      if(sum.guides || sum.designs || sum.secrets || sum.power || sum.svsPoints){
        details.push({ id: base, from, to, sum });
        grand.guides += sum.guides;
        grand.designs += sum.designs;
        grand.secrets += sum.secrets;
        grand.svsPoints += sum.svsPoints;

        // Power: sum the target power of each charm (3 charms per type)
        grand.power += Number(sum.power || 0);
      }
    });


    // Get the results container and clear it
    const out = document.getElementById('calculation-results');
    if(!out) return;
    out.innerHTML = '';

    // Create the totals summary (big numbers at top)
    // Inventory subtraction (optional inputs) - show gaps similar to Fire Crystals page
    const invGuides = safeInventory(document.getElementById('inventory-guides')?.value);
    const invDesigns = safeInventory(document.getElementById('inventory-designs')?.value);
    const invSecrets = safeInventory(document.getElementById('inventory-secrets')?.value);

    const gapGuides = grand.guides - invGuides;
    const gapDesigns = grand.designs - invDesigns;
    const gapSecrets = grand.secrets - invSecrets;

    // Only show gap messages when there are actual calculations (totals > 0)
    const hasCalculations = grand.guides > 0 || grand.designs > 0 || grand.secrets > 0;

    function gapHtml(label, total, inv){
      const gap = total - inv; // positive = need more, negative/zero = will have left

      // Don't show gap message if there are no calculations
      if (!hasCalculations) {
        return `
          <div class="total-line">
            <p><strong>${label}:</strong> ${formatNumber(total)}</p>
          </div>`;
      }

      // Get translations for gap messages
      const t = window.I18n?.t || (k => k);
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

    const totalsHtml = `
      <div class="result-totals" aria-live="polite">
        ${gapHtml(totalLabelWithIcon('guides'), grand.guides, invGuides)}
        ${gapHtml(totalLabelWithIcon('designs'), grand.designs, invDesigns)}
        ${gapHtml(totalLabelWithIcon('secrets'), grand.secrets, invSecrets)}
        <div class="total-item summary-pill power-pill" style="background: var(--accent-secondary); color: white;">
          <p><strong>${window.I18n?.t('total-power') || 'Total Power'}:</strong> ${formatNumber(grand.power)}</p>
        </div>
        <div class="total-item summary-pill svs-pill" style="background: var(--accent); color: white;">
          <p><strong>${window.I18n?.t('total-svs-points') || 'Total SvS Points'}:</strong> ${formatNumber(grand.svsPoints)}</p>
        </div>
      </div>`;

    // Add an estimated time to gather resources (based on simple rates)
    // Removed estimated time line for clarity

    // If no calculations, just show totals and exit
    if(!details.length){
      out.innerHTML = totalsHtml;
      return;
    }

    // Translation helper
    const t = window.I18n?.t || (k => k);

    // Build table rows - group equipment types that are in batch mode, show individual charms for others
    function prettySlotName(raw){
      const match = raw.match(/^([a-z]+)-charm-(\d+)/i);
      if(match){
        const typeKey = `${match[1]}-charms`;
        const numKey = `charm-${match[2]}`;
        const typeLabel = t(typeKey) || `${match[1].charAt(0).toUpperCase() + match[1].slice(1)} Charms`;
        const slotLabel = t(numKey) || `Charm ${match[2]}`;
        return `${typeLabel} - ${slotLabel}`;
      }
      return raw
        .split('-')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');
    }

    // Group charms by type
    const grouped = {};
    details.forEach(d => {
      // Extract type from id: 'hat-charm-1' -> 'hat'
      const type = d.id.split('-')[0];
      if(!grouped[type]){
        grouped[type] = {
          type: type,
          charms: []
        };
      }
      grouped[type].charms.push(d);
    });

    // Create rows: one line per type if in batch mode, individual lines otherwise
    const rows = [];
    Object.values(grouped).forEach(g => {
      if(batchModeByType[g.type]){
        // This type is in batch mode - show one aggregated line
        const totals = {
          guides: 0,
          designs: 0,
          secrets: 0,
          power: 0,
          svsPoints: 0,
          from: g.charms[0].from,
          to: g.charms[0].to
        };
        g.charms.forEach(c => {
          totals.guides += c.sum.guides;
          totals.designs += c.sum.designs;
          totals.secrets += c.sum.secrets;
          totals.power += Number(c.sum.power || 0);
          totals.svsPoints += Number(c.sum.svsPoints || 0);
        });
        const typeName = t(`${g.type}-charms`) || (g.type.charAt(0).toUpperCase() + g.type.slice(1) + ' Charms');
        rows.push(`
          <tr>
            <td>${typeName}</td>
            <td>${formatLevelLabel(totals.from)}</td>
            <td>${formatLevelLabel(totals.to)}</td>
            <td><img class="res-icon" src="assets/resources/charms/guides.png" alt="Guides"> ${formatNumber(totals.guides)}</td>
            <td><img class="res-icon" src="assets/resources/charms/designs.png" alt="Designs"> ${formatNumber(totals.designs)}</td>
            <td><img class="res-icon" src="assets/resources/charms/secrets.png" alt="Secrets"> ${formatNumber(totals.secrets)}</td>
            <td>${formatNumber(totals.power)}</td>
            <td>${formatNumber(totals.svsPoints)}</td>
          </tr>`);
      } else {
        // This type is NOT in batch mode - show individual charm lines
        g.charms.forEach(d => {
          rows.push(`
            <tr>
              <td>${prettySlotName(d.id)}</td>
              <td>${formatLevelLabel(d.from)}</td>
              <td>${formatLevelLabel(d.to)}</td>
              <td><img class="res-icon" src="assets/resources/charms/guides.png" alt="Guides"> ${formatNumber(d.sum.guides)}</td>
              <td><img class="res-icon" src="assets/resources/charms/designs.png" alt="Designs"> ${formatNumber(d.sum.designs)}</td>
              <td><img class="res-icon" src="assets/resources/charms/secrets.png" alt="Secrets"> ${formatNumber(d.sum.secrets)}</td>
              <td>${formatNumber(d.sum.power || 0)}</td>
              <td>${formatNumber(d.sum.svsPoints || 0)}</td>
            </tr>`);
        });
      }
    });

    const rowsHtml = rows.join('\n');

    // Create the full table HTML
    // Includes colored dots for each resource type
    const tableHtml = `
      <div class="results-wrap table-responsive">
        <table class="results-table" aria-live="polite">
          <thead>
            <tr>
              <th data-key="slot">${t('slot')}</th>
              <th data-key="from">${t('from')}</th>
              <th data-key="to">${t('to')}</th>
              <th data-key="guides">${labelWithIcon('guides')}</th>
              <th data-key="designs">${labelWithIcon('designs')}</th>
              <th data-key="secrets">${labelWithIcon('secrets')}</th>
              <th data-key="power">${t('power') || 'Power'}</th>
              <th data-key="svsPoints">${t('svs-points') || 'SvS Points'}</th>
            </tr>
          </thead>
          <tbody>
            ${rowsHtml}
          </tbody>
          <tfoot>
            <tr>
              <td>${t('totals')}</td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
              <td><img class="res-icon" src="assets/resources/charms/guides.png" alt="Guides"> ${formatNumber(grand.guides)}</td>
              <td><img class="res-icon" src="assets/resources/charms/designs.png" alt="Designs"> ${formatNumber(grand.designs)}</td>
              <td><img class="res-icon" src="assets/resources/charms/secrets.png" alt="Secrets"> ${formatNumber(grand.secrets)}</td>
              <td>${formatNumber(grand.power)}</td>
              <td>${formatNumber(grand.svsPoints)}</td>
            </tr>
          </tfoot>
        </table>
      </div>`;

    out.innerHTML = totalsHtml + tableHtml;

    // Make the table sortable (clickable headers)
    if(typeof TableSortModule !== 'undefined'){
      TableSortModule.makeTableSortable(document.querySelector('.results-table'));
    }
  }

  /**
   * applyBatch(type, which, value)
   * Quick-set feature: Sets all FROM or TO selects for a charm type to the same value
   *
   * Example: User selects "5" from the "Hat FROM" dropdown
   * This sets all hat charms' FROM (start) select to 5
   *
   * @param {string} type - Charm type ('hat', 'ring', 'watch', etc)
   * @param {string} which - 'from' for start selects, 'to' for finish selects
   * @param {number} value - The level to set
   */
  function applyBatch(type, which, value){
    // Determine if we're setting -start or -finish selects
    const suffix = which === 'from' ? '-start' : '-finish';

    // Find all selects for this charm type with the matching suffix
    // Example: 'hat' + 'from' → find all [hat-charm-*-start]
    const nodes = Array.from(document.querySelectorAll(`select[id^="${type}-charm-"]`))
      .filter(s => s.id.endsWith(suffix));

    // Set all matching selects to the same value
    nodes.forEach(s => {
      s.value = String(value);

      // If we're setting TO values, validate against the FROM value
      if(which === 'to'){
        const base = s.id.replace(/-finish$/, '');
        const startSel = document.getElementById(base + '-start');
        if(startSel){
          const startVal = parseInt(startSel.value);
          const finishVal = parseInt(value);
          if(!isNaN(startVal) && !isNaN(finishVal) && startVal > finishVal){
            // If FROM > TO, adjust FROM to match TO
            startSel.value = String(value);
          }
          // Update disabled states for this TO select
          validateLevels(startSel, s);
        }
      }

      // If we're setting FROM values, validate against the TO value
      if(which === 'from'){
        const base = s.id.replace(/-start$/, '');
        const finishSel = document.getElementById(base + '-finish');
        if(finishSel){
          const startVal = parseInt(value);
          const finishVal = parseInt(finishSel.value);
          if(!isNaN(startVal) && !isNaN(finishVal) && startVal > finishVal){
            // If FROM > TO, adjust TO to match FROM
            finishSel.value = String(value);
          }
          // Update disabled states for this TO select
          validateLevels(s, finishSel);
        }
      }
    });

    // Recalculate totals since inputs changed
    calculateAll();
    // Save profile after all DOM updates
    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
    }
  }

  /**
   * resetCharms()
   * Clears all charm values back to level 0
   * Used when user clicks the "Reset all charms" button
   */
  function resetCharms(){
    // Find all charm input selects (end with -start or -finish)
    // But exclude the batch control selects (which end with -from or -to)
    const charmSelects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
      .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));

    // Reset all to 0
    charmSelects.forEach(s => { s.value = LOCKED_VALUE; });

    // Also reset the batch control selects for visual consistency
    const batchControls = Array.from(document.querySelectorAll('select[id$="-from"], select[id$="-to"]'));
    batchControls.forEach(b => { b.value = LOCKED_VALUE; });

    // Re-validate all TO selects to reset disabled states
    const startSelects = Array.from(document.querySelectorAll('select[id$="-start"]'))
      .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));

    startSelects.forEach(startSel => {
      const base = startSel.id.replace(/-start$/, '');
      const finishSel = document.getElementById(base + '-finish');
      if(finishSel){
        validateLevels(startSel, finishSel);
      }
    });

    // Also reset batch control validation
    const batchTypes = ['hat','chestplate','ring','watch','pants','staff'];
    batchTypes.forEach(type => {
      const from = document.getElementById(`${type}-batch-from`);
      const to = document.getElementById(`${type}-batch-to`);
      if(from && to){
        validateLevels(from, to);
      }
    });

    // Recalculate (should be 0 cost now)
    calculateAll();
  }

  /**
   * validateLevels(startSelect, finishSelect)
   * Ensures start level is not higher than finish level
   * Also disables options in finish select that are less than start value
   */
  function validateLevels(startSelect, finishSelect){
    if(!startSelect || !finishSelect) return;
    const start = parseInt(startSelect.value, 10);
    const finish = parseInt(finishSelect.value, 10);

    // Disable options in finish select that are less than start
    if(!isNaN(start)){
      Array.from(finishSelect.options).forEach(option => {
        const optValue = parseInt(option.value, 10);
        if(!isNaN(optValue) && optValue < start){
          option.disabled = true;
        } else {
          option.disabled = false;
        }
      });
    }

    if(!isNaN(start) && !isNaN(finish) && start > finish){
      // If start > finish, set finish = start
      finishSelect.value = start.toString();
    }
    applyRegexForPair(startSelect, finishSelect);
  }

  /**
   * attachCalcListeners()
   * Sets up all event handlers (what happens when user interacts with controls)
   * Called once when page loads
   */
  async function init(){
    // Load charm costs from CSV (overrides default values)
    await loadCharmCostsFromCsv();

    // Setup validation and calculation on charm select changes
    // Find all -start selects and attach validation
    const startSelects = Array.from(document.querySelectorAll('select[id$="-start"]'))
      .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));

    startSelects.forEach(startSel => {
      const base = startSel.id.replace(/-start$/, '');
      const finishSel = document.getElementById(base + '-finish');

      if(finishSel){
        // Apply initial validation
        validateLevels(startSel, finishSel);

        startSel.addEventListener('change', () => {
          validateLevels(startSel, finishSel);
          calculateAll();
          // Auto-save profile when a charm start level changes
          if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
            setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
          }
        });
        finishSel.addEventListener('change', () => {
          validateLevels(startSel, finishSel);
          calculateAll();
          // Auto-save profile when a charm finish level changes
          if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
            setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
          }
        });
      }
    });

    // Setup batch controls
    // Each charm type (hat, ring, watch) has FROM and TO batch selects
    const batchTypes = ['hat','chestplate','ring','watch','pants','staff'];
    batchTypes.forEach(type => {
      const from = document.getElementById(`${type}-batch-from`);
      const to = document.getElementById(`${type}-batch-to`);

      if(from && to){
        // Apply initial validation
        validateLevels(from, to);

        from.addEventListener('change', ()=> {
          const oldToValue = to.value;
          validateLevels(from, to);
          applyBatch(type, 'from', from.value);
          // If validateLevels adjusted the batch TO, apply it to all individual charms
          if(to.value !== oldToValue){
            applyBatch(type, 'to', to.value);
          }
          calculateAll();
          // Save profile after all DOM updates
          if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
            setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
          }
        });
        to.addEventListener('change', ()=> {
          validateLevels(from, to);
          applyBatch(type, 'to', to.value);
          calculateAll();
          // Save profile after all DOM updates
          if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
            setTimeout(() => { ProfilesModule.autoSaveCurrentProfile(); }, 0);
          }
        });
      }
    });

    // Setup reset button
    const resetBtn = document.getElementById('charms-reset');
    if(resetBtn) resetBtn.addEventListener('click', resetCharms);

    // Setup inventory inputs to trigger recalculation on change
    const invGuides = document.getElementById('inventory-guides');
    const invDesigns = document.getElementById('inventory-designs');
    const invSecrets = document.getElementById('inventory-secrets');

    function enforceDigitsLimit(input, maxDigits){
      if(!input) return;
      input.addEventListener('input', () => {
        let v = String(input.value || '');
        v = v.replace(/\D+/g, '');
        if(v.length > maxDigits){
          v = v.slice(0, maxDigits);
        }
        if(input.value !== v){
          input.value = v;
        }
        calculateAll();
      });
      // Also listen to change event for when field is cleared or loses focus
      input.addEventListener('change', () => {
        calculateAll();
      });
      // Listen to keyup for immediate feedback on delete/backspace
      input.addEventListener('keyup', () => {
        calculateAll();
      });
    }

    enforceDigitsLimit(invGuides, 8);
    enforceDigitsLimit(invDesigns, 8);
    enforceDigitsLimit(invSecrets, 6);

    // Initial calculation on page load
    calculateAll();
  }

  // Public API
  return {
    init,
    calculateAll,
    sumCosts,
    applyBatch,
    resetCharms
  };
})();

// Auto-initialize when page loads
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => CalculatorModule.init());
} else {
  CalculatorModule.init();
}
