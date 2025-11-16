# Calculator Page Implementation Guide

This guide documents the standard structure and patterns for creating new calculator pages in the Whiteout Survival Calculator project, based on the charms and chief gear implementations.

## Table of Contents
1. [HTML Structure](#html-structure)
2. [Layout & Placement](#layout--placement)
3. [JavaScript Module](#javascript-module)
4. [CSS Styling](#css-styling)
5. [Inventory Layout](#inventory-layout)
6. [Profile Integration](#profile-integration)
7. [Internationalization](#internationalization)
8. [Validation Pattern](#validation-pattern)
9. [Batch Controls](#batch-controls)
10. [Complete Checklist](#complete-checklist)

---

## HTML Structure

### Required Elements

#### 1. Page Container
```html
<div class="container">
    <h1 data-i18n="page.title">Page Title</h1>
    
    <!-- Navigation back button -->
    <a href="index.html" class="back-button" data-i18n="navigation.back">← Back</a>
</div>
```

#### 2. Language Selector (if not in header)
```html
<div class="language-selector">
    <select id="language-select">
        <option value="en">🇬🇧 English</option>
        <option value="es">🇪🇸 Español</option>
        <option value="fr">🇫🇷 Français</option>
        <option value="de">🇩🇪 Deutsch</option>
        <option value="ko">🇰🇷 한국어</option>
        <option value="ru">🇷🇺 Русский</option>
    </select>
</div>
```

**Note:** Ensure file encoding is UTF-8 to preserve flag emojis and special characters.

#### 3. Profile Controls
```html
<div class="profile-controls">
    <div class="profile-buttons">
        <button id="save-profile-btn" data-i18n="profile.save">Save Profile</button>
        <button id="load-profile-btn" data-i18n="profile.load">Load Profile</button>
        <button id="delete-profile-btn" data-i18n="profile.delete">Delete Profile</button>
        <button id="export-profile-btn" data-i18n="profile.export">Export Profile</button>
        <button id="import-profile-btn" data-i18n="profile.import">Import Profile</button>
    </div>
    <input type="file" id="import-profile-input" accept=".json" style="display: none;">
</div>
```

#### 4. Batch Controls Pattern

**For pages with multiple item types (like charms):**
```html
<!-- Per-type batch controls within each section -->
<div class="equipment-section">
    <h2 data-i18n="section.title">Section Title</h2>
    
    <!-- Batch controls for this type -->
    <div class="batch-controls-row">
        <div class="batch-control-group">
            <label data-i18n="batch.from">FROM:</label>
            <select id="type-batch-from" class="batch-select">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <!-- ... levels 2-99 ... -->
                <option value="100">100</option>
            </select>
        </div>
        <div class="batch-control-group">
            <label data-i18n="batch.to">TO:</label>
            <select id="type-batch-to" class="batch-select">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <!-- ... levels 2-99 ... -->
                <option value="100">100</option>
            </select>
        </div>
        <button class="batch-apply-btn" onclick="ModuleName.applyBatch('type', 'both', null)">
            <span data-i18n="batch.apply">Apply Batch</span>
        </button>
    </div>
    
    <!-- Individual items follow -->
</div>
```

**For pages with single unified type (like chief gear):**
```html
<!-- Global batch controls at top -->
<div class="batch-controls-row">
    <div class="batch-control-group">
        <label data-i18n="batch.from">FROM:</label>
        <select id="gear-batch-from" class="batch-select">
            <option value="0" selected>0</option>
            <!-- ... levels ... -->
        </select>
    </div>
    <div class="batch-control-group">
        <label data-i18n="batch.to">TO:</label>
        <select id="gear-batch-to" class="batch-select">
            <option value="0" selected>0</option>
            <!-- ... levels ... -->
        </select>
    </div>
    <button class="batch-apply-btn" onclick="ModuleName.applyGlobalBatch('both', null)">
        <span data-i18n="batch.apply">Apply to All</span>
    </button>
</div>
```

#### 5. Individual Item Structure
```html
<div class="equipment-item" data-type="item-type">
    <div class="equipment-header">
        <img src="assets/path/item-icon.png" alt="Item Name" class="equipment-icon">
        <div class="equipment-info">
            <h3 data-i18n="item.name">Item Name</h3>
        </div>
    </div>
    
    <div class="level-controls">
        <div class="level-group">
            <label data-i18n="level.start">Start Level:</label>
            <select id="item-start" class="level-select" onchange="ModuleName.calculateAll()">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <!-- ... all levels ... -->
            </select>
        </div>
        <div class="level-group">
            <label data-i18n="level.finish">Finish Level:</label>
            <select id="item-finish" class="level-select" onchange="ModuleName.calculateAll()">
                <option value="0" selected>0</option>
                <option value="1">1</option>
                <!-- ... all levels ... -->
            </select>
        </div>
        <button class="reset-button" onclick="ModuleName.resetItem('item-type')" data-i18n="button.reset">
            Reset
        </button>
    </div>
    
    <div class="resources-grid" id="item-resources">
        <!-- Resources populated by JavaScript -->
    </div>
</div>
```

#### 6. Total Results Section
```html
<div class="total-section">
    <h2 data-i18n="total.title">Total Resources Required</h2>
    <div class="total-power">
        <span data-i18n="total.power">Total Power:</span>
        <span id="total-power">0</span>
    </div>
    <div class="resources-grid" id="total-resources">
        <!-- Totals populated by JavaScript -->
    </div>
</div>
```

#### 7. Script Imports (at end of body)
```html
<script src="Scripts/translations.js"></script>
<script src="Scripts/profiles.js"></script>
<script src="Scripts/icon-helper.js"></script>
<script src="Scripts/data-loader.js"></script>
<script src="Scripts/calculator.js"></script>
<script src="Scripts/theme.js"></script>
```

---

## Layout & Placement

Inventory must be positioned to the left of profiles. Use a two-column responsive layout with a left sidebar for inventory and a main section for profiles and calculators.

### Recommended Structure

```html
<div class="page-layout">
    <aside class="sidebar">
        <section class="inventory-section compact" aria-label="Inventory">
            <h3 data-i18n="inventory-header">Your Inventory</h3>
            <div class="inventory-grid compact">
                <!-- Inventory items -->
            </div>
        </section>
    </aside>

    <section class="main-section">
        <section class="profiles" aria-label="Profiles">
            <!-- Profile controls/buttons -->
        </section>

        <!-- Calculators, sections, totals, etc. -->
    </section>
</div>
```

### Placement Rules
- Desktop/tablet: Inventory (left) → Profiles (top-right) → Calculators.
- Mobile: Stack in this order — Inventory → Profiles → Calculators.
- Keep the inventory compact (see Inventory Layout) to minimize vertical space.

---

## JavaScript Module

### Module Structure Template

```javascript
const ModuleName = (() => {
    // ============================================
    // CONFIGURATION
    // ============================================
    const CONFIG = {
        dataFile: 'assets/data_file.csv',
        maxLevel: 100,
        types: ['type1', 'type2', 'type3'] // Item categories
    };

    // ============================================
    // STATE MANAGEMENT
    // ============================================
    let itemData = new Map();
    let isDataLoaded = false;

    // ============================================
    // DATA LOADING
    // ============================================
    async function loadData() {
        try {
            const csvText = await DataLoader.loadCSV(CONFIG.dataFile);
            parseCSVData(csvText);
            isDataLoaded = true;
            console.log('Data loaded successfully');
        } catch (error) {
            console.error('Error loading data:', error);
            alert('Failed to load data. Please refresh the page.');
        }
    }

    function parseCSVData(csvText) {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(h => h.trim());
        
        // Expected format: ItemName,Level,Resource1,Resource2,...,Power
        
        for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const itemName = values[0];
            const level = parseInt(values[1]);
            
            if (!itemData.has(itemName)) {
                itemData.set(itemName, new Map());
            }
            
            const levelData = {
                resources: {},
                power: 0
            };
            
            // Parse resources
            for (let j = 2; j < values.length - 1; j++) {
                const resourceName = headers[j];
                const amount = parseFloat(values[j]) || 0;
                if (amount > 0) {
                    levelData.resources[resourceName] = amount;
                }
            }
            
            // Parse power (last column)
            levelData.power = parseFloat(values[values.length - 1]) || 0;
            
            itemData.get(itemName).set(level, levelData);
        }
    }

    // ============================================
    // VALIDATION
    // ============================================
    function validateLevels(startSelect, finishSelect) {
        const startLevel = parseInt(startSelect.value);
        const finishLevel = parseInt(finishSelect.value);
        
        // Disable finish options less than start
        Array.from(finishSelect.options).forEach(option => {
            const optionValue = parseInt(option.value);
            option.disabled = optionValue < startLevel;
        });
        
        // Disable start options greater than finish
        Array.from(startSelect.options).forEach(option => {
            const optionValue = parseInt(option.value);
            option.disabled = optionValue > finishLevel;
        });
        
        // Adjust finish if needed
        if (finishLevel < startLevel) {
            finishSelect.value = startLevel;
        }
        
        // Adjust start if needed
        if (startLevel > finishLevel) {
            startSelect.value = finishLevel;
        }
    }

    // ============================================
    // BATCH CONTROLS
    // ============================================
    function applyBatch(type, which, value) {
        if (!isDataLoaded) {
            console.warn('Data not loaded yet');
            return;
        }

        // Get batch control values
        const batchFrom = document.getElementById(`${type}-batch-from`);
        const batchTo = document.getElementById(`${type}-batch-to`);
        
        if (!batchFrom || !batchTo) {
            console.error('Batch controls not found');
            return;
        }

        // Validate batch controls themselves
        validateLevels(batchFrom, batchTo);

        const fromValue = parseInt(batchFrom.value);
        const toValue = parseInt(batchTo.value);

        // Apply to all items of this type
        const items = document.querySelectorAll(`[data-type="${type}"]`);
        items.forEach(item => {
            const itemId = item.getAttribute('data-type');
            const startSelect = item.querySelector(`#${itemId}-start`);
            const finishSelect = item.querySelector(`#${itemId}-finish`);

            if (startSelect && finishSelect) {
                if (which === 'from' || which === 'both') {
                    startSelect.value = value !== null ? value : fromValue;
                }
                if (which === 'to' || which === 'both') {
                    finishSelect.value = value !== null ? value : toValue;
                }
                validateLevels(startSelect, finishSelect);
            }
        });

        calculateAll();
    }

    // For single-type pages: global batch
    function applyGlobalBatch(which, value) {
        if (!isDataLoaded) return;

        const batchFrom = document.getElementById('gear-batch-from');
        const batchTo = document.getElementById('gear-batch-to');
        
        if (!batchFrom || !batchTo) return;

        // Validate batch controls
        validateLevels(batchFrom, batchTo);

        const fromValue = parseInt(batchFrom.value);
        const toValue = parseInt(batchTo.value);

        // Apply to ALL items
        CONFIG.types.forEach(type => {
            const startSelect = document.getElementById(`${type}-start`);
            const finishSelect = document.getElementById(`${type}-finish`);

            if (startSelect && finishSelect) {
                if (which === 'from' || which === 'both') {
                    startSelect.value = value !== null ? value : fromValue;
                }
                if (which === 'to' || which === 'both') {
                    finishSelect.value = value !== null ? value : toValue;
                }
                validateLevels(startSelect, finishSelect);
            }
        });

        calculateAll();
    }

    // ============================================
    // CALCULATION
    // ============================================
    function calculateItem(itemId, startLevel, finishLevel) {
        if (!itemData.has(itemId)) {
            console.error(`Item not found: ${itemId}`);
            return null;
        }

        const levels = itemData.get(itemId);
        const result = {
            resources: {},
            power: 0
        };

        for (let level = startLevel + 1; level <= finishLevel; level++) {
            if (!levels.has(level)) continue;

            const levelData = levels.get(level);
            result.power += levelData.power;

            Object.entries(levelData.resources).forEach(([resource, amount]) => {
                result.resources[resource] = (result.resources[resource] || 0) + amount;
            });
        }

        return result;
    }

    function displayItemResources(itemId, resources, power) {
        const container = document.getElementById(`${itemId}-resources`);
        if (!container) return;

        container.innerHTML = '';

        if (Object.keys(resources).length === 0) {
            container.innerHTML = '<p class="no-resources">No resources required</p>';
            return;
        }

        Object.entries(resources).forEach(([resourceName, amount]) => {
            const resourceDiv = document.createElement('div');
            resourceDiv.className = 'resource-item';
            resourceDiv.innerHTML = `
                ${IconHelper.getResourceIcon(resourceName)}
                <span class="resource-amount">${formatNumber(amount)}</span>
            `;
            container.appendChild(resourceDiv);
        });
    }

    function calculateAll() {
        if (!isDataLoaded) return;

        const totals = {
            resources: {},
            power: 0
        };

        // Calculate each item
        CONFIG.types.forEach(type => {
            const startSelect = document.getElementById(`${type}-start`);
            const finishSelect = document.getElementById(`${type}-finish`);

            if (startSelect && finishSelect) {
                // Validate before calculating
                validateLevels(startSelect, finishSelect);

                const startLevel = parseInt(startSelect.value);
                const finishLevel = parseInt(finishSelect.value);

                const result = calculateItem(type, startLevel, finishLevel);
                if (result) {
                    displayItemResources(type, result.resources, result.power);
                    totals.power += result.power;

                    Object.entries(result.resources).forEach(([resource, amount]) => {
                        totals.resources[resource] = (totals.resources[resource] || 0) + amount;
                    });
                }
            }
        });

        displayTotals(totals);
    }

    function displayTotals(totals) {
        const powerElement = document.getElementById('total-power');
        if (powerElement) {
            powerElement.textContent = formatNumber(totals.power);
        }

        const container = document.getElementById('total-resources');
        if (!container) return;

        container.innerHTML = '';

        if (Object.keys(totals.resources).length === 0) {
            container.innerHTML = '<p class="no-resources">No resources required</p>';
            return;
        }

        Object.entries(totals.resources)
            .sort(([a], [b]) => a.localeCompare(b))
            .forEach(([resourceName, amount]) => {
                const resourceDiv = document.createElement('div');
                resourceDiv.className = 'resource-item';
                resourceDiv.innerHTML = `
                    ${IconHelper.getResourceIcon(resourceName)}
                    <span class="resource-amount">${formatNumber(amount)}</span>
                `;
                container.appendChild(resourceDiv);
            });
    }

    // ============================================
    // RESET FUNCTIONS
    // ============================================
    function resetItem(itemId) {
        const startSelect = document.getElementById(`${itemId}-start`);
        const finishSelect = document.getElementById(`${itemId}-finish`);

        if (startSelect) startSelect.value = '0';
        if (finishSelect) finishSelect.value = '0';

        if (startSelect && finishSelect) {
            validateLevels(startSelect, finishSelect);
        }

        calculateAll();
    }

    function resetAll() {
        CONFIG.types.forEach(type => resetItem(type));
    }

    // ============================================
    // UTILITY FUNCTIONS
    // ============================================
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(2) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toFixed(0);
    }

    // ============================================
    // EVENT LISTENERS
    // ============================================
    function setupEventListeners() {
        // Setup validation on all level selects
        CONFIG.types.forEach(type => {
            const startSelect = document.getElementById(`${type}-start`);
            const finishSelect = document.getElementById(`${type}-finish`);

            if (startSelect && finishSelect) {
                startSelect.addEventListener('change', () => {
                    validateLevels(startSelect, finishSelect);
                    calculateAll();
                });

                finishSelect.addEventListener('change', () => {
                    validateLevels(startSelect, finishSelect);
                    calculateAll();
                });
            }
        });

        // Setup batch control validation
        // For per-type pages:
        CONFIG.types.forEach(type => {
            const batchFrom = document.getElementById(`${type}-batch-from`);
            const batchTo = document.getElementById(`${type}-batch-to`);

            if (batchFrom && batchTo) {
                batchFrom.addEventListener('change', () => {
                    validateLevels(batchFrom, batchTo);
                });

                batchTo.addEventListener('change', () => {
                    validateLevels(batchFrom, batchTo);
                });
            }
        });

        // For single-type pages:
        const globalBatchFrom = document.getElementById('gear-batch-from');
        const globalBatchTo = document.getElementById('gear-batch-to');

        if (globalBatchFrom && globalBatchTo) {
            globalBatchFrom.addEventListener('change', () => {
                validateLevels(globalBatchFrom, globalBatchTo);
            });

            globalBatchTo.addEventListener('change', () => {
                validateLevels(globalBatchFrom, globalBatchTo);
            });
        }
    }

    // ============================================
    // INITIALIZATION
    // ============================================
    async function initialize() {
        await loadData();
        setupEventListeners();
        calculateAll();
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initialize);
    } else {
        initialize();
    }

    // ============================================
    // PUBLIC API
    // ============================================
    return {
        calculateAll,
        resetItem,
        resetAll,
        applyBatch,
        applyGlobalBatch, // For single-type pages
        validateLevels,
        sumCosts: calculateAll // Alias for profiles
    };
})();
```

---

## CSS Styling

### Required CSS Classes

All calculator pages should use these standard classes from `style.css`:

```css
/* Container */
.container { /* Main page container */ }

/* Equipment Grid */
.equipment-grid { /* Grid layout for items */ }
.equipment-section { /* Section grouping items */ }
.equipment-item { /* Individual item card */ }
.equipment-header { /* Item header with icon */ }
.equipment-icon { /* Item icon image */ }
.equipment-info { /* Item info container */ }

/* Level Controls */
.level-controls { /* Controls container */ }
.level-group { /* Individual level select group */ }
.level-select { /* Level dropdown */ }

/* Batch Controls */
.batch-controls-row { /* Batch controls container */ }
.batch-control-group { /* Individual batch control */ }
.batch-select { /* Batch dropdown */ }
.batch-apply-btn { /* Batch apply button */ }

/* Resources */
.resources-grid { /* Resource display grid */ }
.resource-item { /* Individual resource */ }
.resource-icon { /* Resource icon */ }
.resource-amount { /* Resource amount text */ }

/* Totals */
.total-section { /* Total results section */ }
.total-power { /* Power display */ }

/* Buttons */
.reset-button { /* Reset button */ }
.back-button { /* Navigation back button */ }

/* Profile Controls */
.profile-controls { /* Profile buttons container */ }
.profile-buttons { /* Profile button group */ }
```

### Page Layout (Inventory Left)

```css
/* Two-column layout with inventory sidebar */
.page-layout { display: grid; grid-template-columns: 280px 1fr; gap: 16px; align-items: start; }
.sidebar { position: sticky; top: 12px; }
.main-section { min-width: 0; }

@media (max-width: 900px) {
    .page-layout { grid-template-columns: 1fr; }
    .sidebar { position: static; }
}
```

**Important:** Do NOT add page-specific hiding rules like:
```css
/* NEVER DO THIS */
.equipment-grid .equipment-section .batch-controls-row {
    display: none;
}
```

---

## Inventory Layout

Make the inventory compact to take as little space as possible while staying readable.

### Compact Inventory Markup

```html
<section class="inventory-section compact">
    <h3 data-i18n="inventory-header">Your Inventory</h3>
    <div class="inventory-grid compact">
        <div class="inventory-item">
            <label for="inventory-meat">
                <span class="label-with-icon">
                    <img class="res-icon" src="assets/resources/base/meat.png" alt="Meat">
                    <span data-i18n="meat">Meat</span>
                </span>
            </label>
            <input type="number" id="inventory-meat" min="0" value="0" inputmode="numeric" pattern="[0-9]*">
        </div>
        <!-- Repeat for additional resources/items -->
    </div>
    <!-- Optional: wrap in <details> for collapsible inventory if many fields -->
</section>
```

### Compact Inventory CSS

```css
.inventory-section.compact h3 { margin: 0 0 8px; }
.inventory-grid.compact { display: grid; grid-template-columns: 1fr; gap: 8px; }

/* Increase density on wider screens if sidebar has room */
@media (min-width: 640px) { .inventory-grid.compact { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
@media (min-width: 1024px) { .inventory-grid.compact { grid-template-columns: 1fr; } }

.inventory-item { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
.inventory-item label { flex: 1 1 auto; min-width: 0; }
.inventory-item input[type=number] { width: 120px; max-width: 40%; text-align: right; }

.label-with-icon { display: inline-flex; align-items: center; gap: 6px; }
.res-icon { width: 18px; height: 18px; object-fit: contain; }
```

### Space-Saving Tips
- Use small icons (16–20px) and tight spacing (6–8px gaps).
- Keep inputs narrow (100–140px) and right-aligned to reduce jitter.
- Prefer a single column inside a narrow sidebar; switch to two columns on medium widths if needed.
- Avoid redundant text; rely on clear labels + icons; use placeholders sparingly.
- Consider an optional collapsible inventory (`<details>/<summary>`) if many fields exist.

---

## Profile Integration

### Field Naming Convention

Profile system uses field IDs to save/restore state. Follow these naming patterns:

**For multi-item pages (charms):**
- Start level: `{itemType}-start`
- Finish level: `{itemType}-finish`

**For single-type pages (chief gear):**
- Start level: `{itemType}-start`
- Finish level: `{itemType}-finish`

### Export validateLevels

Profiles need to call validation after loading. Export it in your module:

```javascript
return {
    calculateAll,
    resetItem,
    validateLevels, // ← Required for profiles
    // ... other exports
};
```

### Profile Capture in profiles.js

Add your page to the profile capture logic in `profiles.js`:

```javascript
function captureCurrent() {
    const data = {
        timestamp: new Date().toISOString(),
        version: '1.0'
    };

    // Add your page detection
    if (window.location.pathname.includes('yourpage.html')) {
        // Capture your item fields
        CONFIG.types.forEach(type => {
            const startField = document.getElementById(`${type}-start`);
            const finishField = document.getElementById(`${type}-finish`);
            
            if (startField) data[`${type}-start`] = startField.value;
            if (finishField) data[`${type}-finish`] = finishField.value;
        });
    }
    
    return data;
}
```

### Profile Application

Add validation call after loading your page's fields:

```javascript
function applyProfileObject(profileData) {
    // ... existing code ...
    
    if (window.location.pathname.includes('yourpage.html') && window.YourModule) {
        // Apply fields
        CONFIG.types.forEach(type => {
            // ... set values ...
        });
        
        // Validate all after loading
        CONFIG.types.forEach(type => {
            const start = document.getElementById(`${type}-start`);
            const finish = document.getElementById(`${type}-finish`);
            if (start && finish) {
                window.YourModule.validateLevels(start, finish);
            }
        });
        
        window.YourModule.calculateAll();
    }
}
```

---

## Internationalization

### Translation Keys

Add entries to `translations.js` for your page:

```javascript
const translations = {
    en: {
        page: {
            title: "Your Page Title"
        },
        navigation: {
            back: "← Back"
        },
        level: {
            start: "Start Level:",
            finish: "Finish Level:"
        },
        batch: {
            from: "FROM:",
            to: "TO:",
            apply: "Apply Batch"
        },
        total: {
            title: "Total Resources Required",
            power: "Total Power:"
        },
        button: {
            reset: "Reset"
        },
        profile: {
            save: "Save Profile",
            load: "Load Profile",
            delete: "Delete Profile",
            export: "Export Profile",
            import: "Import Profile"
        }
        // ... add item-specific translations
    },
    es: { /* Spanish translations */ },
    fr: { /* French translations */ },
    de: { /* German translations */ },
    ko: { /* Korean translations */ },
    ru: { /* Russian translations */ }
};
```

### HTML i18n Attributes

Use `data-i18n` attributes on all text elements:

```html
<h1 data-i18n="page.title">Page Title</h1>
<label data-i18n="level.start">Start Level:</label>
<button data-i18n="button.reset">Reset</button>
```

---

## Validation Pattern

### Critical Rules

1. **Bidirectional Validation**: Both FROM and TO selects must validate each other
2. **Batch Self-Validation**: Batch controls validate themselves before applying
3. **Option Disabling**: Disable invalid options, don't just check values
4. **Calculate After Validate**: Always call validation before calculation

### Validation Call Chain

```
User changes select
    ↓
validateLevels(startSelect, finishSelect)
    ↓
Disable invalid options
    ↓
Adjust values if needed
    ↓
calculateAll()
```

### Batch Control Validation

```javascript
// Batch controls validate themselves
batchFrom.addEventListener('change', () => {
    validateLevels(batchFrom, batchTo);
});

batchTo.addEventListener('change', () => {
    validateLevels(batchFrom, batchTo);
});

// Then validate before applying
function applyBatch(type, which, value) {
    validateLevels(batchFrom, batchTo); // ← Validate first
    // Then apply to items
    items.forEach(item => {
        // Set values
        validateLevels(startSelect, finishSelect); // ← Validate each
    });
    calculateAll();
}
```

---

## Batch Controls

### Decision: Per-Type vs Global

**Use per-type batch controls when:**
- Page has distinct item categories (hats, rings, weapons, etc.)
- Users might want different levels per category
- Each section is visually separated

**Use global batch controls when:**
- All items are same type (all gear pieces)
- Users likely set same levels across all items
- Cleaner UI with single control set

### Per-Type Implementation

```html
<!-- In each section -->
<div class="equipment-section">
    <h2>Category Name</h2>
    
    <div class="batch-controls-row">
        <!-- Batch controls for this category -->
        <select id="category-batch-from">...</select>
        <select id="category-batch-to">...</select>
        <button onclick="Module.applyBatch('category', 'both', null)">
            Apply Batch
        </button>
    </div>
    
    <!-- Items in this category -->
</div>
```

### Global Implementation

```html
<!-- At top of page, before all sections -->
<div class="batch-controls-row">
    <select id="gear-batch-from">...</select>
    <select id="gear-batch-to">...</select>
    <button onclick="Module.applyGlobalBatch('both', null)">
        Apply to All
    </button>
</div>

<!-- Then all item sections without individual batch controls -->
```

---

## Complete Checklist

### Before Starting
- [ ] Decide on per-type vs global batch control structure
- [ ] Prepare CSV data file with correct format
- [ ] Gather all item icons and resource icons
- [ ] Plan item categories/types

### HTML Implementation
- [ ] Create page structure with all required sections
- [ ] Use two-column layout (`.page-layout`) with inventory on the left
- [ ] Place profiles at the top of the main section (right side)
- [ ] Add language selector with UTF-8 encoding
- [ ] Add profile control buttons
- [ ] Implement batch controls (per-type or global)
- [ ] Create individual item structures with correct IDs
- [ ] Add total results section
- [ ] Include all script imports
- [ ] Add `data-i18n` attributes to all text
- [ ] Verify UTF-8 encoding (check flag emojis display correctly)

### JavaScript Module
- [ ] Create module with IIFE pattern
- [ ] Define CONFIG with dataFile, maxLevel, types
- [ ] Implement loadData() function
- [ ] Implement parseCSVData() function
- [ ] Implement validateLevels() function
- [ ] Implement applyBatch() or applyGlobalBatch()
- [ ] Implement calculateItem() function
- [ ] Implement calculateAll() function
- [ ] Implement displayItemResources() function
- [ ] Implement displayTotals() function
- [ ] Implement resetItem() and resetAll()
- [ ] Setup event listeners for validation
- [ ] Setup batch control event listeners
- [ ] Export public API (including validateLevels)
- [ ] Test data loading and parsing
- [ ] Test calculations at various levels

### Profile Integration
- [ ] Add page detection to profiles.js captureCurrent()
- [ ] Add field capture for all items
- [ ] Add page detection to profiles.js applyProfileObject()
- [ ] Add field restoration with validation calls
- [ ] Export validateLevels in module
- [ ] Test save/load profile functionality
- [ ] Test export/import profile functionality

### Internationalization
- [ ] Add all translation keys to translations.js
- [ ] Translate all text to supported languages
- [ ] Test language switching
- [ ] Verify special characters display correctly

### CSS Styling
- [ ] Verify all standard classes are used
- [ ] Add any page-specific styling if needed
- [ ] Do NOT add hiding rules for batch controls
- [ ] Apply compact inventory styles (`.inventory-section.compact`, `.inventory-grid.compact`)
- [ ] Ensure responsive layout keeps inventory left of profiles on wide screens
- [ ] Test responsive layout
- [ ] Test dark/light theme if implemented

### Testing
- [ ] Test all individual item calculations
- [ ] Test total calculations
- [ ] Test validation (FROM ≤ TO enforcement)
- [ ] Test batch controls (per-type or global)
- [ ] Test batch control self-validation
- [ ] Test reset functionality
- [ ] Test profile save/load
- [ ] Test language switching
- [ ] Test with level 0 (should show 0 resources)
- [ ] Test with same start/finish level
- [ ] Test with max levels
- [ ] Test in different browsers
- [ ] Test UTF-8 encoding displays correctly

### Git Workflow
- [ ] Create feature branch for new page
- [ ] Commit HTML structure
- [ ] Commit JavaScript module
- [ ] Commit profile integration
- [ ] Commit translations
- [ ] Test thoroughly on feature branch
- [ ] Merge to main when complete

---

## Common Pitfalls to Avoid

1. **Missing Validation**: Always validate levels bidirectionally
2. **Batch Controls Not Validating Themselves**: Batch controls need their own validation
3. **Wrong Field Names in Profiles**: Use consistent `-start` and `-finish` suffixes
4. **Not Exporting validateLevels**: Profiles need access to validation function
5. **CSS Hiding Batch Controls**: Never add display:none rules for batch controls
6. **Encoding Issues**: Always use UTF-8 for flag emojis and special characters
7. **PowerShell String Replacement**: Use `-replace` with literal strings, not regex
8. **Not Calling calculateAll After Validation**: Always recalculate after changes
9. **Placeholder Options**: Don't add "--" options, use "0" as default selected
10. **Malformed HTML**: Watch for literal `\n` in HTML from script replacements

---

## File Encoding Requirements

### Critical: UTF-8 Encoding

All HTML files MUST be saved with UTF-8 encoding to preserve:
- Flag emojis in language selector: 🇬🇧 🇪🇸 🇫🇷 🇩🇪 🇰🇷 🇷🇺
- Special characters: ñ, ö, é, à, ü
- Korean characters: 한국어
- Russian Cyrillic: Русский

### PowerShell Commands for Encoding

```powershell
# Read with UTF-8
$content = Get-Content -Path "file.html" -Encoding UTF8 -Raw

# Write with UTF-8
Set-Content -Path "file.html" -Value $content -Encoding UTF8

# OR use Out-File with UTF8
$content | Out-File "file.html" -Encoding UTF8
```

### Verify Encoding

After saving, open file and check:
- Language selector shows flag emojis correctly
- Special characters display properly
- No weird characters or question marks

---

## Example Data File Format

### CSV Structure
```csv
ItemName,Level,Resource1,Resource2,Resource3,Power
Hat,1,100,50,0,1000
Hat,2,150,75,0,1500
Hat,3,200,100,25,2000
Ring,1,80,40,0,800
Ring,2,120,60,0,1200
```

### Data Parsing Logic
- Column 0: Item name (matches item ID in HTML)
- Column 1: Level number
- Columns 2 to N-1: Resource amounts
- Last column: Power value

### Handling Missing Data
- Use `|| 0` to default missing values to 0
- Skip resources with amount = 0 in display
- Validate all numeric conversions

---

## Summary

This guide provides a complete template for creating calculator pages following the established patterns in the Whiteout Survival Calculator project. Key principles:

1. **Consistency**: Use standard HTML structure, CSS classes, and module pattern
2. **Validation**: Implement bidirectional validation everywhere
3. **Batch Controls**: Validate before and during application
4. **Profile Integration**: Use consistent field naming and export validation
5. **Internationalization**: Support all languages with proper encoding
6. **Testing**: Thoroughly test all functionality before merging

Follow this guide to ensure new pages integrate seamlessly with existing functionality and maintain code quality standards.
