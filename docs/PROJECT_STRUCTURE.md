# WOS Calculator - Project Structure Guide

This guide explains what every file does and where to find things.

---

## 📁 Folder Layout

```
Wos calculator/
├── src/
│   ├── index.html          ← Home page
│   ├── charms.html         ← Main calculator page
│   ├── style/
│   │   └── style.css       ← All styling & colors
│   └── Scripts/
│       ├── theme.js        ← Theme toggle
│       ├── table-sort.js   ← Sorting behavior
│       ├── calculator.js   ← Calculations, batch, reset
│       └── profiles.js     ← Profiles (save/load/rename/delete)
├── package.json            ← npm configuration
├── package-lock.json       ← Dependency lock file
├── .stylelintrc.json       ← CSS linter rules
├── README.md               ← Quick start & overview
├── MAINTENANCE.md          ← How to change things
└── PROJECT_STRUCTURE.md    ← This file
```

---

## 📄 File Details

### 1. **index.html** - Home Page
**Purpose:** Landing page

**Contains:**
- Header with project title
- Link to dark-mode toggle button
- Link to calculator page (charms.html)

**When to edit:**
- Change home page title or description
- Add new sections or information
- Update links

**Key IDs/Classes:**
- `dark-mode-toggle` - Button to switch themes (shared with charms.html)

---

### 2. **charms.html** - Main Calculator
**Purpose:** The calculator interface where users input charm levels

**Contains:**
- Dark mode toggle button
- Profiles section (save/load/rename/delete)
- Batch controls (quick-set all FROM or TO levels)
- Charm input grids (Hat, Chestplate, Ring, Watch, Pants, Staff)
  - Each charm has two selects: FROM level and TO level
- Results table (shows calculations)

**HTML Structure:**
```html
<button id="dark-mode-toggle">Dark Mode</button>
<div id="profiles-section">...</div>
<div class="charm-type" id="hat-charm">
  <select id="hat-charm-1-start"></select>
  <select id="hat-charm-1-finish"></select>
</div>
<div id="calculation-results"></div>
```

**When to edit:**
- Add new charm types
- Change charm names
- Modify level range (0-15)
- Adjust grid layout
- Add new sections

**Key IDs:**
- `dark-mode-toggle` - Theme toggle button
- `{charm-type}-charm-{number}-start` - FROM level select
- `{charm-type}-charm-{number}-finish` - TO level select
- `{charm-type}-batch-from` / `{charm-type}-batch-to` - Batch controls
- `calculation-results` - Results container (filled by JavaScript)

**Example:** Hat charm 1:
- `hat-charm-1-start` ← FROM level
- `hat-charm-1-finish` ← TO level
- `hat-batch-from` ← Batch FROM control
- `hat-batch-to` ← Batch TO control

---

### 3. **Scripts (modular)**
**Purpose:** Former monolithic `script.js` split into focused modules

**File Size:** ~650 lines (heavily commented)

**Sections:**

#### **theme.js - Theme Toggle**
- Functions: `ThemeModule.setTheme()`, `ThemeModule.init()`
- Saves preference in `localStorage['wos-theme']`

#### **calculator.js - Calculator Logic**
- Data: `costs` object (levels 0-15, resource costs)
- Functions: `sumCosts()`, `calculateAll()`, `applyBatch()`, `resetCharms()`
- Edit: change `costs`, update `types`, tweak calculations

**costs Object Example:**
```javascript
const costs = {
  0:  { guides: 5,   designs: 5,   secrets: 0 },   // Level 0→1 costs
  1:  { guides: 40,  designs: 15,  secrets: 0 },   // Level 1→2 costs
  // ... continues to level 15
  15: { guides: 650, designs: 550, secrets: 100 }  // Level 14→15 costs
};
```

#### **profiles.js - Profiles**
- Save/load/rename/delete profiles using `localStorage['wos-charm-profiles']`

#### **table-sort.js - Sorting**
- `TableSortModule.makeTableSortable()` adds click + keyboard sorting

Legacy: original `script.js` removed; behavior preserved in modules

---

### 4. **style/style.css** - All Styling
**Purpose:** Colors, fonts, layout, responsive design

**File Size:** ~347 lines (linted and clean)

**Sections:**

#### **:root Variables (Lines 1-20)**
```css
:root {
  --bg: #12121a;           /* Main background color */
  --panel: #1f1d32;        /* Panel/card background */
  --muted: #2f2b45;        /* Input field background */
  --accent: #7c6cff;       /* Button highlight color */
  --text: #e9eef8;         /* Main text color */
  --muted-text: #bfc6df;   /* Secondary text color */
  --card: rgb(255 255 255 / 3%);  /* Semi-transparent white */
  --success: #6ad29a;      /* Success green */
  --danger: #ff7b7b;       /* Error red */
}
```

