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

---

## Project Scope & Constraints

### Project Scope
**WOS Calculator** provides web-based calculators for multiple Whiteout Survival game systems:
- **Pages**: Root `index.html` (landing page), calculator pages in `src/`
- **Data Source**: `src/assets/resource_data.xlsx` → CSV/JS artifacts
- **Runtime**: Browser loads minified bundles from `src/Scripts/min/`, computes totals, updates DOM
- **Deployment**: Static hosting via GitHub Pages, Netlify, or any web server

### Technical Constraints
1. **GitHub Pages Requirement**: `index.html` must remain at repository root
2. **Game Vocabulary**: Preserve domain-specific terms (do not "correct" game terminology)
3. **Path Stability**: All HTML-referenced scripts/assets paths must remain stable
4. **Static Hosting**: No server-side processing, all computation client-side
5. **Browser Compatibility**: Support modern browsers (Chrome, Firefox, Edge, Safari)

### Data Flow
```
Excel Workbook (src/assets/resource_data.xlsx)
        ↓
    [npm scripts in scripts/]
        ↓
    CSV/JS files (src/assets/)
        ↓
    Data Loaders (browser fetch)
        ↓
    Calculator Modules
        ↓
    UI Render → DOM Update
```

---

## Module Dependency Graph

### Runtime Module Loading (Per Page)
```
Page Load
  ├── icon-helper.min.js (IconHelper utility)
  ├── theme.min.js (dark/light theme toggle)
  ├── table-sort.min.js (sortable tables)
  ├── translations.min.js (I18n system)
  ├── profiles.min.js (profile management)
  ├── Calculator-specific bundle:
  │     ├── calculator.min.js (Charms)
  │     ├── chief-gear-calculator.min.js (Chief Gear)
  │     ├── fire-crystals-calculator.min.js (Fire Crystals)
  │     └── war-laboratory.min.js (War Academy)
  └── Page-specific:
        ├── data-loader.js (CSV loading with caching)
        └── fc-status-ui.js (Fire Crystals status display)
```

### Event Flow
**Fire Crystals Data Loading:**
```javascript
// Dispatched when FC data loads
document.dispatchEvent(new CustomEvent('fc-data-ready', {
  detail: {
    rows: [...],    // Data rows
    source: 'csv',  // or 'inline'
    error: null     // Error message if failed
  }
}));

// Listeners
fc-status-ui.js → Updates status badge
fire-crystals-calculator.js → Processes data
```

### Future Namespace Structure (In Progress)
```javascript
WOS = {
  helpers: {
    icons: IconHelper,
    numberFormat: formatNumber,
    csv: parseCSV
  },
  data: {
    loader: DataLoader
  },
  calcs: {
    charms: CharmsCalculator,
    chiefGear: ChiefGearCalculator,
    fireCrystals: FireCrystalsCalculator,
    warLab: WarLabCalculator
  },
  ui: {
    charms: CharmsUI,
    chiefGear: ChiefGearUI,
    fireCrystals: FireCrystalsUI,
    i18n: I18nUI,
    theme: ThemeUI
  }
};
```

**Note**: Legacy globals remain bridged for backward compatibility during migration.

---

## Calculator Logic Deep Dive

### Charms Calculator
**Data Structure:**
```javascript
// Embedded defaults, CSV override via charms_costs.csv
{
  level: 1,
  guides: 10,
  designs: 5,
  secrets: 2,
  power: 100,
  svsPoints: 50
}
```

**Calculation Logic:**
```javascript
sumCosts(fromLevel, toLevel) {
  // fromLevel: exclusive (start after this level)
  // toLevel: inclusive (include this level's costs)
  // Example: sumCosts(1, 3) = costs for levels 2 + 3
  
  let totals = { guides: 0, designs: 0, secrets: 0, svsPoints: 0 };
  
  for (let level = fromLevel + 1; level <= toLevel; level++) {
    const costs = getCostsForLevel(level);
    totals.guides += costs.guides;
    totals.designs += costs.designs;
    totals.secrets += costs.secrets;
    totals.svsPoints += costs.svsPoints;
  }
  
  // Power = target level power only (not cumulative)
  totals.power = getPowerForLevel(toLevel);
  
  return totals;
}
```

### Chief Gear Calculator
**Data Structure:**
```javascript
// Ordered by tier: Green → Blue → Purple → Gold → Red
{
  level: "Green 1",
  hardenedAlloy: 100,
  polishingSolution: 50,
  designPlans: 25,
  lunarAmber: 0,
  power: 500,
  svsPoints: 100
}
```

