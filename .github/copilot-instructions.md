# Copilot Instructions - WOS Calculator

## Project Overview
This is a **Whiteout Survival** game calculator that computes resource costs for upgrading charms, chief gear, buildings (Fire Crystals), War Academy, pets, and experts. The project follows a **data-driven architecture** where all game data originates from an authoritative Excel workbook (`src/assets/resource_data.xlsx`) and is extracted to CSV files, then dynamically loaded at runtime.

**Tech stack**: Vanilla JavaScript (ES6+), CSS3 custom properties, HTML5 semantic markup, Python HTTP server (dev), ExcelJS (data extraction), Stylelint (CSS quality).

## Architecture Philosophy

### Data-Driven Design
1. **Single source of truth**: `src/assets/resource_data.xlsx` (39 sheets)
2. **Build-time extraction**: Node.js scripts in `scripts/` convert sheets → CSVs
3. **Runtime override**: JavaScript modules load CSVs asynchronously and override default fallback values
4. **Graceful degradation**: If CSV missing, hardcoded defaults ensure calculator still functions

### Module System (IIFE + Revealing Module Pattern)
All JavaScript uses **IIFE (Immediately Invoked Function Expression)** for encapsulation:

```javascript
const ModuleName = (function(){
  'use strict';
  // Private scope - not accessible outside
  const privateVar = 'hidden';
  function privateMethod() { /* ... */ }
  
  // Public API - only exposed methods
  function publicMethod() { return privateVar; }
  
  return { publicMethod };  // Reveal only what's needed
})();
```

**Critical module dependency chain** (load order matters):
```
Independent (load first):
├── icon-helper.js      - Icon rendering utility (global window.IconHelper)
├── theme.js            - Theme toggle (global window.ThemeModule)
├── table-sort.js       - Sortable tables (global window.TableSortModule)
├── data-loader.js      - CSV loader/cache (global window.DataLoader)
└── translations.js     - i18n support (global window.I18n)

Dependent (load after):
├── calculator.js       - Charms calculator (uses table-sort, icon-helper)
├── chief-gear-calculator.js - Chief gear (uses table-sort, icon-helper)
├── fire-crystals-calculator.js - Fire Crystals (uses data-loader, icon-helper)
└── profiles.js         - Profile management (uses calculator APIs)
```

**HTML script loading pattern** (use `defer`, maintain order):
```html
<!-- Independent modules first -->
<script src="Scripts/icon-helper.js" defer></script>
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/table-sort.js" defer></script>

<!-- Dependent modules after -->
<script src="Scripts/calculator.js" defer></script>
<script src="Scripts/profiles.js" defer></script>
```

### Data Pipeline: Excel → CSV → JavaScript

```
┌─────────────────────────────────┐
│  resource_data.xlsx (39 sheets) │  ← Edit game data here
└────────────┬────────────────────┘
             │
             │ npm run import:all
             ↓
┌─────────────────────────────────┐
│  CSV files (assets/*.csv)       │  ← Generated, don't edit manually
│  • charms_costs.csv             │
│  • chief_gear_costs.csv         │
│  • resource_costs.csv           │
└────────────┬────────────────────┘
             │
             │ Browser loads HTML
             ↓
┌─────────────────────────────────┐
│  JavaScript modules              │  ← Fetch CSV, override defaults
│  • loadCharmCostsFromCsv()      │
│  • loadChiefGearCostsFromCsv()  │
│  • applyResourceOverridesFromCsv│
└─────────────────────────────────┘
```

**Extraction commands**:
```bash
npm run import:all          # Extract all (charms + chief gear + buildings)
npm run import:charms       # Charms only (assets/charms_costs.csv)
npm run import:buildings    # Fire Crystals only (assets/resource_costs.csv)
npm run import:chief-gear   # Chief gear only (assets/chief_gear_costs.csv)
```

### CSV Override Pattern (Standard Across All Calculators)
```javascript
// Step 1: Define defaults (fallback if CSV fails)
const costs = {
  0: { guides: 5, designs: 5, secrets: 0, power: 205700, svsPoints: 625 },
  // ... 15 more levels
};

// Step 2: Async CSV loader
async function loadCostsFromCsv(url = 'assets/charms_costs.csv') {
  try {
    const { header, rows } = await window.DataLoader.loadCsv(url);
    // Parse rows and override costs object
    for (const row of rows) {
      const level = parseInt(row[0], 10);
      costs[level] = { guides: parseInt(row[1]), ... };
    }
    console.info(`Applied ${rows.length} overrides from CSV`);
  } catch (e) {
    console.warn('CSV override skipped:', e.message);
    // Defaults remain active - calculator still works
  }
}

// Step 3: Call immediately (don't await - non-blocking)
loadCostsFromCsv();
```

