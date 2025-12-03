# TODO: Pets Page Fixes - Next Session

**Created**: December 3, 2025  
**Status**: NO CODE CHANGES MADE - Ready for implementation

---

## Overview
This document lists all required fixes for the pets calculator page based on user requirements and screenshot analysis. All fixes have been attempted previously but did not take effect, likely due to caching/service worker issues.

---

## Required Fixes (Priority Order)

### 🔴 Critical: Service Worker & Caching

**Issue**: Changes not appearing despite multiple CSS/HTML edits  
**Root Cause**: Service worker cache may be serving old files

**Actions Required**:
1. Manually clear all caches before testing:
   ```javascript
   // Run in DevTools Console
   caches.keys().then(names => names.forEach(name => caches.delete(name)));
   ```

2. Unregister service worker:
   ```javascript
   // Run in DevTools Console
   navigator.serviceWorker.getRegistrations().then(regs => 
     regs.forEach(reg => reg.unregister())
   );
   ```

3. Hard refresh page (Ctrl+Shift+R)

4. Verify current version:
   ```javascript
   // Check what's actually cached
   caches.open('v17').then(cache => cache.keys().then(keys => 
     console.log(keys.map(k => k.url))
   ));
   ```

**Alternative**: Temporarily disable service worker during development by commenting out `sw-register.js` script tag in `pets.html`.

---

### 🔴 Critical: Verify HTML Changes Persisted

**Issue**: Multiple HTML edits made - need to confirm they saved correctly

**Actions Required**:
1. Open `src/pets.html` and verify:
   - Line ~21: `<body class="pets-page">` exists
   - All 15 pet images use `.svg` extension (not `.png`)
   - No `<div class="inventory-row">` wrapper exists (should be removed)
   - Profiles section has complete HTML structure with buttons

2. If changes missing, reapply from `docs/PETS_PAGE_OUTSTANDING_ISSUES.md`

---

### 🔴 Critical: Verify CSS Loading

**Issue**: Not clear if `style.css` or `style.min.css` is being loaded

**Actions Required**:
1. Check `pets.html` line ~9 for stylesheet link
2. If loading `.min.css`, verify it was regenerated:
   ```powershell
   cd "d:\CODE\Projet\Wos calculator\src\style"
   Get-Item style.css, style.min.css | Select-Object Name, Length, LastWriteTime
   ```
3. If timestamps don't match, regenerate:
   ```powershell
   npx csso style.css -o style.min.css
   ```

**Alternative**: Temporarily switch to loading `style.css` directly (unminified) to rule out minification issues.

---

### 1. Hide Mobile Navigation Bar on Desktop

**Current Status**: Bottom nav visible on desktop  
**Expected**: Hidden at ≥1024px (64em)

**CSS to Verify**:
```css
.bottom-nav {
    display: flex;
    /* ... other properties ... */
}

@media (min-width: 64em) {
    .bottom-nav {
        display: none !important;
    }
}
```

**Location**: `src/style/style.css` (should be near end of file, around line 3670)

**Test**:
- Resize browser to ≥1024px width
- Bottom nav should disappear
- Check DevTools → Elements → inspect `.bottom-nav` → verify `display: none` computed style

---

### 2. Fix FROM/TO Labels and Selectors Overflow

**Current Status**: Labels/selects appear cramped or overflowing  
**Expected**: Compact, readable labels with properly sized selects

**CSS to Verify**:
```css
.pets-page .pet-slot .level-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.pets-page .pet-slot .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.pets-page .pet-slot .select-group label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--muted-text);
    white-space: nowrap;
}

.pets-page .pet-slot .select-group select {
    width: 100%;
    font-size: 0.9rem;
}
```

**Location**: `src/style/style.css` (around line 3740-3760)

**Test**:
- Inspect any pet slot (e.g., Cave Hyena)
- FROM/TO labels should be 0.75rem, uppercase
- Selects should fill container width
- No horizontal scrolling within pet slot

---

### 3. Fix Pet Images Not Loading

**Current Status**: Pet icons not displaying  
**Expected**: SVG placeholder icons visible in all 15 pet headers

**Actions Required**:

A. Verify SVG files exist:
```powershell
Get-ChildItem "d:\CODE\Projet\Wos calculator\src\assets\resources\pets" -Filter "*.svg" | Select-Object Name
```
Should show 15 SVG files.

B. Verify HTML has correct paths:
```html
<!-- Example for Cave Hyena -->
<img class="pet-icon building-icon" 
     src="assets/resources/pets/cave-hyena.svg" 
     alt="Cave Hyena" 
     onerror="this.style.display='none'">
```

C. Test image paths manually:
- Start dev server: `python -m http.server 8080` from `src/` directory
- Navigate to `http://127.0.0.1:8080/assets/resources/pets/cave-hyena.svg`
- Should display SVG icon

D. Check Network tab in DevTools:
- Reload page with Network tab open
- Filter by "svg"
- Verify no 404 errors for pet images

