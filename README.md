# WOS Calculator - Complete Beginner's Guide

Welcome! This is a **Whiteout Survival (WOS) Game Calculator** that helps players calculate resource costs for upgrading charms, chief gear, and buildings (Fire Crystals). All data is driven by an authoritative Excel workbook to ensure accuracy.

> 📁 **New Organization:** All source code is in `src/` folder, all documentation is in `docs/` folder. See the structure below!

---

## 🎯 What Does This Project Do?

The calculator helps you answer questions like:
- **"How many guides do I need to upgrade my hat charm from level 0 to level 10?"**
- **"What's the total cost to upgrade my chief gear from Blue to Gold?"**
- **"How many Fire Crystals do I need to upgrade my Furnace to FC10?"**
- **"Can I save my favorite upgrade plans?"**

You set the current and desired levels, and the app calculates total resources, power gains, and SvS points.

---

## 📊 Data Sources

All calculator data is extracted from **`src/assets/resource_data.xlsx`** (39 sheets) and converted to CSV files at build time:

| Calculator | Source Sheet(s) | Generated CSV | Extracted By |
|-----------|----------------|---------------|--------------|
| **Charms** | Charms Data | `charms_costs.csv` | `scripts/extract-charms-costs.js` |
| **Chief Gear** | New Chief Gear Data | `chief_gear_costs.csv` | `scripts/extract-chief-gear-costs.js` |
| **Fire Crystals** | Furnace, Embassy, Command Center, Infirmary, Infantry/Marksman/Lancer Camps, War Academy | `resource_costs.csv` | `scripts/extract-building-resources.js` |

### Data Import Pipeline

1. **Update workbook**: Edit `src/assets/resource_data.xlsx` with latest game data
2. **Run extractors**: Execute Node.js scripts to generate CSVs
3. **Automatic override**: Calculators load CSVs at runtime and override defaults

Commands:
```bash
# Extract all data (run after workbook updates)
npm run import:all

# Extract individual domains
node scripts/extract-building-resources.js   # Fire Crystals base resources
node scripts/extract-charms-costs.js         # Charm costs, power, SvS points
node scripts/extract-chief-gear-costs.js     # Chief gear costs, power, SvS points
```

See [`docs/MAINTENANCE.md`](docs/MAINTENANCE.md) for detailed import procedures.

---

## 📁 Project Structure (Easy Explanation)

Think of it like a house:
- **The HTML files** = the rooms (pages: home, calculators)
- **CSS file** = the paint and furniture (colors, styling, layout)
- **JavaScript files** = the appliances (buttons work, calculations happen)
- **Excel workbook** = the source of truth (all game data)

```
Wos calculator/
├── src/                          # Source code folder
│   ├── index.html                # Home page
│   ├── charms.html               # Charms calculator page (main page you use)
│   ├── style/
│   │   └── style.css             # All colors, fonts, button styles, dark/light theme
│   └── Scripts/                  # Modular JavaScript (monolith removed)
│       ├── theme.js              # Theme toggle (dark/light)
│       ├── calculator.js         # Core calculations (sumCosts, calculateAll, batch, reset)
│       ├── profiles.js           # Profile save/load/rename/delete (localStorage)
│       └── table-sort.js         # Sortable results table behavior
├── docs/                         # Documentation folder
│   ├── START_HERE.md             # Begin here for complete overview
│   ├── MAINTENANCE.md            # How to maintain and update the project
│   ├── PROJECT_STRUCTURE.md      # Detailed code structure explanation
│   ├── QUICK_REFERENCE.md        # Quick lookup guide
│   ├── SETUP_LINT_VERIFY.md      # How to install and run linter
│   └── button-improvements/      # Button enhancement documentation
├── package.json                  # List of tools we installed (stylelint, etc)
├── .stylelintrc.json             # Configuration for checking CSS style
├── README.md                     # This file! Explains the project
└── node_modules/                 # Folder with all the tools (ignore this)
```

---

## 🚀 Quick Start (How to Use It)

### Method 1: Using npm (Recommended)
```bash
npm start
```
Then open `http://127.0.0.1:8080/` in your browser.

### Method 2: Direct File Access
Navigate to the `src/` folder and double-click `charms.html` in your file explorer, or open it in your browser.