## Critical Conventions

### Accessibility-First Development
**Non-negotiable requirements**:
- Semantic HTML: `<main role="main">`, `<nav role="navigation">`, `<section aria-label="...">`
- All interactive elements: `aria-label`, `aria-describedby`, or `aria-labelledby`
- Keyboard navigation: Tab (focus), Enter/Space (activate), Escape (close modals)
- ARIA states: `aria-pressed` (toggles), `aria-sort` (table headers), `aria-current` (nav)
- Focus management: Trap focus in modals, restore focus after close

**Example - accessible button**:
```html
<button id="save-profile" 
        aria-label="Save current upgrade plan as new profile"
        class="btn primary">
  Save as New
</button>
```

### CSS Theme System (Custom Properties)
**All colors MUST use CSS variables** - never hardcode hex values in components:

```css
:root {
  --bg: #12121a;           /* Main background */
  --panel: #1f1d32;        /* Card/panel background */
  --muted: #2f2b45;        /* Input background */
  --accent: #7c6cff;       /* Primary action color */
  --text: #e9eef8;         /* Primary text */
  --muted-text: #bfc6df;   /* Secondary text */
  --success: #6ad29a;      /* Success state */
  --danger: #ff7b7b;       /* Danger/delete state */
}

html.light-theme {
  --bg: #fff;
  --panel: #f2f2f6;
  --accent: #6b6bf0;
  --text: #111;
  /* ... override all theme vars */
}
```

**Usage in components**:
```css
.panel {
  background: var(--panel);   /* Not #1f1d32! */
  color: var(--text);
  border: 1px solid var(--muted);
}
```

Theme toggle is managed by `ThemeModule` which adds/removes `.light-theme` class on `<html>`.

### HTML ID Naming Conventions

**Calculator inputs** (auto-detected by JavaScript):
```html
<!-- Pattern: {type}-charm-{number}-{start|finish} -->
<select id="hat-charm-1-start"></select>     <!-- FROM level -->
<select id="hat-charm-1-finish"></select>    <!-- TO level -->
<select id="hat-charm-2-start"></select>
<!-- ... repeat for all charms -->

<!-- Batch controls: {type}-batch-{from|to} -->
<select id="hat-batch-from"></select>        <!-- Set all FROM -->
<select id="hat-batch-to"></select>          <!-- Set all TO -->
```

**Profile section** (unified across all pages):
```html
<select id="profiles-list"></select>         <!-- Saved profiles dropdown -->
<button id="load-profile-btn"></button>      <!-- Load selected -->
<button id="save-profile-btn"></button>      <!-- Save as new -->
<button id="rename-profile-btn"></button>    <!-- Rename existing -->
<button id="delete-profile-btn"></button>    <!-- Delete selected -->
```

### LocalStorage Architecture

**Keys and migration strategy**:
```javascript
// Current unified system (v2.0+)
'wos-unified-profiles'  // Stores all page data: { charms: {}, chiefGear: {}, ... }
'wos-theme'             // 'light' or 'dark'
'wos-language'          // 'en', 'es', 'ko', 'ru'
'wos-last-profile'      // Last loaded profile name

// Legacy (v1.x) - auto-migrated on load
'wos-charm-profiles'    // Old charms-only profiles (migrated to unified)
```

**Safe storage pattern** (handle quota errors, private browsing):
```javascript
function saveProfiles(data) {
  try {
    localStorage.setItem('wos-unified-profiles', JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save:', e);
    alert('Could not save profile (storage full or disabled)');
  }
}

function readProfiles() {
  const raw = localStorage.getItem('wos-unified-profiles');
  return raw ? JSON.parse(raw) : {};
}
```

## Development Workflows

### Local Development Server
**Never use `file://` protocol** - localStorage, fetch(), and CORS won't work properly.

```bash
npm start                    # Starts Python server on http://127.0.0.1:8080
# OR manually:
cd src && python -m http.server 8080
```

### CSS Linting (Enforce Quality)
```bash
npm run lint                 # Check style.css for errors
npm run lint:fix             # Auto-fix formatting issues
```

**Config**: `.stylelintrc.json` (extends `stylelint-config-standard`)  
**Common violations**: Missing semicolons, invalid hex colors, duplicate selectors, unknown properties

