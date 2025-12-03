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

  // Pet costs data: { petName: { level: { foodBase, foodRequired, ... } } }
  const petsCosts = {};
  
  // List of all available pets (populated from CSV)
  const availablePets = [];
  
  const LOCKED_LEVEL = -1;
  const MAX_PET_LEVEL = 100.1; // Adjust based on actual max level
  const LOCKED_VALUE = LOCKED_LEVEL.toString();

  /**
   * Initialize default costs structure (fallback if CSV fails to load)
   */
  function initializeDefaultCosts() {
    // Fallback defaults - will be overridden by CSV
    const defaultPets = ['Cave Hyena', 'Arctic Wolf', 'Musk Ox'];
    const defaultLevels = [10, 10.1, 20, 20.1, 30, 30.1];
    
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

      // Update available pets list
      availablePets.length = 0;
      availablePets.push(...Array.from(petSet).sort());

      console.info(`[Pets] Applied ${rowsProcessed} cost overrides from CSV (${availablePets.length} pets)`);
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
   * Calculate all pets and update results table
   */
  function calculateAll() {
    const tbody = document.querySelector('#pets-results-table tbody');
    if (!tbody) {
      console.warn('[Pets] Results table not found');
      return;
    }

    tbody.innerHTML = '';

    const totals = {
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

    // Find all pet selects (pattern: {petId}-pet-start, {petId}-pet-finish)
    const petContainers = document.querySelectorAll('[data-pet-id]');
    
    petContainers.forEach(container => {
      const petId = container.getAttribute('data-pet-id');
      const petSelect = document.getElementById(`${petId}-pet-select`);
      const startSelect = document.getElementById(`${petId}-pet-start`);
      const finishSelect = document.getElementById(`${petId}-pet-finish`);
      
      if (!petSelect || !startSelect || !finishSelect) return;
      
      const petName = petSelect.value;
      const fromLevel = startSelect.value;
      const toLevel = finishSelect.value;
      
      if (!petName || fromLevel === '' || toLevel === '' || fromLevel === toLevel) return;
      
      const costs = sumCosts(petName, fromLevel, toLevel);
      
      // Add to totals
      Object.keys(totals).forEach(key => {
        totals[key] += costs[key];
      });
      
      // Create result row
      const row = tbody.insertRow();
      row.innerHTML = `
        <td>${petName}</td>
        <td>${fromLevel}</td>
        <td>${toLevel}</td>
        <td>${costs.foodBase.toLocaleString()}</td>
        <td>${costs.foodRequired.toLocaleString()}</td>
        <td>${costs.manualBase.toLocaleString()}</td>
        <td>${costs.manualRequired.toLocaleString()}</td>
        <td>${costs.potionBase.toLocaleString()}</td>
        <td>${costs.potionRequired.toLocaleString()}</td>
        <td>${costs.serumBase.toLocaleString()}</td>
        <td>${costs.serumRequired.toLocaleString()}</td>
        <td>${costs.svsPointsBase.toLocaleString()}</td>
        <td>${costs.svsPointsRequired.toLocaleString()}</td>
      `;
    });

    // Add totals row
    if (tbody.rows.length > 0) {
      const totalRow = tbody.insertRow();
      totalRow.className = 'total-row';
      totalRow.innerHTML = `
        <td colspan="3"><strong data-i18n="total">Total</strong></td>
        <td><strong>${totals.foodBase.toLocaleString()}</strong></td>
        <td><strong>${totals.foodRequired.toLocaleString()}</strong></td>
        <td><strong>${totals.manualBase.toLocaleString()}</strong></td>
        <td><strong>${totals.manualRequired.toLocaleString()}</strong></td>
        <td><strong>${totals.potionBase.toLocaleString()}</strong></td>
        <td><strong>${totals.potionRequired.toLocaleString()}</strong></td>
        <td><strong>${totals.serumBase.toLocaleString()}</strong></td>
        <td><strong>${totals.serumRequired.toLocaleString()}</strong></td>
        <td><strong>${totals.svsPointsBase.toLocaleString()}</strong></td>
        <td><strong>${totals.svsPointsRequired.toLocaleString()}</strong></td>
      `;
    }

    // Make table sortable if TableSortModule is available
    if (window.TableSortModule) {
      window.TableSortModule.makeSortable('pets-results-table');
    }
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
    // Listen for changes on pet selects
    const allPetSelects = document.querySelectorAll('[id$="-pet-select"], [id$="-pet-start"], [id$="-pet-finish"]');
    
    allPetSelects.forEach(select => {
      select.addEventListener('change', () => {
        calculateAll();
        
        // Auto-save profile if ProfilesModule is available
        if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
          ProfilesModule.autoSaveCurrentProfile();
        }
      });
    });

    // Initial calculation
    calculateAll();
  }

  /**
   * Get current state for profile saving
   */
  function getCurrentState() {
    const state = {};
    const petContainers = document.querySelectorAll('[data-pet-id]');
    
    petContainers.forEach(container => {
      const petId = container.getAttribute('data-pet-id');
      const petSelect = document.getElementById(`${petId}-pet-select`);
      const startSelect = document.getElementById(`${petId}-pet-start`);
      const finishSelect = document.getElementById(`${petId}-pet-finish`);
      
      if (petSelect && startSelect && finishSelect) {
        state[petId] = {
          pet: petSelect.value,
          start: startSelect.value,
          finish: finishSelect.value
        };
      }
    });
    
    return state;
  }

  /**
   * Load state from profile
   */
  function loadState(state) {
    if (!state) return;
    
    Object.entries(state).forEach(([petId, values]) => {
      const petSelect = document.getElementById(`${petId}-pet-select`);
      const startSelect = document.getElementById(`${petId}-pet-start`);
      const finishSelect = document.getElementById(`${petId}-pet-finish`);
      
      if (petSelect && values.pet !== undefined) {
        petSelect.value = values.pet;
      }
      if (startSelect && values.start !== undefined) {
        startSelect.value = values.start;
      }
      if (finishSelect && values.finish !== undefined) {
        finishSelect.value = values.finish;
      }
    });
    
    calculateAll();
  }

  /**
   * Get available pets list
   */
  function getAvailablePets() {
    return [...availablePets];
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

  // Public API
  return {
    calculateAll,
    sumCosts,
    getCurrentState,
    loadState,
    getAvailablePets,
    getAvailableLevels
  };
})();

// Expose globally
window.PetsCalculatorModule = PetsCalculatorModule;