> **Note:** For full functionality (saving profiles), use Method 1 or run `python -m http.server 8080` from the `src/` folder.

### Step 1: Set Charm Levels
For each charm type (Hat, Chestplate, Ring, etc.):
1. Pick the **starting level** (FROM)
2. Pick the **ending level** (TO)
3. The calculator shows the cost immediately

Example:
```
Hat Charm 1: FROM 0 → TO 5
Result: 100 Guides, 200 Designs, 0 Secrets needed
```

### Step 3: Use Batch Controls
Want all hat charms to start at level 0? Use the quick "Batch" dropdown above the inputs—it sets all FROM or TO at once.

### Step 4: Save Your Plan as a Profile
1. Enter a name: "My Plan 1"
2. Click "Save as new"
3. Your plan is saved in your browser
4. Later, select it from the dropdown to load it again

### Step 5: Toggle Dark/Light Mode
Click the **"Dark mode toggle"** button in the top-right to switch themes.

---

## 🎨 Key Features Explained

### 1. **Dark/Light Theme**
- Stored in your browser (survives page refresh)
- Changes colors of everything: background, text, buttons, inputs
- File: `style.css` (look for `--bg`, `--panel`, `--text` variables)

### 2. **Smart Calculations**
- Looks at the resource cost table (internally: 0→16 levels)
- Adds up all the costs from your FROM level to TO level
- Shows results in a nice table format
- File: `Scripts/calculator.js` (look for `sumCosts()` and `calculateAll()`)

### 3. **Profiles (Save & Load)**
- Saves your input values to browser storage
- You can have multiple profiles
- Stored with key: `wos-charm-profiles`
- File: `Scripts/profiles.js` (look for `saveNewProfile()`, `loadSelectedProfile()`)

### 4. **Sortable Table**
- Click any table header to sort by that column
- Click again to reverse sort
- Example: Click "Guides" to see highest cost charms first
- File: `Scripts/table-sort.js` (look for `TableSortModule.makeTableSortable()`)

### 5. **Accessibility**
- All buttons/inputs can be reached with **Tab** key
- Focus states are visible (purple outline)
- Screen reader friendly (aria labels)
- Implemented across modules (`theme.js`, `calculator.js`, `table-sort.js`, `profiles.js`) and `charms.html` (aria-label, aria-live, aria-pressed)

---

## 📖 How the Code Works (Simple Explanation)

### The CSS File (`style.css`)
**Purpose:** Makes everything look pretty

**Key sections:**
```css
/* Theme colors - easy to change! */
:root {
  --bg: #12121a;         /* Dark background */
  --text: #e9eef8;       /* Light text */
  --accent: #7c6cff;     /* Purple for buttons/highlights */
}

/* Light theme - colors flip here */
html.light-theme {
  --bg: #ffffff;         /* White background */
  --text: #111111;       /* Dark text */
}

/* Button styles */
button { 
  padding: 8px 10px;     /* Inside spacing */
  border-radius: 6px;    /* Rounded corners */
  cursor: pointer;       /* Hand cursor */
}

button:hover {
  transform: translateY(-2px);  /* Lift effect */
  box-shadow: ...;              /* Shadow appears */
}
```

**To change colors:** Find the `:root` section at the top, change the hex colors (e.g., `#7c6cff` → `#ff6b6b` for red).

### JavaScript Modules (Replaces Former Monolithic `script.js`)
Instead of one large file, logic is split for clarity:

1. **`theme.js` – Theme Toggle**
  - Reads saved theme from browser storage
  - Toggles dark/light on click
  - Updates button text + aria-pressed state

2. **`calculator.js` – Cost Calculator**
  - `costs` object = resource table (level 0→15 costs)
  - `sumCosts(from,to)` adds up costs
  - `calculateAll()` renders results & totals
  - Batch controls + reset logic

3. **`profiles.js` – Profiles/Presets**
  - Save / load / overwrite / rename / delete profile sets
  - Uses localStorage key `wos-charm-profiles`

4. **`table-sort.js` – Sortable Results Table**
  - `TableSortModule.makeTableSortable()` adds click + keyboard sorting
  - Manages aria-sort and visual sorted state

Legacy note: Original `script.js` removed after modularization.

### The HTML File (`charms.html`)
**Purpose:** The structure—where things go on the page