**When to edit:** Change all theme colors at once by editing these variables

#### **Light Theme Overrides (Lines 22-32)**
```css
html.light-theme, body.light-theme {
  --bg: #ffffff;           /* White background */
  --panel: #f2f2f6;        /* Light gray panels */
  --muted: #e9e9ee;        /* Light gray inputs */
  --accent: #6b6bf0;       /* Blue accent */
  --text: #111111;         /* Black text */
  --card: rgb(0 0 0 / 3%); /* Semi-transparent black */
}
```

**When to edit:** Change colors for light theme (applied when user toggles to light mode)

#### **Button Styling (Lines ~70-100)**
- Defines: hover effects (lift/shadow), focus rings (keyboard accessibility)
- When to edit: Change button appearance, size, animation

#### **Select/Input Styling (Lines ~100-150)**
- Defines: Custom dropdown arrow (SVG), input focus states
- When to edit: Change input appearance, focus indicators

#### **Batch Controls (Lines ~160-180)**
- Defines: Layout and spacing for batch buttons
- When to edit: Add more batch buttons, change layout

#### **Profiles Section (Lines ~190-230)**
- Defines: Save/load/delete/rename button styling
- When to edit: Add new profile features, change layout

#### **Results Table (Lines ~240-290)**
- Defines: `.results-table`, `.result-totals` styling
- When to edit: Change table colors, adjust column widths, add rows

#### **Media Queries (Lines ~300-347)**
- Responsive design for mobile/tablet
- When to edit: Change breakpoints, adjust layout for narrow screens

---

### 5. **package.json** - npm Configuration
**Purpose:** Lists project dependencies and scripts

**Contains:**
```json
{
  "name": "wos-calculator",
  "version": "1.0.0",
  "scripts": {
    "lint": "stylelint 'style/style.css'"
  },
  "devDependencies": {
    "stylelint": "^15.0.0",
    "stylelint-config-standard": "^35.0.0"
  }
}
```

**When to edit:**
- Add new scripts (build, test, etc.)
- Add new npm packages
- Change version number

**Running:** `npm run lint` → Checks CSS for errors

---

### 6. **.stylelintrc.json** - CSS Linter Rules
**Purpose:** Tells the linter which CSS rules to enforce

**Contains:**
- `indentation: null` - Allows mixed indentation
- `color-no-invalid-hex: true` - Prevents bad color codes
- `no-duplicate-selectors: true` - Catches duplicate CSS
- `declaration-block-single-line-max-declarations: null` - Allows multiple properties per line

**When to edit:**
- Make CSS rules stricter (set `null` to `true`)
- Relax strict rules (set `true` to `null`)
- Add new rules

---

### 7. **README.md** - Project Overview
**Purpose:** Quick start guide and feature overview

**Contains:**
- What the project is
- How to open/use it
- Features explained
- File sizes and purposes
- Learning resources
- Troubleshooting tips

**When to edit:**
- Add new features
- Update instructions
- Add FAQs
- Add learning resources

---

### 8. **MAINTENANCE.md** - Modification Guide (NEW)
**Purpose:** How-to guide for changing things

**Contains:**
- How to change colors
- How to modify costs
- How to add new charm types
- How to change button styles
- Common problems & fixes
- New feature examples (export/import, time calculator)

**When to edit:**
- Document new features
- Add common modifications
- Update troubleshooting

---

## 🔗 Data Flow

### User Opens Calculator
```
charms.html
  ↓
Loaded into browser
  ↓
script.js runs init()
  ↓
Loads theme preference from localStorage
  ↓
Loads saved profiles from localStorage
  ↓
Attaches event listeners to all buttons/selects
  ↓
Ready for user input
```

### User Selects Charm Levels
```
User clicks/changes FROM select
  ↓
Event listener triggers
  ↓
calculateAll() runs
  ↓
sumCosts() calculates resources for each charm
  ↓
formatNumber() formats numbers (1500 → "1.5K")
  ↓
Results table is rendered in #calculation-results
  ↓
makeTableSortable() adds click/keyboard handlers
```

### User Saves a Profile
```
User clicks "Save Profile"
  ↓
captureCurrent() reads all charm FROM/TO values
  ↓
saveNewProfile() asks for name
  ↓
writeProfiles() saves to localStorage as JSON
  ↓
renderProfilesList() updates profile dropdown
```

### User Switches Theme
```
User clicks dark-mode-toggle button
  ↓
setTheme() runs
  ↓
Adds/removes 'light-theme' class to <html>
  ↓
CSS rules apply new colors
  ↓
Saves choice to localStorage
  ↓
Theme remembered next time user opens page
```

---

## 🎯 "Where Do I Find X?"