**If images still don't load**: Check if HTTP server is serving from correct root directory.

---

### 4. Fix Resource Images in Results Not Loading

**Current Status**: Food, Manual, Potion, Serum, SVS Points icons not showing  
**Expected**: SVG icons visible next to resource labels in results

**Actions Required**:

A. Verify SVG files exist:
```powershell
Get-ChildItem "d:\CODE\Projet\Wos calculator\src\assets\resources\pet-items" -Filter "*.svg"
Get-ChildItem "d:\CODE\Projet\Wos calculator\src\assets\resources\base" -Filter "*svs*.svg"
```

B. Verify JavaScript has correct paths in `pets-calculator.js`:
```javascript
const urlMap = {
  'food-base': 'assets/resources/pet-items/food.svg',
  'manual-base': 'assets/resources/pet-items/manual.svg',
  'potion-base': 'assets/resources/pet-items/potion.svg',
  'serum-base': 'assets/resources/pet-items/serum.svg',
  'svs-points-base': 'assets/resources/base/svs-points.svg'
};
```
Location: Around line 288

C. Check if IconHelper is being used:
```javascript
// In browser console
console.log(window.IconHelper);
console.log(typeof window.IconHelper?.label);
```

D. Verify `calculateAll()` is being called:
```javascript
// In browser console
window.PetsCalculatorModule?.calculateAll();
```

**Test**: Change any pet FROM/TO levels and verify results update with icons.

---

### 5. Make Results Display in Single Column

**Current Status**: Results may be horizontal  
**Expected**: Each resource on separate line, vertically stacked

**CSS to Verify**:
```css
.pets-page .totals-summary {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.pets-page .totals-summary .total-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--muted);
    border-radius: 0.5rem;
    border: 1px solid var(--border);
}
```

**Location**: `src/style/style.css` (around line 3710-3730)

**Note**: Check if JavaScript adds `.vertical` class to `.totals-summary`. If not, remove `.vertical` from CSS selector.

**Test**:
- Set any pet FROM/TO levels
- Results should stack vertically
- Each item should be on its own line

---

### 6. Fix Profiles Controls Not Visible

**Current Status**: Only "Profiles" header visible, no controls  
**Expected**: 3 controls visible - input+save, dropdown+rename, delete button

**Actions Required**:

A. Verify HTML structure in `pets.html` (around line 86-101):
```html
<section class="profiles card" aria-label="Pet profiles" role="region">
  <h3 data-i18n="profiles-header">Profiles</h3>
  <div class="profiles-row">
    <div class="input-with-icon">
      <input id="profile-name" type="text" placeholder="New profile name">
      <button id="profile-save" type="button" class="icon-button">
        <img src="assets/icons/save.svg" alt="Save">
      </button>
    </div>
    <div class="select-with-icon">
      <select id="profiles-list" class="profiles-list"></select>
      <button id="profile-rename" type="button" class="icon-button">
        <img src="assets/icons/edit.svg" alt="Rename">
      </button>
    </div>
    <button id="profile-delete" type="button" class="danger">
      <span data-i18n="delete">Delete</span>
    </button>
  </div>
</section>
```

B. Verify CSS:
```css
.pets-page .profiles {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75em;
    background: var(--card);
    border: 0.0625em solid var(--border);
    border-radius: 0.5em;
    padding: 0.375em 0.5em;
}

.pets-page .profiles-row {
    display: flex;
    gap: 0.625em;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
    justify-content: center;
}
```

C. Check if icon files exist:
```powershell
Test-Path "d:\CODE\Projet\Wos calculator\src\assets\icons\save.svg"
Test-Path "d:\CODE\Projet\Wos calculator\src\assets\icons\edit.svg"
```

D. Inspect in DevTools:
```javascript
// Check if profiles section exists and is visible
const profiles = document.querySelector('.profiles-row');
console.log(profiles);
console.log(getComputedStyle(profiles).display);
console.log(profiles.innerHTML);
```

**Test**: Should see input field, save button, dropdown, rename button, delete button all in one row.

---

### 7. Make Inventory Single Horizontal Line on Desktop

**Current Status**: Items may be stacking vertically  
**Expected**: All 5 inputs in one row on desktop, wrapping on smaller screens

**Actions Required**:

A. Verify `.inventory-row` wrapper was removed from HTML:
```html
<!-- WRONG (old structure): -->
<div class="inventory-row">
  <h3>Pet Resources Inventory</h3>
  <div class="inventory-inputs">...</div>
</div>

<!-- CORRECT (new structure): -->
<h3>Pet Resources Inventory</h3>
<div class="inventory-inputs">...</div>
```

B. Verify CSS:
```css
.pets-page .inventory-section .inventory-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
}

.pets-page .inventory-section .inventory-item {
    flex: 1 1 auto;
    min-width: 140px;
    max-width: 180px;
}
```

**Location**: `src/style/style.css` (around line 3680-3700)

