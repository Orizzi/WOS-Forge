# Responsive Layout Pattern - Label/Select Overlapping Fix

## Problem Statement
At smaller viewport sizes (~1200px and below), horizontal layouts with `align-items: center` cause labels and select values to overlap when content has minimum widths. This creates readability issues where "Start" and "Finish" labels overlap with select dropdown values like "F" and "F30".

## Solution: Vertical Layout with Responsive Sizing

### CSS Pattern
Use vertical flex layout (`flex-direction: column`) or grid with proper gap spacing and minimum heights to ensure labels and inputs never overlap:

```css
/* Container with vertical layout */
.container {
  display: flex; /* or grid with 2 columns for FROM/TO pairs */
  flex-direction: column;
  gap: clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem);
  min-height: clamp(4.5rem, 3.5rem + 2vw, 6rem);
}

/* Grid variant for label+select pairs */
.gear-item-row,
.charm-inputs {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem);
  min-height: clamp(4.5rem, 3.5rem + 2vw, 6rem);
}

/* Nested divs for each label+select pair */
.gear-item-row > div,
.charm-inputs > div {
  display: flex;
  flex-direction: column;
  gap: clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem);
  background: var(--panel);
  border: 0.0625rem solid var(--border);
  border-radius: clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem);
  padding: clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem);
}

/* Labels: centered, non-shrinking */
.gear-item-row label,
.charm-inputs label {
  text-align: center;
  padding-bottom: clamp(0.25rem, 0.125rem + 0.5vw, 0.5rem);
  flex-shrink: 0;
  font-weight: 500;
}

/* Selects: responsive width */
.gear-item-row select,
.charm-inputs select {
  min-width: clamp(8rem, 7rem + 2vw, 12rem);
  width: 100%;
}
```

### HTML Structure Pattern

**Required nested div structure:**

```html
<!-- Container with class that uses the CSS pattern -->
<div class="gear-item-row">
  
  <!-- First label+select pair wrapped in div -->
  <div>
    <label data-i18n="from" for="item-start">FROM:</label>
    <select id="item-start" name="item">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  
  <!-- Second label+select pair wrapped in div -->
  <div>
    <label data-i18n="to" for="item-finish">TO:</label>
    <select id="item-finish" name="item">
      <option value="1">Option 1</option>
      <option value="2">Option 2</option>
    </select>
  </div>
  
</div>
```

**IMPORTANT:** Each label+select pair MUST be wrapped in its own `<div>` to become a grid item with vertical layout.

## Applied to Existing Pages

### Chief Gear (`chiefGear.html`)
**Class:** `.gear-item-row`  
**Instances:** 6 (Helmet, Chestplate, Ring, Watch, Pants, Staff)  
**Structure:** Each has 2 label+select pairs (FROM/TO) wrapped in divs

```html
<div class="gear-item-row">
  <div>
    <label data-i18n="from" for="helmet-start">FROM:</label>
    <select id="helmet-start" name="helmet">...</select>
  </div>
  <div>
    <label data-i18n="to" for="helmet-finish">TO:</label>
    <select id="helmet-finish" name="helmet">...</select>
  </div>
</div>
```

### Charms (`charms.html`)
**Class:** `.charm-inputs`  
**Instances:** 18 (6 charm types × 3 charms each)  
**Structure:** Same 2-div pattern for FROM/TO pairs

```html
<div class="charm-inputs">
  <div>
    <label data-i18n="from" for="hat-charm-1-start">FROM:</label>
    <select id="hat-charm-1-start" name="hat-charm-1">...</select>
  </div>
  <div>
    <label data-i18n="to" for="hat-charm-1-finish">TO:</label>
    <select id="hat-charm-1-finish" name="hat-charm-1">...</select>
  </div>
</div>
```

### Fire Crystals (`fireCrystals.html`)
**Class:** `.select-group`  
**Instances:** 8 (one per building type)  
**Structure:** Already had proper div containers - only CSS needed updating

```html
<div class="select-group">
  <div>
    <label data-i18n="from" for="furnace-from">FROM:</label>
    <select id="furnace-from">...</select>
  </div>
  <div>
    <label data-i18n="to" for="furnace-to">TO:</label>
    <select id="furnace-to">...</select>
  </div>
</div>
```

## Key Responsive Sizing Variables

All sizing uses `clamp(min, preferred, max)` with rem units for viewport responsiveness:

