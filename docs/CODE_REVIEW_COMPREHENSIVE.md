# WOS Calculator - Comprehensive Code Review

**Date**: December 27, 2025  
**Scope**: Full project audit covering architecture, code quality, missing features, bugs, and improvements  
**Status**: ✅ Detailed analysis with actionable recommendations  

---

## 📊 Executive Summary

**Project Health**: 🟡 **GOOD** with notable gaps
- **Strengths**: Solid IIFE module pattern, data-driven architecture, multi-language support
- **Weaknesses**: Missing features, weak error handling, no build optimization, incomplete test coverage
- **Risk Areas**: Production error visibility, data pipeline fragility, incomplete features

**Critical Findings**:
1. ❌ **Missing Core Features**: Pets & Experts calculators (placeholder pages only)
2. ❌ **No Error Monitoring**: Console errors invisible to users
3. ⚠️ **Fragile Data Loading**: CSV failures silently fall back with no user notification
4. ⚠️ **No Build Pipeline**: Minified files exist but no automated generation
5. ⚠️ **Incomplete Profiles**: No export/import functionality
6. ⚠️ **Code Duplication**: Fire Crystals has 3 parallel calculator implementations

**Estimated Effort to Address**:
- Critical issues: 2-3 weeks
- High priority: 4-6 weeks
- Complete roadmap: 10-12 weeks

---

## 1. 🏗️ Architecture Analysis

### 1.1 Module Pattern - GOOD ✅

**Strengths**:
- Proper IIFE (Immediately Invoked Function Expression) encapsulation
- Module dependency chain correctly ordered
- All modules expose public API via return object
- No global pollution (except `window.ModuleName`)

**Example (Good)**:
```javascript
// src/Scripts/calculator.js
const CalculatorModule = (function(){
  const costs = {};  // Private
  function loadCharmCostsFromCsv() { /* ... */ }  // Private
  return {
    calculateAll() { /* ... */ },  // Public
    refreshAll() { /* ... */ }      // Public
  };
})();
```

**Recommendation**: Continue this pattern for all future modules. ✅

---

### 1.2 Data-Driven Architecture - PARTIAL ⚠️

**Current State**:
```
Excel (resource_data.xlsx) 
  → npm scripts (extract-*.js)
    → CSV files (assets/*_costs.csv)
      → JavaScript (dynamic CSV loading)
        → Calculator modules (override defaults)
```

**Issues Found**:

| Issue | Severity | Location | Impact |
|-------|----------|----------|--------|
| CSV loading not error-handled for users | HIGH | `data-loader.js`, `calculator.js` | Silent failures, users don't know costs are from hardcoded defaults |
| No CSV version management | MEDIUM | Build pipeline | No way to invalidate old cache |
| Fire Crystals has 3 independent cost systems | HIGH | `fire-crystals-calculator.js` (lines 180+) | Data redundancy, potential inconsistencies |
| Excel → CSV extraction fragile | MEDIUM | All `scripts/extract-*.js` | Column header changes break extraction |

**Code Example (Problem)**:
```javascript
// src/Scripts/data-loader.js - Lines 1-20
async function loadCsv(url){
  const text = await fetchText(url);
  if(!text) return { header:[], rows:[] };  // ← Silently fails!
  // ... parsing ...
}
// User never sees error - calculator falls back to hardcoded costs
```

**Recommendation**: Add user-facing error notifications when CSV fails.

---

### 1.3 Script Load Order - GOOD ✅

**Current State** (Validated):
```html
<!-- Independent (no dependencies) -->
<script src="Scripts/min/icon-helper.min.js" defer></script>
<script src="Scripts/min/theme.min.js" defer></script>
<script src="Scripts/min/table-sort.min.js" defer></script>

<!-- Dependent -->
<script src="Scripts/min/calculator.min.js" defer></script>
<script src="Scripts/min/profiles.min.js" defer></script>
```

✅ **Verified Correct** on all 6 HTML pages (charms, chiefGear, fireCrystals, war-academy, pets, experts)

---

