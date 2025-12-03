# Bug Fixes Reference Guide

This document catalogs all bugs encountered during the pets calculator implementation and their solutions. Use this as a reference when similar issues arise.

---

## Table of Contents
1. [Layout & Responsive Issues](#layout--responsive-issues)
2. [Image & Icon Issues](#image--icon-issues)
3. [CSS Scoping & Override Issues](#css-scoping--override-issues)
4. [Service Worker & Caching Issues](#service-worker--caching-issues)
5. [Profile System Issues](#profile-system-issues)

---

## Layout & Responsive Issues

### Bug: Mobile Navigation Bar Appearing on Desktop
**Symptom**: Bottom navigation bar (`.bottom-nav`) visible on desktop screens where it should be hidden.

**Root Cause**: Missing CSS media query to hide `.bottom-nav` on large screens.

**Solution Applied**:
```css
/* Hide bottom-nav on desktop (>=64em / 1024px) */
@media (min-width: 64em) {
    .bottom-nav {
        display: none;
    }
}

/* Show on mobile */
@media (max-width: 48em) {
    .bottom-nav {
        display: flex;
    }
}
```

**Files Modified**: `src/style/style.css`

**Prevention**: Always add desktop-specific hide rules when implementing mobile-only navigation.

---

### Bug: FROM/TO Labels and Selectors Overflowing
**Symptom**: Pet slot FROM/TO labels and dropdown selectors overflow container, text wraps awkwardly.

**Root Cause**: No explicit sizing constraints on `.select-group` elements; font sizes too large for compact layout.

**Solution Applied**:
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

**Files Modified**: `src/style/style.css`

**Prevention**: Use compact font sizes (0.75rem labels, 0.9rem selects) and flexbox column layout for tight spaces.

---

### Bug: Inventory Not Displaying in Single Horizontal Line on Desktop
**Symptom**: Inventory items stack vertically instead of wrapping horizontally in a row.

**Root Causes**:
1. Used CSS Grid with `repeat(auto-fit, minmax(10rem, 1fr))` which forces wrapping to new rows
2. Nested `.inventory-row` wrapper with `grid-template-columns: 1fr auto` creating empty space
3. `.inventory-inputs` spanning both columns with problematic grid

**Solution Applied**:
```css
/* Changed from grid to flexbox */
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

/* Removed nested .inventory-row wrapper from HTML */
```

**HTML Change**: Removed `<div class="inventory-row">` wrapper, made inputs direct children of `.inventory-section`.

**Files Modified**: `src/style/style.css`, `src/pets.html`

**Prevention**: Use flexbox with `flex-wrap: wrap` for single-line-on-desktop, responsive wrapping behavior. Avoid nested grid wrappers.

---

### Bug: Results Not Displaying in Single Column
**Symptom**: Results display horizontally in a row instead of vertically stacked.

**Root Cause**: `.totals-summary` had `flex-direction: row` from global styles.

**Solution Applied**:
```css
.pets-page .totals-summary.vertical {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.pets-page .totals-summary.vertical .total-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--muted);
    border-radius: 0.5rem;
    border: 1px solid var(--border);
}
```

**JavaScript Change**: JavaScript already generates results correctly, just needed CSS class `.vertical`.

**Files Modified**: `src/style/style.css`

**Prevention**: Add page-specific override classes (`.pets-page .totals-summary`) with explicit `flex-direction: column`.

---

### Bug: Inventory/Profile Block Not Taking Enough Horizontal Space
**Symptom**: Inventory and profiles section too narrow, leaving unused space on right.

**Root Cause**: `.inventory-profiles-row` grid ratio `1.5fr 1fr` didn't allocate enough space.

**Solution Applied**:
```css
.pets-page .inventory-profiles-row {
    display: grid;
    grid-template-columns: 1.8fr 1fr;  /* Changed from 1.5fr 1fr */
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.5rem;
}
```

**Files Modified**: `src/style/style.css`

**Prevention**: Use `1.8fr 1fr` or `2fr 1fr` ratio for inventory-heavy layouts; test at different viewport widths.

---

### Bug: Background Not Stretching to Full Viewport Height
**Symptom**: Background image doesn't cover full page height, white/empty space at bottom.

**Root Cause**: No `min-height: 100vh` on body or page container.

**Solution Applied**:
```css
.pets-page {
    min-height: 100vh;
    background-attachment: fixed;
    background-size: cover;
}

.pets-page body {
    min-height: 100vh;
}
```

**Files Modified**: `src/style/style.css`

**Prevention**: Always set `min-height: 100vh` on page-level container classes and `background-size: cover` + `background-attachment: fixed` for full-page backgrounds.

---

### Bug: 5-Column Pets Grid Not Optimized for Space
**Symptom**: Pet slots too large with excessive padding/gaps, wasting horizontal space.

**Root Cause**: Default padding and font sizes too generous for 5-column layout.

**Solution Applied**:
```css
.pets-page .pets-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 0.75rem;  /* Reduced from 1rem */
    width: 100%;
}

.pets-page .pet-slot {
    background: var(--panel);
    padding: 0.75rem;  /* Reduced from 1rem */
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pets-page .pet-icon {
    width: 2rem;  /* Reduced from 2.5rem */
    height: 2rem;
    object-fit: contain;
}

.pets-page .pet-header h4 {
    font-size: 0.9rem;  /* Reduced from 1rem */
    margin: 0;
    line-height: 1.2;
}
```

**Files Modified**: `src/style/style.css`

**Prevention**: For 5-column layouts, use compact spacing (0.75rem gaps, 0.75rem padding, 2rem icons, 0.9rem font).

---

## Image & Icon Issues

### Bug: Pet Images Not Loading
**Symptom**: Pet icon images show broken image icons or don't display at all.

**Root Causes**:
1. HTML referenced `.png` files that didn't exist
2. `/assets/resources/pets/` directory was empty (only `README.md`)

**Solution Applied**:
1. Generated 15 placeholder SVG icons using PowerShell script
2. Updated HTML from `cave-hyena.png` → `cave-hyena.svg` (all 15 pets)
3. Created color-coded SVG placeholders for each pet

**Script Used**: `scripts/generate-pet-icons.ps1`

**Files Modified**: 
- `src/pets.html` (15 image src changes)
- Created 15 SVG files in `src/assets/resources/pets/`
- Created `ICONS_NEEDED.md` guide

**Prevention**: 
- Always verify asset existence before referencing in HTML
- Use `onerror="this.style.display='none'"` for graceful degradation
- Create placeholder assets (SVG) during development
- Document required assets in `ICONS_NEEDED.md` files

---

### Bug: Resource Images in Results Not Loading
**Symptom**: Food, Manual, Potion, Serum, SVS Points icons missing in results display.

**Root Causes**:
1. JavaScript referenced `.png` files in `pet-items/` folder that didn't exist
2. `/assets/resources/pet-items/` directory was empty

**Solution Applied**:
1. Created 4 placeholder SVG icons: food.svg, manual.svg, potion.svg, serum.svg
2. Created svs-points.svg in `/base/` folder
3. Updated JavaScript `urlMap` from `.png` → `.svg`:

```javascript
const urlMap = {
  'food-base': 'assets/resources/pet-items/food.svg',
  'manual-base': 'assets/resources/pet-items/manual.svg',
  'potion-base': 'assets/resources/pet-items/potion.svg',
  'serum-base': 'assets/resources/pet-items/serum.svg',
  'svs-points-base': 'assets/resources/base/svs-points.svg'
};
```

**Files Modified**: 
- `src/Scripts/pets-calculator.js`
- Created 4 SVG files in `src/assets/resources/pet-items/`
- Created 1 SVG file in `src/assets/resources/base/`

**Prevention**: 
- Check IconHelper fallback paths before deployment
- Create placeholder SVG assets early in development
- Use consistent naming: lowercase with hyphens

---

## CSS Scoping & Override Issues

### Bug: Global Media Queries Overriding Pets Page Layout
**Symptom**: Pets page responsive behavior broken because global `@media (max-width: 64em)` rules force 1-column layout.

**Root Cause**: Global CSS rules apply to all pages without scoping; pets page needs different breakpoints.

**Solution Applied**:
1. Added `.pets-page` class to `<body>` in `pets.html`
2. Prefixed ALL pets-specific CSS with `.pets-page`
3. Used `!important` on critical layout properties to override globals

```css
.pets-page .pets-grid {
    grid-template-columns: repeat(5, 1fr) !important;
}

.pets-page .inventory-profiles-row {
    grid-template-columns: 1.8fr 1fr !important;
}
```

**Files Modified**: `src/style/style.css`, `src/pets.html`

**Prevention**: 
- Always add page-specific class to `<body>`: `<body class="page-name">`
- Prefix all page-specific CSS with page class: `.page-name .component`
- Use `!important` sparingly but when needed for layout-critical overrides
- Define page-specific breakpoints independent of global ones

---

### Bug: Profiles Controls Not Visible
**Symptom**: Profiles section shows header but no controls (input, dropdown, buttons).

**Root Cause**: Missing explicit `display` properties for `.pets-page .profiles` and `.profiles-row`.

**Solution Applied**:
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

**Files Modified**: `src/style/style.css`

**Prevention**: Add explicit display rules for all major layout containers when scoping to page-specific classes.

---

## Service Worker & Caching Issues

### Bug: Hard Refresh Required for CSS Changes
**Symptom**: Users must hard refresh (Ctrl+F5) to see updated styles after CSS changes.

**Root Cause**: Service worker caches old CSS files; no auto-update mechanism.

**Solution Applied**:
1. Implemented SKIP_WAITING pattern in service-worker.js
2. Added controllerchange listener in sw-register.js to auto-reload
3. Bump CACHE_VERSION on every change (v11→v12→v13...→v17)

**Implementation**:
```javascript
// service-worker.js
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// sw-register.js
navigator.serviceWorker.addEventListener('controllerchange', () => {
  console.log('[SW] Controller changed, reloading...');
  window.location.reload();
});
```

**Files Modified**: `src/Scripts/service-worker.js`, `src/Scripts/sw-register.js`

**Version History**: v11 → v12 → v13 → v14 → v15 → v16 → v17

**Prevention**: 
- Always bump CACHE_VERSION when editing cached files
- Use SKIP_WAITING pattern for seamless updates
- Test updates by checking service worker version in DevTools → Application → Service Workers

---

## Profile System Issues

### Bug: Profiles Missing 2-Input Structure
**Symptom**: Profiles section doesn't match charms/chief-gear page structure with save button + rename button.

**Root Cause**: HTML structure was correct but may have been misunderstood in screenshots.

**Verified Structure** (already correct):
```html
<section class="profiles card">
  <h3>Profiles</h3>
  <div class="profiles-row">
    <div class="input-with-icon">
      <input id="profile-name" type="text" placeholder="New profile name">
      <button id="profile-save" class="icon-button">
        <img src="assets/icons/save.svg" alt="Save">
      </button>
    </div>
    <div class="select-with-icon">
      <select id="profiles-list"></select>
      <button id="profile-rename" class="icon-button">
        <img src="assets/icons/edit.svg" alt="Rename">
      </button>
    </div>
    <button id="profile-delete" class="danger">Delete</button>
  </div>
</section>
```

**Status**: Structure was already correct; may need CSS visibility fixes (see Profiles Controls Not Visible above).

**Files Checked**: `src/pets.html`, `src/charms.html`

**Prevention**: Cross-reference HTML structure with working pages (charms, chiefGear) before assuming structure is wrong.

---

## Quick Reference: Common Fixes

### When Mobile Nav Shows on Desktop
```css
@media (min-width: 64em) {
    .bottom-nav { display: none; }
}
```

### When Labels/Selects Overflow
```css
.select-group label { font-size: 0.75rem; white-space: nowrap; }
.select-group select { width: 100%; font-size: 0.9rem; }
```

### When Inventory Won't Display Horizontally
```css
.inventory-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
}
.inventory-item {
    flex: 1 1 auto;
    min-width: 140px;
    max-width: 180px;
}
```

### When Images Don't Load
1. Check file exists: `Test-Path "path/to/image.png"`
2. Create placeholder SVG if missing
3. Update HTML/JS to reference correct extension
4. Add `onerror="this.style.display='none'"` to `<img>` tags

### When Background Doesn't Cover Page
```css
.page-class {
    min-height: 100vh;
    background-size: cover;
    background-attachment: fixed;
}
```

### When Service Worker Won't Update
1. Bump `CACHE_VERSION` in `service-worker.js`
2. Verify SKIP_WAITING implemented
3. Clear cache: DevTools → Application → Storage → Clear site data
4. Check version: DevTools → Application → Service Workers

---

## Debugging Checklist

When encountering layout issues:
- [ ] Check browser DevTools Console for errors
- [ ] Inspect element to see computed styles
- [ ] Verify page-specific class exists on `<body>`
- [ ] Check for global CSS overrides
- [ ] Test at multiple viewport widths (mobile, tablet, desktop)
- [ ] Verify all required assets exist
- [ ] Check service worker cache version

When CSS changes don't apply:
- [ ] Bump service worker CACHE_VERSION
- [ ] Hard refresh (Ctrl+F5) once
- [ ] Check `style.min.css` was regenerated
- [ ] Verify CSS syntax is valid (no trailing commas)
- [ ] Check for CSS specificity conflicts

When JavaScript features break:
- [ ] Check Console for errors
- [ ] Verify script load order in HTML
- [ ] Check if module is IIFE and returns public API
- [ ] Verify `window.ModuleName` is defined
- [ ] Check for undefined references to other modules

---

## Tools & Scripts Created

### CSS Minification
```powershell
cd "d:\CODE\Projet\Wos calculator\src\style"
npx csso style.css -o style.min.css
```

### Generate Pet Icons
```powershell
powershell -ExecutionPolicy Bypass -File "d:\CODE\Projet\Wos calculator\scripts\generate-pet-icons.ps1"
```

### Apply Layout Fixes
```powershell
powershell -ExecutionPolicy Bypass -File "d:\CODE\Projet\Wos calculator\scripts\fix-pets-layout.ps1"
```

### Start Dev Server
```powershell
cd "d:\CODE\Projet\Wos calculator\src"
python -m http.server 8080
```

---

## Related Documentation
- [Project Structure](PROJECT_STRUCTURE.md)
- [Maintenance Guide](MAINTENANCE.md)
- [Technical Architecture](TECHNICAL_ARCHITECTURE.md)
- [Pets Calculator Implementation](PETS_CALCULATOR_IMPLEMENTATION.md)