| Need to... | Edit this file | Find this section | Line# approx |
|---|---|---|---|
| Change button color | `style.css` | `button {` rules | ~75 |
| Change accent purple | `style.css` | `:root { --accent: }` | ~5 |
| Change light theme colors | `style.css` | `html.light-theme` | ~22 |
| Change level 5 cost | `calculator.js` | `const costs = {` | near top |
| Add new charm type | `charms.html` + `calculator.js` | Copy Hat section + update `types` | both files |
| Change batch behavior | `calculator.js` | `applyBatch()` function | mid file |
| Fix profile saving | `script.js` | `readProfiles()`, `writeProfiles()` | ~330 |
| Change table layout | `style.css` | `.results-table` CSS | ~240 |
| Make mobile better | `style.css` | `@media (max-width:` | ~300 |
| Update home page | `index.html` | Any section | Varies |
| Enable strict linting | `.stylelintrc.json` | Change rules from `null` to `true` | Varies |

---

## 🧪 Development Workflow

### 1. Make a Change
Edit one of these files:
- `charms.html` - Add/change HTML
- `script.js` - Add/change logic
- `style.css` - Add/change styling

### 2. Test
- Open `charms.html` in browser (via `http://127.0.0.1:8080/charms.html` with Python server)
- Test the change
- Check browser console (F12) for errors

### 3. Lint CSS (Optional)
```powershell
npx stylelint "style/style.css"
```

### 4. Commit to Git
```powershell
git add .
git commit -m "Brief description of change"
git push origin main
```

---

## 📊 File Dependencies

```
charms.html
  ├── Linked from: index.html
  ├── Calls: script.js
  ├── Linked to: style.css
  └── Needs: Dark mode toggle button ID = 'dark-mode-toggle'

script.js
  ├── Uses: HTML element IDs from charms.html
  ├── Uses: CSS variables from style.css
  ├── Stores: Data in localStorage (browser memory)
  └── Accesses: costs object, types array

style.css
  ├── Styles: charms.html + index.html
  ├── Defines: --accent, --bg, --text variables
  ├── Checked by: .stylelintrc.json rules
  └── Applied by: Browsers when page loads
```

---

## 💾 Data Storage Locations

**Where does the browser save data?**

| Data | Storage | Key | Format |
|---|---|---|---|
| Theme (dark/light) | `localStorage` | `'wos-theme'` | String: `'light'` or `'dark'` |
| Saved profiles | `localStorage` | `'wos-charm-profiles'` | JSON array of profile objects |

**Example:**
```javascript
// Theme preference
localStorage['wos-theme'] = 'light';

// Profiles
localStorage['wos-charm-profiles'] = JSON.stringify([
  { name: "Farm Setup", hat: {...}, chestplate: {...}, ... },
  { name: "Hunt Setup", hat: {...}, chestplate: {...}, ... }
]);
```

**Browser Clearing Data:** If user clears browser cache, both theme and profiles are deleted.

---

## 🚨 Common Mistakes

| Mistake | Problem | Fix |
|---|---|---|
| Edit HTML but IDs don't match JS | Elements won't work | Make sure `id="hat-charm-1-start"` in HTML matches `#hat-charm-1-start` in JS |
| Typo in `types` array | Batch controls don't work | Check spelling: `['hat','chestplate',...]` |
| Wrong level number in costs | Calculations wrong | Verify costs[5] exists for level 5 |
| CSS variable typo | Colors don't change | Use: `var(--accent)` not `var(--acent)` |
| Edit file, no change visible | Browser cache | Hard refresh: Ctrl+Shift+R |
| Profiles won't save | Not using http:// | Use Python server: `python -m http.server 8080` |

---

## 📞 Quick Help

**"I want to add a NEW feature"**
→ Check MAINTENANCE.md → Feature Section

**"Styling looks broken"**
→ Check CSS variable names in `:root {}`

**"Calculations are wrong"**
→ Check `costs` object values in script.js

**"Buttons don't work"**
→ Check HTML IDs match JavaScript IDs

**"My changes don't show"**
→ Hard refresh (Ctrl+Shift+R) or clear browser cache

---

## 🎓 Learning Path

**If you want to understand...**

1. **Colors & Layout** → Read: `style.css` + MAINTENANCE.md (Change Colors section)
2. **Calculator Math** → Read: `script.js` + comments in `sumCosts()` and `calculateAll()`
3. **How Profiles Work** → Read: `script.js` + comments in profile section + localStorage explanation
4. **How to Add Features** → Read: MAINTENANCE.md + "Feature" sections

---

## ✅ Validation Checklist

Before sharing updates:

- [ ] HTML is valid (no broken tags)
- [ ] All IDs in HTML match IDs in JS
- [ ] CSS linter passes: `npx stylelint "style/style.css"`
- [ ] Theme toggle works (dark ↔ light)
- [ ] Calculator computes correctly
- [ ] Profile save/load works
- [ ] Table sorts when headers clicked
- [ ] Changes committed to Git

**You got this!** 🚀
