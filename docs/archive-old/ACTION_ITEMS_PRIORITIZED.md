# WOS Calculator - Quick Action Items

**Last Updated**: December 27, 2025  
**Total Issues Found**: 35+ (14 Critical/High, 12 Medium, 9+ Nice-to-Have)

---

## 🔴 CRITICAL - Fix This Week

### 1. Fire Crystals Data Duplication ⚠️ HIGH PRIORITY
**Files**: `src/Scripts/fire-crystals-calculator.js` (lines 150-300)  
**Problem**: Hardcoded cost data conflicts with CSV  
**Fix**: Remove hardcoded `fireCrystalCosts` object, load from CSV only  
**Time**: 2-3 hours  
**Risk**: Data inconsistency, wrong calculations

```javascript
// DELETE this section (lines 150+):
const fireCrystalCosts = { "Furnace": { ... }, ... };

// KEEP: Load from CSV
async function ensureFireCrystalCosts() {
  const data = await window.DataLoader.loadCsv('assets/fire_crystals_unified.csv');
  // Parse and use data
}
```

---

### 2. Silent CSV Load Failures ⚠️ HIGH PRIORITY
**Files**: `src/Scripts/data-loader.js`, all calculators  
**Problem**: CSV failures return empty data, user doesn't know  
**Fix**: Add user notification when CSV fails  
**Time**: 1 day  
**Impact**: Users calculating with hardcoded data without realizing

```javascript
// Add to data-loader.js
async function loadCsv(url) {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    // ... parsing ...
  } catch (error) {
    console.warn(`CSV load failed: ${url}`, error);
    // Dispatch event or call callback
    document.dispatchEvent(new CustomEvent('csv-load-failed', {
      detail: { url, error: error.message }
    }));
    return { header: [], rows: [] };
  }
}
```

---

### 3. No Input Validation ⚠️ HIGH PRIORITY
**Files**: `src/Scripts/profiles.js`, calculator modules  
**Problem**: Negative inventory values, invalid levels allowed  
**Fix**: Create `src/Scripts/input-validators.js`  
**Time**: 2-3 hours  
**Risk**: Invalid calculations, corrupted profiles

```javascript
// New file: src/Scripts/input-validators.js
const InputValidators = (function() {
  return {
    validateLevel: (val, min=0, max=16) => {
      const n = parseInt(val, 10);
      return Number.isInteger(n) && n >= min && n <= max;
    },
    validateInventory: (val, min=0, max=999999999) => {
      const n = parseInt(val, 10);
      return Number.isInteger(n) && n >= min && n <= max;
    }
  };
})();
```

---

### 4. localStorage Corruption Risk ⚠️ HIGH PRIORITY
**File**: `src/Scripts/profiles.js` (readProfiles function)  
**Problem**: No recovery if localStorage gets corrupted  
**Fix**: Add validation + backup mechanism  
**Time**: 3-4 hours  
**Risk**: Users lose all their saved profiles

```javascript
function readProfiles() {
  try {
    const raw = localStorage.getItem('wos-unified-profiles');
    if (!raw) return {};
    
    const data = JSON.parse(raw);
    if (!validateProfileStructure(data)) {
      throw new Error('Invalid structure');
    }
    return data;
  } catch (error) {
    // Backup corrupted data
    localStorage.setItem('wos-backup-corrupted', localStorage.getItem('wos-unified-profiles'));
    localStorage.removeItem('wos-unified-profiles');
    
    // Notify user
    showNotification('Your profiles were corrupted. A backup was saved.', 'warning');
    return {};
  }
}
```

---

## 🟠 HIGH PRIORITY - Next 2 Weeks

### 5. Incomplete Features
- [ ] **Pets Calculator** (2-3 weeks work remaining)
  - Add "Pets Data" sheet to Excel
  - Create `src/Scripts/pets-calculator.js`
  - Add pet icons and translations
  
- [ ] **Experts Calculator** (2-3 weeks work remaining)
  - Add "Experts Data" sheet to Excel
  - Create `src/Scripts/experts-calculator.js`
  - Add translations

