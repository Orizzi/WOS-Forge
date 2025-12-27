# WOS Calculator - Code Fixes & Recommendations

**Purpose**: Specific code examples and exact fixes for identified issues  
**Date**: December 27, 2025

---

## 1. Fix: Fire Crystals Hardcoded Data Removal

### Current Problem
File: `src/Scripts/fire-crystals-calculator.js` (lines 150-300+)
```javascript
const fireCrystalCosts = {
  "Furnace": {
    "F30": { "time": 604800, "1": 132, "2": 132, ... },
    "FC1": { "time": 777600, "1": 158, "2": 158, ... },
    // ... 100+ lines of duplicated hardcoded data
  },
  "Embassy": { /* ... */ },
  // ... 8 buildings total
};
```

### Why This Is Bad
1. **Data duplication**: Same data in 3 places (Excel, CSV, JS hardcode)
2. **Maintenance nightmare**: Update Excel, but hardcoded data stays old
3. **Inconsistency**: CSV might have updated costs, hardcode doesn't
4. **Large file**: 150+ lines of static data inflates JS bundle

### Exact Fix

**Option A: Remove entirely, load from CSV**
```javascript
// REMOVE: Lines 150-300+ (entire fireCrystalCosts object)

// REPLACE with: Load from CSV at runtime
const FireCrystalsCalculator = (function() {
  let fireCrystalCosts = {};
  
  async function loadFireCrystalCosts() {
    try {
      const { header, rows } = await window.DataLoader.loadCsv(
        'assets/fire_crystals_unified.csv'
      );
      
      if (!header || !rows || rows.length === 0) {
        console.warn('[FireCrystals] CSV empty, using fallback');
        return false;
      }
      
      // Parse CSV into fireCrystalCosts object
      // ... parsing logic ...
      
      console.info(`[FireCrystals] Loaded ${rows.length} cost entries from CSV`);
      return true;
    } catch (error) {
      console.warn('[FireCrystals] CSV load failed:', error.message);
      document.dispatchEvent(new CustomEvent('csv-load-failed', {
        detail: { calculator: 'FireCrystals', error: error.message }
      }));
      return false;
    }
  }
  
  // Fallback hardcoded data (minimal, for offline)
  const FALLBACK_COSTS = {
    "Furnace": {
      "F30": { "time": 604800, "1": 132, "2": 132, "3": 132, "4": 132, "toFC1": 132 },
      // ... ONLY first level, not full 150 lines
    }
    // Minimal fallback only
  };
  
  return {
    init: async () => {
      const loaded = await loadFireCrystalCosts();
      if (!loaded) {
        console.log('[FireCrystals] Using fallback costs (offline mode)');
        fireCrystalCosts = FALLBACK_COSTS;
      }
    },
    calculateAll: () => { /* use fireCrystalCosts */ }
  };
})();
```

**Option B: Keep but mark as fallback only**
```javascript
// At top of fireCrystalCosts declaration:
/**
 * FALLBACK ONLY - DO NOT EDIT
 * 
 * This hardcoded data is ONLY used if CSV fails to load.
 * To update costs, edit src/assets/resource_data.xlsx
 * Then run: npm run import:fc
 * 
 * This is minimal data for offline mode only.
 */
const FALLBACK_FIRE_CRYSTAL_COSTS = {
  // ... only essential data, not full 150 lines
};
```

### Expected Result
- **Before**: 150+ lines of duplicated data in JS file
- **After**: CSV is source of truth, JS loads and uses it
- **File size reduction**: ~8-10 KB in production

### Verification
```bash
# Test that CSV loads correctly:
1. Open DevTools Console
2. Should see: "[FireCrystals] Loaded 100+ cost entries from CSV"
3. Try calculate: should work with CSV data
```

---

## 2. Fix: Silent CSV Load Failures

### Current Problem
```javascript
// src/Scripts/data-loader.js
async function loadCsv(url) {
  const text = await fetchText(url);
  if (!text) return { header: [], rows: [] };  // ← User never knows!
  // ... parsing ...
}
```

