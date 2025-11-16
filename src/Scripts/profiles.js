/**
 * ====== UNIFIED PROFILES / PRESETS MODULE ======
 * 
 * Allows users to save and load their upgrade plans across ALL pages
 * 
 * How it works:
 * 1. User fills in values on any page (Charms, Chief Gear, etc.)
 * 2. Clicks "Save as new" → captureCurrent() saves all current values from ALL pages
 * 3. Values are stored in browser storage (key: 'wos-unified-profiles')
 * 4. User can select saved profile from dropdown → loadSelectedProfile() restores values across all pages
 * 5. User can rename or delete profiles
 * 
 * Data is stored as JSON: { "My Plan 1": { charms: {...}, chiefGear: {...}, inventory: {...} }, ... }
 */

const ProfilesModule = (function(){
  const PROFILES_KEY = 'wos-unified-profiles';  // Key used for browser storage
  const LAST_PROFILE_KEY = 'wos-last-profile';  // Remember last loaded profile name
  let currentLoadedProfile = null;  // Track which profile is currently loaded
  /**
   * showConfirmDialog(options)
   * Render a themed confirmation modal. Returns a Promise<boolean>.
   */
  function showConfirmDialog({
    title = 'Confirm',
    message = '',
    confirmText = 'Delete',
    cancelText = 'Cancel',
    danger = false
  } = {}){
    return new Promise(resolve => {
      // Prevent multiple dialogs
      if(document.querySelector('.modal-overlay')){
        resolve(false);
        return;
      }
      const overlay = document.createElement('div');
      overlay.className = 'modal-overlay';
      overlay.setAttribute('role', 'presentation');

      const dialog = document.createElement('div');
      dialog.className = 'modal-dialog';
      dialog.setAttribute('role', 'dialog');
      dialog.setAttribute('aria-modal', 'true');
      dialog.setAttribute('aria-labelledby', 'modal-title');

      dialog.innerHTML = `
        <div class="modal-header">
          <h4 id="modal-title" class="modal-title">${title}</h4>
        </div>
        <div class="modal-body">${message}</div>
        <div class="modal-actions">
          <button type="button" class="btn secondary" data-action="cancel">${cancelText}</button>
          <button type="button" class="btn ${danger ? 'danger' : 'primary'}" data-action="confirm">${confirmText}</button>
        </div>
      `;

      overlay.appendChild(dialog);
      document.body.appendChild(overlay);

      const cancelBtn = dialog.querySelector('[data-action="cancel"]');
      const confirmBtn = dialog.querySelector('[data-action="confirm"]');

      const cleanup = (result) => {
        if(overlay && overlay.parentNode){ overlay.parentNode.removeChild(overlay); }
        resolve(result);
      };

      cancelBtn.addEventListener('click', () => cleanup(false));
      confirmBtn.addEventListener('click', () => cleanup(true));

      // Close on overlay click
      overlay.addEventListener('click', (e) => {
        if(e.target === overlay) cleanup(false);
      });

      // Keyboard: Esc cancels, Enter confirms
      const keyHandler = (e) => {
        if(e.key === 'Escape'){ e.preventDefault(); cleanup(false); }
        if(e.key === 'Enter'){ e.preventDefault(); cleanup(true); }
      };
      document.addEventListener('keydown', keyHandler, { once: true });

      // Focus management
      setTimeout(() => { confirmBtn.focus(); }, 0);
    });
  }

  /**
   * readProfiles()
   * Reads all saved profiles from browser storage
   * Also handles migration from old format
   * @returns {object} Object with all profiles: { "Name": { charms: {}, chiefGear: {}, inventory: {} }, ... }
   */
  function readProfiles(){
    try{
      const raw = localStorage.getItem(PROFILES_KEY);
      if(raw) {
        return JSON.parse(raw);
      }
      
      // Check for old format profiles and migrate
      const oldKey = 'wos-charm-profiles';
      const oldRaw = localStorage.getItem(oldKey);
      if(oldRaw) {
        const oldProfiles = JSON.parse(oldRaw);
        const migratedProfiles = {};
        
        // Convert old format to new format
        Object.keys(oldProfiles).forEach(name => {
          migratedProfiles[name] = {
            charms: oldProfiles[name],
            chiefGear: {},
            inventory: {}
          };
        });
        
        // Save in new format
        writeProfiles(migratedProfiles);
        
        // Keep old profiles as backup (don't delete)
        console.log('Migrated old charm profiles to unified format');
        
        return migratedProfiles;
      }
      
      return {};
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
   * Takes a "snapshot" of current selections across ALL pages
   * Returns an object with separate sections for each calculator
   * @returns {object} Current selections from all calculators
   */
  function captureCurrent(){
    // Page detection helpers
    const isFireCrystals = !!document.getElementById('furnace-start');
    const isChiefGear = !!document.getElementById('helmet-start');
    const isCharms = !!document.querySelector('select[id*="-charm-"]');

    const data = { charms: {}, chiefGear: {}, inventory: {}, fireCrystals: {} };

    // Capture Charms data (only on Charms page; selects contain -charm- in id)
    if(isCharms){
      const charmSelects = Array.from(document.querySelectorAll('select[id*="-charm-"][id$="-start"], select[id*="-charm-"][id$="-finish"]'))
        .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
      charmSelects.forEach(s => { if(s.value) data.charms[s.id] = s.value; });
    }

    // Capture Chief Gear data (only on Chief Gear page)
    if(isChiefGear){
      const gearTypes = ['helmet', 'chestplate', 'ring', 'watch', 'pants', 'staff'];
      gearTypes.forEach(gear => {
        const start = document.getElementById(`${gear}-start`);
        const finish = document.getElementById(`${gear}-finish`);
        if(start && start.value) data.chiefGear[`${gear}-start`] = start.value;
        if(finish && finish.value) data.chiefGear[`${gear}-finish`] = finish.value;
      });
    }

    // Capture Fire Crystals buildings data (only on Fire Crystals page)
    if(isFireCrystals){
      const buildings = ['furnace', 'embassy', 'command-center', 'infirmary', 'infantry-camp', 'marksman-camp', 'lancer-camp', 'war-academy'];
      buildings.forEach(building => {
        const start = document.getElementById(`${building}-start`);
        const finish = document.getElementById(`${building}-finish`);
        if(start && start.value) data.fireCrystals[`${building}-start`] = start.value;
        if(finish && finish.value) data.fireCrystals[`${building}-finish`] = finish.value;
      });
    }

    // Capture Inventory data (only inputs present on current page)
    const inventoryIds = [
      // Charms inventory
      'inventory-guides', 'inventory-designs', 'inventory-secrets',
      // Chief Gear inventory
      'inventory-alloy', 'inventory-solution', 'inventory-plans', 'inventory-amber',
      // Fire Crystals inventory
      'inventory-fire-crystals', 'inventory-refine-crystals', 'inventory-speedup-days', 'inventory-construction-speed',
      // Base resources
      'inventory-meat', 'inventory-wood', 'inventory-coal', 'inventory-iron'
    ];
    inventoryIds.forEach(id => {
      const input = document.getElementById(id);
      if(input && input.value !== undefined) data.inventory[id] = input.value;
    });

    return data;
  }

  /**
   * applyProfileObject(obj)
   * Takes a saved profile snapshot and applies it to ALL pages
   * Restores all selections from a saved profile
   * @param {object} obj - Profile data to apply
   */
  function applyProfileObject(obj){
    if(!obj) return;
    
    // Detect page
    const isFireCrystals = !!document.getElementById('furnace-start');
    const isChiefGear = !!document.getElementById('helmet-start');
    const isCharms = !!document.querySelector('select[id*="-charm-"]');

    // Apply only for the current page
    if(isCharms && obj.charms){
      Object.keys(obj.charms).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(obj.charms[id]);
      });
      // Update charms batch/select validations
      const startSelects = Array.from(document.querySelectorAll('select[id*="-charm-"][id$="-start"]'));
      startSelects.forEach(startSel => {
        const base = startSel.id.replace(/-start$/, '');
        const finishSel = document.getElementById(base + '-finish');
        if(finishSel){
          const start = parseInt(startSel.value);
          if(!isNaN(start)){
            Array.from(finishSel.options).forEach(option => {
              const optValue = parseInt(option.value);
              option.disabled = !isNaN(optValue) && optValue < start;
            });
          }
        }
      });
      if(typeof CalculatorModule !== 'undefined'){
        try { CalculatorModule.calculateAll(); } catch(_) {}
      }
    }

    if(isChiefGear && obj.chiefGear){
      Object.keys(obj.chiefGear).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(obj.chiefGear[id]);
      });
      const gearTypes = ['helmet', 'chestplate', 'ring', 'watch', 'pants', 'staff'];
      gearTypes.forEach(gear => {
        const startSel = document.getElementById(`${gear}-start`);
        const finishSel = document.getElementById(`${gear}-finish`);
        if(startSel && finishSel && typeof ChiefGearCalculator !== 'undefined' && ChiefGearCalculator.validateLevels){
          ChiefGearCalculator.validateLevels(startSel, finishSel);
        }
      });
      if(typeof ChiefGearCalculator !== 'undefined'){
        try { ChiefGearCalculator.calculateAll(); } catch(_) {}
      }
    }

    if(isFireCrystals && obj.fireCrystals){
      const fcData = { ...obj.fireCrystals };
      Object.keys(obj.fireCrystals).forEach(key => {
        if(key.endsWith('-current')){ const base = key.replace(/-current$/,''); fcData[`${base}-start`] = obj.fireCrystals[key]; }
        if(key.endsWith('-desired')){ const base = key.replace(/-desired$/,''); fcData[`${base}-finish`] = obj.fireCrystals[key]; }
      });
      Object.keys(fcData).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(fcData[id]);
      });
      if(typeof FireCrystalsCalculator !== 'undefined'){
        try {
          const fcBuildings = ['furnace', 'embassy', 'command-center', 'infirmary', 'infantry-camp', 'marksman-camp', 'lancer-camp', 'war-academy'];
          const buildingNames = ['Furnace', 'Embassy', 'Command Center', 'Infirmary', 'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'];
          fcBuildings.forEach((building, idx) => {
            const start = document.getElementById(`${building}-start`);
            const finish = document.getElementById(`${building}-finish`);
            if (start && finish && FireCrystalsCalculator.validateLevels && FireCrystalsCalculator.getLevelsForBuilding) {
              const levelsArray = FireCrystalsCalculator.getLevelsForBuilding(buildingNames[idx]);
              FireCrystalsCalculator.validateLevels(start, finish, levelsArray);
            }
          });
          FireCrystalsCalculator.calculateAll();
        } catch(_) {}
      }
    }

    // Apply Inventory (only inputs present on this page)
    if(obj.inventory){
      Object.keys(obj.inventory).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'INPUT') el.value = String(obj.inventory[id]);
      });
    }
  }

  /**
   * renderProfilesList()
   * Updates the profile dropdown with all saved profiles
   */
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
    name = String(name).trim().slice(0, 10);
    const profiles = readProfiles();
    if(profiles[name]) return alert('A profile with that name already exists. Use Overwrite or pick another name.');
    // Capture current page selections only
    profiles[name] = captureCurrent();
    writeProfiles(profiles);
    
    // Refresh the dropdown list
    renderProfilesList();
    
    // Clear the input field
    const nameInput = document.getElementById('profile-name');
    if(nameInput) nameInput.value = '';
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
    // Merge current page selections into existing profile
    const current = captureCurrent();
    const merged = { ...profiles[name] };
    if(current.charms && Object.keys(current.charms).length){ merged.charms = { ...(profiles[name].charms||{}), ...current.charms }; }
    if(current.chiefGear && Object.keys(current.chiefGear).length){ merged.chiefGear = { ...(profiles[name].chiefGear||{}), ...current.chiefGear }; }
    if(current.fireCrystals && Object.keys(current.fireCrystals).length){ merged.fireCrystals = { ...(profiles[name].fireCrystals||{}), ...current.fireCrystals }; }
    if(current.inventory && Object.keys(current.inventory).length){ merged.inventory = { ...(profiles[name].inventory||{}), ...current.inventory }; }
    profiles[name] = merged;
    writeProfiles(profiles);
    renderProfilesList();
  }
  
  /**
   * autoSaveCurrentProfile()
   * Automatically saves changes to the currently loaded profile
   */
  function autoSaveCurrentProfile(){
    if(!currentLoadedProfile) return; // No profile loaded, don't save
    
    const profiles = readProfiles();
    if(!profiles[currentLoadedProfile]) return; // Profile was deleted
    // Silently merge current page selections with existing profile
    const current = captureCurrent();
    const existing = profiles[currentLoadedProfile];
    if(current.charms && Object.keys(current.charms).length){ existing.charms = { ...(existing.charms||{}), ...current.charms }; }
    if(current.chiefGear && Object.keys(current.chiefGear).length){ existing.chiefGear = { ...(existing.chiefGear||{}), ...current.chiefGear }; }
    if(current.fireCrystals && Object.keys(current.fireCrystals).length){ existing.fireCrystals = { ...(existing.fireCrystals||{}), ...current.fireCrystals }; }
    if(current.inventory && Object.keys(current.inventory).length){ existing.inventory = { ...(existing.inventory||{}), ...current.inventory }; }
    profiles[currentLoadedProfile] = existing;
    writeProfiles(profiles);
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
    
    // Track the currently loaded profile
    currentLoadedProfile = name;
    try { localStorage.setItem(LAST_PROFILE_KEY, name); } catch(e){}
    
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

    const message = `<p>Are you sure you want to delete the profile <span class="warning">"${name}"</span>?<br>This action cannot be undone.</p>`;
    showConfirmDialog({
      title: 'Delete Profile',
      message,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      danger: true
    }).then(ok => {
      if(!ok) return;
      const profiles = readProfiles();
      delete profiles[name];
      writeProfiles(profiles);
      renderProfilesList();
    });
  }

  /**
   * renameSelectedProfile()
   * Renames the selected profile
   */
  function renameSelectedProfile(){
    const list = document.getElementById('profiles-list');
    const input = document.getElementById('profile-name');
    if(!list || !input) return;
    const from = list.value;
    const to = (input.value && input.value.trim().slice(0, 10));
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

  /**
   * init()
   * Wire up profile UI buttons and initialize
   * Called once when page loads
   */
  function init(){
    const saveBtn = document.getElementById('profile-save');
    const deleteBtn = document.getElementById('profile-delete');
    const renameBtn = document.getElementById('profile-rename');
    const list = document.getElementById('profiles-list');
    const nameInput = document.getElementById('profile-name');

    if(saveBtn) saveBtn.addEventListener('click', ()=> saveNewProfile(nameInput && nameInput.value && nameInput.value.trim()));
    if(deleteBtn) deleteBtn.addEventListener('click', deleteSelectedProfile);
    if(renameBtn) renameBtn.addEventListener('click', renameSelectedProfile);
    
    // Auto-load when a profile is selected from the list
    if(list) list.addEventListener('change', loadSelectedProfile);
    
    // Auto-save when any charm select or inventory input changes
    const allSelects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
      .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
    allSelects.forEach(sel => {
      sel.addEventListener('change', autoSaveCurrentProfile);
    });
    
    // Auto-save when batch controls change
    const batchSelects = Array.from(document.querySelectorAll('select[id$="-from"], select[id$="-to"]'));
    batchSelects.forEach(sel => {
      sel.addEventListener('change', autoSaveCurrentProfile);
    });
    
    // Auto-save when inventory inputs change (Charms + Chief Gear + Fire Crystals + base resources)
    const inventoryInputs = [
      // Charms
      'inventory-guides', 'inventory-designs', 'inventory-secrets',
      // Chief Gear
      'inventory-alloy', 'inventory-solution', 'inventory-plans', 'inventory-amber',
      // Fire Crystals specific
      'inventory-fire-crystals', 'inventory-refine-crystals', 'inventory-speedup-days', 'inventory-construction-speed',
      // Optional base resources
      'inventory-meat', 'inventory-wood', 'inventory-coal', 'inventory-iron'
    ];
    inventoryInputs.forEach(id => {
      const input = document.getElementById(id);
      if(input) input.addEventListener('input', autoSaveCurrentProfile);
    });
    
    // Render existing profiles on load
    renderProfilesList();

    // Auto-load last used profile (or first available) on page load
    if(list){
      const all = readProfiles();
      const last = (() => { try { return localStorage.getItem(LAST_PROFILE_KEY); } catch(e){ return null; } })();
      if(last && all[last]){
        list.value = last;
        loadSelectedProfile();
      } else if(list.options.length > 0){
        list.selectedIndex = 0;
        loadSelectedProfile();
      }
      // Force recalculation after profile load (handles Netlify timing issues)
      setTimeout(() => {
        if(typeof CalculatorModule !== 'undefined' && CalculatorModule.calculateAll) CalculatorModule.calculateAll();
        if(typeof ChiefGearCalculator !== 'undefined' && ChiefGearCalculator.calculateAll) ChiefGearCalculator.calculateAll();
        if(typeof FireCrystalsCalculator !== 'undefined' && FireCrystalsCalculator.calculateAll) FireCrystalsCalculator.calculateAll();
      }, 0);
    }
  }

  // Public API
  return {
    init,
    readProfiles,
    writeProfiles,
    captureCurrent,
    applyProfileObject,
    renderProfilesList,
    saveNewProfile,
    loadSelectedProfile,
    deleteSelectedProfile,
    renameSelectedProfile,
    autoSaveCurrentProfile
  };
})();

// Auto-initialize when page loads
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => ProfilesModule.init());
} else {
  ProfilesModule.init();
}