### Post-Edit Testing Checklist
Before committing any change, verify:
1. **Console clean**: Open DevTools (F12) → Console → No errors
2. **Theme toggle**: Switch light/dark → All colors update correctly
3. **Calculator**: Change FROM/TO levels → Results table updates
4. **Batch controls**: Set batch FROM/TO → All inputs change
5. **Profiles**: Save new → Load → Rename → Delete → Verify localStorage
6. **Table sorting**: Click column headers → Rows re-sort (ascending/descending)
7. **Keyboard nav**: Tab through page → Enter/Space activates buttons
8. **Responsive**: Resize browser → Layout adapts (mobile breakpoints: 768px, 480px)

## File Organization & Responsibilities

```
Wos calculator/
├── src/                          # All source code (HTML/CSS/JS/Assets)
│   ├── *.html                    # Calculator pages (charms, chiefGear, fireCrystals, etc.)
│   │   ├── index.html            # Landing page with nav
│   │   ├── charms.html           # Charms calculator
│   │   ├── chiefGear.html        # Chief gear calculator
│   │   ├── fireCrystals.html     # Fire Crystals (buildings)
│   │   ├── warAcademy.html       # War Academy
│   │   ├── pets.html             # Pets (future)
│   │   └── experts.html          # Experts (future)
│   ├── Scripts/                  # Modular JavaScript
│   │   ├── theme.js              # ~150 lines - Theme toggle
│   │   ├── table-sort.js         # ~150 lines - Sortable tables
│   │   ├── calculator.js         # ~665 lines - Charms calculations
│   │   ├── chief-gear-calculator.js  # Chief gear calculations
│   │   ├── fire-crystals-calculator.js  # ~1234 lines - Buildings
│   │   ├── profiles.js           # ~533 lines - Profile CRUD + migration
│   │   ├── translations.js       # ~440 lines - i18n support
│   │   ├── data-loader.js        # ~30 lines - CSV fetch/cache utility
│   │   └── icon-helper.js        # ~25 lines - Icon rendering utility
│   ├── style/
│   │   └── style.css             # ~347 lines - Single CSS for ALL pages
│   └── assets/
│       ├── resource_data.xlsx    # SOURCE OF TRUTH (edit here)
│       ├── *_costs.csv           # Generated CSVs (don't edit manually)
│       └── resources/            # Icon images (base/, charms/, chief-gear/)
├── scripts/                      # Node.js data extraction
│   ├── extract-charms-costs.js   # Charms Data sheet → charms_costs.csv
│   ├── extract-chief-gear-costs.js   # New Chief Gear Data → chief_gear_costs.csv
│   └── extract-building-resources.js # 8 building sheets → resource_costs.csv
├── docs/                         # Comprehensive documentation
│   ├── START_HERE.md             # Entry point overview
│   ├── MAINTENANCE.md            # How-to guide (colors, costs, features)
│   ├── PROJECT_STRUCTURE.md      # File-by-file explanation
│   ├── TECHNICAL_ARCHITECTURE.md # Architecture evolution, patterns
│   └── QUICK_REFERENCE.md        # Quick lookup guide
├── package.json                  # npm scripts, dependencies
├── .stylelintrc.json             # CSS linting rules
└── README.md                     # User-facing guide
```

## Common Development Tasks

### Adding a New Calculator Page
1. **Copy template**: Duplicate `charms.html` → `newpage.html`
2. **Update navigation**: Add link in `<nav class="main-nav">` across all HTML files
3. **Create calculator module**: `Scripts/newpage-calculator.js` following IIFE pattern
4. **Add script tags**: Include dependencies in correct order (icon-helper, theme, data-loader, translations, your-calculator, profiles)
5. **Update profiles**: Modify `ProfilesModule.captureCurrent()` and `loadSelectedProfile()` to save/load new page data

### Modifying Resource Costs
**Method 1 (Recommended)**: Update Excel + re-extract
```bash
1. Edit src/assets/resource_data.xlsx (e.g., change Guides for level 10)
2. Run: npm run import:charms     # Or import:all
3. Test: npm start → verify calculator shows new values
```

**Method 2**: Direct CSV edit (quick fixes)
```bash
1. Open src/assets/charms_costs.csv
2. Edit row: 10,560,420,0,1320000,16000  # level,guides,designs,secrets,power,svsPoints
3. Save → refresh browser
```

**Method 3**: JavaScript defaults (not recommended - CSV overrides anyway)
```javascript
// In calculator.js
const costs = {
  10: { guides: 560, designs: 420, ... }  // Change here
};
```

