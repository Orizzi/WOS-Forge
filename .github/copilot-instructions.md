# Copilot Instructions - WOS Calculator

## Project Overview
This is a Whiteout Survival game calculator that computes resource costs for upgrading charms, chief gear, and buildings (Fire Crystals). All data is sourced from an authoritative Excel workbook (`src/assets/resource_data.xlsx`) and converted to CSV files at build time.

## Architecture Patterns

### Module System (IIFE Pattern)
All JavaScript uses the **Immediately Invoked Function Expression (IIFE)** pattern with revealing module pattern:

```javascript
const ModuleName = (function(){
  'use strict';
  // Private variables/functions
  const privateVar = 'hidden';
  function privateMethod() { /* ... */ }
  
  // Public API
  function publicMethod() { return privateVar; }
  
  return { publicMethod };  // Only expose what's needed
})();
```

**Key modules:**
- `theme.js` - Theme toggle (no dependencies)
- `table-sort.js` - Sortable tables (no dependencies)
- `calculator.js` - Cost calculations (uses table-sort)
- `profiles.js` - Profile CRUD operations (uses calculator)
- `data-loader.js` - CSV caching utility (shared)
- `icon-helper.js` - Icon rendering utility (shared)

### Module Loading Order Matters
In HTML files, load scripts in dependency order using `defer`:
```html
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/table-sort.js" defer></script>
<script src="Scripts/calculator.js" defer></script>
<script src="Scripts/profiles.js" defer></script>
```

### Data Flow: Excel → CSV → JavaScript
1. **Source of truth**: `src/assets/resource_data.xlsx` (39 sheets)
2. **Extraction scripts**: Node.js scripts in `scripts/` convert sheets to CSV
3. **Runtime loading**: JavaScript modules load CSVs and override default costs

**Commands:**
```bash
npm run import:all          # Extract all data
npm run import:charms       # Extract charms only
npm run import:buildings    # Extract Fire Crystals resources only
npm run import:chief-gear   # Extract chief gear only
```

### CSV Override Pattern
All calculators follow this pattern:
```javascript
// 1. Define default costs in code (fallback)
const costs = { 0: { guides: 5, designs: 5, ... }, ... };

// 2. Async function to load and override from CSV
async function loadCostsFromCsv(url) {
  const { header, rows } = await DataLoader.loadCsv(url);
  // Parse and override costs object
}

// 3. Call on init, gracefully fail if CSV missing
loadCostsFromCsv('assets/charms_costs.csv');
```

## Critical Conventions

### Accessibility First
- Use semantic HTML: `<section>`, `<nav role="navigation">`, `<main role="main">`
- All interactive elements need `aria-label` or `aria-describedby`
- Keyboard navigation must work (Tab + Enter/Space)
- Theme toggle has `aria-pressed` state

### CSS Theme Variables
All colors use CSS custom properties for dark/light theme support:
```css
:root {
  --bg: #12121a;
  --panel: #1f1d32;
  --accent: #7c6cff;
  --text: #e9eef8;
}

html.light-theme {
  --bg: #fff;
  --panel: #f2f2f6;
  --accent: #6b6bf0;
  --text: #111;
}
```
**Never hardcode colors** - always use `var(--variable-name)`.

### HTML ID Naming Pattern
Calculator inputs follow strict naming convention:
```html
<!-- Pattern: {charm-type}-charm-{number}-{start|finish} -->
<select id="hat-charm-1-start"></select>    <!-- FROM level -->
<select id="hat-charm-1-finish"></select>   <!-- TO level -->

<!-- Batch controls: {charm-type}-batch-{from|to} -->
<select id="hat-batch-from"></select>
```

### LocalStorage Keys
- Unified profiles: `'wos-unified-profiles'` (current)
- Legacy profiles: `'wos-charm-profiles'` (auto-migrated)
- Theme: `'wos-theme'`

Always check for existence before parsing:
```javascript
const raw = localStorage.getItem('key');
if(raw) { const data = JSON.parse(raw); }
```

## Development Workflows

### Local Development
```bash
npm start                    # Starts Python server on :8080
# OR
cd src && python -m http.server 8080
```
Never run from file:// protocol - localStorage won't work.

### Linting CSS
```bash
npm run lint                 # Check CSS style
npm run lint:fix             # Auto-fix issues
```
Config: `.stylelintrc.json` (stylelint-config-standard)

### Testing Checklist After Changes
1. Open browser console (F12) - check for errors
2. Test theme toggle (dark/light switch)
3. Test calculator (change levels, verify results)
4. Test profiles (save, load, rename, delete)
5. Test table sorting (click headers)
6. Test keyboard navigation (Tab + Enter)

## File Organization

```
src/
├── *.html                  # Calculator pages (charms, chiefGear, fireCrystals, etc.)
├── Scripts/                # Modular JavaScript
│   ├── calculator.js       # Core calculation logic
│   ├── profiles.js         # Profile management
│   ├── theme.js            # Theme toggle
│   ├── table-sort.js       # Sortable tables
│   ├── data-loader.js      # CSV caching utility
│   └── icon-helper.js      # Icon rendering utility
├── style/
│   └── style.css           # Single CSS file for all pages
└── assets/
    ├── resource_data.xlsx  # Source of truth (DO NOT EDIT via code)
    ├── *_costs.csv         # Generated CSV files
    └── resources/          # Icon images (base/, charms/, chief-gear/)

scripts/                    # Node.js extraction scripts
├── extract-charms-costs.js
├── extract-chief-gear-costs.js
└── extract-building-resources.js

docs/                       # Comprehensive documentation
├── START_HERE.md           # Entry point
├── MAINTENANCE.md          # How-to guide
└── PROJECT_STRUCTURE.md    # Architecture reference
```

## Common Tasks

### Adding New Charm Type
1. **HTML**: Add new charm section with correct IDs
   ```html
   <div class="charm-type" id="newtype-charm">
     <select id="newtype-charm-1-start">...</select>
     <select id="newtype-charm-1-finish">...</select>
   </div>
   ```
2. **CSS**: Style follows `.charm-type` class (auto-inherits)
3. **JS**: Calculator auto-detects IDs matching pattern `{type}-charm-{n}-{start|finish}`

### Modifying Resource Costs
**Option 1 (Recommended)**: Update Excel workbook, run extraction
```bash
# Edit src/assets/resource_data.xlsx
npm run import:all
```

**Option 2**: Directly edit CSV files in `src/assets/`

**Option 3**: Modify defaults in JavaScript (not recommended, CSV will override)

### Adding New Calculator Page
1. Copy `charms.html` structure
2. Include required scripts: `theme.js`, `data-loader.js`, `icon-helper.js`
3. Create calculator module in `Scripts/` following IIFE pattern
4. Update main navigation in all HTML files
5. Add extraction script if new data source

## Integration Points

- **ExcelJS**: Used in `scripts/` to parse `.xlsx` workbooks
- **Python HTTP Server**: Dev server (no backend dependencies)
- **LocalStorage**: Client-side persistence (no server/database)
- **Stylelint**: CSS linting (config: `.stylelintrc.json`)

## Documentation References

- **Quick Start**: `README.md`
- **Maintenance Guide**: `docs/MAINTENANCE.md` (color changes, cost modifications, new features)
- **Architecture**: `docs/TECHNICAL_ARCHITECTURE.md` (evolution, performance, accessibility)
- **Module Details**: `src/Scripts/README.md` (dependencies, loading order, testing)

When in doubt, check `docs/MAINTENANCE.md` for step-by-step examples.