**Impact**: CSV fails to load, user calculates with wrong data, doesn't realize.

### Exact Fix

**Step 1: Enhance data-loader.js**
```javascript
// src/Scripts/data-loader.js
(function() {
  'use strict';
  const cache = {};
  
  async function fetchText(url) {
    if (cache[url]) return cache[url];
    cache[url] = fetch(url, { cache: 'no-cache' })
      .then(r => {
        if (!r.ok) {
          throw new Error(`HTTP ${r.status}`);
        }
        return r.text();
      })
      .catch(err => {
        console.error(`[DataLoader] Fetch failed: ${url}`, err);
        throw err;  // Propagate error up
      });
    return cache[url];
  }
  
  async function loadCsv(url) {
    try {
      const text = await fetchText(url);
      if (!text || text.trim().length === 0) {
        throw new Error('CSV file is empty');
      }
      
      const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
      if (lines.length === 0) {
        throw new Error('No data rows found');
      }
      
      const header = lines[0].split(',').map(h => h.trim());
      const rows = lines.slice(1).map(l => l.split(',').map(p => p.trim()));
      
      return { header, rows };
    } catch (error) {
      // Log but don't throw - let caller handle
      console.warn(`[DataLoader] Error loading ${url}:`, error.message);
      return null;  // Signal failure with null instead of empty object
    }
  }
  
  window.DataLoader = {
    fetchText,
    loadCsv,
    clearCache: () => Object.keys(cache).forEach(k => delete cache[k])
  };
})();
```

**Step 2: Update calculator.js to handle failures**
```javascript
// src/Scripts/calculator.js
async function loadCharmCostsFromCsv(url = 'assets/charms_unified.csv') {
  const result = await window.DataLoader.loadCsv(url);
  
  if (!result) {
    console.warn('[Charms] CSV load failed, using fallback');
    document.dispatchEvent(new CustomEvent('csv-load-failed', {
      detail: {
        calculator: 'Charms',
        message: 'Could not load charm costs. Using default values.'
      }
    }));
    return 0;  // Signal no overrides applied
  }
  
  // ... rest of parsing ...
}
```

**Step 3: Create notification handler**
```javascript
// Add to any calculator or profiles.js
document.addEventListener('csv-load-failed', (e) => {
  const { calculator, message } = e.detail;
  
  // Show user-friendly notification
  const notification = document.createElement('div');
  notification.className = 'notification notification-warning';
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'polite');
  notification.innerHTML = `
    <strong>⚠️ ${calculator} Data:</strong> ${message}
    <button class="close" aria-label="Close notification">&times;</button>
  `;
  
  // Insert into page
  document.body.insertBefore(notification, document.body.firstChild);
  
  // Auto-dismiss after 5 seconds
  setTimeout(() => notification.remove(), 5000);
  
  // Manual dismiss
  notification.querySelector('.close').addEventListener('click', () => {
    notification.remove();
  });
});
```

**Step 4: Add CSS for notification**
```css
/* src/style/style.css */
.notification {
  position: fixed;
  top: 20px;
  right: 20px;
  padding: 15px;
  border-radius: 4px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
  z-index: 1000;
  font-weight: 500;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
  animation: slideIn 0.3s ease-out;
}

.notification-warning {
  background: var(--danger);
  color: white;
  border-left: 4px solid darken(var(--danger), 10%);
}

.notification .close {
  background: none;
  border: none;
  color: inherit;
  font-size: 20px;
  cursor: pointer;
  padding: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.notification .close:hover {
  opacity: 0.8;
}

@keyframes slideIn {
  from {
    transform: translateX(400px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}
```

---

## 3. Fix: Missing Input Validation

### Current Problem
```javascript
// src/Scripts/profiles.js
const inventory = document.getElementById('inventory-meat');
const value = inventory?.value || 0;
snapshot.inventory.meat = parseInt(value, 10);  // No bounds check!

// Result: Can save "-999" or "999999999999" as inventory
```