```css
:root {
  /* Base font size scales with viewport */
  font-size: clamp(14px, 0.875vw + 0.5vh, 18px);
}

/* Form field variables */
--field-padding: clamp(0.5rem, 0.375rem + 0.5vw, 0.75rem);
--field-height: clamp(2.5rem, 2rem + 1vw, 3.5rem);
--field-font: clamp(0.875rem, 0.75rem + 0.5vw, 1rem);
--field-gap: clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem);

/* Touch targets (accessibility requirement) */
--min-touch-target: clamp(2.5rem, 2rem + 1vw, 3.5rem);
```

### Input Responsive Widths

```css
/* Inventory items */
.inventory-item input {
  width: clamp(4rem, 3.5rem + 2vw, 6rem);
}

/* Batch selects */
.batch-select {
  min-width: clamp(5rem, 4.5rem + 1.5vw, 7rem);
}

/* Building/gear selects */
.building-select,
.gear-select {
  min-width: clamp(8rem, 7rem + 2vw, 12rem);
}

/* Profile inputs */
.profiles input[type="text"] {
  width: clamp(8rem, 7rem + 2vw, 12rem);
}

/* Compact inventory */
.inventory-grid.compact input {
  width: clamp(5rem, 4rem + 3vw, 8rem);
  max-width: 48%;
}
```

## Testing Checklist

When implementing this pattern on a new page, verify:

1. **Console Clean:** No JavaScript errors in DevTools Console
2. **Label Visibility:** Labels and select values don't overlap at any viewport size
3. **Responsive Range:** Test from 320px (mobile) to 2560px (large desktop)
4. **Critical Breakpoints:**
   - 480px (small mobile)
   - 768px (tablet portrait)
   - 1024px (tablet landscape)
   - 1200px (where previous overlap occurred)
   - 1920px (desktop)
5. **Theme Toggle:** Both light and dark themes display correctly
6. **Keyboard Navigation:** Tab through inputs, Enter/Space activate
7. **Touch Targets:** All interactive elements ≥ 40px (2.5rem) touch area
8. **Grid Layout:** Each label+select pair forms visual card with proper spacing

## Implementation Script

For batch conversion of existing flat label+select structures, use:

```bash
cd scripts
python fix-charm-inputs.py  # Adds nested div wrappers to charm-inputs
```

Script applies 3 regex patterns:
1. Add opening `<div>` after container opening
2. Add `</div><div>` between FROM and TO selects  
3. Add closing `</div>` before container closing

## Benefits

✅ **No Overlap:** Labels and inputs maintain separation at all viewport sizes  
✅ **Responsive:** Scales smoothly from mobile to desktop using viewport units  
✅ **Accessible:** Minimum 40px touch targets, keyboard navigable, screen reader friendly  
✅ **Consistent:** Same pattern across all calculator pages  
✅ **Maintainable:** Single CSS pattern, reusable structure  
✅ **Theme Compatible:** Works with both light and dark themes  
✅ **Future-Proof:** Template for War Academy, Pets, Experts pages

## Breakpoint Palette

For the complete breakpoint map and rationale used across pages, see [docs/CSS_BREAKPOINTS_AUDIT.md](docs/CSS_BREAKPOINTS_AUDIT.md). Key thresholds: 80em, 75em, 68.75em, 64em (paired with 64.0625/63.9375 offsets), 56.25em, 48em, 43.75em, 37.5em, 30em.

## CSS Classes Using This Pattern

| Class | File | Purpose |
|-------|------|---------|
| `.gear-item-row` | chiefGear.html | Chief gear FROM/TO selects (6 instances) |
| `.charm-inputs` | charms.html | Charm FROM/TO selects (18 instances) |
| `.select-group` | fireCrystals.html | Building FROM/TO selects (8 instances) |
| `.batch-controls` | All calculators | Batch FROM/TO controls |

## Migration Notes

**From:** Horizontal flex with `align-items: center`
```css
.old-pattern {
  display: flex;
  align-items: center;
  gap: 1rem;
}
```

**To:** Vertical flex/grid with nested divs
```css
.new-pattern {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: clamp(0.625rem, 0.5rem + 0.5vw, 0.75rem);
  min-height: clamp(4.5rem, 3.5rem + 2vw, 6rem);
}
.new-pattern > div {
  display: flex;
  flex-direction: column;
  gap: clamp(0.375rem, 0.25rem + 0.5vw, 0.625rem);
}
```

**HTML Change Required:** Add `<div>` wrappers around each label+select pair.

---

**Last Updated:** December 3, 2025  
**Status:** ✅ Implemented and tested on chiefGear, charms, fireCrystals pages  
**Next:** Apply to War Academy, Pets, Experts when implemented
