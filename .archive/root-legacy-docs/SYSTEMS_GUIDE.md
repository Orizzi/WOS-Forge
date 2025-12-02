# WOS Calculator - Systems Guide

**Version:** 2.1.0  
**Last Updated:** December 2, 2025  
**Purpose:** Comprehensive guide to all core systems (i18n, data pipeline, theme, UI flow, profiles)

---

## Table of Contents

1. [Internationalization (i18n) System](#internationalization-i18n-system)
2. [Data Pipeline](#data-pipeline)
3. [Theme System](#theme-system)
4. [Profile System](#profile-system)
5. [UI Flow & Page Architecture](#ui-flow--page-architecture)
6. [Service Worker & PWA](#service-worker--pwa)
7. [Event System](#event-system)
8. [Storage & Persistence](#storage--persistence)

---

## Internationalization (i18n) System

### Overview
Complete multi-language support system with 8 languages and 193 translation keys per language.

### Supported Languages
- 🇬🇧 **English (EN)** - Default
- 🇪🇸 **Spanish (ES)**
- 🇰🇷 **Korean (KO)**
- 🇷🇺 **Russian (RU)**
- 🇫🇷 **French (FR)**
- 🇩🇪 **German (DE)**
- 🇵🇹 **Portuguese (PT)**
- 🇮🇹 **Italian (IT)**

### File Structure
```
src/Scripts/translations.js (81KB)
  ├── translations = {
  │     en: { 193 keys },
  │     es: { 193 keys },
  │     ko: { 193 keys },
  │     ru: { 193 keys },
  │     fr: { 193 keys },
  │     de: { 193 keys },
  │     pt: { 193 keys },
  │     it: { 193 keys }
  │   }
  ├── I18n.currentLanguage
  ├── I18n.t(key) - Get translation
  ├── I18n.setLanguage(lang) - Switch language
  └── I18n.applyTranslations() - Update DOM
```

### Implementation

#### HTML Usage
```html
<!-- Basic translation -->
<h1 data-i18n="title">Default Text</h1>

<!-- Button with translation -->
<button data-i18n="calculate">Calculate</button>

<!-- Placeholder translation -->
<input type="text" data-i18n-placeholder="enter-name" />

<!-- Multiple attributes -->
<button data-i18n="save" data-i18n-title="save-tooltip">Save</button>
```

#### JavaScript Usage
```javascript
// Get translation for current language
const text = I18n.t('calculate'); // Returns "Calculate" in current language

// With placeholder replacement
const message = I18n.t('need-x-more').replace('{x}', '100');
// Returns "Need 100 more" (translated)

// Check current language
if (I18n.currentLanguage === 'fr') {
  // French-specific logic
}

// Change language programmatically
I18n.setLanguage('es');
I18n.applyTranslations(); // Update all data-i18n elements
```

#### Adding New Translation Keys
```javascript
// 1. Open src/Scripts/translations.js

// 2. Add key to ALL 8 language objects
const translations = {
  en: {
    // ... existing keys
    'my-new-key': 'My New Text',
  },
  es: {
    // ... existing keys
    'my-new-key': 'Mi Nuevo Texto',
  },
  // ... add to fr, de, pt, it, ko, ru
};

// 3. Use in HTML
<span data-i18n="my-new-key">Fallback text</span>

// 4. Or in JavaScript
const text = I18n.t('my-new-key');
```

### Language Persistence
```javascript
// Stored in localStorage
localStorage.setItem('language', 'fr'); // Save preference
const lang = localStorage.getItem('language') || 'en'; // Load preference

// Applied on page load
document.addEventListener('DOMContentLoaded', () => {
  const savedLang = localStorage.getItem('language') || 'en';
  I18n.setLanguage(savedLang);
  I18n.applyTranslations();
});
```

### Language Selector
```html
<!-- Standard language selector on all pages -->
<select id="language-selector">
  <option value="en">English</option>
  <option value="es">Español</option>
  <option value="fr">Français</option>
  <option value="de">Deutsch</option>
  <option value="pt">Português</option>
  <option value="it">Italiano</option>
  <option value="ko">한국어</option>
  <option value="ru">Русский</option>
</select>

<script>
document.getElementById('language-selector').addEventListener('change', (e) => {
  I18n.setLanguage(e.target.value);
  I18n.applyTranslations();
  localStorage.setItem('language', e.target.value);
});
</script>
```

### Translation Categories
**UI Elements** (50 keys):
- Navigation, buttons, labels, headings

**Calculator Terms** (80 keys):
- Resource names, calculator-specific terminology

**Messages** (30 keys):
- Error messages, success messages, tooltips

**Time Units** (6 keys):
- days, hours, minutes, seconds

**Gap Messages** (3 keys):
- need-x-more, have-x-extra, exact-match

**Data Status** (3 keys):
- data-ok, data-failed, data-not-loaded

**Profile System** (21 keys):
- Profile management UI strings

### Best Practices
1. ✅ **Always add to all 8 languages** - Maintain parity
2. ✅ **Use meaningful key names** - `calculate-button` not `btn1`
3. ✅ **Keep game terminology** - Preserve Whiteout Survival terms
4. ✅ **Test in all languages** - Verify translations display correctly
5. ✅ **Use placeholders** - `{x}`, `{name}` for dynamic values
6. ⛔ **Never hardcode English** - Use translation keys everywhere

### Future Enhancements
- [ ] Dynamic translation loading (reduce initial bundle size)
- [ ] Translation validation tool (check for missing keys)
- [ ] Pluralization support (1 item vs 2 items)
- [ ] Date/number formatting per locale
- [ ] RTL language support (Arabic, Hebrew)

---

## Data Pipeline

### Overview
Excel workbook → Node.js extraction scripts → CSV files → Browser data loaders → Calculators

### Data Flow Architecture
```
┌─────────────────────────────────────────────────┐
│  src/assets/resource_data.xlsx                  │
│  (Source of Truth - Game Data)                  │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│  Node.js Extraction Scripts (scripts/)          │
│  - extract-charms-costs.js                      │
│  - extract-chief-gear-costs.js                  │
│  - extract-fire-crystal-refinement.js           │
│  - extract-building-power.js                    │
│  - export-all-sheets-to-csv.js                  │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│  CSV Files (src/assets/)                        │
│  - charms_costs.csv                             │
│  - chief_gear_costs.csv                         │
│  - fire_crystals_costs.csv                      │
│  - resource_costs.csv                           │
│  - building_power.csv                           │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│  Browser Data Loader (data-loader.js)           │
│  - Fetch CSV with caching                       │
│  - Parse and validate                           │
│  - Fallback to inline defaults                  │
└───────────────┬─────────────────────────────────┘
                │
                ▼
┌─────────────────────────────────────────────────┐
│  Calculator Modules                              │
│  - Process data                                  │
│  - Perform calculations                          │
│  - Update UI                                     │
└─────────────────────────────────────────────────┘
```

### Extraction Commands
```bash
# Extract all data after Excel updates
npm run import:all

# Individual extractors
npm run import:charms        # Charms costs
npm run import:chief-gear    # Chief Gear costs
npm run import:fc            # Fire Crystals costs & times
npm run import:power         # Building power values

# Utility commands
npm run export:sheets        # Export all sheets to CSV
npm run analyze:sheets       # Analyze workbook structure
```

### CSV File Schemas

#### Charms Costs (`charms_costs.csv`)
```csv
level,guides,designs,secrets,power,svsPoints
1,10,5,2,100,50
2,20,10,4,250,100
...
```

#### Chief Gear Costs (`chief_gear_costs.csv`)
```csv
level,hardenedAlloy,polishingSolution,designPlans,lunarAmber,power,svsPoints
Green 1,100,50,25,0,500,100
Green 2,120,60,30,0,600,120
...
Red 10,5000,2500,1250,500,50000,5000
```

#### Fire Crystals Costs (`fire_crystals_costs.csv`)
```csv
building,level,fc,rfc,meat,wood,coal,iron,timeSeconds,power
Furnace,1,10,5,1000,800,600,400,3600,200
Furnace,2,15,7,1500,1200,900,600,5400,300
...
```

#### Building Power (`building_power.csv`)
```csv
building,level,power
Furnace,1,200
Furnace,2,300
...
```

### Data Loader Implementation
```javascript
// src/Scripts/data-loader.js

const DataLoader = {
  cache: new Map(),
  
  async loadCSV(url, fallbackData = null) {
    // Check cache first
    if (this.cache.has(url)) {
      return this.cache.get(url);
    }
    
    try {
      // Fetch with no-cache to get latest
      const response = await fetch(url, { cache: 'no-cache' });
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      
      const csvText = await response.text();
      const rows = this.parseCSV(csvText);
      
      // Cache successful result
      this.cache.set(url, rows);
      
      return rows;
    } catch (error) {
      console.warn(`CSV load failed for ${url}:`, error);
      
      // Fallback to inline data if provided
      if (fallbackData) {
        console.log('Using fallback data');
        return fallbackData;
      }
      
      throw error;
    }
  },
  
  parseCSV(csvText) {
    const lines = csvText.split('\n').filter(line => line.trim());
    const headers = lines[0].split(',').map(h => h.trim());
    
    return lines.slice(1).map(line => {
      const values = line.split(',').map(v => v.trim());
      const row = {};
      
      headers.forEach((header, index) => {
        const value = values[index];
        // Convert numbers
        row[header] = isNaN(value) ? value : parseFloat(value);
      });
      
      return row;
    });
  },
  
  clearCache() {
    this.cache.clear();
  }
};
```

### Calculator Data Loading Pattern
```javascript
// Example: Fire Crystals Calculator

const FireCrystalsCalculator = {
  data: null,
  
  async init() {
    try {
      // Try loading from CSV
      this.data = await DataLoader.loadCSV(
        'assets/fire_crystals_costs.csv',
        FireCrystalFlatCosts // Inline fallback
      );
      
      // Dispatch success event
      document.dispatchEvent(new CustomEvent('fc-data-ready', {
        detail: {
          rows: this.data,
          source: 'csv',
          error: null
        }
      }));
      
      console.log('Fire Crystals data loaded:', this.data.length, 'rows');
    } catch (error) {
      // Dispatch error event
      document.dispatchEvent(new CustomEvent('fc-data-ready', {
        detail: {
          rows: null,
          source: 'none',
          error: error.message
        }
      }));
      
      console.error('Fire Crystals data load failed:', error);
    }
  },
  
  calculateAll() {
    if (!this.data) {
      console.warn('No data loaded yet');
      return;
    }
    
    // Perform calculations...
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  FireCrystalsCalculator.init();
});
```

### Data Validation
```javascript
// Validate CSV schema before using
function validateCharmsData(rows) {
  const requiredColumns = ['level', 'guides', 'designs', 'secrets', 'power', 'svsPoints'];
  
  if (!rows || rows.length === 0) {
    throw new Error('No data rows');
  }
  
  const firstRow = rows[0];
  const missingColumns = requiredColumns.filter(col => !(col in firstRow));
  
  if (missingColumns.length > 0) {
    throw new Error(`Missing columns: ${missingColumns.join(', ')}`);
  }
  
  return true;
}
```

### Best Practices
1. ✅ **Excel as source of truth** - Always update Excel first
2. ✅ **Run extraction after Excel changes** - `npm run import:all`
3. ✅ **Validate CSV schemas** - Check headers match expectations
4. ✅ **Provide fallback data** - Inline defaults for offline use
5. ✅ **Cache loaded data** - Avoid repeated fetches
6. ✅ **Handle errors gracefully** - Show user-friendly messages
7. ⛔ **Don't edit CSV directly** - Changes will be overwritten

### Constraints
- **File paths must stay stable** - GitHub Pages expects specific paths
- **CSV headers must match** - Calculator code depends on column names
- **Keep game terminology** - Don't "correct" domain-specific terms
- **No server-side processing** - All computation is client-side

---

## Theme System

### Overview
Dark/Light mode toggle with CSS variables and localStorage persistence.

### Implementation
```html
<!-- Theme toggle button -->
<button id="theme-toggle" aria-label="Toggle theme">
  <span class="theme-icon">🌙</span>
</button>
```

### CSS Variables
```css
/* Default: Dark Theme */
:root {
  --primary-bg: #1e1e2e;
  --secondary-bg: #2a2a3a;
  --tertiary-bg: #3a3a4a;
  
  --text-primary: #e0e0e0;
  --text-secondary: #b0b0b0;
  --text-muted: #808080;
  
  --accent: #7c6cff;
  --accent-hover: #9b8dff;
  
  --success-color: #4ade80;
  --warning-color: #fbbf24;
  --error-color: #f87171;
  
  --border-color: #4a4a5a;
  --hover-bg: #35354a;
  
  --shadow: rgba(0, 0, 0, 0.3);
}

/* Light Theme */
html.light-theme {
  --primary-bg: #f5f5f5;
  --secondary-bg: #ffffff;
  --tertiary-bg: #e5e5e5;
  
  --text-primary: #2c2c2c;
  --text-secondary: #555555;
  --text-muted: #888888;
  
  --accent: #5a4fcf;
  --accent-hover: #7a6fdf;
  
  --success-color: #22c55e;
  --warning-color: #f59e0b;
  --error-color: #ef4444;
  
  --border-color: #d0d0d0;
  --hover-bg: #e8e8e8;
  
  --shadow: rgba(0, 0, 0, 0.1);
}
```

### JavaScript Implementation
```javascript
// src/Scripts/theme.js

const ThemeModule = {
  init() {
    // Load saved theme
    const savedTheme = localStorage.getItem('theme') || 'dark';
    this.setTheme(savedTheme);
    
    // Setup toggle button
    const toggleBtn = document.getElementById('theme-toggle');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => this.toggle());
    }
  },
  
  toggle() {
    const currentTheme = this.getCurrentTheme();
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    this.setTheme(newTheme);
  },
  
  setTheme(theme) {
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
    } else {
      document.documentElement.classList.remove('light-theme');
    }
    
    localStorage.setItem('theme', theme);
    this.updateToggleIcon(theme);
  },
  
  getCurrentTheme() {
    return document.documentElement.classList.contains('light-theme') ? 'light' : 'dark';
  },
  
  updateToggleIcon(theme) {
    const icon = document.querySelector('.theme-icon');
    if (icon) {
      icon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
  }
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  ThemeModule.init();
});
```

### Smooth Transitions
```css
/* Add transitions to themed elements */
body,
.card,
.button,
input,
select,
textarea {
  transition: 
    background-color 200ms ease,
    color 200ms ease,
    border-color 200ms ease;
}
```

### Accessibility
```html
<!-- Proper ARIA labels -->
<button 
  id="theme-toggle" 
  aria-label="Toggle between dark and light theme"
  aria-pressed="false">
  <span class="theme-icon" aria-hidden="true">🌙</span>
</button>

<script>
// Update aria-pressed on toggle
function updateAriaPressed() {
  const btn = document.getElementById('theme-toggle');
  const isLight = document.documentElement.classList.contains('light-theme');
  btn.setAttribute('aria-pressed', isLight ? 'true' : 'false');
}
</script>
```

### Best Practices
1. ✅ **Use CSS variables** - Easy to maintain and override
2. ✅ **Persist preference** - Save to localStorage
3. ✅ **Smooth transitions** - Add transition CSS
4. ✅ **Accessible controls** - ARIA labels and keyboard support
5. ✅ **Sufficient contrast** - Test both themes for readability
6. ⛔ **Don't hardcode colors** - Always use CSS variables

---

## Profile System

### Overview
Save and load multiple profiles with form values and inventory tracking.

**See [PROFILES_SYSTEM.md](docs/PROFILES_SYSTEM.md) and [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md#profile-system-architecture) for complete details.**

### Quick Reference
```javascript
// Save current state as profile
ProfilesModule.saveProfile('My Profile');

// Load profile
ProfilesModule.loadProfile('My Profile');

// Rename profile
ProfilesModule.renameProfile('Old Name', 'New Name');

// Delete profile
ProfilesModule.deleteProfile('My Profile');

// Export profile as JSON
ProfilesModule.exportProfile('My Profile');

// Import profile from file
ProfilesModule.importProfile(fileObject);
```

### Storage Structure
```javascript
localStorage['wos-profiles'] = {
  "Profile 1": {
    name: "Profile 1",
    timestamp: 1701475200000,
    values: { /* all form inputs */ },
    inventory: { /* all inventory- prefixed inputs */ }
  }
}
```

---

## UI Flow & Page Architecture

### Page Structure
```
index.html (root)
  └── Landing page with navigation

src/
  ├── charms.html          - Charms calculator
  ├── chiefGear.html       - Chief Gear calculator
  ├── fireCrystals.html    - Fire Crystals calculator
  ├── war-academy.html     - War Academy calculator
  ├── experts.html         - Experts calculator (coming soon)
  ├── pets.html            - Pets calculator (coming soon)
  └── coming-soon.html     - Placeholder page
```

### Script Loading Order
```html
<!-- Standard page structure -->
<!DOCTYPE html>
<html lang="en">
<head>
  <link rel="stylesheet" href="style/style.css">
</head>
<body>
  <!-- Page content -->
  
  <!-- Core utilities (load first) -->
  <script src="Scripts/icon-helper.js"></script>
  <script src="Scripts/data-loader.js"></script>
  
  <!-- UI systems -->
  <script src="Scripts/theme.js"></script>
  <script src="Scripts/table-sort.js"></script>
  <script src="Scripts/translations.js"></script>
  
  <!-- Calculator-specific -->
  <script src="Scripts/modules/calculator.js"></script>
  
  <!-- Profile system (load last) -->
  <script src="Scripts/profiles.js"></script>
  
  <!-- Page-specific (if needed) -->
  <script src="Scripts/fc-status-ui.js"></script>
</body>
</html>
```

### Runtime Flow
```
Page Load (DOMContentLoaded)
  ↓
1. Theme system loads saved preference
  ↓
2. Translation system loads saved language
  ↓
3. Calculator initializes and binds inputs
  ↓
4. Data loader fetches CSV (if needed)
  ↓
5. Profile system restores last profile (if any)
  ↓
6. Calculator runs initial calculation
  ↓
User Interacts
  ↓
7. Input changes trigger auto-recalculation
  ↓
8. Profile autosave on changes
  ↓
9. Theme/language toggles update UI
```

### Event Flow
```javascript
// Page initialization
document.addEventListener('DOMContentLoaded', () => {
  ThemeModule.init();           // Load theme
  I18n.init();                  // Load language
  Calculator.init();            // Setup calculator
  ProfilesModule.init();        // Setup profiles
});

// Data loading (Fire Crystals example)
document.addEventListener('fc-data-ready', (e) => {
  if (e.detail.error) {
    // Handle error
    showDataStatus('error', e.detail.error);
  } else {
    // Data loaded successfully
    showDataStatus('success', `${e.detail.rows.length} rows loaded`);
    Calculator.calculateAll();
  }
});

// Input changes
document.addEventListener('input', (e) => {
  if (e.target.id.startsWith('inventory-')) {
    // Inventory changed - recalculate gaps
    WOSCalcCore.runActive();
  }
});
```

---

## Service Worker & PWA

### Overview
Progressive Web App support for offline access and caching (future enhancement).

### Current Status
- Service worker files present: `src/service-worker.js`, `src/manifest.json`
- Not fully implemented yet
- Planned for future release

### Planned Features
```javascript
// service-worker.js (planned)
const CACHE_VERSION = 'wos-calc-v1';
const CACHE_FILES = [
  '/',
  '/index.html',
  '/src/charms.html',
  '/src/chiefGear.html',
  '/src/fireCrystals.html',
  '/src/war-academy.html',
  '/src/style/style.css',
  '/src/Scripts/translations.js',
  '/src/Scripts/profiles.js',
  '/src/Scripts/theme.js',
  // Calculator modules
  '/src/Scripts/modules/calculator.js',
  '/src/Scripts/modules/chief-gear-calculator.js',
  '/src/Scripts/modules/fire-crystals-calculator.js',
  '/src/Scripts/modules/war-laboratory.js',
  // Data files
  '/src/assets/charms_costs.csv',
  '/src/assets/chief_gear_costs.csv',
  '/src/assets/fire_crystals_costs.csv',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION)
      .then(cache => cache.addAll(CACHE_FILES))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
  );
});
```

### Manifest
```json
{
  "name": "WOS Calculator",
  "short_name": "WOS Calc",
  "description": "Whiteout Survival resource calculator suite",
  "start_url": "/",
  "display": "standalone",
  "theme_color": "#7c6cff",
  "background_color": "#1e1e2e",
  "icons": [
    {
      "src": "/assets/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/assets/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

---

## Event System

### Custom Events

#### `fc-data-ready`
Dispatched when Fire Crystals data loads.

```javascript
document.dispatchEvent(new CustomEvent('fc-data-ready', {
  detail: {
    rows: [...],        // Data rows array
    source: 'csv',      // 'csv', 'inline', or 'none'
    error: null         // Error message if failed
  }
}));

// Listen for event
document.addEventListener('fc-data-ready', (e) => {
  if (e.detail.error) {
    console.error('FC data failed:', e.detail.error);
  } else {
    console.log('FC data loaded:', e.detail.rows.length, 'rows');
  }
});
```

### Standard DOM Events Used
- `DOMContentLoaded` - Initialize modules
- `input` - Auto-recalculate on form changes
- `change` - Handle select/checkbox changes
- `click` - Button actions, theme toggle
- `submit` - Form submissions (prevented with preventDefault)

---

## Storage & Persistence

### localStorage Keys
```javascript
{
  'language': 'en',              // Current language
  'theme': 'dark',               // Theme preference
  'wos-profiles': '{...}',       // All saved profiles (JSON)
  'lastProfile': 'Profile 1'     // Last loaded profile name
}
```

### Session State
- No sessionStorage used currently
- All state persists across browser sessions
- Profiles survive browser restart
- Theme and language preferences restored on page load

### Storage Limits
- **localStorage**: ~5-10MB depending on browser
- **Profile data**: ~1-5KB per profile typically
- **Translations**: 81KB (loaded once, not stored)
- **Estimated capacity**: ~1,000-5,000 profiles before hitting limits

### Clearing Storage
```javascript
// Clear all WOS Calculator data
localStorage.removeItem('language');
localStorage.removeItem('theme');
localStorage.removeItem('wos-profiles');
localStorage.removeItem('lastProfile');

// Or clear everything
localStorage.clear();
```

---

## Best Practices Summary

### i18n
- ✅ Add keys to all 8 languages
- ✅ Use meaningful key names
- ✅ Test in all languages

### Data Pipeline
- ✅ Excel as source of truth
- ✅ Run extractions after Excel updates
- ✅ Validate CSV schemas

### Theme
- ✅ Use CSS variables
- ✅ Smooth transitions
- ✅ Accessible controls

### Profiles
- ✅ Save form state + inventory
- ✅ Trigger recalc after load
- ✅ Handle errors gracefully

### UI Flow
- ✅ Load systems in correct order
- ✅ Initialize on DOMContentLoaded
- ✅ Use events for decoupling

---

**For detailed technical implementation, see [TECHNICAL_ARCHITECTURE.md](TECHNICAL_ARCHITECTURE.md)**

**For development workflow, see [DEVELOPER_GUIDE.md](DEVELOPER_GUIDE.md)**

**For maintenance procedures, see [docs/MAINTENANCE.md](docs/MAINTENANCE.md)**

---

**Document Version:** 2.1.0  
**Last Updated:** December 2, 2025  
**Maintainer:** Orizzi