### Exact Fix

**Create new file: src/Scripts/input-validators.js**
```javascript
/**
 * Input Validation Module
 * Validates user inputs for all calculators
 */
const InputValidators = (function() {
  'use strict';
  
  /**
   * Validate charm/chief gear level
   * @param {*} value - Value to validate
   * @param {number} min - Minimum level (default: 0)
   * @param {number} max - Maximum level (default: 16)
   * @returns {boolean}
   */
  function validateLevel(value, min = 0, max = 16) {
    if (value === null || value === undefined || value === '') return false;
    const num = parseInt(value, 10);
    if (!Number.isInteger(num)) return false;
    return num >= min && num <= max;
  }
  
  /**
   * Validate inventory value (must be positive integer)
   * @param {*} value - Value to validate
   * @param {number} min - Minimum (default: 0)
   * @param {number} max - Maximum (default: 999,999,999)
   * @returns {boolean}
   */
  function validateInventory(value, min = 0, max = 999999999) {
    if (value === null || value === undefined || value === '') return true; // Empty OK
    const num = parseInt(value, 10);
    if (!Number.isInteger(num)) return false;
    return num >= min && num <= max;
  }
  
  /**
   * Validate profile name (non-empty, not too long)
   * @param {*} name - Profile name
   * @param {number} maxLength - Max characters (default: 50)
   * @returns {boolean}
   */
  function validateProfileName(name, maxLength = 50) {
    if (typeof name !== 'string') return false;
    const trimmed = name.trim();
    return trimmed.length > 0 && trimmed.length <= maxLength;
  }
  
  /**
   * Sanitize profile name (trim whitespace, prevent XSS)
   * @param {string} name - Raw profile name
   * @returns {string} Sanitized name
   */
  function sanitizeProfileName(name) {
    return String(name || '').trim().slice(0, 50);
  }
  
  /**
   * Validate profile JSON structure
   * @param {*} data - Data to validate
   * @returns {boolean}
   */
  function validateProfileJson(data) {
    if (typeof data !== 'object' || data === null) return false;
    
    // Must have at least one page
    const hasAtLeastOne = Object.values(data).some(profile => 
      profile && typeof profile === 'object' && 
      (profile.charms || profile.chiefGear || profile.fireCrystals || profile.warLab)
    );
    
    if (!hasAtLeastOne) return false;
    
    // All profiles must be objects
    return Object.values(data).every(profile => 
      profile === null || typeof profile === 'object'
    );
  }
  
  /**
   * Get validation error message
   * @param {string} fieldType - Type: 'level', 'inventory', 'profile-name'
   * @param {*} value - Invalid value
   * @returns {string} Human-readable error message
   */
  function getErrorMessage(fieldType, value) {
    const t = window.I18n?.t || (k => k);
    
    switch (fieldType) {
      case 'level':
        return t('validation-error-level') || 'Level must be between 0 and 16';
      case 'inventory':
        return t('validation-error-inventory') || 'Must be a positive number';
      case 'profile-name':
        return t('validation-error-profile-name') || 'Profile name must be 1-50 characters';
      default:
        return t('validation-error-general') || 'Invalid input';
    }
  }
  
  return {
    validateLevel,
    validateInventory,
    validateProfileName,
    sanitizeProfileName,
    validateProfileJson,
    getErrorMessage
  };
})();
```

