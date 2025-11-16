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
    const data = {
      charms: {},
      chiefGear: {},
        inventory: {},
        fireCrystals: {}
      };
    
    // Capture Charms data (all charm selects ending with -start or -finish)
    const charmSelects = Array.from(document.querySelectorAll('select[id$="-start"], select[id$="-finish"]'))
      .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
    charmSelects.forEach(s => {
      if(s.value) data.charms[s.id] = s.value;
    });
    
    // Capture Chief Gear data (all gear -current and -desired selects)
    const gearTypes = ['helmet', 'chestplate', 'ring', 'watch', 'pants', 'staff'];
    gearTypes.forEach(gear => {
      const current = document.getElementById(`${gear}-current`);
      const desired = document.getElementById(`${gear}-desired`);
      if(current && current.value) data.chiefGear[`${gear}-current`] = current.value;
      if(desired && desired.value) data.chiefGear[`${gear}-desired`] = desired.value;
    });
    
      // Capture Fire Crystals buildings data (8 buildings from fireCrystals.html page)
      const buildings = ['furnace', 'embassy', 'command-center', 'infirmary', 
                         'infantry-camp', 'marksman-camp', 'lancer-camp', 'war-academy'];
      buildings.forEach(building => {
        const current = document.getElementById(`${building}-current`);
        const desired = document.getElementById(`${building}-desired`);
        if(current && current.value) data.fireCrystals[`${building}-current`] = current.value;
        if(desired && desired.value) data.fireCrystals[`${building}-desired`] = desired.value;
      });
    
      // Capture Inventory data (all inventory inputs from all pages)
      const inventoryIds = [
        'inventory-guides', 'inventory-designs', 'inventory-secrets', // Charms inventory
        'inventory-alloy', 'inventory-solution', 'inventory-plans', 'inventory-amber',  // Chief Gear
        'inventory-fire-crystals', 'inventory-refine-crystals', 'inventory-speedup-days', 'inventory-construction-speed', // Fire Crystals
        'inventory-meat', 'inventory-wood', 'inventory-coal', 'inventory-iron' // Base resources (optional)
      ];
      inventoryIds.forEach(id => {
        const input = document.getElementById(id);
        if(input && input.value) data.inventory[id] = input.value;
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
    
    // Apply Charms data
    if(obj.charms){
      Object.keys(obj.charms).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(obj.charms[id]);
      });
      
      // Update validation states for charm selects (disabled options)
      const startSelects = Array.from(document.querySelectorAll('select[id$="-start"]'))
        .filter(s => !s.id.endsWith('-from') && !s.id.endsWith('-to'));
      
      startSelects.forEach(startSel => {
        const base = startSel.id.replace(/-start$/, '');
        const finishSel = document.getElementById(base + '-finish');
        if(finishSel){
          // Update disabled options based on FROM value
          const start = parseInt(startSel.value);
          
          if(!isNaN(start)){
            Array.from(finishSel.options).forEach(option => {
              const optValue = parseInt(option.value);
              if(!isNaN(optValue) && optValue < start){
                option.disabled = true;
              } else {
                option.disabled = false;
              }
            });
          }
        }
      });
      
      // Also update batch control validation states
      const batchTypes = ['hat','chestplate','ring','watch','pants','staff'];
      batchTypes.forEach(type => {
        const from = document.getElementById(`${type}-batch-from`);
        const to = document.getElementById(`${type}-batch-to`);
        if(from && to){
          const fromVal = parseInt(from.value);
          if(!isNaN(fromVal)){
            Array.from(to.options).forEach(option => {
              const optValue = parseInt(option.value);
              if(!isNaN(optValue) && optValue < fromVal){
                option.disabled = true;
              } else {
                option.disabled = false;
              }
            });
          }
        }
      });
    }
    
    // Apply Chief Gear data
    if(obj.chiefGear){
      Object.keys(obj.chiefGear).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'SELECT') el.value = String(obj.chiefGear[id]);
      });
    }
    
    // Apply Inventory data
    if(obj.inventory){
      Object.keys(obj.inventory).forEach(id => {
        const el = document.getElementById(id);
        if(el && el.tagName === 'INPUT') el.value = String(obj.inventory[id]);
      });
    }
    
      // Apply Fire Crystals data
      if(obj.fireCrystals){
        Object.keys(obj.fireCrystals).forEach(id => {
          const el = document.getElementById(id);
          if(el && el.tagName === 'SELECT') el.value = String(obj.fireCrystals[id]);
        });
      }
    
    // Recalculate with new values (trigger both calculators if available)
    if(typeof CalculatorModule !== 'undefined'){
      CalculatorModule.calculateAll();
    }
    if(typeof ChiefGearCalculator !== 'undefined'){
      ChiefGearCalculator.calculateAll();
    }
      if(typeof FireCrystalsCalculator !== 'undefined'){
        FireCrystalsCalculator.calculateAll();
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
    
    // Capture current selections and save
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
    
    // Replace profile with current selections
    profiles[name] = captureCurrent();
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
    
    // Silently update the profile with current selections
    profiles[currentLoadedProfile] = captureCurrent();
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
    
    // Auto-save when inventory inputs change
    const inventoryInputs = ['inventory-guides', 'inventory-designs', 'inventory-secrets'];
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
