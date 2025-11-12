# JavaScript Modules - Organization Guide

This folder contains all JavaScript functionality, organized into separate modular files for better maintainability.

## 📁 Module Structure

### `theme.js` - Theme Toggle Module
**Purpose:** Handles dark/light mode switching  
**Used in:** All pages (index.html, charms.html)  
**Key Functions:**
- `ThemeModule.init()` - Initialize theme system
- `ThemeModule.setTheme(isLight)` - Switch between themes

**Dependencies:** None  
**Storage:** Uses `localStorage` key `'wos-theme'`

---

### `calculator.js` - Charms Calculator Module
**Purpose:** Calculates upgrade costs for charms  
**Used in:** charms.html  
**Key Functions:**
- `CalculatorModule.init()` - Setup calculator listeners
- `CalculatorModule.calculateAll()` - Run calculations
- `CalculatorModule.sumCosts(from, to)` - Calculate cost between levels
- `CalculatorModule.applyBatch(type, which, value)` - Batch set levels
- `CalculatorModule.resetCharms()` - Reset all to level 0

**Dependencies:** 
- `TableSortModule` (optional, for sortable results)

**Data:** Contains upgrade cost table (`costs` object)

---

### `profiles.js` - Profiles/Presets Module
**Purpose:** Save and load charm upgrade profiles  
**Used in:** charms.html  
**Key Functions:**
- `ProfilesModule.init()` - Setup profile UI
- `ProfilesModule.saveNewProfile(name)` - Save current as new profile
- `ProfilesModule.loadSelectedProfile()` - Load selected profile
- `ProfilesModule.deleteSelectedProfile()` - Delete profile
- `ProfilesModule.renameSelectedProfile()` - Rename profile
- `ProfilesModule.captureCurrent()` - Snapshot current values

**Dependencies:** 
- `CalculatorModule` (optional, for recalculation after load)

**Storage:** Uses `localStorage` key `'wos-charm-profiles'`

---

### `table-sort.js` - Table Sorting Module
**Purpose:** Make results tables sortable by clicking headers  
**Used in:** charms.html (via calculator.js)  
**Key Functions:**
- `TableSortModule.makeTableSortable(table)` - Make table sortable

**Dependencies:** None  
**Accessibility:** Keyboard accessible (Tab + Enter/Space)

---

## 🔄 Module Loading Order

In `charms.html`, modules are loaded in this specific order:

```html
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/table-sort.js" defer></script>
<script src="Scripts/calculator.js" defer></script>
<script src="Scripts/profiles.js" defer></script>
```

**Why this order?**
1. **theme.js** - Independent, no dependencies
2. **table-sort.js** - Used by calculator.js
3. **calculator.js** - Uses table-sort, used by profiles
4. **profiles.js** - Uses calculator for recalculations

---

## 🎯 Module Independence

Each module:
- ✅ Uses IIFE (Immediately Invoked Function Expression) pattern
- ✅ Exposes only necessary public API
- ✅ Has clear separation of concerns
- ✅ Auto-initializes when page loads
- ✅ Handles missing dependencies gracefully

---

## 📝 Adding New Functionality

### To add a new feature:

1. **Create new module file** (e.g., `my-feature.js`)
2. **Use module pattern:**
   ```javascript
   const MyFeatureModule = (function(){
     function init(){
       // Setup code
     }
     
     return {
       init
       // ... other public functions
     };
   })();
   
   // Auto-initialize
   if(document.readyState === 'loading'){
     document.addEventListener('DOMContentLoaded', () => MyFeatureModule.init());
   } else {
     MyFeatureModule.init();
   }
   ```

3. **Add script tag to HTML:**
   ```html
   <script src="Scripts/my-feature.js" defer></script>
   ```

4. **Call from other modules if needed:**
   ```javascript
   if(typeof MyFeatureModule !== 'undefined'){
     MyFeatureModule.doSomething();
   }
   ```

---

## 🗂️ Legacy Files

The original monolithic `script.js` has been removed after migration to modular files. All features now live in the modules listed above.

---

## 🧪 Testing After Changes

After modifying any module:

1. **Check browser console** (F12) for errors
2. **Test theme toggle** - Click the theme button
3. **Test calculator** - Change charm levels, verify results
4. **Test profiles** - Save, load, delete profiles
5. **Test table sorting** - Click table headers to sort

---

## 💡 Benefits of This Organization

**Before (script.js):**
- ❌ One 670-line file
- ❌ Hard to find specific functionality
- ❌ All code loads even if not needed
- ❌ Difficult to maintain and debug

**After (Modular):**
- ✅ 4 focused files (~100-300 lines each)
- ✅ Easy to locate and modify features
- ✅ Clear dependencies and relationships
- ✅ Better code organization and maintainability
- ✅ Easier for beginners to understand

---

## 📚 Further Reading

- See `/docs/MAINTENANCE.md` for code modification guides
- See `/docs/PROJECT_STRUCTURE.md` for overall architecture
- See `/docs/QUICK_REFERENCE.md` for quick lookup