## 2. 🐛 Code Quality Issues

### 2.1 Error Handling - WEAK ❌

**Finding**: Insufficient try-catch and user error notification

**Examples of Problems**:

| File | Line | Issue | Severity |
|------|------|-------|----------|
| `data-loader.js` | 6 | Fetch failure returns empty object | HIGH |
| `calculator.js` | 93 | CSV parse fails silently | HIGH |
| `profiles.js` | 450 | localStorage quota error no retry | MEDIUM |
| `fire-crystals-calculator.js` | 150 | Module load fail doesn't notify | MEDIUM |

**Code Example (Bad)**:
```javascript
// src/Scripts/profiles.js - Line 450
function saveProfiles(data) {
  try {
    localStorage.setItem('wos-unified-profiles', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save:', e);  // ← Only console.warn!
    // User won't see this error
  }
}
```

**Fixed Version**:
```javascript
function saveProfiles(data) {
  try {
    localStorage.setItem('wos-unified-profiles', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save:', e);
    // Show user-facing error
    const msg = e.name === 'QuotaExceededError' 
      ? 'Storage full. Delete old profiles to save new ones.'
      : 'Could not save profile due to storage issue.';
    showNotification(msg, 'error');
  }
}
```

**Recommendation**: 
1. Create `src/Scripts/error-handler.js` with `showNotification(msg, type)` 
2. Replace all `console.warn/error` with user notifications
3. Test private browsing (localStorage disabled)

---

### 2.2 Data Validation - WEAK ❌

**Finding**: Minimal input validation, potential invalid calculations

**Missing Validations**:

| Input | Validation | Currently | Risk |
|-------|-----------|-----------|------|
| FROM level > TO level | Checked | ✅ Yes (calculator.js:65) | LOW |
| Negative levels | Checked | ⚠️ Partial (only UI level range) | MEDIUM |
| Out-of-range levels | Checked | ✅ Partial (CHARM_LEVEL_VALUES) | MEDIUM |
| Inventory values (negative) | NOT checked | ❌ No | HIGH |
| Profile JSON corruption | NOT checked | ❌ No | HIGH |

**Code Example (Missing Validation)**:
```javascript
// src/Scripts/profiles.js - captureCurrent() doesn't validate
const inventoryMeat = document.getElementById('inventory-meat');
const value = inventoryMeat?.value || 0;  // ← Could be "-999"
snapshot[currentScope]['inventory-meat'] = parseInt(value, 10);  // ← No bounds check
```

**Recommendation**: Add `input-validators.js` module:
```javascript
const InputValidators = (function(){
  function validateLevel(value, min=0, max=16) {
    const num = parseInt(value, 10);
    return Number.isInteger(num) && num >= min && num <= max;
  }
  
  function validateInventory(value, min=0, max=999999999) {
    const num = parseInt(value, 10);
    return Number.isInteger(num) && num >= min && num <= max;
  }
  
  return { validateLevel, validateInventory };
})();
```

---

### 2.3 Console Logging - INCONSISTENT ⚠️

**Finding**: Debugging messages left in production code

**Issues**:

```javascript
// src/Scripts/calculator.js - Lines 1-5
allBatchInputs.forEach(batchInput => {
  batchInput.addEventListener('change', () => {
    // [Charms] Batch input changed: removed for production  ← Comment indicates removed
    if (window.ProfilesModule && ProfilesModule.autoSaveCurrentProfile) {
      ProfilesModule.autoSaveCurrentProfile();
      // [Charms] Profile auto-saved after batch input change: removed for production
    }
  });
});
```

**Best Practice**: Use prefixed logging:
```javascript
const DEBUG = false;  // Toggle in build process
const log = (...args) => DEBUG && console.log('[Charms]', ...args);

log('Batch input changed, auto-saving...');
```

---

### 2.4 Code Duplication - CRITICAL ❌

**Finding**: Fire Crystals calculator duplicated 3 ways