**Calculation Logic:**
```javascript
sumCosts(fromIndex, toIndex) {
  // Index-based accumulation (46 total levels)
  // Returns null for invalid ranges
  
  if (fromIndex < 0 || toIndex >= levels.length || fromIndex >= toIndex) {
    return null;
  }
  
  let totals = { hardenedAlloy: 0, polishingSolution: 0, designPlans: 0, lunarAmber: 0, svsPoints: 0 };
  
  for (let i = fromIndex + 1; i <= toIndex; i++) {
    totals.hardenedAlloy += levels[i].hardenedAlloy;
    totals.polishingSolution += levels[i].polishingSolution;
    totals.designPlans += levels[i].designPlans;
    totals.lunarAmber += levels[i].lunarAmber;
    totals.svsPoints += levels[i].svsPoints;
  }
  
  totals.power = levels[toIndex].power; // Target level power
  
  return totals;
}
```

### Fire Crystals Calculator
**Data Structure:**
```javascript
// Per-building, per-level data
{
  building: "Furnace",
  level: 1,
  fc: 10,      // Fire Crystals
  rfc: 5,      // Refined Fire Crystals
  meat: 1000,
  wood: 800,
  coal: 600,
  iron: 400,
  timeSeconds: 3600,
  power: 200
}
```

**Calculation Logic:**
```javascript
sumRange(building, fromLevel, toLevel) {
  // Slice levelsArray from fromLevel to toLevel (inclusive)
  // Returns null for invalid ranges
  
  const buildingData = data.filter(row => row.building === building);
  
  if (fromLevel < 1 || toLevel > maxLevel || fromLevel >= toLevel) {
    return null;
  }
  
  // Sum all levels from (fromLevel+1) to toLevel inclusive
  const range = buildingData.slice(fromLevel, toLevel + 1);
  
  let totals = { fc: 0, rfc: 0, meat: 0, wood: 0, coal: 0, iron: 0, timeSeconds: 0 };
  
  range.forEach(level => {
    totals.fc += level.fc;
    totals.rfc += level.rfc;
    totals.meat += level.meat;
    totals.wood += level.wood;
    totals.coal += level.coal;
    totals.iron += level.iron;
    totals.timeSeconds += level.timeSeconds;
  });
  
  totals.power = buildingData[toLevel].power; // Target level power
  
  return totals;
}
```

**Time Formatting:**
```javascript
formatTime(seconds) {
  const days = Math.floor(seconds / 86400);
  const hours = Math.floor((seconds % 86400) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  
  // Uses I18n.t() for translation
  let parts = [];
  if (days > 0) parts.push(`${days} ${I18n.t('days')}`);
  if (hours > 0) parts.push(`${hours} ${I18n.t('hours')}`);
  if (minutes > 0) parts.push(`${minutes} ${I18n.t('minutes')}`);
  
  return parts.join(', ');
}
```

### War Academy Calculator
**Data Structure:**
```javascript
// Helios research tree (inline JS object)
{
  nodes: [
    {
      id: "helios-1-1",
      name: "Research Name",
      level: 1,
      costs: {
        books: 100,
        research: 50,
        power: 1000
      },
      timeSeconds: 7200,
      requires: [] // Prerequisite node IDs
    }
  ]
}
```

**Calculation Logic:**
```javascript
calculatePath(nodeId, targetLevel) {
  // Calculate cumulative costs from level 1 to targetLevel
  // Includes prerequisite nodes in dependency tree
  
  const node = findNode(nodeId);
  let totals = { books: 0, research: 0, power: 0, timeSeconds: 0 };
  
  // Add prerequisites first
  node.requires.forEach(reqId => {
    const reqTotals = calculatePath(reqId, getMaxLevel(reqId));
    mergeTotals(totals, reqTotals);
  });
  
  // Add this node's levels
  for (let level = 1; level <= targetLevel; level++) {
    const levelCosts = node.costs[level];
    totals.books += levelCosts.books;
    totals.research += levelCosts.research;
    totals.power += levelCosts.power;
    totals.timeSeconds += levelCosts.timeSeconds;
  }
  
  return totals;
}
```

---

## Calculation Core System (WOSCalcCore)

### Purpose
A centralized dispatcher that:
- Runs the appropriate calculator(s) for the current page
- Auto-recalculates when inventory values change
- Provides unified API for triggering calculations
- Eliminates duplicate calculation logic across modules

### Architecture
```javascript
WOSCalcCore = {
  adapters: Map(),
  
  registerAdapter(config) {
    // config: { id, isActive(), run() }
    this.adapters.set(config.id, config);
  },
  
  run(id) {
    // Run specific adapter by ID
    const adapter = this.adapters.get(id);
    if (adapter) adapter.run();
  },
  
  runActive() {
    // Run all adapters where isActive() returns true
    for (const adapter of this.adapters.values()) {
      if (adapter.isActive()) {
        adapter.run();
      }
    }
  },
  
  runAll() {
    // Run all registered adapters (debug/refresh)
    for (const adapter of this.adapters.values()) {
      adapter.run();
    }
  }
};
```

