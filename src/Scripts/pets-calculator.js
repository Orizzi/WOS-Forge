/**
 * ====== PETS CALCULATOR MODULE ======
 *
 * This module calculates the total resources needed to upgrade pets
 * from one level to another.
 *
 * How it works:
 * 1. The 'petsCosts' object stores upgrade costs per pet and level
 * 2. When you select a FROM and TO level, sumCosts() adds up all costs between them
 * 3. calculateAll() finds all pet inputs, runs sumCosts for each, and shows results
 * 4. The results table is made sortable so you can click headers to sort
 *
 * Data structure from CSV:
 * - petName: Name of the pet (e.g., "Cave Hyena")
 * - level: Level (10, 10.1, 20, 20.1, etc.)
 * - foodBase, foodRequired: Food costs
 * - manualBase, manualRequired: Training Manual costs
 * - potionBase, potionRequired: Potion costs
 * - serumBase, serumRequired: Serum costs
 * - svsPointsBase, svsPointsRequired: SVS Points costs
 */

const PetsCalculatorModule = (function(){
  'use strict';

  const validator = window.InputValidation;

  function safeInventory(value){
    if(validator && typeof validator.numberOrZero === 'function'){
      return validator.numberOrZero(value, { min: 0, max: 999999999, fallback: 0 });
    }
    const n = parseInt(value, 10);
    if(Number.isNaN(n) || !Number.isFinite(n)) return 0;
    return Math.max(0, n);
  }

  // Pet costs data: { petName: { level: { foodBase, foodRequired, ... } } }
  const petsCosts = {};

  // Map of pet IDs to pet names
  const PET_MAP = {
    'cave-hyena': 'Cave Hyena',
    'arctic-wolf': 'Arctic Wolf',
    'musk-ox': 'Musk Ox',
    'giant-tapir': 'Giant Tapir',
    'titan-roc': 'Titan Roc',
    'giant-elk': 'Giant Elk',
    'snow-leopard': 'Snow Leopard',
    'cave-lion': 'Cave Lion',
    'snow-ape': 'Snow Ape',
    'iron-rhino': 'Iron Rhino',
    'sabertooth-tiger': 'Sabertooth Tiger',
    'mammoth': 'Mammoth',
    'frost-gorilla': 'Frost Gorilla',
    'frostscale-chameleon': 'Frostscale Chameleon',
    'abyssal-shelldragon': 'Abyssal Shelldragon'
  };

  const LOCKED_LEVEL = -1;
  const MAX_PET_LEVEL = 100.1;
  const LOCKED_VALUE = LOCKED_LEVEL.toString();

  /**
   * Initialize default costs structure (fallback if CSV fails to load)
   */
  function initializeDefaultCosts() {
    // Fallback defaults - will be overridden by CSV
    const defaultPets = Object.values(PET_MAP);
    const defaultLevels = [10, 10.1, 20, 20.1, 30, 30.1, 40, 40.1, 50, 50.1,
      60, 60.1, 70, 70.1, 80, 80.1, 90, 90.1, 100, 100.1];

    defaultPets.forEach(petName => {
      petsCosts[petName] = {};
      defaultLevels.forEach(level => {
        petsCosts[petName][level] = {
          foodBase: 0,
          foodRequired: 0,
          manualBase: 0,
          manualRequired: 0,
          potionBase: 0,
          potionRequired: 0,
          serumBase: 0,
          serumRequired: 0,
          svsPointsBase: 0,
          svsPointsRequired: 0
        };
      });
    });
  }

  /**
   * Load pet costs from CSV and override defaults
   */
  async function loadPetCostsFromCsv(url = 'assets/pets_costs.csv') {
    try {
      const res = await fetch(url, { cache: 'no-cache' });
      if (!res.ok) {
        console.warn('[Pets] CSV not found, using fallback defaults');
        return;
      }

      const text = await res.text();
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length <= 1) {
        console.warn('[Pets] CSV empty or no data rows');
        return;
      }

      const header = lines[0].split(',').map(h => h.trim().toLowerCase());
      const idx = {
        petName: header.indexOf('petname'),
        level: header.indexOf('level'),
        foodBase: header.indexOf('foodbase'),
        foodRequired: header.indexOf('foodrequired'),
        manualBase: header.indexOf('manualbase'),
        manualRequired: header.indexOf('manualrequired'),
        potionBase: header.indexOf('potionbase'),
        potionRequired: header.indexOf('potionrequired'),
        serumBase: header.indexOf('serumbase'),
        serumRequired: header.indexOf('serumrequired'),
        svsPointsBase: header.indexOf('svspointsbase'),
        svsPointsRequired: header.indexOf('svspointsrequired')
      };

      // Validate all required columns exist
      const missingCols = Object.entries(idx).filter(([k, v]) => v === -1).map(([k]) => k);
      if (missingCols.length > 0) {
        console.error('[Pets] Missing CSV columns:', missingCols.join(', '));
        return;
      }

      let rowsProcessed = 0;
      const petSet = new Set();

      for (let i = 1; i < lines.length; i++) {
        const line = lines[i];
        // Handle quoted CSV fields
        const cols = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g) || [];
        const row = cols.map(c => c.replace(/^"|"$/g, '').trim());

        if (row.length < 3) continue; // Skip malformed rows

        const petName = row[idx.petName];
        const level = parseFloat(row[idx.level]);

        if (!petName || isNaN(level)) continue;

        if (!petsCosts[petName]) {
          petsCosts[petName] = {};
          petSet.add(petName);
        }

        petsCosts[petName][level] = {
          foodBase: parseInt(row[idx.foodBase], 10) || 0,
          foodRequired: parseInt(row[idx.foodRequired], 10) || 0,
          manualBase: parseInt(row[idx.manualBase], 10) || 0,
          manualRequired: parseInt(row[idx.manualRequired], 10) || 0,
          potionBase: parseInt(row[idx.potionBase], 10) || 0,
          potionRequired: parseInt(row[idx.potionRequired], 10) || 0,
          serumBase: parseInt(row[idx.serumBase], 10) || 0,
          serumRequired: parseInt(row[idx.serumRequired], 10) || 0,
          svsPointsBase: parseInt(row[idx.svsPointsBase], 10) || 0,
          svsPointsRequired: parseInt(row[idx.svsPointsRequired], 10) || 0
        };

        rowsProcessed++;
      }

      console.info(`[Pets] Applied ${rowsProcessed} cost overrides from CSV (${petSet.size} pets)`);
    } catch (e) {
      console.warn('[Pets] CSV override skipped:', e.message);
    }
  }

  /**
   * Sum costs between two levels for a specific pet
   */
  function sumCosts(petName, fromLevel, toLevel) {
    const result = {
      foodBase: 0,
      foodRequired: 0,
      manualBase: 0,
      manualRequired: 0,
      potionBase: 0,
      potionRequired: 0,
      serumBase: 0,
      serumRequired: 0,
      svsPointsBase: 0,
      svsPointsRequired: 0
    };

    if (!petsCosts[petName]) {
      console.warn(`[Pets] Unknown pet: ${petName}`);
      return result;
    }

    const from = parseFloat(fromLevel);
    const to = parseFloat(toLevel);

    if (isNaN(from) || isNaN(to) || from >= to) {
      return result;
    }

    // Iterate through all levels for this pet
    const petLevels = Object.keys(petsCosts[petName])
      .map(l => parseFloat(l))
      .filter(l => l > from && l <= to)
      .sort((a, b) => a - b);

    for (const level of petLevels) {
      const costs = petsCosts[petName][level];
      if (!costs) continue;

      result.foodBase += costs.foodBase;
      result.foodRequired += costs.foodRequired;
      result.manualBase += costs.manualBase;
      result.manualRequired += costs.manualRequired;
      result.potionBase += costs.potionBase;
      result.potionRequired += costs.potionRequired;
      result.serumBase += costs.serumBase;
      result.serumRequired += costs.serumRequired;
      result.svsPointsBase += costs.svsPointsBase;
      result.svsPointsRequired += costs.svsPointsRequired;
    }

    return result;
  }

  /**
   * Calculate all pets and update results display
   */
  function calculateAll() {
    const resultsDisplay = document.getElementById('pets-results-display');
    if (!resultsDisplay) {
      console.warn('[Pets] Results display not found');
      return;
    }

    const totals = {
      foodBase: 0,
      manualBase: 0,
      potionBase: 0,
      serumBase: 0,
      svsPointsBase: 0
    };

    // Iterate through all 15 pets using PET_MAP
    Object.entries(PET_MAP).forEach(([petId, petName]) => {
      const startSelect = document.getElementById(`${petId}-start`);
      const finishSelect = document.getElementById(`${petId}-finish`);

      if (!startSelect || !finishSelect) return;

      const fromLevel = startSelect.value;
      const toLevel = finishSelect.value;

      if (fromLevel === '' || toLevel === '' || fromLevel === toLevel) return;

      const costs = sumCosts(petName, fromLevel, toLevel);

      // Add to totals (only base resources)
      totals.foodBase += costs.foodBase;
      totals.manualBase += costs.manualBase;
      totals.potionBase += costs.potionBase;
      totals.serumBase += costs.serumBase;
      totals.svsPointsBase += costs.svsPointsBase;
    });

    // Get inventory values
    const inventoryFood = safeInventory(document.getElementById('inventory-food')?.value || '0');
    const inventoryManual = safeInventory(document.getElementById('inventory-manual')?.value || '0');
    const inventoryPotion = safeInventory(document.getElementById('inventory-potion')?.value || '0');
    const inventorySerum = safeInventory(document.getElementById('inventory-serum')?.value || '0');
    const inventorySvsPoints = safeInventory(document.getElementById('inventory-svs-points')?.value || '0');

    // Calculate gaps
    const foodGap = totals.foodBase - inventoryFood;
    const manualGap = totals.manualBase - inventoryManual;
    const potionGap = totals.potionBase - inventoryPotion;
    const serumGap = totals.serumBase - inventorySerum;
    const svsPointsGap = totals.svsPointsBase - inventorySvsPoints;

    // Build results HTML with grid layout
    const t = window.I18n?.t || (k => k);
    const hasCalc = totals.foodBase > 0 || totals.manualBase > 0;

    function formatGap(gap) {
      const className = gap > 0 ? 'deficit' : 'surplus';
      const text = gap > 0
        ? `⚠ Need ${gap.toLocaleString()} more`
        : `✅ Have ${Math.abs(gap).toLocaleString()} left`;
      return `<span class="gap ${className}">${text}</span>`;
    }

    function labelWithIcon(key) {
      if (window.IconHelper && typeof window.IconHelper.label === 'function') {
        return window.IconHelper.label(key, t);
      }
      const urlMap = {
        'food-base': 'assets/resources/pet-items/food.svg',
        'manual-base': 'assets/resources/pet-items/manual.svg',
        'potion-base': 'assets/resources/pet-items/potion.svg',
        'serum-base': 'assets/resources/pet-items/serum.svg',
        'svs-points-base': 'assets/resources/base/svs-points.svg'
      };
      const url = urlMap[key];
      const text = t(key);
      if (!url) return text;
      return `<img class="res-icon" src="${url}" alt="${text}" onerror="this.style.display='none'"> ${text}`;
    }

    let html = '<div class="totals-summary">';

    html += `<div class="total-item"><span class="resource-label">${labelWithIcon('food-base')}:</span><span class="resource-value">${totals.foodBase.toLocaleString()}</span>${hasCalc ? formatGap(foodGap) : ''}</div>`;
    html += `<div class="total-item"><span class="resource-label">${labelWithIcon('manual-base')}:</span><span class="resource-value">${totals.manualBase.toLocaleString()}</span>${hasCalc ? formatGap(manualGap) : ''}</div>`;
    html += `<div class="total-item"><span class="resource-label">${labelWithIcon('potion-base')}:</span><span class="resource-value">${totals.potionBase.toLocaleString()}</span>${hasCalc ? formatGap(potionGap) : ''}</div>`;
    html += `<div class="total-item"><span class="resource-label">${labelWithIcon('serum-base')}:</span><span class="resource-value">${totals.serumBase.toLocaleString()}</span>${hasCalc ? formatGap(serumGap) : ''}</div>`;
    html += `<div class="total-item"><span class="resource-label">${labelWithIcon('svs-points-base')}:</span><span class="resource-value">${totals.svsPointsBase.toLocaleString()}</span>${hasCalc ? formatGap(svsPointsGap) : ''}</div>`;

    html += '</div>';
    resultsDisplay.innerHTML = html;
  }

  /**
   * Initialize the calculator
   */
  function init() {
    console.info('[Pets] Initializing calculator module');

    // Initialize default costs
    initializeDefaultCosts();

    // Load costs from CSV (async, non-blocking)
    loadPetCostsFromCsv();

    // Set up event listeners after DOM is ready
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', setupEventListeners);
    } else {
      setupEventListeners();
    }
  }

  /**
   * Setup event listeners for all pet inputs
   */
  function setupEventListeners() {
    // Listen for changes on pet level selects
    const allLevelSelects = document.querySelectorAll('[id$="-start"], [id$="-finish"]');

    allLevelSelects.forEach(select => {
      select.addEventListener('change', () => {
        calculateAll();

        // Auto-save profile if ProfilesModule is available
        if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
          ProfilesModule.autoSaveCurrentProfile();
        }
      });
    });

    // Inventory inputs auto-save
    const inventoryInputs = document.querySelectorAll('#inventory-food, #inventory-manual, #inventory-potion, #inventory-serum, #inventory-svs-points');
    inventoryInputs.forEach(input => {
      input.addEventListener('change', () => {
        if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
          ProfilesModule.autoSaveCurrentProfile();
        }
      });
    });

    // Reset button
    const resetBtn = document.getElementById('pets-reset');
    if (resetBtn) {
      resetBtn.addEventListener('click', resetAll);
    }

    // Populate level dropdowns with options
    populateLevelDropdowns();

    // Initial calculation
    calculateAll();
  }

  /**
   * Populate all level dropdowns with level options
   */
  function populateLevelDropdowns() {
    const levelOptions = ['', '10', '10.1', '20', '20.1', '30', '30.1', '40', '40.1',
      '50', '50.1', '60', '60.1', '70', '70.1', '80', '80.1',
      '90', '90.1', '100', '100.1'];

    Object.keys(PET_MAP).forEach(petId => {
      const startSelect = document.getElementById(`${petId}-start`);
      const finishSelect = document.getElementById(`${petId}-finish`);

      if (startSelect && startSelect.options.length <= 1) {
        levelOptions.forEach(level => {
          const option = document.createElement('option');
          option.value = level;
          option.textContent = level || '--';
          startSelect.appendChild(option);
        });
      }

      if (finishSelect && finishSelect.options.length <= 1) {
        levelOptions.forEach(level => {
          const option = document.createElement('option');
          option.value = level;
          option.textContent = level || '--';
          finishSelect.appendChild(option);
        });
      }
    });
  }

  /**
   * Reset all pet levels and inventory
   */
  function resetAll() {
    Object.keys(PET_MAP).forEach(petId => {
      const startSelect = document.getElementById(`${petId}-start`);
      const finishSelect = document.getElementById(`${petId}-finish`);

      if (startSelect) startSelect.value = '';
      if (finishSelect) finishSelect.value = '';
    });

    // Reset inventory
    const inventoryInputs = ['inventory-food', 'inventory-manual', 'inventory-potion',
      'inventory-serum', 'inventory-svs-points'];
    inventoryInputs.forEach(id => {
      const input = document.getElementById(id);
      if (input) input.value = '0';
    });

    calculateAll();

    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      ProfilesModule.autoSaveCurrentProfile();
    }
  }

  /**
   * Get current state for profile saving
   * Returns data in format compatible with unified profiles
   */
  function getCurrentState() {
    const state = {};

    // Save all 15 pet levels with data-profile-key format
    Object.entries(PET_MAP).forEach(([petId, petName]) => {
      const startSelect = document.getElementById(`${petId}-start`);
      const finishSelect = document.getElementById(`${petId}-finish`);

      if (startSelect) {
        state[`${petId}-start`] = startSelect.value;
      }
      if (finishSelect) {
        state[`${petId}-finish`] = finishSelect.value;
      }
    });

    // Save inventory
    const inventoryIds = ['inventory-food', 'inventory-manual', 'inventory-potion',
      'inventory-serum', 'inventory-svs-points'];
    inventoryIds.forEach(id => {
      const input = document.getElementById(id);
      if (input) {
        state[id] = input.value;
      }
    });

    return state;
  }

  /**
   * Load state from profile
   * Compatible with unified profile system
   */
  function loadState(state) {
    if (!state || typeof state !== 'object') return;

    // Load pet levels
    Object.entries(PET_MAP).forEach(([petId, petName]) => {
      const startKey = `${petId}-start`;
      const finishKey = `${petId}-finish`;

      if (state[startKey] !== undefined) {
        const startSelect = document.getElementById(startKey);
        if (startSelect) startSelect.value = state[startKey];
      }
      if (state[finishKey] !== undefined) {
        const finishSelect = document.getElementById(finishKey);
        if (finishSelect) finishSelect.value = state[finishKey];
      }
    });

    // Load inventory
    const inventoryIds = ['inventory-food', 'inventory-manual', 'inventory-potion',
      'inventory-serum', 'inventory-svs-points'];
    inventoryIds.forEach(id => {
      if (state[id] !== undefined) {
        const input = document.getElementById(id);
        if (input) input.value = state[id];
      }
    });

    calculateAll();
  }

  /**
   * Get available pets list
   */
  function getAvailablePets() {
    return Object.values(PET_MAP);
  }

  /**
   * Get available levels for a specific pet
   */
  function getAvailableLevels(petName) {
    if (!petsCosts[petName]) return [];
    return Object.keys(petsCosts[petName])
      .map(l => parseFloat(l))
      .sort((a, b) => a - b);
  }

  // Initialize on load
  init();

  // Register with unified profile system if available
  if (window.WOSCalcCore && typeof window.WOSCalcCore.registerAdapter === 'function') {
    window.WOSCalcCore.registerAdapter({
      id: 'pets',
      isActive: () => !!document.getElementById('cave-hyena-start'),
      run: () => calculateAll(),
      getCurrentState: () => getCurrentState(),
      loadState: (state) => loadState(state)
    });
  }

  // Public API
  return {
    calculateAll,
    sumCosts,
    getCurrentState,
    loadState,
    resetAll,
    getAvailablePets,
    getAvailableLevels
  };
})();

// Expose globally
window.PetsCalculatorModule = PetsCalculatorModule;