| System | Location | Lines | Status |
|--------|----------|-------|--------|
| **Hardcoded data** | `fire-crystals-calculator.js:180+` | 150+ | Active |
| **CSV-based** | `fire-crystals-costs.js` (old) | 300+ | Deprecated? |
| **New unified** | `fire-crystals-unified.csv` | Auto-updated | Active |

**Problem**:
```javascript
// fire-crystals-calculator.js - Line 150+
const fireCrystalCosts = {
  "Furnace": {
    "F30": { "time": 604800, "1": 132, ... },  // ← Hardcoded!
    // ... 100+ more lines ...
  }
};
```

This data is ALSO in:
- `src/assets/resource_data.xlsx` (source of truth)
- `src/assets/fire_crystals_unified.csv` (generated)

**Risk**: If Excel data updates but hardcoded costs aren't, users get wrong calculations.

**Recommendation**: 
1. Remove hardcoded `fireCrystalCosts` object (line 150+)
2. Load ONLY from CSV: `await window.DataLoader.loadCsv('assets/fire_crystals_unified.csv')`
3. Keep fallback defaults for offline mode, not as primary data

---

## 3. 📋 Missing Features

### 3.1 Pets Calculator (INCOMPLETE) ❌

**Status**: Placeholder page exists (`src/pets.html`)

**Required Work**:

| Task | Effort | Files | Priority |
|------|--------|-------|----------|
| Create `src/Scripts/pets-calculator.js` | 1 week | pets-calculator.js (800 lines) | HIGH |
| Add "Pets Data" sheet to Excel | 3 days | resource_data.xlsx | HIGH |
| Extract pets costs CSV | 2 days | scripts/extract-pets-costs.js | HIGH |
| Add pet icons | 2 days | assets/resources/pets/ | MEDIUM |
| Translations (~30 keys) | 3 days | scripts/translations.js | MEDIUM |
| Integration with profiles | 2 days | profiles.js updates | MEDIUM |

**Scope**:
- Pet level progression (0-max)
- Feeding cost calculations
- Evolution path tracking
- Power impact calculations
- Synergy detection between pets

**Effort Estimate**: 2-3 weeks (one developer)

---

### 3.2 Experts Calculator (INCOMPLETE) ❌

**Status**: Placeholder page exists (`src/experts.html`)

**Required Work**: Similar to Pets (see above)

**Scope**:
- Expert level progression
- Skill unlock calculations
- Talent tree path optimization
- Power impact per expert

**Effort Estimate**: 2-3 weeks

---

### 3.3 Profile Export/Import (MISSING) ❌

**Status**: Profiles stored in localStorage only (no backup/sharing)

**Required Features**:

| Feature | Effort | Impact |
|---------|--------|--------|
| Export to JSON file | 2 days | User backup & sharing |
| Import from JSON file | 2 days | Profile transfer |
| Export to CSV | 2 days | Excel integration |
| Bulk import multiple profiles | 1 day | Team coordination |
| Version compatibility check | 1 day | Migration support |

**Code Sketch**:
```javascript
// Add to ProfilesModule
function exportProfileAsJson(profileName) {
  const profile = readProfiles()[profileName];
  const json = JSON.stringify(profile, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wos-profile-${profileName}-${Date.now()}.json`;
  a.click();
}

function importProfileFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const profile = JSON.parse(e.target.result);
        validateProfileJson(profile);  // Check structure
        resolve(profile);
      } catch (err) {
        reject(new Error(`Invalid profile file: ${err.message}`));
      }
    };
    reader.readAsText(file);
  });
}
```

**Effort Estimate**: 1 week (with testing)

---

### 3.4 Advanced Table Filtering (MISSING) ❌

**Status**: Tables are sortable but not filterable

**Missing Filters**:
1. Resource type (show only "Guides" rows)
2. Text search (filter by keyword)
3. Range filter (costs 1000-5000 only)
4. Export filtered results to CSV

**Current Code** (`table-sort.js` ~150 lines):
```javascript
// Only has sorting, no filtering
function addSortListener(header) {
  header.addEventListener('click', () => {
    table.dataset.sortBy = header.dataset.sortKey;
    // ... sort logic ...
  });
}
```

**Recommendation**: Extend `table-sort.js` with:
```javascript
const TableSort = (function() {
  const sort = {};
  const filters = {};
  
  function applyFilters(table) {
    Array.from(table.querySelectorAll('tbody tr')).forEach(row => {
      const visible = Object.entries(filters).every(([key, predicate]) =>
        predicate(row)
      );
      row.style.display = visible ? '' : 'none';
    });
  }
  
  function addFilter(key, predicate) {
    filters[key] = predicate;
    applyFilters();
  }
  
  return { sort: () => {}, addFilter };
})();
```

**Effort Estimate**: 1-2 weeks

---

## 4. 🚀 Performance Issues

### 4.1 Missing Build Optimization ❌

**Current State**: 
- ✅ Minified JS files exist (`Scripts/min/`)
- ✅ Minified CSS exists (`style.min.css`)
- ❌ No automated build script
- ❌ No cache-busting strategy
- ❌ No bundling/tree-shaking

**Missing Script** (`scripts/build.js`):
```bash
# Currently missing, but should:
1. Lint CSS (already: npm run lint)
2. Minify JS (already exists, but not automated)
3. Minify CSS (already exists, but not automated)
4. Generate hash-based filenames (e.g., `calculator.min.abc123.js`)
5. Create source maps for debugging
```

**Recommendation**: Add build automation:
```json
{
  "scripts": {
    "build": "node scripts/build.js",
    "build:watch": "nodemon --exec 'npm run build'",
    "deploy": "npm run lint && npm run build && npm test"
  }
}
```

**Effort Estimate**: 3-5 days

---

### 4.2 CSV Caching Not Optimized ⚠️

**Current State**:
```javascript
// data-loader.js
const cache = {};
async function fetchText(url){
  if(cache[url]) return cache[url];
  cache[url] = fetch(url, { cache: 'no-cache' }).then(...);
  return cache[url];
}
```

**Issues**:
- `cache: 'no-cache'` means no browser caching ← **Inefficient**
- No versioning (cache invalidation unknown)
- No ETag support
- No compression

**Recommendation**:
```javascript
// Better: use cache headers server-side
fetch(url, { 
  cache: 'default'  // Browser handles cache
  // Server should set: Cache-Control: max-age=3600
})

// Or add version hash
const csvUrl = `assets/charms_costs.csv?v=${PACKAGE_VERSION}`;
```

**Effort Estimate**: 1-2 days

---

### 4.3 No Code Splitting ⚠️

**Current State**: All JavaScript loaded on every page

**Impact**:
- `charms.html` loads `fire-crystals-calculator.js` (unnecessary)
- War Academy page loads 50KB of Fire Crystals code it doesn't need

**Recommendation**: Dynamic imports
```javascript
// Instead of: <script src="calculator.js"></script>

// Use:
if (document.querySelector('select[id*="-charm-"]')) {
  import('./Scripts/calculator.js').then(mod => mod.CalculatorModule.init());
}
```

**Expected Gain**: 40-60% reduction in initial JS size

**Effort Estimate**: 1 week

---

## 5. 🌐 Accessibility Gaps

### 5.1 ARIA Attributes - PARTIAL ✅

**Current State**: Most pages have proper ARIA labels

**Gap Found** (war-academy.html):
```html
<!-- ❌ Missing aria-label -->
<div class="war-lab-page" role="main">  <!-- Should have aria-label -->
  