**Add to profiles.js - Update captureCurrent()**
```javascript
function captureCurrent() {
  const snapshot = {};
  const pages = detectPages();
  
  if (pages.charms) {
    // ... capture charm values ...
    // NEW: Validate each value
    for (const type of ['hat', 'coat', ...]) {
      for (let i = 1; i <= CHARMS_PER_TYPE; i++) {
        const startId = `${type}-charm-${i}-start`;
        const finishId = `${type}-charm-${i}-finish`;
        
        const startEl = document.getElementById(startId);
        const finishEl = document.getElementById(finishId);
        
        // Validate before saving
        if (!InputValidators.validateLevel(startEl?.value)) {
          console.warn(`[Profiles] Invalid level in ${startId}: ${startEl?.value}`);
          // Show error to user
          startEl?.classList.add('invalid');
          startEl?.setAttribute('aria-invalid', 'true');
        } else {
          startEl?.classList.remove('invalid');
          startEl?.setAttribute('aria-invalid', 'false');
        }
      }
    }
  }
  
  // Inventory validation
  InputValidators.validateLevel // Reuse for inventory validation too
  const meatEl = document.getElementById('inventory-meat');
  if (meatEl?.value && !InputValidators.validateInventory(meatEl.value)) {
    console.warn('[Profiles] Invalid inventory meat:', meatEl.value);
    meatEl.classList.add('invalid');
    throw new Error('Invalid inventory value');
  }
  
  return snapshot;
}
```

---

## 4. Fix: localStorage Corruption Recovery

### Current Problem
```javascript
function readProfiles() {
  try {
    const raw = localStorage.getItem('wos-unified-profiles');
    return raw ? JSON.parse(raw) : {};
  } catch (e) {
    return {};  // ← Silently loses all data!
  }
}
```

### Exact Fix

```javascript
// In src/Scripts/profiles.js

/**
 * Safely read profiles from localStorage with recovery
 * @returns {Object} Profiles object
 */
function readProfiles() {
  try {
    const raw = localStorage.getItem('wos-unified-profiles');
    if (!raw) return {};
    
    const data = JSON.parse(raw);
    
    // Validate structure
    if (!InputValidators.validateProfileJson(data)) {
      throw new Error('Invalid profile structure');
    }
    
    return data;
  } catch (error) {
    console.error('[Profiles] Corruption detected:', error.message);
    
    // Backup corrupted data for recovery
    try {
      const raw = localStorage.getItem('wos-unified-profiles');
      const timestamp = new Date().toISOString();
      localStorage.setItem(`wos-backup-corrupted-${timestamp}`, raw);
      console.info('[Profiles] Backed up corrupted data');
    } catch (backupError) {
      console.warn('[Profiles] Could not backup corrupted data:', backupError);
    }
    
    // Clear corrupted data
    localStorage.removeItem('wos-unified-profiles');
    
    // Notify user
    showCorruptionNotification();
    
    return {};
  }
}

/**
 * Show user notification about data loss with recovery option
 */
function showCorruptionNotification() {
  const notification = document.createElement('div');
  notification.className = 'notification notification-danger';
  notification.setAttribute('role', 'alert');
  notification.setAttribute('aria-live', 'assertive');
  notification.innerHTML = `
    <div>
      <strong>⚠️ Data Recovery:</strong>
      <p>Your saved profiles were corrupted and have been cleared.</p>
      <p>A backup was saved. You can attempt to restore it manually.</p>
      <button id="show-corruption-backup" class="btn secondary">Show Backup</button>
      <button class="close" aria-label="Close notification">&times;</button>
    </div>
  `;
  
  document.body.insertBefore(notification, document.body.firstChild);
  
  // Recovery button
  notification.querySelector('#show-corruption-backup').addEventListener('click', () => {
    const backups = Object.keys(localStorage)
      .filter(k => k.startsWith('wos-backup-corrupted-'));
    
    if (backups.length === 0) {
      alert('No backup found. Your data could not be recovered.');
      return;
    }
    
    const latest = backups.sort().pop();
    const backup = localStorage.getItem(latest);
    console.log('Corrupted backup:', backup);
    
    // Show in modal for user to copy/paste
    const modal = createRecoveryModal(backup, latest);
    document.body.appendChild(modal);
  });
  
  // Dismiss button
  notification.querySelector('.close').addEventListener('click', () => {
    notification.remove();
  });
  
  // Auto-dismiss after 10 seconds
  setTimeout(() => notification.remove(), 10000);
}

function createRecoveryModal(backupData, timestamp) {
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.innerHTML = `
    <div class="modal-content">
      <h2>Profile Backup Data</h2>
      <p>This is your backed-up profile data from ${timestamp}</p>
      <textarea readonly rows="10" style="width:100%;font-family:monospace;font-size:12px;">
