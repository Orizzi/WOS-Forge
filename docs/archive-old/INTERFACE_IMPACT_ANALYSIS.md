# HTML Changes Impact Assessment

## Interfaces & Scripts Analysis

### Changes Made to HTML
1. **Script Loading Order** - Standardized to: independent → core → page-specific → profiles → service worker
2. **CSS Files** - Changed from `style.css` to `style.min.css` everywhere
3. **HTML Structure** 
   - Added `.app-shell` wrapper to pets.html & experts.html
   - Added `role="main"` to pets.html & experts.html
   - Added `role="group" aria-label="..."` to inventory-profiles-row elements
   - Fixed navigation structure in experts.html

### Scripts That Reference HTML Elements

#### ✅ SAFE (Generic ID references)
- `theme.js` - References `id="dark-mode-toggle"` (✅ still exists in all pages)
- `profiles.js` - References IDs for form elements like `furnace-start`, `helmet-start` (✅ unchanged)
- `translations.js` - Uses `data-i18n` attributes (✅ unchanged)
- `nav.js` - References `id="main-nav"` (✅ fixed in experts.html, already existed in others)

#### ⚠️ POTENTIAL ISSUES (Check These)
1. **fire-crystals-calculator.js & related files**
   - These might inject HTML for results/tables
   - Check if they use any hardcoded CSS classes that might have changed
   
2. **calculator.js (charms)**
   - Injects result tables
   - Uses `.inventory-profiles-row` structure
   
3. **chief-gear-calculator.js**
   - Similar table injection
   
4. **war-laboratory.js**
   - Heavy HTML injection (tabs, trees, tables, forms)
   - Uses IDs like `helios-tree`, `selection-panel`, `war-lab-page` (check if these still exist!)

### Critical ID/Class References to Verify

#### IDs That Must Exist
| ID | Pages | Status |
|----|-------|--------|
| `dark-mode-toggle` | All | ✅ Present |
| `language-selector` | All | ✅ Present |
| `main-nav` | All | ✅ Fixed (was missing in experts) |
| `top` | All | ✅ Present |
| `furnace-start` | Fire Crystals | ✅ Unchanged |
| `helmet-start` | Chief Gear | ✅ Unchanged |
| `helios-tree` | War Academy | ❓ Need to verify |
| `selection-panel` | War Academy | ❓ Need to verify |
| `branch-tabs` | War Academy | ❓ Need to verify |
| `war-lab-page` | War Academy | ✅ Class, not ID - unchanged |

#### Classes That Must Exist
| Class | Purpose | Status |
|-------|---------|--------|
| `.app-shell` | Layout wrapper | ✅ Now present on all pages |
| `.inventory-profiles-row` | Flex layout | ✅ Present, added role/aria |
| `.main-nav` | Navigation styling | ✅ Unchanged |
| `.dark-mode-toggle` | Button styling | ✅ Unchanged |
| `.language-selector` | Select styling | ✅ Unchanged |
| `.war-lab-page` | War Academy layout | ✅ Unchanged |

### Script-Injected HTML Checks

#### War Academy (`war-laboratory.js`)
- Line 356: `document.querySelectorAll('#branch-tabs .tab')`
- Line 375: `document.getElementById('helios-tree')`
- Line 537: `document.getElementById('selection-panel')`
- Line 545: `document.getElementById('selection-list')`
- Line 588: `document.getElementById('helios-slot-table')`
- Line 590: `document.getElementById('war-lab-slot-body')`
- Line 708: `document.getElementById('stat-recap-grid')`
- Line 932: `document.querySelector('.war-lab-page')`

**Status**: ❓ Need to check if these IDs exist in `war-academy.html` after changes

#### Fire Crystals
- Various table updates and result injections
- **Status**: ✅ Should be OK (only changed scripts/CSS, not these IDs)

### Minification Impact

**Potential Issue**: Changed from `style.css` to `style.min.css`

#### Verify:
- [ ] `style.min.css` file exists
- [ ] `style.min.css` is up-to-date with `style.css`
- [ ] Minified files in `Scripts/min/` are all present and minified correctly
- [ ] All referenced minified JS files exist

---

## Testing Checklist

### For Each Page, Test:
- [ ] Page loads without console errors (F12)
- [ ] Theme toggle works (colors change)
- [ ] Language selector works (text changes)
- [ ] No layout broken (check responsive)
- [ ] Calculator/form functions work (if applicable)
- [ ] Profile save/load works
- [ ] Service worker registered

### Specific Tests:

**Charms.html**
- [ ] Calculator loads
- [ ] Results display properly
- [ ] Batch controls work

**Chief Gear.html**
- [ ] Calculator loads
- [ ] Results display properly
- [ ] Profiles save/load

**Fire Crystals.html**
- [ ] Calculator loads with new scripts
- [ ] Power calculations work
- [ ] Tables render correctly

**War Academy.html**
- [ ] Tabs/tree render correctly
- [ ] All IDs resolve (check `helios-tree`, etc.)
- [ ] Selection panel works
- [ ] Results calculate correctly

**Pets.html**
- [ ] Page loads (it's a coming-soon page)
- [ ] Navigation works
- [ ] App shell layout correct

**Experts.html**
- [ ] Page loads (was broken)
- [ ] Navigation fixed (should have proper ID now)
- [ ] App shell wrapper present
- [ ] Theme/language selectors work

---

## Critical Review Points

### 1. CSS Minification Risk
**Current**: All pages now reference `style/style.min.css`
**Risk**: If `style.min.css` doesn't exist or is outdated, pages will be unstyled
**Action**: Verify file exists and is current

### 2. War Academy Complex Scripts
**Current**: `war-laboratory.js` heavily injects HTML
**Risk**: Depends on specific IDs that might not exist
**Action**: Verify all IDs in `war-academy.html` match what `war-laboratory.js` expects

### 3. Script Load Order
**Changed**: All pages now follow standard pattern
**Risk**: If dependencies aren't loaded in correct order, modules might fail
**Action**: Test each page loads without console errors

### 4. Minified JS Files
**Risk**: Minified calculator.js, profiles.js, etc. might be outdated
**Action**: Verify all `Scripts/min/*.min.js` files exist and are recent

---

## Next Steps
1. Run browser console test on each HTML page (look for errors)
2. Verify `style.min.css` exists and matches `style.css`
3. Verify all minified JS in `Scripts/min/` are present
4. Test War Academy page specifically (most complex)
5. Test profile save/load on each calculator page