### Built-in Adapters
```javascript
// Charms Calculator
WOSCalcCore.registerAdapter({
  id: 'charms',
  isActive: () => !!document.querySelector('#charm-life-start'),
  run: () => CalculatorModule.calculateAll()
});

// Chief Gear Calculator
WOSCalcCore.registerAdapter({
  id: 'chiefGear',
  isActive: () => !!document.querySelector('#helmet-start'),
  run: () => ChiefGearCalculator.calculateAll()
});

// Fire Crystals Calculator
WOSCalcCore.registerAdapter({
  id: 'fireCrystals',
  isActive: () => !!document.querySelector('#furnace-start'),
  run: () => FireCrystalsCalculator.calculateAll()
});

// War Academy Calculator
WOSCalcCore.registerAdapter({
  id: 'warLab',
  isActive: () => !!document.querySelector('.war-lab-page'),
  run: () => WarLabCalculator.calculateAll()
});
```

### Auto-Recalculation System
```javascript
// Listen to all inventory inputs
document.addEventListener('input', (e) => {
  if (e.target.id && e.target.id.startsWith('inventory-')) {
    // Throttle with requestAnimationFrame
    requestAnimationFrame(() => {
      WOSCalcCore.runActive();
    });
  }
});

// Listen to form inputs (excludes profiles/language selectors)
document.addEventListener('input', (e) => {
  const input = e.target;
  
  // Skip non-relevant inputs
  if (input.type === 'button' || input.type === 'submit') return;
  if (input.id.includes('profile') || input.id.includes('language')) return;
  
  // Trigger recalculation
  requestAnimationFrame(() => {
    WOSCalcCore.runActive();
  });
});
```

### Integration with Other Modules
```javascript
// Profiles module - after loading profile
ProfilesModule.loadProfile = (profileName) => {
  const profile = getProfile(profileName);
  applyValuesToForm(profile);
  
  // Trigger recalculation with new values
  WOSCalcCore.runActive();
};

// Translations module - after language change
I18n.setLanguage = (lang) => {
  localStorage.setItem('language', lang);
  updateAllTranslations();
  
  // Recalculate to update translated number formats
  WOSCalcCore.runActive();
};

// Theme module - after theme toggle (optional)
ThemeModule.toggle = () => {
  document.documentElement.classList.toggle('light-theme');
  localStorage.setItem('theme', getCurrentTheme());
  
  // Optional: recalculate if theme affects display
  WOSCalcCore.runActive();
};
```

### Adding New Calculator Page
```javascript
// 1. Include calculation-core.js in HTML
<script src="Scripts/calculation-core.js"></script>

// 2. Register adapter once calculator is loaded
<script>
  WOSCalcCore.registerAdapter({
    id: 'myNewCalculator',
    isActive: () => !!document.querySelector('.my-calculator-page'),
    run: () => MyCalculator.calculateAll()
  });
</script>

// 3. Ensure inventory inputs follow naming convention
<input type="number" id="inventory-resource-name" />

// Auto-recalculation will work automatically
```

### Benefits
- **Single Responsibility**: Each calculator only implements calculation logic
- **No Coupling**: Calculators don't need to know about profiles, translations, or themes
- **Consistent Behavior**: All calculators respond to inventory changes identically
- **Easy Testing**: Test calculators in isolation, test WOSCalcCore separately
- **Simple Integration**: New calculators only need to register an adapter

---

## Gap Calculation System

### Purpose
Display the difference between required resources and owned inventory:
- **"Need X more"** - When inventory < required
- **"Have X extra"** - When inventory > required  
- **"Exact match"** - When inventory = required

### Implementation
```javascript
function displayGap(required, owned, resourceName) {
  const gap = required - owned;
  
  if (gap > 0) {
    // Need more
    return `${I18n.t('need-x-more').replace('{x}', formatNumber(gap))} ${resourceName}`;
  } else if (gap < 0) {
    // Have extra
    return `${I18n.t('have-x-extra').replace('{x}', formatNumber(Math.abs(gap)))} ${resourceName}`;
  } else {
    // Exact match
    return I18n.t('exact-match');
  }
}
```

### UI Display
```javascript
// Summary display example (War Academy)
function updateSummary(required, inventory) {
  const resources = ['books', 'research', 'meat', 'wood', 'coal', 'iron'];
  
  resources.forEach(resource => {
    const req = required[resource] || 0;
    const own = inventory[resource] || 0;
    const gap = req - own;
    
    // Update required cell
    document.getElementById(`total-${resource}`).textContent = formatNumber(req);
    
    // Update gap cell with color coding
    const gapCell = document.getElementById(`gap-${resource}`);
    gapCell.textContent = displayGap(req, own, resource);
    
    // Color coding
    if (gap > 0) {
      gapCell.className = 'gap-need-more';  // Red
    } else if (gap < 0) {
      gapCell.className = 'gap-have-extra';  // Green
    } else {
      gapCell.className = 'gap-exact';  // Neutral
    }
  });
}
```

