/* Toggle light theme on body and persist choice in localStorage */
(function(){
  const TOGGLE_ID = 'dark-mode-toggle';
  const STORAGE_KEY = 'wos-theme';
  const CLASS = 'light-theme';

  const toggle = document.getElementById(TOGGLE_ID);

  function setTheme(isLight){
    document.body.classList.toggle(CLASS, !!isLight);
    try { localStorage.setItem(STORAGE_KEY, isLight ? 'light' : 'dark'); } catch(e){}
    // update the toggle button label to reflect the action it will perform
    if(toggle){
      // short English labels: show the action the button will perform
      // when currently in light mode, show 'Dark' (to switch to dark mode)
      // when currently in dark mode, show 'Light' (to switch to light mode)
      toggle.textContent = isLight ? 'Dark' : 'Light';
      // keep an accessible pressed state (true when light mode is active)
      try { toggle.setAttribute('aria-pressed', isLight ? 'true' : 'false'); } catch(e){}
    }
  }

  function init(){
    const saved = (()=>{ try { return localStorage.getItem(STORAGE_KEY); } catch(e){ return null; } })() || 'dark';
    setTheme(saved === 'light');
    if(!toggle) return;
    toggle.addEventListener('click', function(){
      const isLight = !document.body.classList.contains(CLASS);
      setTheme(isLight);
    });
  }

  if(document.readyState === 'loading'){
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();

  /* --- Charms calculator: compute resource costs FROM -> TO for all select groups --- */
  (function(){
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

    // helper to sum costs between levels (exclusive of start, inclusive of finish)
    function sumCosts(from, to){
      const total = { guides: 0, designs: 0, secrets: 0 };
      const a = Number(from);
      const b = Number(to);
      if(isNaN(a) || isNaN(b) || b <= a) return total; // no cost or invalid
      for(let lvl = a + 1; lvl <= b; lvl++){
        const c = costs[lvl];
        if(!c) continue;
        total.guides += c.guides || 0;
        total.designs += c.designs || 0;
        total.secrets += c.secrets || 0;
      }
      return total;
    }

    function formatNumber(n){ return n.toLocaleString(); }

    function calculateAll(){
      // find all start selects (ids ending with -start)
      const starts = Array.from(document.querySelectorAll('select[id$="-start"]'));
      const grand = { guides: 0, designs: 0, secrets: 0 };
      const details = [];

      starts.forEach(startSel => {
        const base = startSel.id.slice(0, -6); // remove '-start'
        const finishSel = document.getElementById(base + '-finish');
        if(!finishSel) return;
        const from = Number(startSel.value);
        const to = Number(finishSel.value);
        const sum = sumCosts(from, to);
        if(sum.guides || sum.designs || sum.secrets){
          details.push({ id: base, from, to, sum });
          grand.guides += sum.guides;
          grand.designs += sum.designs;
          grand.secrets += sum.secrets;
        }
      });

      // render results
      const out = document.getElementById('calculation-results');
      if(!out) return;
      out.innerHTML = '';

      // build a clean results table
      const totalsHtml = `
        <div class="result-totals">
          <p><strong>Total Guides:</strong> ${formatNumber(grand.guides)}</p>
          <p><strong>Total Designs:</strong> ${formatNumber(grand.designs)}</p>
          <p><strong>Total Secrets:</strong> ${formatNumber(grand.secrets)}</p>
        </div>`;

      if(!details.length){
        out.innerHTML = totalsHtml + '<p>No upgrades selected (finish &le; start for all slots).</p>';
        return;
      }

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

      // make the results table sortable by clicking headers
      makeTableSortable(document.querySelector('.results-table'));

    }

    // Apply a batch value to all charm selects of a given type.
    // type: 'hat'|'chestplate'|'ring'|'watch'|'pants'|'staff'
    // which: 'from' or 'to' (maps to '-start' and '-finish')
    function applyBatch(type, which, value){
      const suffix = which === 'from' ? '-start' : '-finish';
      const nodes = Array.from(document.querySelectorAll(`select[id^="${type}-charm-"]`)).filter(s => s.id.endsWith(suffix));
      nodes.forEach(s => { s.value = String(value); });
      // recalc once after applying
      calculateAll();
    }

    // Reset all charm selects (only the actual charm start/finish selects) to 0
    function resetCharms(){
      const charmSelects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
        // exclude our batch controls which use '-from'/'-to' ids
        .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
      charmSelects.forEach(s => { s.value = '0'; });
      // also reset batch controls to 0 for visual consistency
      const batchControls = Array.from(document.querySelectorAll('select[id$="-from"], select[id$="-to"]'));
      batchControls.forEach(b => { b.value = '0'; });
      calculateAll();
    }

    function attachCalcListeners(){
      const selects = Array.from(document.querySelectorAll('select'));
      selects.forEach(s=> s.addEventListener('change', calculateAll));

      // wire batch controls
      const types = ['hat','chestplate','ring','watch','pants','staff'];
      types.forEach(type => {
        const from = document.getElementById(`${type}-batch-from`);
        const to = document.getElementById(`${type}-batch-to`);
        if(from) from.addEventListener('change', ()=> applyBatch(type, 'from', from.value));
        if(to) to.addEventListener('change', ()=> applyBatch(type, 'to', to.value));
      });

      const resetBtn = document.getElementById('charms-reset');
      if(resetBtn) resetBtn.addEventListener('click', resetCharms);

      // initial calc
      calculateAll();
    }

    /* --- Profiles (presets) management ---------------------------------- */
    const PROFILES_KEY = 'wos-charm-profiles';

    function readProfiles(){
      try{
        const raw = localStorage.getItem(PROFILES_KEY);
        return raw ? JSON.parse(raw) : {};
      }catch(e){ return {}; }
    }

    function writeProfiles(profiles){
      try{ localStorage.setItem(PROFILES_KEY, JSON.stringify(profiles)); }catch(e){}
    }

    // capture current charm selects values into an object { id: value }
    function captureCurrent(){
      const selects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
        .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
      const obj = {};
      selects.forEach(s => obj[s.id] = s.value);
      return obj;
    }

    function applyProfileObject(obj){
      if(!obj) return;
      Object.keys(obj).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(obj[id]);
      });
      calculateAll();
    }

    function renderProfilesList(){
      const list = document.getElementById('profiles-list');
      if(!list) return;
      const profiles = readProfiles();
      list.innerHTML = '';
      Object.keys(profiles).forEach(name => {
        const opt = document.createElement('option');
        opt.value = name; opt.textContent = name;
        list.appendChild(opt);
      });
    }

    function saveNewProfile(name){
      if(!name) return alert('Enter a profile name');
      const profiles = readProfiles();
      if(profiles[name]) return alert('A profile with that name already exists. Use Overwrite or pick another name.');
      profiles[name] = captureCurrent();
      writeProfiles(profiles);
      renderProfilesList();
      document.getElementById('profile-name').value = '';
    }

    function overwriteProfile(name){
      if(!name) return alert('Select a profile to overwrite');
      const profiles = readProfiles();
      if(!profiles[name]) return alert('Profile not found');
      profiles[name] = captureCurrent();
      writeProfiles(profiles);
      renderProfilesList();
    }

    function loadSelectedProfile(){
      const list = document.getElementById('profiles-list');
      if(!list) return alert('No profiles');
      const name = list.value;
      const profiles = readProfiles();
      if(!profiles[name]) return alert('Profile not found');
      applyProfileObject(profiles[name]);
    }

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

    // ensure profile UI is wired after DOM load
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', attachProfileListeners);
    } else {
      attachProfileListeners();
    }

    // run after DOM loaded
    if(document.readyState === 'loading'){
      document.addEventListener('DOMContentLoaded', attachCalcListeners);
    } else {
      attachCalcListeners();
    }

    // --- Utility: make a results table sortable by clicking the <th> with data-key ---
    function makeTableSortable(table){
      if(!table) return;
      const ths = table.querySelectorAll('thead th[data-key]');
      if(!ths || !ths.length) return;
      const colMap = { slot:0, from:1, to:2, guides:3, designs:4, secrets:5 };

      ths.forEach(th => {
        th.style.cursor = 'pointer';
        th.setAttribute('role','button');
        th.setAttribute('tabindex','0');
        th.addEventListener('click', () => sortBy(th));
        th.addEventListener('keydown', (e) => { if(e.key === 'Enter' || e.key === ' ') { e.preventDefault(); sortBy(th); } });
      });

      function sortBy(th){
        const key = th.dataset.key;
        const idx = colMap[key] ?? 0;
        const tbody = table.tBodies[0];
        if(!tbody) return;
        const rows = Array.from(tbody.querySelectorAll('tr'));
        // toggle direction
        const dir = th.dataset.sortDir === 'asc' ? 'desc' : 'asc';
        // clear previous
        ths.forEach(h => { delete h.dataset.sortDir; h.classList.remove('sorted-asc','sorted-desc'); h.setAttribute('aria-sort','none'); });
        th.dataset.sortDir = dir;
        th.classList.add(dir === 'asc' ? 'sorted-asc' : 'sorted-desc');
        th.setAttribute('aria-sort', dir === 'asc' ? 'ascending' : 'descending');

        const parseCell = (row) => {
          const cell = row.children[idx];
          if(!cell) return '';
          let t = cell.textContent.trim();
          t = t.replace(/,/g,'');
          const v = parseFloat(t);
          return isNaN(v) ? t.toLowerCase() : v;
        };

        rows.sort((a,b) => {
          const va = parseCell(a);
          const vb = parseCell(b);
          if(typeof va === 'number' && typeof vb === 'number') return dir === 'asc' ? va - vb : vb - va;
          if(va < vb) return dir === 'asc' ? -1 : 1;
          if(va > vb) return dir === 'asc' ? 1 : -1;
          return 0;
        });
        // re-append sorted rows
        rows.forEach(r => tbody.appendChild(r));
      }
    }

  })();