**Key sections:**
```html
<!-- Navigation (top bar) -->
<nav class="main-nav">
  <button id="dark-mode-toggle">Dark mode toggle</button>
</nav>

<!-- Profiles section (save/load plans) -->
<section class="profiles">
  <input id="profile-name" placeholder="New profile name">
  <button id="profile-save">Save as new</button>
</section>

<!-- Batch controls (quick set all) -->
<div class="batch-controls">
  <select id="hat-batch-from">Hat FROM: 0-16</select>
</div>

<!-- Charm inputs (FROM/TO dropdowns) -->
<section class="calculation-input">
  <div class="table">
    <!-- One for each charm type: Hat, Chestplate, Ring, Watch, Pants, Staff -->
    <select id="hat-charm-1-start">...</select>
    <select id="hat-charm-1-finish">...</select>
  </div>
</section>

<!-- Results table -->
<div id="calculation-results">
  <!-- JavaScript fills this with table data -->
</div>
```

---

## 🔧 Common Tasks (How to Modify)

### 📝 Task 1: Change the Dark Theme Color
**File:** `style/style.css`
**Find:** `:root { --bg: #12121a; ... }`
**Change:** `#12121a` to any hex color (use [colorpicker.com](https://colorpicker.com))

Example: To make dark theme greenish:
```css
:root {
  --bg: #0a2616;  /* Instead of #12121a - now dark green */
  --panel: #1a3d2a;
}
```

### 🎨 Task 2: Change Button Colors on Hover
**File:** `style/style.css`
**Find:** `button:hover { box-shadow: 0 8px 20px ... }`
**Change:** The shadow or add a color property

Example:
```css
button:hover {
  background-color: #ff6b6b;  /* Add this line for red buttons on hover */
  box-shadow: 0 8px 20px rgba(0,0,0,0.3);
}
```

### ➕ Task 3: Add a New Charm Type
**Files:** `src/charms.html` and `src/Scripts/calculator.js`

**In `src/charms.html`:**
1. Find the section with `<div class="table">` (has Hat, Chestplate, etc.)
2. Copy the Hat section and paste it below
3. Change all `hat-` to `yournewtype-` (e.g., `amulet-`)

**In `src/Scripts/calculator.js`:**
1. Find line with `const types = ['hat','chestplate','ring','watch','pants','staff'];`
2. Add your new type: `const types = ['hat','chestplate','ring','watch','pants','staff','amulet'];`

That's it! The rest of the code will automatically work with it.

### 🐛 Task 4: Fix a Bug or Issue
1. Open browser (F12) → Console tab
2. Look for red error messages
3. Check the line number in the error
4. Open the file and find that line
5. Read the comment above it to understand what it does
6. Make a small change and test

---

## 📚 File-by-File Explanation

| File | Size | Purpose | When to Edit |
|------|------|---------|--------------|
| `src/index.html` | ~1KB | Home page | To change home page text or layout |
| `src/charms.html` | ~50KB | Calculator page | To add/remove charm slots or inputs |
| `src/style/style.css` | ~15KB | All styling | To change colors, fonts, spacing, button styles |
| `src/Scripts/calculator.js` | ~12KB | Core calculations | Change costs, add charm types |
| `src/Scripts/profiles.js` | ~9KB | Profile management | Modify save/load behavior |
| `src/Scripts/theme.js` | ~6KB | Theme toggle | Adjust theme persistence or labels |
| `src/Scripts/table-sort.js` | ~5KB | Sorting logic | Change sort behavior |
| `docs/` | - | Documentation | Reference guides for maintenance |
| `package.json` | ~1KB | Dependency list | Rarely—only if installing new tools |
| `.stylelintrc.json` | ~1KB | CSS linter rules | Rarely—only to relax/enforce CSS rules |
| `README.md` | ~8KB | This file | To document changes you make |
| `node_modules/` | ~200MB | Downloaded tools | NEVER TOUCH—just ignore it |

---

## 🔍 Understanding the Data Flow

When you use the calculator, here's what happens:

```
YOU (set Hat FROM 0, TO 5)
     ↓
[HTML input changes] ← charms.html (form)
     ↓
[JavaScript event fires] ← Scripts/calculator.js (detects the change)
     ↓
[calculateAll() runs] ← calls sumCosts(0, 5)
     ↓
[sumCosts adds up costs] ← looks in costs table
     ↓
[Results rendered] ← makeTableSortable() adds sorting
     ↓
[You see: 100 Guides, 200 Designs] ← back to YOU
```

---

## 💾 Where Data is Stored

1. **Theme choice** → Browser's localStorage (key: `wos-theme`)
2. **Saved profiles** → Browser's localStorage (key: `wos-charm-profiles`)
3. **Current input values** → Only in memory (lost on refresh unless in a profile)
4. **CSS/JS code** → Files on your computer

**Important:** localStorage only works when you open the file from a web server (like Python's http.server). It won't work if you double-click the HTML file directly from your computer (security reasons).

---

## 🛠️ Tools You Have

| Tool | What It Does | Command |
|------|--------------|---------|
| **npm** | Manages project dependencies | `npm install` |
| **stylelint** | Checks CSS for errors/style | `npx stylelint style/style.css` |
| **Python** | Runs a local web server | `python -m http.server 8080` |
| **Git** | Version control (track changes) | `git status`, `git commit`, `git push` |

---

## 📥 Importing building resources from Excel (F30 → FC10)

You can keep your Excel workbook as the source of truth. The app will import base resource costs and override defaults at runtime.

What it does:
- Reads `src/assets/resource_data.xlsx` (sheets: Furnace, Embassy, Command Center, Infirmary, Infantry Camp, Marksman Camp, Lancer Camp, War Academy)
- Extracts rows labeled `30-1`, `30-2`, `30-3`, `30-4`, `FC1..FC9` (+ sub-steps `-1..-4`), and `FC10`
- Maps Meat/Wood/Coal/Iron totals and writes `src/assets/resource_costs.csv`
- On page load, the Fire Crystals calculator automatically loads this CSV and overrides only the F30 → FC10 entries

How to run:

```powershell
cd 'D:\CODE\Projet\Wos calculator'
npm install
npm run import:resources
```

After running, refresh the site. If the CSV is present, overrides apply; otherwise, built-in defaults are used.

Notes:
- No other data is changed; only the specified level keys for the buildings above are overridden.
- If you update the Excel, rerun the import command.

---

## 🆘 Troubleshooting

### "I opened charms.html but profiles don't save"
**Reason:** Browser security doesn't allow localStorage for file:// URLs
**Fix:** Use a web server: From the `src/` folder run `python -m http.server 8080`, then visit `http://127.0.0.1:8080/charms.html`

### "CSS changes don't show up"
**Fix:** Hard refresh your browser (Ctrl+Shift+R on Windows/Linux)

### "Buttons don't work or calculations are wrong"
**Fix:** Check browser console (F12 → Console) for red errors. Note the line number and open `Scripts/calculator.js` (or relevant module) to see what's happening.

### "I accidentally broke something"
**Fix:** Open Terminal/PowerShell and run:
```powershell
cd 'D:\CODE\Projet\Wos calculator'
git status              # See what changed
git restore filename    # Undo changes to that file
```

---

## 📞 Need Help?

If something breaks or you want to add a feature:

1. **Check MAINTENANCE.md** - common tasks
2. **Check PROJECT_STRUCTURE.md** - detailed file explanations
3. **Look for inline comments** in the code (// lines)
4. **Search the code** for function names (Ctrl+F)
5. **Use browser DevTools** (F12) to see errors and debug

---

## 🎓 Learning Resources

If you want to learn more about the technologies:
- **HTML:** [MDN HTML Guide](https://developer.mozilla.org/en-US/docs/Web/HTML)
- **CSS:** [MDN CSS Guide](https://developer.mozilla.org/en-US/docs/Web/CSS)
- **JavaScript:** [MDN JavaScript Guide](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide)
- **Local Storage:** [MDN localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage)

---

## ✅ Quick Checklist for Beginners

- [ ] I can open `src/charms.html` in my browser
- [ ] I can toggle dark/light mode
- [ ] I can set charm levels and see calculations
- [ ] I can save and load profiles
- [ ] I can click table headers to sort
- [ ] I understand where to edit colors (`src/style/style.css`)
- [ ] I know what `src/Scripts/calculator.js` does (calculations)
- [ ] I can run `npx stylelint` to check CSS

---

**You've got this! Start small—change a color, test it, see it work. Then expand from there. Good luck! 🚀**
