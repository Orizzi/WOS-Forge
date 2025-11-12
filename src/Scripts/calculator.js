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
  /**
   * costs: Resource table
   * Stores how much it costs to upgrade FROM level N-1 TO level N
   * Example: To upgrade FROM level 0 TO level 1, you need 40 guides + 15 designs
   */
  const costs = {
    0: { guides: 5, designs: 5, secrets: 0 },
    1: { guides: 40, designs: 15, secrets: 0 },
    2: { guides: 60, designs: 40, secrets: 0 },
    3: { guides: 80, designs: 100, secrets: 0 },
    4: { guides: 100, designs: 200, secrets: 0 },
    5: { guides: 120, designs: 300, secrets: 0 },
    6: { guides: 140, designs: 400, secrets: 0 },
    7: { guides: 200, designs: 400, secrets: 0 },
    8: { guides: 300, designs: 400, secrets: 0 },
    9: { guides: 420, designs: 420, secrets: 0 },
    10: { guides: 560, designs: 420, secrets: 0 },
    11: { guides: 580, designs: 450, secrets: 15 },
    12: { guides: 580, designs: 450, secrets: 30 },
    13: { guides: 600, designs: 500, secrets: 45 },
    14: { guides: 600, designs: 500, secrets: 70 },
    15: { guides: 650, designs: 550, secrets: 100 }
  };

  /**
   * estimateDaysNeeded(totals)
   * Rough estimate of days needed to gather resources
   * Assumptions (adjust as needed):
   * - 100 guides/day
   * - 50 designs/day
   * - 10 secrets/day
   * Returns the max days among the three resources.
   */
  function estimateDaysNeeded(totals){
    const daysForGuides = Math.ceil((totals.guides || 0) / 100);
    const daysForDesigns = Math.ceil((totals.designs || 0) / 50);
    const daysForSecrets = Math.ceil((totals.secrets || 0) / 10);
    return Math.max(daysForGuides, daysForDesigns, daysForSecrets);
  }

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
   * @returns {object} Object with guides, designs, secrets total
   */
  function sumCosts(from, to){
    const total = { guides: 0, designs: 0, secrets: 0 };
    const a = Number(from);
    const b = Number(to);
    
    // If invalid (to <= from), return 0 cost
    if(isNaN(a) || isNaN(b) || b <= a) return total;
    
    // Loop from (from+1) to (to), adding up all costs
    for(let lvl = a + 1; lvl <= b; lvl++){
      const c = costs[lvl];
      if(!c) continue;
      total.guides += c.guides || 0;
      total.designs += c.designs || 0;
      total.secrets += c.secrets || 0;
    }
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
    
    const grand = { guides: 0, designs: 0, secrets: 0 };  // Grand total
    const details = [];  // Array to store each charm's cost

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
      const from = Number(startSel.value);
      const to = Number(finishSel.value);
      
      // Calculate cost for this charm
      const sum = sumCosts(from, to);
      
      // If cost > 0, save it for display
      if(sum.guides || sum.designs || sum.secrets){
        details.push({ id: base, from, to, sum });
        grand.guides += sum.guides;
        grand.designs += sum.designs;
        grand.secrets += sum.secrets;
      }
    });

    // Get the results container and clear it
    const out = document.getElementById('calculation-results');
    if(!out) return;
    out.innerHTML = '';

    // Create the totals summary (big numbers at top)
    const totalsHtml = `
      <div class="result-totals">
        <p><strong>Total Guides:</strong> ${formatNumber(grand.guides)}</p>
        <p><strong>Total Designs:</strong> ${formatNumber(grand.designs)}</p>
        <p><strong>Total Secrets:</strong> ${formatNumber(grand.secrets)}</p>
      </div>`;

    // Add an estimated time to gather resources (based on simple rates)
    const estDays = estimateDaysNeeded(grand);
    const timeHtml = `<p class="result-estimate">Estimated time to gather: <strong>${formatNumber(estDays)} day${estDays===1?'':'s'}</strong></p>`;

    // If no calculations, show message and exit
    if(!details.length){
      out.innerHTML = totalsHtml + '<p>No upgrades selected (finish &le; start for all slots).</p>';
      return;
    }

    // Build table rows
    // Each row shows: slot name, from level, to level, guides cost, designs cost, secrets cost
    const rows = details.map(d => {
      return `
        <tr>
          <td>${d.id.replace(/-/g,' ')}</td>
          <td>${d.from}</td>
          <td>${d.to}</td>
          <td><span class="col-dot res-guides" aria-hidden="true"></span>${formatNumber(d.sum.guides)}</td>
          <td><span class="col-dot res-designs" aria-hidden="true"></span>${formatNumber(d.sum.designs)}</td>
          <td><span class="col-dot res-secrets" aria-hidden="true"></span>${formatNumber(d.sum.secrets)}</td>
        </tr>`;
    }).join('\n');

    // Create the full table HTML
    // Includes colored dots for each resource type
    const tableHtml = `
      <div class="results-wrap">
        <table class="results-table" aria-live="polite">
          <thead>
            <tr>
              <th data-key="slot">Slot</th>
              <th data-key="from">From</th>
              <th data-key="to">To</th>
              <th data-key="guides">Guides <span class="col-dot res-guides" aria-hidden="true"></span></th>
              <th data-key="designs">Designs <span class="col-dot res-designs" aria-hidden="true"></span></th>
              <th data-key="secrets">Secrets <span class="col-dot res-secrets" aria-hidden="true"></span></th>
            </tr>
          </thead>
          <tbody>
            ${rows}
          </tbody>
          <tfoot>
            <tr>
              <td colspan="3">Totals</td>
              <td>${formatNumber(grand.guides)}</td>
              <td>${formatNumber(grand.designs)}</td>
              <td>${formatNumber(grand.secrets)}</td>
            </tr>
          </tfoot>
        </table>
      </div>`;

  out.innerHTML = totalsHtml + timeHtml + tableHtml;

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
    nodes.forEach(s => { s.value = String(value); });
    
    // Recalculate totals since inputs changed
    calculateAll();
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
    charmSelects.forEach(s => { s.value = '0'; });
    
    // Also reset the batch control selects for visual consistency
    const batchControls = Array.from(document.querySelectorAll('select[id$="-from"], select[id$="-to"]'));
    batchControls.forEach(b => { b.value = '0'; });
    
    // Recalculate (should be 0 cost now)
    calculateAll();
  }

  /**
   * validateLevels(currentSelect, desiredSelect)
   * Ensures current level is not higher than desired level
   */
  function validateLevels(currentSelect, desiredSelect){
    const current = parseInt(currentSelect.value);
    const desired = parseInt(desiredSelect.value);
    
    if(!isNaN(current) && !isNaN(desired) && current > desired){
      // If current > desired, set current = desired
      currentSelect.value = desired.toString();
    }
  }

  /**
   * attachCalcListeners()
   * Sets up all event handlers (what happens when user interacts with controls)
   * Called once when page loads
   */
  function init(){
    // Setup validation and calculation on select changes
    const types = ['hat','chestplate','ring','watch','pants','staff'];
    types.forEach(type => {
      for(let i = 1; i <= 5; i++){
        const currentSelect = document.getElementById(`${type}${i}-current`);
        const desiredSelect = document.getElementById(`${type}${i}-desired`);
        
        if(currentSelect && desiredSelect){
          currentSelect.addEventListener('change', () => {
            validateLevels(currentSelect, desiredSelect);
            calculateAll();
          });
          desiredSelect.addEventListener('change', () => {
            validateLevels(currentSelect, desiredSelect);
            calculateAll();
          });
        }
      }
    });

    // When ANY other select changes, recalculate
    const selects = Array.from(document.querySelectorAll('select'));
    selects.forEach(s=> {
      if(!s.id.includes('-current') && !s.id.includes('-desired')){
        s.addEventListener('change', calculateAll);
      }
    });

    // Setup batch controls
    // Each charm type (hat, ring, watch) has FROM and TO batch selects
    const batchTypes = ['hat','chestplate','ring','watch','pants','staff'];
    batchTypes.forEach(type => {
      const from = document.getElementById(`${type}-batch-from`);
      const to = document.getElementById(`${type}-batch-to`);
      if(from) from.addEventListener('change', ()=> applyBatch(type, 'from', from.value));
      if(to) to.addEventListener('change', ()=> applyBatch(type, 'to', to.value));
    });

    // Setup reset button
    const resetBtn = document.getElementById('charms-reset');
    if(resetBtn) resetBtn.addEventListener('click', resetCharms);

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
