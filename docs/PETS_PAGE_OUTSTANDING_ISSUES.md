# Pets Page Outstanding Issues - December 3, 2025

## Current Status
After multiple iterations, the following issues remain unresolved despite CSS/HTML fixes applied.

---

## Issues Still Present (Per Latest Screenshots)

### 1. Mobile Navigation Bar Appearing on Desktop ❌
**Status**: NOT FIXED  
**Symptom**: Bottom navigation bar visible at bottom of page on desktop view  
**Expected**: Hidden on screens ≥1024px (64em)  
**CSS Applied**: 
```css
@media (min-width: 64em) {
    .bottom-nav { display: none; }
}
```
**Verification Needed**: Check if `.bottom-nav` CSS is being overridden or if class name mismatch exists

---

### 2. FROM/TO Labels and Selectors Overflowing ❌
**Status**: NOT FIXED  
**Symptom**: FROM/TO labels appear cramped, selectors may be overflowing pet slot containers  
**Expected**: Compact labels (0.75rem) with proper spacing, selectors at 100% width  
**CSS Applied**:
```css
.pets-page .pet-slot .select-group label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    white-space: nowrap;
}
.pets-page .pet-slot .select-group select {
    width: 100%;
    font-size: 0.9rem;
}
```
**Verification Needed**: Inspect actual rendered font sizes and container widths in DevTools

---

### 3. Pet Images Not Loading ❌
**Status**: NOT FIXED  
**Symptom**: Pet icon images not displaying in pet slot headers  
**Expected**: SVG placeholder icons visible  
**Actions Taken**:
- Generated 15 SVG placeholders in `assets/resources/pets/`
- Updated HTML from `.png` → `.svg` for all 15 pets
- Added `onerror="this.style.display='none'"` to all img tags

**Files Created**:
- cave-hyena.svg
- arctic-wolf.svg
- musk-ox.svg
- giant-tapir.svg
- titan-roc.svg
- giant-elk.svg
- snow-leopard.svg
- cave-lion.svg
- snow-ape.svg
- iron-rhino.svg
- sabertooth-tiger.svg
- mammoth.svg
- frost-gorilla.svg
- frostscale-chameleon.svg
- abyssal-shelldragon.svg

**Verification Needed**: 
- Check if service worker v17 has cached the new SVGs
- Verify paths in HTML: `src="assets/resources/pets/cave-hyena.svg"`
- Check if SVG files are actually served by HTTP server
- Inspect Network tab for 404 errors

---

### 4. Resource Images in Results Not Loading ❌
**Status**: NOT FIXED  
**Symptom**: Food, Manual, Potion, Serum, SVS Points icons not showing in results section  
**Expected**: SVG icons visible next to resource labels  
**Actions Taken**:
- Created 4 SVG files: food.svg, manual.svg, potion.svg, serum.svg
- Created svs-points.svg in base folder
- Updated JavaScript urlMap to use `.svg` paths

**JavaScript Code**:
```javascript
const urlMap = {
  'food-base': 'assets/resources/pet-items/food.svg',
  'manual-base': 'assets/resources/pet-items/manual.svg',
  'potion-base': 'assets/resources/pet-items/potion.svg',
  'serum-base': 'assets/resources/pet-items/serum.svg',
  'svs-points-base': 'assets/resources/base/svs-points.svg'
};
```

**Verification Needed**:
- Check if IconHelper is being used or fallback code path
- Verify calculateAll() is rendering images correctly
- Check Network tab for SVG 404s
- Confirm service worker v17 caching these files

---

### 5. Results Not in Single Column ❌
**Status**: NOT FIXED (or partially working)  
**Symptom**: Results may still be displaying horizontally instead of vertically stacked  
**Expected**: Each resource (Food, Manual, Potion, Serum, SVS Points) on separate line  
**CSS Applied**:
```css
.pets-page .totals-summary.vertical {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}
```

**Note**: JavaScript generates `.totals-summary` but may not be adding `.vertical` class. Need to verify.

**Verification Needed**: 
- Check if JavaScript adds `.vertical` class to results div
- Verify CSS selector specificity (should be `.pets-page .totals-summary`)
- Inspect DevTools to see computed flex-direction

---

### 6. Profiles Missing Controls/Buttons ❌
**Status**: NOT FIXED  
**Symptom**: Profiles section shows "Profiles" header but no input/dropdown/buttons visible  
**Expected**: 3 controls visible:
1. Input + Save button (input-with-icon)
2. Dropdown + Rename button (select-with-icon)  
3. Delete button

