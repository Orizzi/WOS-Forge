# HTML Consistency Audit Report

> **Generated**: December 27, 2025  
> **Scope**: All HTML pages (`charms.html`, `chiefGear.html`, `fireCrystals.html`, `war-academy.html`, `pets.html`, `experts.html`)  
> **Status**: ⚠️ Multiple inconsistencies found

---

## 🔴 Critical Issues

### 1. **Script Loading Order & Minification Mismatch**

#### Problem
Different pages use different script loading patterns:

**Charms & Chief Gear** (CORRECT - uses minified files):
```html
<script src="Scripts/min/icon-helper.min.js" defer></script>
<script src="Scripts/min/theme.min.js" defer></script>
<script src="Scripts/min/table-sort.min.js" defer></script>
<script src="Scripts/calculation-core.js" defer></script>
<script src="Scripts/min/calculator.min.js" defer></script>
<script src="Scripts/min/profiles.min.js" defer></script>
```

**Fire Crystals** (INCONSISTENT - mixed minified/unminified):
```html
<script src="Scripts/icon-helper.js" defer></script>
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/translations.js" defer></script>
<script src="Scripts/profiles.js" defer></script>
<script src="Scripts/table-sort.js" defer></script>
<script src="Scripts/calculation-core.js" defer></script>
<script src="Scripts/input-validators.js" defer></script>
<script src="Scripts/min/fire-crystals-calculator.min.js" defer></script>
```

**War Academy** (INCONSISTENT - custom module pattern):
```html
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/translations.js" defer></script>
<script src="Scripts/calculation-core.js" defer></script>
<script src="Scripts/modules/helpers/csv.js" defer></script>
<script src="Scripts/modules/data/data-loader.js" defer></script>
```

**Pets & Experts** (MINIMAL - only core):
```html
<script src="Scripts/theme.js" defer></script>
<script src="Scripts/translations.js" defer></script>
<script src="Scripts/calculation-core.js" defer></script>
<script src="Scripts/sw-register.js" defer></script>
```

#### Impact
- ❌ Performance inconsistency (some pages not optimized with minified files)
- ❌ Dependency chain not standardized
- ❌ Missing `data-loader.js` in pets/experts (will break CSV loading when implemented)
- ❌ Fire Crystals has duplicate `profiles.js` and `table-sort.js` in wrong positions

#### Fix Required
**All pages should follow this standard pattern:**
```html
<!-- Independent modules first (BASE LAYER) -->
<script src="Scripts/min/icon-helper.min.js" defer></script>
<script src="Scripts/min/theme.min.js" defer></script>
<script src="Scripts/translations.js" defer></script>
<script src="Scripts/min/table-sort.min.js" defer></script>
<script src="Scripts/min/data-loader.min.js" defer></script>

<!-- Core calculation & config -->
<script src="Scripts/calculation-core.js" defer></script>

<!-- Page-specific calculator -->
<script src="Scripts/min/{page}-calculator.min.js" defer></script>

<!-- Profile system (shared) -->
<script src="Scripts/min/profiles.min.js" defer></script>

<!-- Service worker (shared) -->
<script src="Scripts/sw-register.js" defer></script>
```

---

### 2. **Navigation Structure Inconsistency**

#### Charms.html & Chief Gear (CORRECT):
```html
<nav id="main-nav" class="main-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-links">
    <a href="../index.html" data-i18n="nav-home">Home</a>
    <!-- ... -->
  </div>
  <div class="nav-actions">
    <button id="dark-mode-toggle" ...></button>
    <select id="language-selector" ...></select>
  </div>
</nav>
```

#### Fire Crystals (CORRECT):
```html
<nav id="main-nav" class="main-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-links">
    <!-- ... -->
  </div>
  <div class="nav-actions">
    <!-- ... -->
  </div>
</nav>
```

#### War Academy (CORRECT):
```html
<nav id="main-nav" class="main-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-links">
    <!-- ... -->
  </div>
  <div class="nav-actions">
    <!-- ... -->
  </div>
</nav>
```

#### Pets (CORRECT):
```html
<nav id="main-nav" class="main-nav" role="navigation" aria-label="Main navigation">
  <div class="nav-links">
    <!-- ... -->
  </div>
  <div class="nav-actions">
    <!-- ... -->
  </div>
</nav>
```