### Adding a New Charm Type
1. **HTML structure** (`charms.html`):
   ```html
   <div class="charm-type" id="boots-charm">
     <h3 data-i18n="boots-charm-title">Boots Charm</h3>
     <div class="charm-grid">
       <label>From</label><label>To</label>
       <select id="boots-charm-1-start"><!-- 0-15 --></select>
       <select id="boots-charm-1-finish"><!-- 0-15 --></select>
       <!-- Repeat for 6 charms -->
     </div>
     <div class="batch-controls">
       <select id="boots-batch-from"></select>
       <select id="boots-batch-to"></select>
     </div>
   </div>
   ```

2. **CSS** (auto-inherits from `.charm-type` class - no changes needed usually)

3. **JavaScript** (`calculator.js` auto-detects IDs):
   ```javascript
   // CalculatorModule.calculateAll() finds all inputs matching:
   // {type}-charm-{n}-start and {type}-charm-{n}-finish
   // No code changes needed if ID pattern followed correctly
   ```

### Changing Theme Colors
Edit CSS custom properties in `src/style/style.css`:
```css
:root {
  --accent: #7c6cff;    /* Change to #ff5733 for orange */
}

html.light-theme {
  --accent: #6b6bf0;    /* Change to #e04d2e for light mode orange */
}
```
**Effect**: All buttons, links, highlights update instantly (no hard-coded colors exist).

## Integration Points & External Dependencies

### Build-Time Dependencies (Node.js)
- **ExcelJS** (`npm install exceljs`): Parse `.xlsx` workbooks in extraction scripts
- **Stylelint** + **stylelint-config-standard**: CSS quality enforcement

### Runtime Environment
- **Python HTTP Server**: Dev server only (no backend logic - just serves static files)
- **LocalStorage**: Client-side persistence (no database, no server state)
- **Fetch API**: Load CSV files (requires HTTP server, not `file://`)

### Browser Requirements
- **ES6+ support**: Arrow functions, async/await, const/let, template literals
- **CSS Grid & Flexbox**: Layout system
- **CSS Custom Properties**: Theme system
- **LocalStorage**: Profile/theme persistence

## Key Documentation References

| Need | Document | Path |
|------|----------|------|
| Quick start | README.md | Root |
| Change colors/costs | MAINTENANCE.md | `docs/` |
| Understand architecture | TECHNICAL_ARCHITECTURE.md | Root |
| File responsibilities | PROJECT_STRUCTURE.md | `docs/` |
| Module dependencies | Scripts/README.md | `src/Scripts/` |

**When stuck**: Check `docs/MAINTENANCE.md` for step-by-step examples with code snippets.
## Anti-Patterns to Avoid

### ❌ Don't Do This
```javascript
// Hardcoded colors (breaks themes)
.button { background: #7c6cff; }

// Synchronous CSV loading (blocks UI)
const data = loadCsvSync('costs.csv');

// Module pollution (breaks encapsulation)
window.myGlobalVar = 'exposed';

// Direct DOM manipulation without IDs
document.querySelectorAll('select')[3].value = 5;

// Skipping error handling on localStorage
localStorage.setItem('key', JSON.stringify(data));  // Can throw!
```

### ✅ Do This Instead
```javascript
// Use CSS variables
.button { background: var(--accent); }

// Async loading with fallback
async function loadCsv() {
  try { /* load CSV */ }
  catch(e) { /* use defaults */ }
}

// Proper module pattern
const Module = (function(){ /* ... */ return { publicAPI }; })();

// Semantic IDs for reliable selection
document.getElementById('hat-charm-1-start').value = 5;

// Safe localStorage with try-catch
try { localStorage.setItem('key', JSON.stringify(data)); }
catch(e) { console.warn('Storage failed:', e); }
```

## Debugging Tips

### Console Logging Strategy
Each module logs its lifecycle:
```javascript
console.info('[Charms] Applied 16 cost overrides from CSV');
console.warn('[Profiles] CSV override skipped: File not found');
console.error('[Calculator] Invalid level range: from=10, to=5');
```

**Key indicators**:
- `[Charms] Applied X overrides` → CSV loaded successfully
- `CSV override skipped` → Using fallback defaults (not fatal)
- Check Network tab in DevTools for 404s on CSV files

### Common Issues

| Symptom | Cause | Fix |
|---------|-------|-----|
| Calculator shows wrong costs | CSV not loaded or outdated | Run `npm run import:all` |
| Theme toggle doesn't work | Script load order wrong | Move `theme.js` before dependent scripts |
| Profiles don't save | Running on `file://` protocol | Use `npm start` (HTTP server required) |
| Table won't sort | `table-sort.js` not loaded | Add script tag before calculator module |
| Icons missing | Wrong path or 404 | Check `assets/resources/` structure |

**Pro tip**: If you see `[Module] Applied 0 overrides`, the CSV header columns might not match what the parser expects.