**HTML Structure** (already correct):
```html
<section class="profiles card">
  <h3>Profiles</h3>
  <div class="profiles-row">
    <div class="input-with-icon">
      <input id="profile-name" type="text">
      <button id="profile-save" class="icon-button">
        <img src="assets/icons/save.svg">
      </button>
    </div>
    <div class="select-with-icon">
      <select id="profiles-list"></select>
      <button id="profile-rename" class="icon-button">
        <img src="assets/icons/edit.svg">
      </button>
    </div>
    <button id="profile-delete" class="danger">Delete</button>
  </div>
</section>
```

**CSS Applied**:
```css
.pets-page .profiles {
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: 0.75em;
}
.pets-page .profiles-row {
    display: flex;
    gap: 0.625em;
    align-items: center;
    flex-wrap: wrap;
    flex: 1;
}
```

**Verification Needed**:
- Check if `.pets-page .profiles` CSS is being applied
- Verify profiles section isn't being hidden by z-index or positioning issues
- Check if `assets/icons/save.svg` and `edit.svg` exist
- Inspect DevTools for `display: none` or `visibility: hidden` overrides

---

### 7. Inventory Not in Single Horizontal Line on Desktop ⚠️
**Status**: PARTIALLY ADDRESSED (needs verification)  
**Symptom**: Inventory items may still be stacking vertically  
**Expected**: All 5 items (Food, Manual, Potion, Serum, SVS Points) in one row on desktop, wrapping responsively  
**CSS Applied**:
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

**HTML Changed**: Removed `.inventory-row` wrapper div

**Verification Needed**:
- Check if HTML changes were saved/deployed
- Verify flexbox properties are applying
- Test at various viewport widths (1200px, 1400px, 1600px)

---

### 8. Background Not Stretching to Full Viewport ⚠️
**Status**: SHOULD BE FIXED (needs verification)  
**CSS Applied**:
```css
.pets-page {
    min-height: 100vh;
    background-attachment: fixed;
    background-size: cover;
}
```

**Verification Needed**: Check if `<body>` has `.pets-page` class applied

---

### 9. Inventory/Profile Block Not Taking Enough Space ⚠️
**Status**: ADJUSTED (needs verification)  
**CSS Applied**:
```css
.pets-page .inventory-profiles-row {
    grid-template-columns: 1.8fr 1fr;  /* Was 1.5fr 1fr */
    gap: 1rem;
}
```

**Verification Needed**: Test at desktop widths to confirm improved ratio

---

### 10. Pet Grid Spacing Not Optimized ⚠️
**Status**: ADJUSTED (needs verification)  
**CSS Applied**:
```css
.pets-page .pets-grid {
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 0.75rem;
}
.pets-page .pet-slot {
    padding: 0.75rem;
}
.pets-page .pet-icon {
    width: 2rem;
    height: 2rem;
}
```

**Verification Needed**: Check if spacing feels balanced at desktop width

---

## Root Cause Analysis

### Possible Service Worker Cache Issue
**Hypothesis**: Service worker v17 may not have activated yet, causing browser to serve cached v16 or earlier files.

**Evidence**:
- Multiple CSS changes made but screenshots show no visual changes
- Image path updates (PNG→SVG) not reflected

**Action Required**:
1. Hard refresh (Ctrl+Shift+R) to bypass service worker
2. Check DevTools → Application → Service Workers → verify v17 is active
3. If v16 still active, manually unregister and reload
4. Clear site data: DevTools → Application → Storage → Clear site data

---

### Possible CSS Not Being Applied
**Hypothesis**: `.pets-page` class not on `<body>`, causing all scoped CSS to fail.

**Evidence**:
- All pets-specific CSS is prefixed with `.pets-page`
- If class missing, none of the fixes would apply

**Action Required**:
1. Inspect `<body>` element in DevTools
2. Verify `class="pets-page"` attribute exists
3. If missing, check if HTML changes were saved

---

### Possible Minified CSS Not Regenerated
**Hypothesis**: `style.min.css` wasn't regenerated after CSS changes, and HTML loads minified version.

**Evidence**:
- Multiple `npx csso` commands executed
- No errors reported

**Action Required**:
1. Check `pets.html` → verify which CSS file is loaded: `style.css` or `style.min.css`
2. If loading `.min.css`, compare file sizes/timestamps of `style.css` vs `style.min.css`
3. Manually regenerate: `cd src/style; npx csso style.css -o style.min.css`