#### ⚠️ Experts (BROKEN):
```html
<nav class="main-nav" role="navigation" aria-label="Main navigation">
  <!-- NO id="main-nav" -->
  <!-- nav-links mixed with nav-actions -->
  <a href="../index.html" ...>Home</a>
  <a href="charms.html" ...>Charms</a>
  <!-- ... -->
  <button id="dark-mode-toggle" ...></button>  <!-- INSIDE nav, not in div -->
  <select id="language-selector" ...></select>
</nav>
```

#### Impact
- ❌ `experts.html` missing `id="main-nav"` (JavaScript may target this ID)
- ❌ No `.nav-links` and `.nav-actions` wrapper divs in experts
- ❌ Inconsistent DOM structure breaks CSS layout
- ❌ Theme toggle and language selector inline with nav links (layout issues)

---

### 3. **CSS File References**

#### Charms & Chief Gear (CORRECT - minified):
```html
<link rel="stylesheet" href="style/style.min.css">
```

#### Fire Crystals, War Academy, Pets, Experts (INCONSISTENT - unminified):
```html
<link rel="stylesheet" href="style/style.css">
```

#### Impact
- ❌ Performance inconsistency
- ❌ Some pages loading 2x CSS file size
- ⚠️ File must exist as both `style.css` and `style.min.css`

---

### 4. **Language Selector HTML Inconsistency**

#### Charms & Chief Gear (CORRECT - with space prefix):
```html
<option value="en"> English</option>
<option value="es"> Español</option>
```

#### Fire Crystals, War Academy, Pets (NO spaces):
```html
<option value="en">English</option>
<option value="es">Español</option>
```

#### Experts (NO spaces):
```html
<option value="en"> English</option>
```

#### Impact
- ⚠️ Visual inconsistency (spacing in dropdown)
- ❌ Not breaking but sloppy

---

### 5. **Main Content Structure Inconsistencies**

#### Charms & Chief Gear (CORRECT):
```html
<div class="app-shell">
  <main role="main">
    <h2 data-i18n="...">Header</h2>
    <div class="inventory-profiles-row" role="group" aria-label="Inventory and profiles">
```

#### Fire Crystals (CORRECT):
```html
<div class="app-shell">
  <main role="main">
    <h2 style="margin-top:0;" data-i18n="..." id="fire-crystals-heading">Fire Crystals</h2>
    <div class="inventory-profiles-row">
```

#### War Academy (CORRECT):
```html
<div class="app-shell">
  <main role="main" class="war-lab-page">
    <section class="card" aria-labelledby="war-lab-title">
      <h1 id="war-lab-title" data-i18n="war-academy-title">War Academy – Helios Research</h1>
```

#### Pets (BROKEN):
```html
<!-- NO app-shell wrapper! -->
<main>  <!-- NO role="main" -->
  <h2>Pets</h2>
  <section class="coming-soon" role="region" aria-labelledby="pets-coming-title">
    <h3 id="pets-coming-title">...</h3>
```

#### Experts (BROKEN):
```html
<!-- app-shell closing tag but no opening? -->
<!-- main tag not properly closed before nav -->
<main>  <!-- NO role="main" -->
  <h2>Experts</h2>
```

#### Impact
- ❌ Pets & Experts missing `.app-shell` wrapper (CSS Grid layout breaks)
- ❌ Pets & Experts missing `role="main"` (accessibility issue)
- ❌ Experts has malformed HTML structure
- ❌ Heading hierarchy inconsistent (h1 vs h2)

---

### 6. **Service Worker Registration**

#### Charms, Chief Gear, Fire Crystals (CORRECT):
```html
<script src="Scripts/sw-register.js" defer></script>
```

#### War Academy (MISSING):
```html
<!-- No sw-register script -->
```

#### Pets (CORRECT):
```html
<script src="Scripts/sw-register.js" defer></script>
```

#### Experts (CORRECT):
```html
<script src="Scripts/sw-register.js" defer></script>
```

#### Impact
- ⚠️ War Academy won't have offline support (PWA feature incomplete)

---

## 🟡 Moderate Issues

### 7. **Page Title Format Inconsistency**