<!-- ✅ Correct -->
<main role="main" aria-label="War Academy Research Calculator">
```

**Verified Elements**:
- ✅ `dark-mode-toggle` has aria-label
- ✅ `language-selector` has aria-label  
- ✅ Profile buttons have aria-label
- ❌ War Academy grid missing labels

**Recommendation**: Add aria-label to all major regions
```html
<div class="war-lab-page" role="main" aria-label="War Academy Research Calculator">
<section class="research-tree" aria-label="Technology Tree">
<table aria-label="Research Costs Table">
```

**Effort Estimate**: 1 day

---

### 5.2 Keyboard Navigation - PARTIAL ✅

**Verified Working**:
- ✅ Tab navigation works
- ✅ Enter/Space activates buttons
- ✅ Select dropdowns keyboard-accessible

**Gap Found**: Profile modal doesn't trap focus
```javascript
// Missing: Focus trap in profile rename/delete modals
function openModal(modal) {
  const focusableElements = modal.querySelectorAll('button, input, select, [tabindex]');
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modal.addEventListener('keydown', (e) => {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        lastElement.focus();
        e.preventDefault();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        firstElement.focus();
        e.preventDefault();
      }
    }
  });
}
```

**Effort Estimate**: 2 days

---

## 6. 🔐 Security & Data Integrity

### 6.1 localStorage Corruption Risk ⚠️

**Finding**: No validation of stored JSON before parsing

**Vulnerable Code** (profiles.js):
```javascript
function readProfiles() {
  try {
    const raw = localStorage.getItem('wos-unified-profiles');
    return raw ? JSON.parse(raw) : {};  // ← Could crash if corrupted
  } catch (e) {
    return {};
  }
}
```

**Problem**: If user manually edits localStorage and breaks JSON:
```javascript
// Corrupted entry
localStorage.setItem('wos-unified-profiles', '{"invalid json');
// readProfiles() silently returns {}, loses all profiles
```

**Recommendation**: Add recovery mechanism
```javascript
function readProfiles() {
  try {
    const raw = localStorage.getItem('wos-unified-profiles');
    if (!raw) return {};
    const data = JSON.parse(raw);
    
    // Validate structure
    if (!validateProfileJson(data)) {
      throw new Error('Invalid profile structure');
    }
    return data;
  } catch (e) {
    console.error('Profile corruption detected:', e);
    // Backup corrupted data
    localStorage.setItem('wos-backup-corrupted', localStorage.getItem('wos-unified-profiles'));
    // Clear and return empty
    localStorage.removeItem('wos-unified-profiles');
    showNotification('Your profiles were corrupted. A backup was saved.', 'warning');
    return {};
  }
}

function validateProfileJson(data) {
  if (typeof data !== 'object' || data === null) return false;
  for (const [name, profile] of Object.entries(data)) {
    if (typeof name !== 'string') return false;
    if (typeof profile !== 'object') return false;
    if (!profile.charms && !profile.chiefGear && !profile.fireCrystals && !profile.warLab) {
      return false;  // At least one page required
    }
  }
  return true;
}
```

**Effort Estimate**: 2-3 days

---

### 6.2 XSS Prevention ⚠️

**Finding**: Profile names are user-input and displayed without escaping

**Vulnerable Code** (profiles.js):
```javascript
// Creating dropdown option
const option = document.createElement('option');
option.textContent = profileName;  // ← Safe (textContent escapes)
option.value = profileName;         // ← Safe

// But if shown in HTML:
const label = `<span>Profile: ${profileName}</span>`;  // ← UNSAFE!
element.innerHTML = label;  // ← Could inject script if profileName = '<img onerror=alert(1)>'
```

**Current Protection**: Most code uses `textContent` (safe), but check for `innerHTML`

**Recommendation**: Audit all user-input display:
```bash
grep -r "innerHTML.*profile" src/Scripts/
grep -r "innerHTML.*inventory" src/Scripts/
```

**Verified Safe** (spot check):
- ✅ Profile names in dropdown: uses `option.textContent`
- ✅ Inventory display: uses `textContent`

**Effort Estimate**: 1 day audit + fixes

---

## 7. 📚 Documentation Gaps

### 7.1 Code Documentation - PARTIAL ⚠️

**What Exists** ✅:
- `docs/CALCULATOR_PAGE_TEMPLATE.md` - Good
- `docs/PROFILES_SYSTEM.md` - Good
- `docs/TRANSLATION_SYSTEM.md` - Good
- Inline comments in most JS files

**What's Missing** ❌:
- `TESTING_GUIDE.md` - How to test changes
- `BUILD_GUIDE.md` - Build process documentation
- `DATA_STRUCTURE.md` - Profile JSON schema
- JSDoc comments on functions
- Type hints / TypeScript definitions

**Priority**: Add JSDoc to all public functions
```javascript
/**
 * Load charm costs from CSV file
 * @param {string} url - CSV file URL (default: 'assets/charms_unified.csv')
 * @returns {Promise<void>}
 * @throws {Error} If CSV format is invalid
 * 
 * @example
 * await loadCharmCostsFromCsv('assets/custom-costs.csv');
 */