---

### Possible Path Issues
**Hypothesis**: SVG paths may be incorrect relative to HTML file location.

**Evidence**:
- HTML at `/src/pets.html`
- Assets at `/src/assets/resources/pets/*.svg`
- Paths use `assets/resources/...` (relative)

**Action Required**:
1. Verify directory structure matches expectations
2. Test absolute paths vs relative paths
3. Check if server is serving files from `/src/` root

---

## Debugging Steps for Next Session

### Step 1: Verify Service Worker
```javascript
// Run in browser console
navigator.serviceWorker.getRegistrations().then(regs => {
  regs.forEach(reg => console.log('SW version:', reg.active?.scriptURL));
});
```

Expected: Should show `service-worker.js` with v17 in code

### Step 2: Check CSS Loading
```javascript
// Run in browser console
Array.from(document.styleSheets).forEach(sheet => {
  console.log(sheet.href || 'inline styles');
});
```

Expected: Should see `style.min.css` or `style.css` loading

### Step 3: Verify Body Class
```javascript
// Run in browser console
console.log(document.body.className);
```

Expected: Should include `pets-page`

### Step 4: Check Image Paths
```javascript
// Run in browser console
Array.from(document.querySelectorAll('img')).forEach(img => {
  console.log(img.src, img.complete, img.naturalWidth);
});
```

Expected: All SVG paths should resolve, naturalWidth > 0

### Step 5: Verify Profiles HTML
```javascript
// Run in browser console
console.log(document.querySelector('.profiles-row')?.innerHTML);
```

Expected: Should show input, select, and buttons

---

## Files Modified This Session
- `src/style/style.css` - Added 200+ lines of pets-specific CSS
- `src/pets.html` - Updated icon paths PNG→SVG, removed .inventory-row wrapper
- `src/Scripts/pets-calculator.js` - Updated urlMap for SVG resources
- `src/service-worker.js` - Bumped to v17
- `src/style/style.min.css` - Regenerated multiple times
- Created 15 SVG pet icons
- Created 4 SVG resource icons
- Created 1 SVG SVS Points icon

---

## Recommended Next Steps (In Order)

1. **Clear All Caches**
   ```javascript
   // In DevTools Console
   caches.keys().then(names => {
     names.forEach(name => caches.delete(name));
   });
   location.reload(true);
   ```

2. **Verify HTML Changes Saved**
   - Check `pets.html` has `<body class="pets-page">`
   - Check all `<img>` tags use `.svg` extension
   - Check `.inventory-row` div is removed

3. **Regenerate Minified CSS Fresh**
   ```powershell
   cd "d:\CODE\Projet\Wos calculator\src\style"
   Remove-Item style.min.css
   npx csso style.css -o style.min.css
   ```

4. **Bump Service Worker Again**
   - Change v17 → v18 in `service-worker.js`
   - Hard refresh page

5. **Test Image Paths Manually**
   ```powershell
   # Verify files exist
   Test-Path "d:\CODE\Projet\Wos calculator\src\assets\resources\pets\cave-hyena.svg"
   Test-Path "d:\CODE\Projet\Wos calculator\src\assets\resources\pet-items\food.svg"
   ```

6. **Consider Direct CSS (No Minification)**
   - Temporarily change `pets.html` to load `style.css` instead of `style.min.css`
   - This eliminates minification as a potential issue

7. **Check for JavaScript Errors**
   - Open DevTools Console
   - Look for errors when page loads
   - Verify `PetsCalculatorModule` is defined: `console.log(window.PetsCalculatorModule)`

---

## Success Criteria

When all issues are resolved, the page should display:

✅ No mobile nav bar visible on desktop  
✅ FROM/TO labels compact (0.75rem) with no overflow  
✅ Pet icons visible in all 15 pet slot headers  
✅ Resource icons visible in results (5 items)  
✅ Results stacked vertically (1 item per line)  
✅ Profiles section showing input + save, dropdown + rename, delete button  
✅ Inventory: 5 items in single horizontal line on desktop  
✅ Background covering full viewport height  
✅ Inventory/profile block using ~1.8:1 ratio  
✅ Pet grid: 5 columns with compact spacing  

---

## Related Documentation
- [Bug Fixes Reference](BUG_FIXES_REFERENCE.md) - Solutions to similar issues
- [Maintenance Guide](MAINTENANCE.md) - How to modify colors, costs, features
- [Project Structure](PROJECT_STRUCTURE.md) - File organization
