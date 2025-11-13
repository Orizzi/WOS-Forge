# Technical Architecture Documentation

## Overview

This document provides detailed technical information about the Whiteout Survival Calculator architecture, design decisions, and implementation details for all major changes made to the project.

---

## Table of Contents

1. [Architecture Evolution](#architecture-evolution)
2. [Module System](#module-system)
3. [Data Flow Architecture](#data-flow-architecture)
4. [Icon System](#icon-system)
5. [Power Calculation System](#power-calculation-system)
6. [CSV Import Pipeline](#csv-import-pipeline)
7. [Accessibility Implementation](#accessibility-implementation)
8. [Responsive Design Strategy](#responsive-design-strategy)
9. [Performance Optimizations](#performance-optimizations)
10. [Browser Compatibility](#browser-compatibility)

---

## Architecture Evolution

### Phase 1: Monolithic Design (v1.0.0)
**Characteristics:**
- Single `script.js` file (~800 lines)
- All functionality in one scope
- Tightly coupled components
- Difficult to maintain and test

**Limitations:**
- Hard to debug specific features
- Code reuse was minimal
- Testing individual features was challenging
- Merge conflicts in team development

### Phase 2: Modularization (v1.2.0)
**Approach:**
- Split monolith into focused modules
- Each module has single responsibility
- Clear interfaces between modules
- Improved maintainability

**Module Breakdown:**
```javascript
// Before (v1.0.0)
script.js (800+ lines)
  ├── Theme logic
  ├── Profile logic
  ├── Calculation logic
  ├── Table sorting logic
  └── All event handlers

// After (v1.2.0+)
theme.js           (~150 lines) - Theme toggle only
profiles.js        (~250 lines) - Profile CRUD operations
calculator.js      (~350 lines) - Cost calculations
table-sort.js      (~150 lines) - Sortable tables
translations.js    (~200 lines) - i18n support
```

### Phase 3: Shared Utilities (v2.0.0)
**Innovation:**
- Created reusable utility libraries
- Centralized common patterns
- Reduced code duplication by ~40%

**New Utilities:**
```javascript
icon-helper.js     (~25 lines)  - Icon rendering
data-loader.js     (~30 lines)  - CSV caching
```

---

## Module System

### Module Pattern: IIFE (Immediately Invoked Function Expression)

All modules use the revealing module pattern for encapsulation:

```javascript
// Standard module template
(function() {
  'use strict';
  
  // Private variables and functions
  const privateVar = 'hidden';
  
  function privateFunction() {
    // Internal logic
  }
  
  // Public API
  function publicFunction() {
    return privateFunction();
  }
  
  // Expose public interface
  window.ModuleName = {
    publicFunction
  };
})();
```

**Benefits:**
- No global namespace pollution
- Private scope for internal variables
- Clear public API definition
- Automatic execution on load

### Module Dependencies

**Dependency Graph:**
```
index.html / charms.html / chiefGear.html / fireCrystals.html
    ├── theme.js (independent)
    ├── translations.js (independent)
    ├── icon-helper.js (independent)
    ├── data-loader.js (independent)
    ├── profiles.js (depends on: translations)
    ├── calculator.js (depends on: icon-helper, data-loader, translations)
    ├── chief-gear-calculator.js (depends on: icon-helper, translations)
    ├── fire-crystals-calculator.js (depends on: icon-helper, translations)
    │   └── fire-crystals-power-extension.js (depends on: fire-crystals-calculator)
    └── table-sort.js (independent)
```

**Load Order Requirements:**
```html
<!-- Must load in this order -->
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/translations.js" defer></script>
<script src="Scripts/icon-helper.js" defer></script>
<script src="Scripts/data-loader.js" defer></script>
<script src="Scripts/profiles.js" defer></script>
<script src="Scripts/calculator.js" defer></script>
<script src="Scripts/table-sort.js" defer></script>
```

**Why `defer`?**
- Scripts execute after DOM parsing
- Maintains document order
- Non-blocking page load
- Better performance than inline scripts

---

## Data Flow Architecture

### User Interaction Flow

```
┌─────────────────┐
│  User Input     │
│  (HTML Form)    │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Event Handler  │
│  (addEventListener)
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Validation     │
│  (Check inputs) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Calculation    │
│  (sumCosts())   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Aggregation    │
│  (calculateAll)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Rendering      │
│  (Update DOM)   │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Enhancement    │
│  (makeTableSortable)
└─────────────────┘
```

### State Management

**LocalStorage Keys:**
```javascript
{
  'wos-theme': 'dark' | 'light',
  'wos-charm-profiles': JSON.stringify([
    {
      name: 'Profile 1',
      data: { /* all input values */ }
    }
  ]),
  'wos-chief-gear-profiles': JSON.stringify([...]),
  'wos-fire-crystals-profiles': JSON.stringify([...])
}
```

**State Persistence Strategy:**
- Theme: Saved on every toggle
- Profiles: Saved explicitly by user action
- Input values: Only saved within profiles
- Temporary calculations: Never persisted

---

## Icon System

### Problem Statement (v1.x)

**Before IconHelper:**
```javascript
// In calculator.js (Charms)
function labelWithIcon(key) {
  const map = {
    guides: 'assets/resources/charm-guides.svg',
    designs: 'assets/resources/charm-designs.svg'
  };
  const url = map[key];
  return `<img src="${url}"> ${key}`;
}

// In chief-gear-calculator.js (duplicate!)
function labelWithIcon(key) {
  const map = {
    'hardened-alloy': 'assets/resources/hardened-alloy.svg',
    'polishing-solution': 'assets/resources/polishing-solution.svg'
  };
  const url = map[key];
  return `<img src="${url}"> ${key}`;
}

// In fire-crystals-calculator.js (more duplication!)
function labelWithIcon(key) {
  const map = {
    'fire-crystals': 'assets/resources/fire-crystals.png',
    meat: 'assets/resources/meat.png'
  };
  const url = map[key];
  return `<img src="${url}"> ${key}`;
}
```

**Issues:**
- Code duplication (3x same logic)
- Inconsistent icon paths
- Hard to maintain (change in 3 places)
- No centralized icon registry

### Solution: Centralized Icon Helper (v2.0.0)

**Implementation:**
```javascript
// icon-helper.js (single source of truth)
(function(){
  'use strict';
  
  // Centralized icon registry
  const ICON_MAP = {
    // Fire Crystals resources
    'fire-crystals': 'assets/resources/fire-crystals.png',
    'refine-crystals': 'assets/resources/refine-crystals.png',
    meat: 'assets/resources/meat.png',
    wood: 'assets/resources/wood.png',
    coal: 'assets/resources/coal.png',
    iron: 'assets/resources/iron.png',
    
    // Chief Gear resources
    'hardened-alloy': 'assets/resources/hardened-alloy.svg',
    'polishing-solution': 'assets/resources/polishing-solution.svg',
    'design-plans': 'assets/resources/design-plans.svg',
    'lunar-amber': 'assets/resources/lunar-amber.svg',
    
    // Charms resources
    guides: 'assets/resources/charm-guides.svg',
    designs: 'assets/resources/charm-designs.svg',
    secrets: 'assets/resources/charm-secrets.svg'
  };
  
  // Single rendering function
  function label(key, translationFn) {
    const url = ICON_MAP[key];
    const text = translationFn 
      ? translationFn(key) 
      : key.charAt(0).toUpperCase() + key.slice(1);
    
    if (!url) return text;
    
    return `<img class="res-icon" 
                 src="${url}" 
                 alt="${text}" 
                 onerror="this.style.display='none'"> ${text}`;
  }
  
  // Global API
  window.IconHelper = { label };
})();
```

**Usage in Calculators:**
```javascript
// All calculators now use:
function labelWithIcon(key) {
  const t = window.I18n ? window.I18n.t : (k) => k;
  
  // Delegate to shared helper if available
  if (window.IconHelper && typeof window.IconHelper.label === 'function') {
    return window.IconHelper.label(key, t);
  }
  
  // Fallback for backward compatibility
  return key;
}
```

**Benefits:**
- 90% reduction in icon-related code
- Single source of truth for icon paths
- Easy to add new icons (one place)
- Consistent rendering across app
- Built-in error handling (onerror)
- Translation support built-in

---

## Power Calculation System

### Design Philosophy: Non-Cumulative Power

**Game Mechanic:**
When you upgrade from level 5 to level 6, you DON'T get:
- ❌ Power from level 1 + 2 + 3 + 4 + 5 + 6 (cumulative)

You only get:
- ✅ Power from level 6 (desired level only)

**Why This Matters:**
```javascript
// WRONG (cumulative - v1.0 mistake)
function calculatePower(from, to) {
  let total = 0;
  for (let level = from + 1; level <= to; level++) {
    total += powerData[level];
  }
  return total; // Over-inflated power number
}

// CORRECT (non-cumulative - v1.1+)
function calculatePower(from, to) {
  // Only return power of the final level
  return powerData[to] || 0;
}
```

### Implementation Across Calculators

#### Charms Calculator
```javascript
// calculator.js
function sumCosts(from, to) {
  const sum = { 
    guides: 0, 
    designs: 0, 
    secrets: 0, 
    power: 0,  // Will be set to target level power only
    svsPoints: 0 
  };
  
  // Sum upgrade costs (cumulative)
  for (let lvl = from + 1; lvl <= to; lvl++) {
    sum.guides += costs[lvl].guides;
    sum.designs += costs[lvl].designs;
    sum.secrets += costs[lvl].secrets;
    sum.svsPoints += costs[lvl].svsPoints;
  }
  
  // Power: ONLY the target level (non-cumulative)
  sum.power = costs[to] ? costs[to].power : 0;
  
  return sum;
}
```

#### Chief Gear Calculator
```javascript
// chief-gear-calculator.js
function calculateGearCost(type, fromLevel, toLevel) {
  let costs = {
    hardenedAlloy: 0,
    polishingSolution: 0,
    designPlans: 0,
    lunarAmber: 0,
    power: 0, // Non-cumulative
    svsPoints: 0
  };
  
  // Sum resources (cumulative)
  for (let i = fromIdx + 1; i <= toIdx; i++) {
    costs.hardenedAlloy += GEAR_COSTS[i].hardenedAlloy;
    costs.polishingSolution += GEAR_COSTS[i].polishingSolution;
    costs.designPlans += GEAR_COSTS[i].designPlans;
    costs.lunarAmber += GEAR_COSTS[i].lunarAmber;
    costs.svsPoints += GEAR_COSTS[i].svsPoints;
  }
  
  // Power: target level only (non-cumulative)
  costs.power = GEAR_COSTS[toIdx] ? GEAR_COSTS[toIdx].power : 0;
  
  return costs;
}
```

#### Fire Crystals Calculator (Extension Pattern)
```javascript
// fire-crystals-power-extension.js
function computeTotalPower() {
  const buildings = [
    'Furnace', 'Embassy', 'Command Center', 'Infirmary',
    'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
  ];
  
  let total = 0;
  
  buildings.forEach(buildingName => {
    const desiredLevel = getDesiredLevel(buildingName);
    
    // Look up power for ONLY the desired level (non-cumulative)
    if (POWER_MAP[buildingName] && POWER_MAP[buildingName][desiredLevel]) {
      total += POWER_MAP[buildingName][desiredLevel];
    }
  });
  
  return total;
}
```

**Why Extension Pattern for Fire Crystals?**
- Main calculator file is 1200+ lines (risky to modify)
- Extension wraps existing `calculateAll()` function
- Loads separate CSV (`building_power.csv`)
- Non-invasive approach (fallback if script fails to load)
- Can be replaced with native implementation later

---

## CSV Import Pipeline

### Architecture Overview

```
┌─────────────────────────┐
│  Excel Workbook         │
│  (resource_data.xlsx)   │
│  39 sheets              │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Node.js Extractors     │
│  - extract-building-    │
│    resources.js         │
│  - extract-charms-      │
│    costs.js             │
│  - extract-chief-gear-  │
│    costs.js             │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Generated CSV Files    │
│  - resource_costs.csv   │
│  - charms_costs.csv     │
│  - chief_gear_costs.csv │
│  - building_power.csv   │
└───────────┬─────────────┘
            │
            ▼
┌─────────────────────────┐
│  Runtime Loading        │
│  fetch() → parse →      │
│  override defaults      │
└─────────────────────────┘
```

### Extractor Scripts

**Common Pattern:**
```javascript
// Example: extract-charms-costs.js
const XLSX = require('xlsx');
const fs = require('fs');

// 1. Read Excel workbook
const workbook = XLSX.readFile('src/assets/resource_data.xlsx');

// 2. Select specific sheet
const sheet = workbook.Sheets['Charms Data'];

// 3. Convert to JSON
const data = XLSX.utils.sheet_to_json(sheet);

// 4. Transform and filter
const costs = data
  .filter(row => row.Level >= 0 && row.Level <= 15)
  .map(row => ({
    level: row.Level,
    guides: row.Guides || 0,
    designs: row.Designs || 0,
    secrets: row.Secrets || 0,
    power: row.Power || 0,
    svsPoints: row['SvS Points'] || 0
  }));

// 5. Convert to CSV
const csv = [
  'level,guides,designs,secrets,power,svsPoints',
  ...costs.map(c => `${c.level},${c.guides},${c.designs},${c.secrets},${c.power},${c.svsPoints}`)
].join('\n');

// 6. Write to file
fs.writeFileSync('src/assets/charms_costs.csv', csv, 'utf8');
console.log('✅ Charms costs CSV generated');
```

### Runtime CSV Override

**Pattern in Calculators:**
```javascript
// Example from calculator.js
async function loadCharmCostsFromCsv(url = 'assets/charms_costs.csv') {
  try {
    const response = await fetch(url, { cache: 'no-cache' });
    if (!response.ok) return; // Silently fail, use defaults
    
    const text = await response.text();
    const lines = text.split(/\r?\n/).filter(l => l.trim());
    
    if (lines.length < 2) return; // No data
    
    const header = lines[0].split(',');
    const indices = {
      level: header.indexOf('level'),
      guides: header.indexOf('guides'),
      designs: header.indexOf('designs'),
      secrets: header.indexOf('secrets'),
      power: header.indexOf('power'),
      svsPoints: header.indexOf('svsPoints')
    };
    
    let applied = 0;
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(',');
      const level = parseInt(parts[indices.level], 10);
      
      if (isNaN(level) || level < 0 || level > 15) continue;
      
      // Override default cost data
      costs[level] = {
        guides: parseInt(parts[indices.guides], 10) || 0,
        designs: parseInt(parts[indices.designs], 10) || 0,
        secrets: parseInt(parts[indices.secrets], 10) || 0,
        power: parseInt(parts[indices.power], 10) || 0,
        svsPoints: parseInt(parts[indices.svsPoints], 10) || 0
      };
      
      applied++;
    }
    
    if (applied > 0) {
      console.log(`✅ Loaded ${applied} charm cost entries from CSV`);
    }
  } catch (error) {
    console.warn('⚠️ Could not load charms CSV, using defaults:', error);
    // Application continues with built-in defaults
  }
}

// Auto-load on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    loadCharmCostsFromCsv();
  });
} else {
  loadCharmCostsFromCsv();
}
```

**Benefits:**
- Excel remains single source of truth
- Developers update Excel, not code
- CSV generation is automated (npm scripts)
- Runtime override is transparent
- Graceful fallback to defaults
- No build step required for basic usage

---

## Accessibility Implementation

### WCAG 2.1 Level AA Compliance

**Target Standards:**
- ✅ Perceivable: Content presented in ways all users can perceive
- ✅ Operable: UI components and navigation are operable
- ✅ Understandable: Information and operation are understandable
- ✅ Robust: Content works with current and future technologies

### Semantic HTML5 Landmarks

**Before (v1.x):**
```html
<div class="header">
  <a href="index.html">WOS CALCULATOR</a>
</div>
<div class="navigation">
  <a href="charms.html">Charms</a>
</div>
<div class="content">
  <h2>Charms Calculator</h2>
  <!-- ... -->
</div>
```

**Issues:**
- No semantic meaning
- Screen readers can't identify regions
- No navigation shortcuts
- Poor accessibility

**After (v2.0):**
```html
<header role="banner">
  <a href="index.html" class="title">WOS CALCULATOR</a>
</header>

<nav class="main-nav" role="navigation" aria-label="Main navigation">
  <a href="index.html">Home</a> |
  <a href="charms.html">Charms</a> |
  <a href="chiefGear.html">Chief Gear</a> |
  <a href="fireCrystals.html">Fire Crystals</a> |
  <button id="dark-mode-toggle" 
          class="dark-mode-toggle" 
          aria-pressed="false" 
          title="Toggle dark/light theme">
    🌙 Theme
  </button>
</nav>

<main role="main">
  <section class="introduction" aria-labelledby="welcome-heading">
    <h1 id="welcome-heading">Welcome to the WOS Calculator</h1>
    <!-- ... -->
  </section>
</main>
```

**Benefits:**
- Screen readers announce "banner", "navigation", "main"
- Users can skip to main content (skip links)
- Clear content structure
- Better SEO

### ARIA Attributes

**Dynamic Content:**
```html
<!-- Results update dynamically -->
<div id="calculation-results" aria-live="polite">
  <!-- Calculator populates this -->
</div>
```

**Toggle States:**
```javascript
// theme.js
button.setAttribute('aria-pressed', isDark ? 'true' : 'false');
```

**Descriptive Labels:**
```html
<input type="number" 
       id="inventory-guides" 
       aria-label="Charm Guides in inventory"
       aria-describedby="guides-help">
<small id="guides-help">Enter how many Guides you already own</small>
```

**Sortable Tables:**
```javascript
// table-sort.js
header.setAttribute('aria-sort', 
  isAscending ? 'ascending' : 'descending'
);
```

### Keyboard Navigation

**Focus Management:**
```css
/* Visible focus indicators */
button:focus,
select:focus,
input:focus {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
  box-shadow: 0 0 0 3px rgba(124, 108, 255, 0.2);
}

/* Remove default browser outline */
button:focus:not(:focus-visible),
select:focus:not(:focus-visible),
input:focus:not(:focus-visible) {
  outline: none;
}

/* Show outline only for keyboard navigation */
button:focus-visible,
select:focus-visible,
input:focus-visible {
  outline: 3px solid var(--accent);
  outline-offset: 2px;
}
```

**Tab Order:**
- Natural DOM order maintained
- No tabindex manipulation
- All interactive elements focusable
- Skip links for main content (planned)

### Touch Targets

**WCAG Success Criterion 2.5.5 (Level AAA):**
Target size: At least 44×44 CSS pixels

**Implementation:**
```css
/* Enforce minimum touch target size */
button,
.dark-mode-toggle,
select,
input[type="number"] {
  min-height: 44px;
  min-width: 44px;
  padding: 10px 16px;
}
```

---

## Responsive Design Strategy

### Mobile-First Approach

**Breakpoint Strategy:**
```css
/* Base styles (mobile) */
.main-nav {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap; /* Wrap on narrow screens */
  gap: 8px;
}

/* Small tablets (600px+) */
@media (min-width: 600px) {
  .inventory-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Tablets (900px+) */
@media (min-width: 900px) {
  .buildings-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* Desktop (1200px+) */
@media (min-width: 1200px) {
  .buildings-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
```

**Reverse Breakpoints (max-width):**
```css
/* Very small phones (480px and below) */
@media (max-width: 480px) {
  .main-nav a {
    padding: 10px 12px;
    font-size: 0.9em;
  }
  
  h1 {
    font-size: 1.5em;
  }
}
```

### Table Responsiveness

**Problem:** Wide tables overflow on mobile

**Solution 1: Horizontal Scroll**
```html
<div class="table-responsive">
  <table class="results-table">
    <!-- Wide table content -->
  </table>
</div>
```

```css
.table-responsive {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch; /* Smooth iOS scrolling */
  margin: 12px 0;
}

.table-responsive table {
  min-width: 600px; /* Force scroll if container < 600px */
}
```

**Solution 2: Stacked Layout (future)**
```css
@media (max-width: 600px) {
  table, thead, tbody, th, td, tr {
    display: block;
  }
  
  tr {
    margin-bottom: 1em;
    border: 1px solid var(--border);
  }
  
  td {
    text-align: right;
    padding-left: 50%;
    position: relative;
  }
  
  td::before {
    content: attr(data-label);
    position: absolute;
    left: 6px;
    font-weight: bold;
  }
}
```

### Flexible Grids

**CSS Grid with Auto-fit:**
```css
.inventory-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 16px;
}
```

**Benefits:**
- Automatically adjusts columns based on container width
- No media queries needed
- Content-aware layout

---

## Performance Optimizations

### Data Loader with Caching

**Problem:** Multiple calculators fetching same CSV files

**Solution:**
```javascript
// data-loader.js
(function() {
  'use strict';
  
  // In-memory cache
  const cache = {};
  
  async function fetchText(url) {
    // Return cached promise if exists
    if (cache[url]) return cache[url];
    
    // Create and cache fetch promise
    cache[url] = fetch(url, { cache: 'no-cache' })
      .then(r => r.ok ? r.text() : '')
      .catch(() => '');
    
    return cache[url];
  }
  
  async function loadCsv(url) {
    const text = await fetchText(url);
    if (!text) return { header: [], rows: [] };
    
    const lines = text.split(/\r?\n/).filter(l => l.trim().length > 0);
    if (lines.length === 0) return { header: [], rows: [] };
    
    const header = lines[0].split(',').map(h => h.trim());
    const rows = lines.slice(1).map(l => l.split(',').map(p => p.trim()));
    
    return { header, rows };
  }
  
  window.DataLoader = { fetchText, loadCsv };
})();
```

**Benefits:**
- Fetch each CSV only once
- Shared across all calculators
- Reduces network requests
- Faster page loads

### Deferred Script Loading

**All scripts use `defer` attribute:**
```html
<script src="Scripts/calculator.js" defer></script>
```

**Benefits:**
- Non-blocking HTML parsing
- Scripts execute after DOM ready
- Maintains script order
- Faster initial page render

### CSS Optimization

**CSS Variables for Theme:**
```css
:root {
  --bg: #12121a;
  --text: #e9eef8;
  /* ... 12 variables total ... */
}

/* Theme switch is instant */
html.light-theme {
  --bg: #ffffff;
  --text: #111111;
}
```

**Benefits:**
- Theme switch without re-painting
- Browser can optimize variable lookups
- Easier to maintain

### Image Optimization

**SVG Icons:**
- Vector format (scalable)
- Small file size (~200-300 bytes)
- No HTTP requests (inline in HTML)
- Crisp at any resolution

**PNG Icons (Fire Crystals, base resources):**
- Optimized with TinyPNG
- Appropriate dimensions (64×64px)
- Lazy loading planned

---

## Browser Compatibility

### Supported Browsers

**Tier 1 (Fully Supported):**
- Chrome 90+
- Firefox 88+
- Edge 90+
- Safari 14+

**Tier 2 (Partially Supported):**
- Chrome 80-89
- Firefox 78-87
- Safari 13

**Tier 3 (Unsupported):**
- Internet Explorer (all versions)

### Polyfills Not Required

**Modern Features Used:**
- ES6+ (async/await, arrow functions, template literals)
- CSS Grid
- CSS Custom Properties (variables)
- Fetch API
- LocalStorage API
- ARIA attributes

**Why No Polyfills:**
- Target audience uses modern browsers
- Reduced bundle size
- Better performance
- Simpler maintenance

### Graceful Degradation

**Feature Detection:**
```javascript
// Check for localStorage
if (typeof Storage !== 'undefined') {
  // Use localStorage
} else {
  // Fall back to in-memory only
}

// Check for Fetch API
if (typeof fetch !== 'undefined') {
  // Load CSV
} else {
  // Use built-in defaults
}
```

**CSS Fallbacks:**
```css
/* Grid with flexbox fallback */
.container {
  display: flex; /* Fallback */
  flex-wrap: wrap;
  display: grid; /* Override if supported */
  grid-template-columns: repeat(3, 1fr);
}

/* Custom properties with fallback */
.button {
  background-color: #7c6cff; /* Fallback */
  background-color: var(--accent); /* Preferred */
}
```

---

## Future Improvements

### Planned Architectural Changes

1. **Service Worker for Offline Support**
   - Cache HTML, CSS, JS files
   - Cache CSV data
   - Offline-first strategy

2. **IndexedDB for Large Datasets**
   - Replace localStorage for profiles
   - Store calculation history
   - Better performance for large data

3. **Web Workers for Heavy Calculations**
   - Move calculation logic to background thread
   - Non-blocking UI
   - Better performance on mobile

4. **Virtual Scrolling for Large Tables**
   - Render only visible rows
   - Better performance with 100+ rows
   - Smooth scrolling experience

5. **Component-Based Architecture**
   - Migrate to lightweight framework (Lit, Preact)
   - Reusable components
   - Better testing

---

## Development Best Practices

### Code Style

**JavaScript:**
```javascript
// Use strict mode
'use strict';

// Descriptive variable names
const inventoryGuides = parseInt(input.value, 10);

// Early returns
function calculate(from, to) {
  if (from >= to) return null;
  // ... calculation logic
}

// Document complex logic
/**
 * Calculates total resource cost from one level to another.
 * The 'from' level is EXCLUSIVE, 'to' level is INCLUSIVE.
 * 
 * @param {number} from - Starting level (not included in sum)
 * @param {number} to - Ending level (included in sum)
 * @returns {Object} Resource totals
 */
function sumCosts(from, to) {
  // ...
}
```

**CSS:**
```css
/* BEM-like naming (Block Element Modifier) */
.result-totals { }
.result-totals__item { }
.result-totals__item--highlighted { }

/* Group related rules */
.button {
  /* Layout */
  display: inline-flex;
  padding: 10px 16px;
  
  /* Visual */
  background-color: var(--accent);
  border-radius: 6px;
  
  /* Typography */
  font-size: 1em;
  font-weight: 600;
  
  /* Interaction */
  cursor: pointer;
  transition: all 150ms ease;
}
```

### Testing Strategy

**Manual Testing Checklist:**
- [ ] All calculators work in Chrome, Firefox, Safari
- [ ] Dark/Light theme toggle works
- [ ] Profile save/load works
- [ ] CSV override works
- [ ] Calculations are accurate
- [ ] Tables are sortable
- [ ] Keyboard navigation works
- [ ] Screen reader announces content
- [ ] Mobile responsive layouts work

**Future: Automated Testing**
- Unit tests for calculation functions
- Integration tests for CSV loading
- E2E tests for user workflows
- Visual regression tests for UI

---

**Document Version:** 2.0.0  
**Last Updated:** November 13, 2024  
**Maintainer:** Orizzi
