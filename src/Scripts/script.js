/*! Deprecated: legacy monolithic file. Do not load. */
(function(){
  try { console.error('Legacy src/Scripts/script.js is deprecated and must not be loaded. Use modular files in src/Scripts/.'); } catch(e){}
  throw new Error('Do not load legacy script.js');
})();
/**
 * ====== THEME TOGGLE (Dark/Light Mode) ======
 * 
 * This section handles switching between dark and light themes.
 * The theme choice is saved in browser storage so it remembers your preference.
 * 
 * How it works:
 * 1. User clicks the "Dark mode toggle" button
 * 2. setTheme() adds/removes the 'light-theme' class from the body
 * 3. CSS automatically changes colors based on whether 'light-theme' is present
 * 4. The choice is saved to localStorage (browser storage)
 * 5. Next time you visit, it loads your saved theme preference
 */
(function(){
  const TOGGLE_ID = 'dark-mode-toggle';      // ID of the toggle button
  const STORAGE_KEY = 'wos-theme';           // Key for storing theme choice
  const CLASS = 'light-theme';               // CSS class that triggers light theme

  const toggle = document.getElementById(TOGGLE_ID);

  /**
   * setTheme(isLight)
   * Applies a theme and saves the choice
   * @param {boolean} isLight - true for light theme, false for dark
   */
  function setTheme(isLight){
    // Add or remove 'light-theme' class on the body element
    document.body.classList.toggle(CLASS, !!isLight);
    
    // Save the choice to browser storage (survives page refresh)
    try { 
      localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); 
    } catch(e){
      // If localStorage fails (e.g., in private browsing), silently continue
    }
    
    // Update button text with emoji to show current theme
    if(toggle){
      // If currently in light mode, show moon emoji (to indicate can switch to dark)
      // If currently in dark mode, show sun emoji (to indicate can switch to light)
      toggle.textContent = isLight ? '☀️ Light' : '🌙 Dark';
      
      // For accessibility: tell screen readers if this button is "pressed" (active)
      try { 
        toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false'); 
      } catch(e){}
    }
  }

  /**
   * init()
   * Loads saved theme and sets up the click handler
   * Called once when the page loads
   */
  function init(){
    // Get saved theme from browser storage, default to 'dark' if not found
    const saved = (()=>{ 
      try { 
        return localStorage.getItem(STORAGE_KEY); 
      } catch(e){ 
        return null; 
      } 
    })() || 'dark';
    
    // Apply the saved theme
    setTheme(saved === 'light');
    
    if(!toggle) return;
    
    // When user clicks the button, toggle the theme
    toggle.addEventListener('click', function(){
      const isLight = !document.body.classList.contains(CLASS);
      setTheme(isLight);
    });
  }

  // Wait for page to load, then initialize
  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

  /**
   * ====== CHARMS CALCULATOR ======
   * 
   * This section calculates the total resources needed to upgrade charms
   * from one level to another.
   * 
   * How it works:
   * 1. The 'costs' object stores how much each level upgrade costs
   * 2. When you select a FROM and TO level, sumCosts() adds up all costs between them
   * 3. calculateAll() finds all charm inputs, runs sumCosts for each, and shows results
   * 4. The results table is made sortable so you can click headers to sort
   */
  (function(){
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

      out.innerHTML = totalsHtml + tableHtml;

      // Make the table sortable (clickable headers)
      makeTableSortable(document.querySelector('.results-table'));

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
     * attachCalcListeners()
     * Sets up all event handlers (what happens when user interacts with controls)
     * Called once when page loads
     */
    function attachCalcListeners(){
      // When ANY select changes, recalculate
      const selects = Array.from(document.querySelectorAll('select'));
      selects.forEach(s=> s.addEventListener('change', calculateAll));

      // Setup batch controls
      // Each charm type (hat, ring, watch) has FROM and TO batch selects
      const types = ['hat','chestplate','ring','watch','pants','staff'];
      types.forEach(type => {
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

    /**
     * ====== PROFILES / PRESETS ======
     * 
     * Allows users to save and load their favorite charm upgrade plans
     * 
     * How it works:
     * 1. User fills in values (e.g., Hat FROM 0 TO 5)
     * 2. Clicks "Save as new" → captureCurrent() saves all current values
     * 3. Values are stored in browser storage (key: 'wos-charm-profiles')
     * 4. User can select saved profile from dropdown → loadSelectedProfile() restores values
     * 5. User can rename or delete profiles
     * 
     * Data is stored as JSON: { "My Plan 1": { id1: value1, id2: value2 }, ... }
     */
    const PROFILES_KEY = 'wos-charm-profiles';  // Key used for browser storage

    /**
     * readProfiles()
     * Reads all saved profiles from browser storage
     * @returns {object} Object with all profiles: { "Name": { selections }, ... }
     */
    function readProfiles(){
      try{
        const raw = localStorage.getItem(PROFILES_KEY);
        return raw ? JSON.parse(raw) : {};
      }catch(e){ 
        return {}; 
      }
    }

    /**
     * writeProfiles(profiles)
     * Saves all profiles to browser storage
     * @param {object} profiles - Object with all profiles to save
     */
    function writeProfiles(profiles){
      try{ 
        localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); 
      }catch(e){}  // Silently fail if localStorage unavailable
    }

    /**
     * captureCurrent()
     * Takes a "snapshot" of current charm selections
     * Returns an object like: { "hat-charm-1-start": "5", "hat-charm-1-finish": "10", ... }
     * @returns {object} Current charm level selections
     */
    function captureCurrent(){
      const selects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
        .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
      const obj = {};
      selects.forEach(s => obj[s.id] = s.value);
      return obj;
    }

    /**
     * applyProfileObject(obj)
     * Takes a saved profile snapshot and applies it to the form
     * Restores all charm selections from a saved profile
     * @param {object} obj - Profile data to apply
     */
    function applyProfileObject(obj){
      if(!obj) return;
      Object.keys(obj).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(obj[id]);
      });
      calculateAll();  // Recalculate with new values
    }

    function renderProfilesList(){
      const list = document.getElementById('profiles-list');
      if(!list) return;
      const profiles = readProfiles();
      list.innerHTML = '';
      Object.keys(profiles).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name; 
        opt.textContent = name;
        list.appendChild(opt);
      });
    }

    /**
     * saveNewProfile(name)
     * Creates a new profile with the current charm selections
     * @param {string} name - Name for the new profile
     */
    function saveNewProfile(name){
      if(!name) return alert('Enter a profile name');
      const profiles = readProfiles();
      if(profiles[name]) return alert('A profile with that name already exists. Use Overwrite or pick another name.');
      
      // Capture current selections and save
      profiles[name] = captureCurrent();
      writeProfiles(profiles);
      
      // Refresh the dropdown list
      renderProfilesList();
      
      // Clear the input field
      document.getElementById('profile-name').value = '';
    }

    /**
     * overwriteProfile(name)
     * Updates an existing profile with current charm selections
     * @param {string} name - Name of profile to overwrite
     */
    function overwriteProfile(name){
      if(!name) return alert('Select a profile to overwrite');
      const profiles = readProfiles();
      if(!profiles[name]) return alert('Profile not found');
      
      // Replace profile with current selections
      profiles[name] = captureCurrent();
      writeProfiles(profiles);
      renderProfilesList();
    }

    /**
     * loadSelectedProfile()
     * Loads the selected profile from the dropdown
     * Restores all charm selections from that profile
     */
    function loadSelectedProfile(){
      const list = document.getElementById('profiles-list');
      if(!list) return alert('No profiles');
      const name = list.value;
      const profiles = readProfiles();
      if(!profiles[name]) return alert('Profile not found');
      
      // Apply the saved profile's selections
      applyProfileObject(profiles[name]);
    }

    /**
     * deleteSelectedProfile()
     * Deletes the selected profile after confirmation
     */
    function deleteSelectedProfile(){
      const list = document.getElementById('profiles-list');
      if(!list) return;
      const name = list.value;
      if(!name) return alert('Select a profile to delete');
      const ok = confirm(`Delete profile "${name}"?`);
      if(!ok) return;
      const profiles = readProfiles();
      delete profiles[name];
      writeProfiles(profiles);
      renderProfilesList();
    }

    function renameSelectedProfile(){
      const list = document.getElementById('profiles-list');
      const input = document.getElementById('profile-name');
      if(!list || !input) return;
      const from = list.value; const to = input.value && input.value.trim();
      if(!from) return alert('Select a profile to rename');
      if(!to) return alert('Enter the new name in the textbox');
      const profiles = readProfiles();
      if(profiles[to]) return alert('A profile with the new name already exists');
      profiles[to] = profiles[from];
      delete profiles[from];
      writeProfiles(profiles);
      renderProfilesList();
      input.value = '';
    }

    // wire profile UI buttons
    function attachProfileListeners(){
      const saveBtn = document.getElementById('profile-save');
      const overwriteBtn = document.getElementById('profile-overwrite');
      const deleteBtn = document.getElementById('profile-delete');
      const renameBtn = document.getElementById('profile-rename');
      const list = document.getElementById('profiles-list');

      if(saveBtn) saveBtn.addEventListener('click', ()=> saveNewProfile(document.getElementById('profile-name').value && document.getElementById('profile-name').value.trim()));
      if(overwriteBtn) overwriteBtn.addEventListener('click', ()=> overwriteProfile(list && list.value));
      if(deleteBtn) deleteBtn.addEventListener('click', deleteSelectedProfile);
      if(renameBtn) renameBtn.addEventListener('click', renameSelectedProfile);
  // auto-load when a profile is selected from the list
  if(list) list.addEventListener('change', loadSelectedProfile);
      // render existing on load
      renderProfilesList();
    }

    // Initialize profile UI after page loads
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', attachProfileListeners);
    } else {
      attachProfileListeners();
    }

    // Initialize calculator after page loads
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', attachCalcListeners);
    } else {
      attachCalcListeners();
    }

    /**
     * ====== TABLE SORTING ======
     * 
     * Makes the results table headers clickable to sort
     * Click a header to sort by that column (ascending)
     * Click again to reverse the sort order (descending)
     * 
     * Keyboard accessible: Tab to header, Enter/Space to sort
     */
    function makeTableSortable(table){
      if(!table) return;
      
      // Find all <th> elements with data-key attribute
      const ths = table.querySelectorAll('thead th[data-key]');
      if(!ths || !ths.length) return;
      
      // Map column names to column indices (position in table)
      const colMap = { 
        slot: 0,     // Column 0: Charm slot name
        from: 1,     // Column 1: Starting level
        to: 2,       // Column 2: Ending level
        guides: 3,   // Column 3: Guides cost
        designs: 4,  // Column 4: Designs cost
        secrets: 5   // Column 5: Secrets cost
      };

      // Make each header clickable and keyboard accessible
      ths.forEach(th => {
        th.style.cursor = 'pointer';           // Show pointer cursor
        th.setAttribute('role','button');      // Tell screen readers it's a button
        th.setAttribute('tabindex','0');       // Make it focusable with Tab key
        th.addEventListener('click', () => sortBy(th));  // Sort on click
        th.addEventListener('keydown', (e) => { 
          // Allow Enter or Space to sort
          if(e.key === 'Enter' || e.key === ' ') { 
            e.preventDefault();
            sortBy(th); 
          } 
        });
      });

      /**
       * sortBy(th)
       * Sorts table rows by the clicked header
       * @param {HTMLElement} th - The header that was clicked
       */
      function sortBy(th){
        const key = th.dataset.key;  // Get the column name (e.g., 'guides')
        const idx = colMap[key] ?? 0;  // Get the column index
        const tbody = table.tBodies[0];  // Get the table body
        if(!tbody) return;
        
        // Get all rows as an array so we can sort them
        const rows = Array.from(tbody.querySelectorAll('tr'));
        
        // Toggle between ascending (asc) and descending (desc)
        const dir = th.dataset.sortDir === 'asc' ? 'desc' : 'asc';
        
        // Clear sorting indicators from all other headers
        ths.forEach(h => { 
          delete h.dataset.sortDir;  // Remove sort direction
          h.classList.remove('sorted-asc','sorted-desc');  // Remove visual indicators
          h.setAttribute('aria-sort','none');  // Tell screen readers
        });
        
        // Mark this header as sorted
        th.dataset.sortDir = dir;
        th.classList.add(dir === 'asc' ? 'sorted-asc' : 'sorted-desc');
        th.setAttribute('aria-sort', dir === 'asc' ? 'ascending' : 'descending');

        /**
         * parseCell(row)
         * Extracts the value from a cell and converts it to a sortable format
         * - If it's a number, returns the number (for numeric sort)
         * - If it's text, returns lowercase text (for alphabetic sort)
         * - Removes commas from numbers (e.g., "1,000" → 1000)
         */
        const parseCell = (row) => {
          const cell = row.children[idx];  // Get cell at the column index
          if(!cell) return '';
          
          let t = cell.textContent.trim();  // Get text, remove extra spaces
          t = t.replace(/,/g,'');  // Remove commas (e.g., "1,000" → "1000")
          
          const v = parseFloat(t);  // Try to convert to number
          // Return as number if it's numeric, otherwise as lowercase text
          return isNaN(v) ? t.toLowerCase() : v;
        };

        // Sort the rows
        rows.sort((a,b) => {
          const va = parseCell(a);  // Get sortable value from row a
          const vb = parseCell(b);  // Get sortable value from row b
          
          // Numeric sort (if both are numbers)
          if(typeof va === 'number' && typeof vb === 'number') 
            return dir === 'asc' ? va - vb : vb - va;
          
          // Text sort (alphabetic)
          if(va < vb) return dir === 'asc' ? -1 : 1;
          if(va > vb) return dir === 'asc' ? 1 : -1;
          return 0;
        });
        
        // Re-append rows in sorted order
        rows.forEach(r => tbody.appendChild(r));
      }
    }

  })();