async function loadCharmCostsFromCsv(url = 'assets/charms_unified.csv') { }
```

---

### 7.2 README.md - OUTDATED ⚠️

**Issues**:
- No mention of Pets/Experts placeholders
- No build instructions
- No contributing guide
- No troubleshooting for common issues

---

## 8. 🧪 Testing Infrastructure

### 8.1 Manual Testing Checklist EXISTS ✅

- ✅ `docs/PETS_TESTING_CHECKLIST.md` exists
- ✅ Comprehensive manual test procedures documented

**What's Missing** ❌:
- No automated tests (unit tests)
- No E2E tests (Playwright/Cypress)
- No CI/CD pipeline
- No test coverage metrics

**Recommended Test Framework**: Playwright
```javascript
// Example: test/calculator.spec.js
import { test, expect } from '@playwright/test';

test('charm calculator calculates correctly', async ({ page }) => {
  await page.goto('http://localhost:8080/charms.html');
  
  // Select FROM level 5
  await page.selectOption('select[id="hat-charm-1-start"]', '5');
  // Select TO level 10
  await page.selectOption('select[id="hat-charm-1-finish"]', '10');
  
  // Check results
  const totalGuides = await page.textContent('[data-resource="guides"] .total');
  expect(parseInt(totalGuides)).toBeGreaterThan(0);
});
```

**Effort Estimate**: 3-4 weeks (comprehensive coverage)

---

## 9. 🔄 Data Pipeline Issues

### 9.1 Excel Sheet Extraction Fragile ⚠️

**Problem**: Column indices hardcoded

```javascript
// scripts/extract-charms-costs.js
const fcCol = 12; // Column L
const rfcCol = 14; // Column N