### CSS Styling
```css
.gap-need-more {
  color: var(--error-color);
  font-weight: 600;
}

.gap-have-extra {
  color: var(--success-color);
  font-weight: 600;
}

.gap-exact {
  color: var(--text-secondary);
  font-style: italic;
}
```

---

## Profile System Architecture

### Storage Structure
```javascript
// localStorage key: 'wos-profiles'
{
  "Profile 1": {
    name: "Profile 1",
    timestamp: 1701475200000,
    values: {
      "charm-life-start": 1,
      "charm-life-end": 10,
      "helmet-start": 0,
      "helmet-end": 5
      // ... all form values
    },
    inventory: {
      "inventory-guides": 1000,
      "inventory-designs": 500,
      "inventory-hardenedAlloy": 2000
      // ... all inventory values
    }
  },
  "Profile 2": { ... }
}
```

### Save Profile Flow
```javascript
ProfilesModule.saveProfile = (profileName) => {
  // 1. Collect form values
  const values = {};
  document.querySelectorAll('input, select, textarea').forEach(input => {
    if (input.type !== 'button' && input.type !== 'submit') {
      values[input.id] = input.value;
    }
  });
  
  // 2. Collect inventory values separately
  const inventory = {};
  document.querySelectorAll('[id^="inventory-"]').forEach(input => {
    inventory[input.id] = input.value;
  });
  
  // 3. Create profile object
  const profile = {
    name: profileName,
    timestamp: Date.now(),
    values: values,
    inventory: inventory
  };
  
  // 4. Save to localStorage
  const profiles = getAllProfiles();
  profiles[profileName] = profile;
  localStorage.setItem('wos-profiles', JSON.stringify(profiles));
  
  // 5. Update UI
  updateProfileDropdown();
};
```

### Load Profile Flow
```javascript
ProfilesModule.loadProfile = (profileName) => {
  // 1. Retrieve profile
  const profiles = getAllProfiles();
  const profile = profiles[profileName];
  
  if (!profile) return;
  
  // 2. Apply form values
  Object.keys(profile.values).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.value = profile.values[id];
    }
  });
  
  // 3. Apply inventory values
  Object.keys(profile.inventory).forEach(id => {
    const element = document.getElementById(id);
    if (element) {
      element.value = profile.inventory[id];
    }
  });
  
  // 4. Trigger recalculation (IMPORTANT!)
  // First calculation applies form values
  WOSCalcCore.runActive();
  
  // Small delay to ensure DOM updates
  setTimeout(() => {
    // Second calculation includes inventory in gap calculation
    WOSCalcCore.runActive();
  }, 50);
};
```

### Cross-Calculator Support
Profiles work across all calculators because:
1. Uses element IDs, not calculator-specific logic
2. Stores ALL form inputs in single structure
3. Each calculator has unique ID prefixes
4. WOSCalcCore handles page-specific calculations

### Profile Management UI
```javascript
// Rename profile
ProfilesModule.renameProfile = (oldName, newName) => {
  const profiles = getAllProfiles();
  profiles[newName] = { ...profiles[oldName], name: newName };
  delete profiles[oldName];
  localStorage.setItem('wos-profiles', JSON.stringify(profiles));
  updateProfileDropdown();
};

// Delete profile
ProfilesModule.deleteProfile = (profileName) => {
  if (!confirm(`Delete profile "${profileName}"?`)) return;
  
  const profiles = getAllProfiles();
  delete profiles[profileName];
  localStorage.setItem('wos-profiles', JSON.stringify(profiles));
  updateProfileDropdown();
};

// Export profile (JSON download)
ProfilesModule.exportProfile = (profileName) => {
  const profiles = getAllProfiles();
  const profile = profiles[profileName];
  
  const dataStr = JSON.stringify(profile, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = `${profileName}.json`;
  link.click();
};

// Import profile (file upload)
ProfilesModule.importProfile = (file) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const profile = JSON.parse(e.target.result);
      const profiles = getAllProfiles();
      profiles[profile.name] = profile;
      localStorage.setItem('wos-profiles', JSON.stringify(profiles));
      updateProfileDropdown();
      alert(`Profile "${profile.name}" imported successfully!`);
    } catch (err) {
      alert('Invalid profile file!');
    }
  };
  reader.readAsText(file);
};
```

---

**Document Version:** 2.1.0  
**Last Updated:** December 2, 2025  
**Maintainer:** Orizzi