**Test**:
- At ≥1200px viewport width, all 5 inputs should be in one row
- At 800px width, should wrap to 2-3 rows
- At 480px width, should stack to 1 column

---

### 8. Stretch Background to Full Viewport Height

**Expected**: Background image covers entire page without white space at bottom

**CSS to Verify**:
```css
.pets-page {
    min-height: 100vh;
    background-attachment: fixed;
    background-size: cover;
}
```

**Location**: `src/style/style.css` (around line 3660)

**Test**: Scroll to bottom of page - background should cover entire height.

---

### 9. Give Inventory/Profile Block More Horizontal Space

**Expected**: Inventory section wider, profiles section narrower (1.8:1 ratio)

**CSS to Verify**:
```css
.pets-page .inventory-profiles-row {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.5rem;
}
```

**Location**: `src/style/style.css` (around line 3675)

**Test**: Inventory should take ~64% of width, profiles ~36%.

---

### 10. Optimize 5-Column Pets Grid for Space

**Expected**: Pet slots compact with minimal padding, 5 columns visible at desktop width

**CSS to Verify**:
```css
.pets-page .pets-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 0.75rem;
    width: 100%;
}

.pets-page .pet-slot {
    background: var(--panel);
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
}

.pets-page .pet-icon {
    width: 2rem;
    height: 2rem;
}

.pets-page .pet-header h4 {
    font-size: 0.9rem;
}
```

**Location**: `src/style/style.css` (around line 3765-3795)

**Test**: At ≥1400px viewport width, all 5 columns should be clearly visible with comfortable spacing.

---

## Verification Checklist

Before starting fixes, run this checklist:

```powershell
# 1. Check if body has pets-page class
$html = Get-Content "d:\CODE\Projet\Wos calculator\src\pets.html" -Raw
$html -match '<body class="pets-page">'  # Should return True

# 2. Check if inventory-row was removed
$html -match '<div class="inventory-row">'  # Should return False

# 3. Check if images are SVG
$html -match 'cave-hyena\.svg'  # Should return True
$html -match 'cave-hyena\.png'  # Should return False

# 4. Verify CSS files exist and recent
Get-Item "d:\CODE\Projet\Wos calculator\src\style\style.css", 
         "d:\CODE\Projet\Wos calculator\src\style\style.min.css" | 
    Select-Object Name, Length, LastWriteTime

# 5. Check service worker version
$sw = Get-Content "d:\CODE\Projet\Wos calculator\src\service-worker.js" -Raw
$sw -match "CACHE_VERSION = 'v(\d+)'"  # Should show v17 or higher
```

---

## Testing Protocol

### Desktop Testing (≥1400px width)
1. Mobile nav hidden ✓
2. Inventory: 5 items in one row ✓
3. Profiles: input+save, dropdown+rename, delete visible ✓
4. Pets grid: 5 columns clearly visible ✓
5. Results: 5 items stacked vertically ✓
6. All images loading (15 pets + 5 resources) ✓
7. Background covers full page ✓

### Tablet Testing (768-1024px)
1. Mobile nav hidden ✓
2. Inventory wraps to 2-3 rows ✓
3. Profiles still visible ✓
4. Pets grid: 3 columns ✓

### Mobile Testing (<768px)
1. Mobile nav visible ✓
2. Inventory stacks to 1 column ✓
3. Profiles below inventory ✓
4. Pets grid: 1 column ✓

---

## If All Else Fails: Nuclear Option

If issues persist after all verification steps:

1. **Disable Service Worker Temporarily**:
   ```html
   <!-- In pets.html, comment out: -->
   <!-- <script src="Scripts/sw-register.js" defer></script> -->
   ```

2. **Load Unminified CSS**:
   ```html
   <!-- Change from: -->
   <link rel="stylesheet" href="style/style.min.css">
   <!-- To: -->
   <link rel="stylesheet" href="style/style.css">
   ```

3. **Add Cache Busting**:
   ```html
   <link rel="stylesheet" href="style/style.css?v=2">
   ```

4. **Test in Incognito/Private Mode**: Bypasses all caching

5. **Use Different Browser**: Rule out browser-specific issues

---

## Success Criteria

✅ No mobile nav on desktop  
✅ FROM/TO compact and contained  
✅ 15 pet icons visible  
✅ 5 resource icons in results  
✅ Results: vertical stack  
✅ Profiles: 3 controls visible  
✅ Inventory: horizontal line on desktop  
✅ Background: full viewport  
✅ Inventory/profiles: 1.8:1 ratio  
✅ Pets grid: 5 compact columns  

---

## Related Documentation
- [Outstanding Issues](PETS_PAGE_OUTSTANDING_ISSUES.md) - Current problem analysis
- [Bug Fixes Reference](BUG_FIXES_REFERENCE.md) - Solutions to similar issues
- [Maintenance Guide](MAINTENANCE.md) - How to safely modify the project

---

**Next Session**: Start with service worker clear and verification checklist, then work through fixes 1-10 in order.