**Status**: Currently placeholder pages only

---

### 6. Missing Profile Features
- [ ] **Profile Export to JSON** (3-4 days)
- [ ] **Profile Import from JSON** (2-3 days)
- [ ] **Bulk profile operations** (1-2 days)

**Impact**: Users can't backup or share profiles currently

---

### 7. Data Pipeline Issues
- [ ] **Column header detection in Excel extractors** (1-2 days)
  - Makes extraction robust to column rearrangement
  
- [ ] **Data validation after extraction** (1 day)
  - Verify all levels present, costs non-negative, monotonic

**Current Risk**: If Excel sheet structure changes, extraction silently breaks

---

## 🟡 MEDIUM PRIORITY - Next 4-6 Weeks

### 8. Performance
- [ ] **Build optimization script** (2-3 days)
  - Automated minification
  - Source maps generation
  - Cache busting (hash-based filenames)

- [ ] **Code splitting** (1 week)
  - Load calculator JS only on relevant pages
  - Expected 40% JS size reduction

- [ ] **CSV caching strategy** (1-2 days)
  - Proper Cache-Control headers
  - ETag support
  - Version management

---

### 9. Code Quality
- [ ] **Refactor Fire Crystals code** (2-3 days)
  - Consolidate 3 duplicate implementations
  - Single source of truth from CSV

- [ ] **Accessibility improvements** (2-3 days)
  - Focus trap in modals
  - ARIA labels on all regions
  - Keyboard navigation testing

- [ ] **Add console logging standardization** (1 day)
  - Use prefixed logging: `[Module] message`
  - Toggle DEBUG mode for production

---

### 10. Testing
- [ ] **Manual testing checklist** (already exists, keep updated)
- [ ] **Automated E2E tests** (3-4 weeks with Playwright)
- [ ] **Unit tests** (ongoing)

---

## 🟢 NICE-TO-HAVE - Backlog

### 11. Features
- [ ] **Advanced table filtering** (1-2 weeks)
  - Resource type filters
  - Text search
  - Range filters
  - CSV export

- [ ] **Web Workers for heavy calculations** (1-2 weeks)
- [ ] **Virtual scrolling for large tables** (3-4 weeks)

---

### 12. Infrastructure
- [ ] **TypeScript migration** (4-6 weeks)
- [ ] **Error monitoring** (Sentry integration) (2-3 days)
- [ ] **CI/CD pipeline** (GitHub Actions) (1-2 weeks)

---

## 📋 Quick Wins (1-2 days each)

1. **Standardize console logging**
   - Search for `console.warn`/`console.error`
   - Replace with prefixed log format `[ModuleName] message`

2. **Add JSDoc comments**
   - Document all public functions
   - Add `@param`, `@returns`, `@throws`

3. **Verify CSS lint passes**
   - Run `npm run lint`
   - Fix all warnings with `npm run lint:fix`

4. **Update README.md**
   - Mention Pets/Experts are coming soon
   - Add build instructions
   - Add troubleshooting section

5. **ARIA label audit**
   - Add aria-label to all major regions
   - Test with screen reader

---

## 📊 Effort Summary

| Priority | Category | Total Effort |
|----------|----------|--------------|
| 🔴 CRITICAL | Fire Crystals, CSV errors, Validation, localStorage | 1-1.5 weeks |
| 🟠 HIGH | Pets, Experts, Profile export, Data pipeline | 6-8 weeks |
| 🟡 MEDIUM | Performance, Code quality, Testing | 4-6 weeks |
| 🟢 NICE-TO-HAVE | Advanced features, Infra, TypeScript | Ongoing |

**Total Backlog**: ~15-25 weeks of work (1-2 developers)

---

## ✅ Quick Checklist

- [ ] Review `docs/CODE_REVIEW_COMPREHENSIVE.md` for full details
- [ ] Schedule team meeting to prioritize Pets/Experts work
- [ ] Assign owner for each critical item
- [ ] Create GitHub issues for all items above
- [ ] Update sprint planning

---

**Keep this file updated as items are completed!**