${backupData}
      </textarea>
      <p>You can:</p>
      <ol>
        <li>Copy the data above</li>
        <li>Contact support with this data</li>
        <li>Or create new profiles</li>
      </ol>
      <button class="btn primary" onclick="this.closest('.modal').remove()">Close</button>
    </div>
  `;
  return modal;
}
```

---

## 5. Quick Fixes (Easy Wins)

### 5.1 Standardize Console Logging

**Before**:
```javascript
console.warn('[Charms] CSV override skipped:', e.message || e);
console.log('Fire Crystals data loaded:', this.data.length, 'rows');
console.error('Error:', err);  // No module prefix
```

**After**:
```javascript
const log = {
  info: (...args) => console.log('[Charms]', ...args),
  warn: (...args) => console.warn('[Charms]', ...args),
  error: (...args) => console.error('[Charms]', ...args)
};

log.info('CSV override applied');
log.warn('CSV failed, using fallback');
log.error('Calculation error:', error);
```

---

### 5.2 Add JSDoc to Public Functions

**Before**:
```javascript
function calculateAll() {
  // Calculate costs for all charms
  // ...
}
```

**After**:
```javascript
/**
 * Calculate all charm upgrade costs
 * 
 * Finds all charm input pairs (from/to levels) and calculates
 * the total resources needed to upgrade from start to finish level.
 * Updates the results table with calculations.
 * 
 * @returns {void}
 * @throws {Error} If calculation fails
 * 
 * @example
 * CalculatorModule.calculateAll();
 */
function calculateAll() {
  // ...
}
```

---

### 5.3 Validate CSV on Load

**Add to all CSV load functions**:
```javascript
async function validateLoadedCsv(header, rows, expectedColumns) {
  // Check required columns present
  const missingCols = expectedColumns.filter(col => !header.includes(col));
  if (missingCols.length > 0) {
    throw new Error(`Missing columns: ${missingCols.join(', ')}`);
  }
  
  // Check data present
  if (rows.length === 0) {
    throw new Error('CSV has no data rows');
  }
  
  // Check each row has expected columns
  for (let i = 0; i < rows.length; i++) {
    if (rows[i].length < header.length) {
      console.warn(`Row ${i} has fewer columns than header`);
    }
  }
  
  return true;
}
```

---

## 6. Testing Your Fixes

### Test Fire Crystals Data Loading
```javascript
// In browser console:
1. Open DevTools (F12)
2. Go to Network tab
3. Filter by "fire_crystals_unified.csv"
4. Verify file loads successfully (200 status)
5. Go to Console
6. Type: window.DataLoader.loadCsv('assets/fire_crystals_unified.csv')
7. Should return data with ~100+ rows
```

### Test Error Handling
```javascript
// Simulate CSV failure:
1. In DevTools Application tab → Local Storage
2. Add key: "test-offline" value: "1"
3. Modify data-loader.js to check this flag
4. Reload page
5. Should see error notification about CSV load failure
```

### Test Input Validation
```javascript
1. Open charms calculator
2. Open DevTools Console
3. Type: InputValidators.validateLevel('abc')
   Result: false ✓
4. Type: InputValidators.validateLevel('5')
   Result: true ✓
5. Type: InputValidators.validateInventory('-100')
   Result: false ✓
6. Type: InputValidators.validateInventory('50000')
   Result: true ✓
```

---

## Next Steps

1. **Start with Fix #1**: Remove Fire Crystals hardcoded data (2-3 hours)
2. **Then Fix #2**: Add CSV error notifications (4-5 hours)
3. **Then Fix #3**: Input validation module (3-4 hours)
4. **Then Fix #4**: localStorage corruption recovery (3-4 hours)
5. **Then Fix #5**: Quick wins (1-2 hours each)

**Total Time for Fixes 1-5**: ~2.5 weeks with testing

---