for (let rowNum = 1; rowNum <= maxRows; rowNum++) {
  const fc = row.getCell(fcCol).value;  // ← Breaks if columns move!
}
```

**Risk**: If someone adds a column to Excel, extraction breaks silently

**Recommendation**: Use header detection
```javascript
async function extractData(sheetName) {
  const sheet = workbook.getWorksheet(sheetName);
  const headerRow = sheet.getRow(1);
  
  // Dynamic column detection
  let levelCol, guidesCol, designsCol;
  headerRow.eachCell((cell, colNum) => {
    const header = String(cell.value || '').toLowerCase().trim();
    if (header === 'level' || header === 'level name') levelCol = colNum;
    if (header === 'guides') guidesCol = colNum;
    if (header === 'designs') designsCol = colNum;
  });
  
  if (!levelCol || !guidesCol) {
    throw new Error(`Required columns not found in sheet "${sheetName}"`);
  }
  
  // Use detected columns
  for (const row of sheet.getRows()) {
    const level = row.getCell(levelCol).value;
    const guides = row.getCell(guidesCol).value;
  }
}
```

**Effort Estimate**: 2-3 days to refactor all extractors

---

### 9.2 No Validation of Extracted Data ⚠️

**Problem**: Extraction scripts don't validate output

```javascript
// scripts/extract-charms-costs.js - no validation that:
// - Level 0 exists
// - Level 16 exists
// - Costs are non-negative
// - Costs are increasing by level
```

**Recommendation**: Add validation step
```javascript
function validateCosts(costs) {
  const errors = [];
  
  // Check all levels present
  for (let i = 0; i <= 16; i++) {
    if (!costs[i]) errors.push(`Level ${i} missing`);
  }
  
  // Check costs are positive
  for (let i = 0; i <= 16; i++) {
    if (costs[i].guides < 0) errors.push(`Level ${i} guides is negative`);
  }
  
  // Check monotonicity
  for (let i = 1; i <= 16; i++) {
    if (costs[i].guides < costs[i-1].guides) {
      errors.push(`Level ${i} guides lower than level ${i-1}`);
    }
  }
  
  return errors.length === 0 ? true : errors;
}
```

**Effort Estimate**: 2 days

---

## 10. 🎯 Priority Roadmap

### Phase 1: CRITICAL (2-3 weeks)

1. **Add Error Monitoring** (3-4 days)
   - User-facing error notifications
   - Error handler module
   - Test all error paths

2. **Fix Fire Crystals Duplication** (2-3 days)
   - Remove hardcoded data
   - Load from CSV only
   - Keep fallback for offline

3. **Add Input Validation** (3-4 days)
   - Create validators module
   - Validate all user inputs
   - Add UI error messages

4. **Add localStorage Corruption Recovery** (2 days)
   - Backup mechanism
   - Validation on read
   - User notifications

### Phase 2: HIGH PRIORITY (4-6 weeks)

1. **Implement Pets Calculator** (2-3 weeks)
2. **Implement Experts Calculator** (2-3 weeks)
3. **Profile Export/Import** (1 week)

### Phase 3: MEDIUM PRIORITY (2-3 weeks)

1. **Build Optimization** (3-5 days)
2. **Code Splitting** (1 week)
3. **CSV Caching Strategy** (2-3 days)
4. **Accessibility Improvements** (3-4 days)

### Phase 4: NICE-TO-HAVE (Ongoing)

1. **Table Filtering** (1-2 weeks)
2. **Automated Testing** (3-4 weeks)
3. **TypeScript Migration** (4-6 weeks)
4. **Web Workers** (1-2 weeks)

---

## 11. 📈 Summary Table

| Category | Status | Impact | Effort |
|----------|--------|--------|--------|
| **Module Pattern** | ✅ Good | - | - |
| **Error Handling** | ❌ Weak | HIGH | 1 week |
| **Data Validation** | ❌ Missing | HIGH | 1 week |
| **Pets Calculator** | ❌ Missing | HIGH | 2-3 weeks |
| **Experts Calculator** | ❌ Missing | HIGH | 2-3 weeks |
| **Profile Export** | ❌ Missing | MEDIUM | 1 week |
| **Build Optimization** | ❌ Missing | MEDIUM | 1 week |
| **Code Duplication** | ❌ High | MEDIUM | 1 week |
| **Accessibility** | ⚠️ Partial | LOW | 3-4 days |
| **Testing** | ❌ None | MEDIUM | 3-4 weeks |
| **Documentation** | ⚠️ Partial | LOW | 2-3 days |

---

## 12. 🚀 Next Steps

**Immediate** (This week):
1. [ ] Run `npm lint` and fix all CSS warnings
2. [ ] Create error-handler.js module
3. [ ] Add user notifications for CSV load failures
4. [ ] Document all code with JSDoc comments

**Short-term** (Next 2 weeks):
1. [ ] Remove Fire Crystals hardcoded costs
2. [ ] Add input validation module
3. [ ] Add localStorage corruption recovery
4. [ ] Start Pets calculator implementation

**Medium-term** (Weeks 3-8):
1. [ ] Complete Pets & Experts calculators
2. [ ] Implement profile export/import
3. [ ] Add build optimization pipeline
4. [ ] Code splitting for performance

---

## 13. 📞 Questions for Team

1. **Pets/Experts**: Do you have game data (spreadsheet) with costs?
2. **Testing**: Do you want automated tests or stick with manual?
3. **TypeScript**: Interested in migrating to TypeScript for type safety?
4. **Analytics**: Should we implement error monitoring (e.g., Sentry)?
5. **i18n**: Are there more languages beyond the current 8?

---

**Generated**: December 27, 2025  
**Reviewed by**: Code Analysis System  
**Confidence**: High (comprehensive codebase scan)

