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

  /**
   * renameSelectedProfile()
   * Renames the selected profile
   */
  function renameSelectedProfile(){
    const list = document.getElementById('profiles-list');
    const input = document.getElementById('profile-name');
    if(!list || !input) return;
    const from = list.value;
    const to = input.value && input.value.trim();
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
   * exportProfiles()
   * Downloads all saved profiles as a JSON file
   */
  function exportProfiles(){
    const profiles = readProfiles();
    const json = JSON.stringify(profiles, null, 2);
    const blob = new Blob([json], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wos-unified-profiles.json';
    a.click();
    setTimeout(()=> URL.revokeObjectURL(url), 0);
  }

  /**
   * importProfiles()
   * Prompts the user to pick a JSON file and imports profiles
   */
  function importProfiles(){
    const picker = document.createElement('input');
    picker.type = 'file';
    picker.accept = 'application/json';
    picker.addEventListener('change', async (e) => {
      const file = e.target && e.target.files && e.target.files[0];
      if(!file) return;
      try{
        const text = await file.text();
        const data = JSON.parse(text);
        if(!data || typeof data !== 'object') throw new Error('Invalid JSON');
        writeProfiles(data);
        renderProfilesList();
        alert('Profiles imported successfully');
      }catch(err){
        alert('Import failed: invalid JSON file');
      }
    });
    picker.click();
  }

  /**
   * init()
   * Wire up profile UI buttons and initialize
   * Called once when page loads
   */
  function init(){
    const saveBtn = document.getElementById('profile-save');
    const overwriteBtn = document.getElementById('profile-overwrite');
    const deleteBtn = document.getElementById('profile-delete');
    const renameBtn = document.getElementById('profile-rename');
    const list = document.getElementById('profiles-list');
    const nameInput = document.getElementById('profile-name');
  const exportBtn = document.getElementById('export-profiles');
  const importBtn = document.getElementById('import-profiles');

    if(saveBtn) saveBtn.addEventListener('click', ()=> saveNewProfile(nameInput && nameInput.value && nameInput.value.trim()));
    if(overwriteBtn) overwriteBtn.addEventListener('click', ()=> overwriteProfile(list && list.value));
    if(deleteBtn) deleteBtn.addEventListener('click', deleteSelectedProfile);
    if(renameBtn) renameBtn.addEventListener('click', renameSelectedProfile);
  if(exportBtn) exportBtn.addEventListener('click', exportProfiles);
  if(importBtn) importBtn.addEventListener('click', importProfiles);
    
    // Auto-load when a profile is selected from the list
    if(list) list.addEventListener('change', loadSelectedProfile);
    
    // Render existing profiles on load
    renderProfilesList();
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
    overwriteProfile,
    loadSelectedProfile,
    deleteSelectedProfile,
      renameSelectedProfile,
      exportProfiles,
      importProfiles
  };
})();

// Auto-initialize when page loads
if(document.readyState === 'loading'){
  document.addEventListener('DOMContentLoaded', () => ProfilesModule.init());
} else {
  ProfilesModule.init();
}