| Page | Title | Status |
|------|-------|--------|
| charms.html | `WOSC-Charms` | ❌ Abbreviation unclear |
| chiefGear.html | `WOSC-Chief Gear` | ❌ Abbreviation unclear |
| fireCrystals.html | `WOSFORGE-Fire Crystals` | ✅ Clear |
| war-academy.html | `WOSFORGE-War Academy` | ✅ Clear |
| pets.html | `WOSFORGE-Pets` | ✅ Clear |
| experts.html | `WOSFORGE-Experts` | ✅ Clear |

#### Recommendation
Standardize all to: `WOSFORGE-{Page Name}`

---

### 8. **Meta Description Missing in Some Pages**

#### Present (Good):
- charms.html ✅
- chiefGear.html ✅

#### Missing (Should Add):
- fireCrystals.html ❌
- war-academy.html ❌
- pets.html ❌
- experts.html ❌

#### Recommended Format:
```html
<meta name="description" content="Calculate and optimize your Whiteout Survival [Feature]. Save profiles, batch edit, and get resource breakdowns.">
```

---

### 9. **Accessibility: Missing aria-label on Group Containers**

#### Charms & Chief Gear (CORRECT):
```html
<div class="inventory-profiles-row" role="group" aria-label="Inventory and profiles">
```

#### Fire Crystals, War Academy (MISSING aria-label):
```html
<div class="inventory-profiles-row">
<!-- Should have: role="group" aria-label="Inventory and profiles" -->
```

---

### 10. **Inventory Section Naming Inconsistency**

| Page | Section Title i18n Key | Default Text |
|------|------------------------|--------------|
| Charms | `charms-inventory` | "Charms Inventory" |
| Chief Gear | `inventory-header` | "Your Inventory" |
| Fire Crystals | `inventory-header` | "Your Inventory" |
| War Academy | `your-inventory` | "Your Inventory" |

#### Issue
Inconsistent i18n keys make translation harder.

#### Recommendation
Standardize to: `inventory-header` across ALL pages

---

## 📋 Summary Table

| Issue | Charms | Chief Gear | Fire Crystals | War Academy | Pets | Experts | Priority |
|-------|--------|-----------|---------------|-------------|------|---------|----------|
| Script loading | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | 🔴 HIGH |
| CSS minification | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | 🔴 HIGH |
| Navigation ID | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔴 HIGH |
| Navigation structure | ✅ | ✅ | ✅ | ✅ | ✅ | ❌ | 🔴 HIGH |
| HTML structure | ✅ | ✅ | ✅ | ✅ | ❌ | ❌ | 🔴 HIGH |
| Service worker | ✅ | ✅ | ✅ | ❌ | ✅ | ✅ | 🟡 MED |
| Page titles | ❌ | ❌ | ✅ | ✅ | ✅ | ✅ | 🟡 MED |
| Meta description | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | 🟡 MED |
| Accessibility labels | ✅ | ✅ | ❌ | ❌ | ❌ | ❌ | 🟡 MED |

---

## ✅ Remediation Checklist

### Phase 1: Critical Fixes (Do First)
- [ ] **Experts.html**: Fix navigation structure (add id, wrap in divs, fix HTML)
- [ ] **Experts.html**: Add `role="main"` to `<main>` tag
- [ ] **Pets.html**: Add `role="main"` to `<main>` tag, wrap in `.app-shell`
- [ ] **All pages**: Standardize script loading order
- [ ] **Fire Crystals, War Academy, Pets, Experts**: Update CSS link to minified version
- [ ] **War Academy**: Add `<script src="Scripts/sw-register.js" defer></script>`

### Phase 2: Accessibility Fixes
- [ ] Add `role="group" aria-label="..."` to all `.inventory-profiles-row`
- [ ] Standardize inventory section i18n keys to `inventory-header`
- [ ] Fix heading hierarchy (use h2 consistently for page headers, not h1)

### Phase 3: SEO & Polish
- [ ] Add meta descriptions to fire-crystals, war-academy, pets, experts
- [ ] Standardize page titles to `WOSFORGE-{Page Name}` format
- [ ] Review language selector spacing for consistency

---

## 📝 Notes for Implementation

1. **Create a template**: Use `charms.html` + `chiefGear.html` as the canonical template
2. **Test each page**: After fixing, test:
   - Console for JS errors (F12)
   - Theme toggle works
   - Language selector works
   - Offline mode (if PWA)
3. **Validate HTML**: Use W3C validator to catch structure issues
4. **Lighthouse audit**: Run each page through Chrome Lighthouse for accessibility score
