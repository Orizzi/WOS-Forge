# WOS Calculator - Maintenance & Modification Guide

This guide shows you exactly how to modify the calculator for common tasks and how to update game data from the Excel workbook.

---

## 📋 Table of Contents

1. [Update Game Data from Excel](#update-game-data-from-excel)
2. [Change Colors](#change-colors)
3. [Modify Resource Costs Manually](#modify-resource-costs-manually)
4. [Add a New Charm Type](#add-a-new-charm-type)
5. [Change Button Styles](#change-button-styles)
6. [Fix Common Problems](#fix-common-problems)
7. [Add New Features](#add-new-features)

---

## 📊 Update Game Data from Excel

### Overview

All calculator data comes from **`src/assets/resource_data.xlsx`** (39 sheets). When game data updates:

1. Edit the Excel workbook with new values
2. Run extractor scripts to generate CSVs
3. Calculators automatically load new data at runtime

### Prerequisites

Make sure you have Node.js installed and dependencies installed:
```bash
npm install
```

### Full Data Refresh (All Calculators)

```bash
npm run import:all
```

This extracts:
- **Building resources** (Fire Crystals calculator): F30→FC10 base resources for Furnace, Embassy, Command Center, Infirmary, Infantry/Marksman/Lancer Camps, War Academy
- **Charm costs**: Guides, Designs, Secrets, Power, SvS Points (levels 1-16)
- **Chief gear costs**: Alloy, Polish, Plans, Amber, Power, SvS Points (116 gear levels)

### Individual Extractors

Extract specific domains when only one sheet changed:

#### Buildings (Fire Crystals)
```bash
npm run import:buildings
# OR
node scripts/extract-building-resources.js
```

**Source sheets:** Furnace, Embassy, Command Center, Infirmary, Infantry Camp, Marksman Camp, Lancer Camp, War Academy  
**Output:** `src/assets/resource_costs.csv` (396 rows, format: `building,level,meat,wood,coal,iron`)  
**Affected file:** `src/Scripts/fire-crystals-calculator.js` (loads at runtime via `applyResourceOverridesFromCsv()`)

#### Charms
```bash
npm run import:charms
# OR
node scripts/extract-charms-costs.js
```

**Source sheet:** Charms Data  
**Output:** `src/assets/charms_costs.csv` (16 rows, format: `level,guides,designs,secrets,power,svsPoints`)  
**Affected file:** `src/Scripts/calculator.js` (loads at runtime via `loadCharmCostsFromCsv()`)

#### Chief Gear
```bash
npm run import:chief-gear
# OR
node scripts/extract-chief-gear-costs.js
```

**Source sheet:** New Chief Gear Data  
**Output:** `src/assets/chief_gear_costs.csv` (116 rows, format: `gearLevel,number,alloy,polish,plans,amber,power,svsPoints`)  
**Affected file:** `src/Scripts/chief-gear-calculator.js` (loads at runtime via `loadChiefGearCostsFromCsv()`)

### Verifying Extraction

After running extractors:

1. **Check console output**: Should say "Extracted X levels to [path]"
2. **Inspect CSV files**: Open generated CSVs in `src/assets/` to verify values
3. **Test in browser**: Run `npm start`, open calculator, verify new values display correctly

### Troubleshooting Extraction

**Error: "Could not find required columns"**  
- Excel sheet structure changed
- Check extractor's column indices match current sheet layout
- Update `scripts/extract-*.js` header row detection logic

**Error: "Sheet 'X' not found"**  
- Sheet renamed in workbook
- Update `sheetName` variable in extractor script

**Values look wrong**  
- Check if sheet has multiple header rows (adjust `dataStartRow` in extractor)
- Verify column order matches extractor's indices
- Check for hidden columns or merged cells in Excel

---

## 🎨 Change Colors

### Where Colors Are Defined
**File:** `style/style.css` (top section)

### Current Colors (Dark Theme)
```css
:root {
  --bg: #12121a;         /* Main background (very dark) */
  --panel: #1f1d32;      /* Panel backgrounds (dark purple) */
  --muted: #2f2b45;      /* Input backgrounds (dark purple) */
  --accent: #7c6cff;     /* Purple (buttons, highlights) */
  --text: #e9eef8;       /* Main text color (light) */
  --muted-text: #bfc6df; /* Secondary text (lighter) */
  --card: rgb(255 255 255 / 3%); /* Semi-transparent white */
  --success: #6ad29a;    /* Green (not currently used) */
  --danger: #ff7b7b;     /* Red (not currently used) */
}
```

### Current Colors (Light Theme)
```css
html.light-theme, body.light-theme {
  --bg: #ffffff;         /* White background */
  --panel: #f2f2f6;      /* Light gray panels */
  --muted: #e9e9ee;      /* Light gray inputs */
  --accent: #6b6bf0;     /* Blue accent */
  --text: #111111;       /* Dark text */
  --card: rgb(0 0 0 / 3%); /* Semi-transparent black */
}
```

### How to Change a Color

**Task:** Change the accent color from purple to orange

**File:** `style/style.css`

**Step 1:** Find the `:root {` section

**Step 2:** Change this line:
```css
--accent: #7c6cff;  /* OLD: Purple */
```

To:
```css
--accent: #ff8c00;  /* NEW: Orange */
```

**Step 3:** Also change the light theme version:
```css
html.light-theme, body.light-theme {
  --accent: #ff6b00;  /* Orange for light theme */
}
```

**Step 4:** Save the file, hard-refresh your browser (Ctrl+Shift+R), and see the orange!

### Color Resources
- **Hex color picker:** [colorpicker.com](https://colorpicker.com)
- **Color ideas:** [colorhunt.co](https://colorhunt.co)

---

## 💰 Modify Resource Costs Manually

> ⚠️ **Note:** It's recommended to update costs via the Excel workbook (see [Update Game Data from Excel](#update-game-data-from-excel)). Manual updates are only for quick testing or when the workbook isn't available.

The cost table tells the game how much it costs to upgrade from level N-1 to level N.

### Current Table
**File:** `Scripts/calculator.js` (near top)

```javascript
const costs = {
  1:  { guides: 5,   designs: 5,   secrets: 0, power: 0, svsPoints: 0 },
  2:  { guides: 40,  designs: 15,  secrets: 0, power: 0, svsPoints: 0 },
  3:  { guides: 60,  designs: 40,  secrets: 0, power: 0, svsPoints: 0 },
  // ... and so on
  16: { guides: 650, designs: 550, secrets: 100, power: 0, svsPoints: 0 }
};
```

**Note:** These default values are overridden at runtime by `charms_costs.csv`. To make permanent changes, edit the workbook and re-extract.

### How to Update Costs

**Task:** Change level 1 cost from (40 guides, 15 designs) to (50 guides, 20 designs)

**Step 1:** Open `Scripts/calculator.js`

**Step 2:** Find this line:
```javascript
1: { guides: 40, designs: 15, secrets: 0 },
```

**Step 3:** Change it to:
```javascript
1: { guides: 50, designs: 20, secrets: 0 },
```

**Step 4:** Save, refresh, and test!

---

## ➕ Add a New Charm Type

Want to add a new charm type (e.g., "Amulet")?

### Step 1: Add HTML Inputs
**File:** `charms.html`

Find the section with Hat/Chestplate/Ring charm inputs. Copy the **Hat section** and paste it below. Change all `hat-` to your new type.

**Example: Adding "Amulet"**

Find:
```html
<div class="table">
  <div class="table-top">
    <label>Hat</label>
    <div class="batch-inline">
      <select id="hat-batch-from">...</select>
      <select id="hat-batch-to">...</select>
    </div>
  </div>
  <div class="inner-selection">
    <select id="hat-charm-1-start">...</select>
    <select id="hat-charm-1-finish">...</select>
  </div>
  <!-- More hat charms... -->
</div>
```

Copy and paste this whole section, then change ALL `hat-` to `amulet-`:

```html
<div class="table">
  <div class="table-top">
    <label>Amulet</label>
    <div class="batch-inline">
      <select id="amulet-batch-from">...</select>
      <select id="amulet-batch-to">...</select>
    </div>
  </div>
  <div class="inner-selection">
    <select id="amulet-charm-1-start">...</select>
    <select id="amulet-charm-1-finish">...</select>
  </div>
  <!-- Add as many amulet charms as needed... -->
</div>
```

### Step 2: Register the Type in JavaScript
**File:** `Scripts/calculator.js`

Find this line:
```javascript
const types = ['hat','chestplate','ring','watch','pants','staff'];
```

Change to:
```javascript
const types = ['hat','chestplate','ring','watch','pants','staff','amulet'];
```

### Step 3: Done!
The calculator will automatically:
- Show batch controls for amulets
- Calculate costs for amulet selections
- Include amulets in reset
- Save/load amulet values in profiles

---

## 🔘 Change Button Styles

### Current Button Styling
**File:** `style/style.css` (search for `button {`)

```css
button {
    font-weight: 500;              /* Bold text */
    letter-spacing: 0.3px;         /* Space between letters */
    transition: all 150ms ease;    /* Smooth animation */
    cursor: pointer;
}

button:hover {
    transform: translateY(-2px);   /* Lift up 2 pixels */
    box-shadow: 0 8px 20px rgba(0,0,0,0.3);  /* Shadow appears */
    filter: brightness(1.05);      /* Slightly brighter */
}

button:active {
    transform: translateY(0);      /* Reset position */
    box-shadow: 0 2px 8px rgba(0,0,0,0.2);  /* Smaller shadow */
}

button:focus {
    outline: 3px solid rgba(124,108,255,0.3);  /* Focus ring */
    outline-offset: 2px;
}
```

### Change Button Color
**Task:** Make buttons red

Add this rule below button styles:

```css
button {
    background-color: #ff3333;  /* Red */
    color: #ffffff;             /* White text */
}
```

### Change Hover Effect
**Task:** Remove the lift effect

In `button:hover`, change:
```css
transform: translateY(-2px);  /* OLD: Lifts up */
```

To:
```css
transform: scale(1.05);  /* NEW: Grows slightly bigger */
```

### Change Button Size
**Task:** Make buttons larger

In the `button` rule, add:
```css
padding: 12px 20px;  /* Bigger padding = bigger button */
font-size: 1.1em;    /* Slightly larger text */
```

---

## 🐛 Fix Common Problems

### Problem 1: Colors Don't Change
**Cause:** Browser cache showing old CSS
**Fix:** Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac)

### Problem 2: Profiles Won't Save
**Cause:** Opening file as `file://` (not through web server)
**Fix:** Run: `python -m http.server 8080` then visit `http://127.0.0.1:8080/charms.html`

### Problem 3: Calculations Are Wrong
**Cause:** Costs table has incorrect values
**Fix:** Check the `costs` object in `Scripts/calculator.js` for typos

**Example:** Wrong costs
```javascript
5: { guides: 120, designs: 300, secrets: 0 }
```
Look for extra zeros or missing numbers.

### Problem 4: Batch Controls Don't Work
**Cause:** Charm type not registered in `types` array
**Fix:** In `Scripts/calculator.js`, add your charm type to:
```javascript
const types = ['hat','chestplate','ring','watch','pants','staff','YOUR_TYPE_HERE'];
```

### Problem 5: Dark/Light Mode Toggle Doesn't Work
**Cause:** Button ID mismatch
**Check:** 
- In `charms.html`: `<button id="dark-mode-toggle">`
- In `Scripts/theme.js` the `TOGGLE_ID` constant is `'dark-mode-toggle'`

Both must match exactly.

---

## ✨ Add New Features

### Feature 1: Export/Import Profiles as JSON

**What it does:** Let users download and share their profiles

**Where to add:** In `charms.html`, add buttons to the profiles section:

```html
<button id="export-profiles">Export</button>
<button id="import-profiles">Import</button>
```

**In `Scripts/profiles.js` (inside `ProfilesModule.init()`), add listeners:**

```javascript
const exportBtn = document.getElementById('export-profiles');
if (exportBtn) exportBtn.addEventListener('click', () => {
  const profiles = readProfiles();
  const json = JSON.stringify(profiles, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'wos-profiles.json';
  a.click();
});

const importBtn = document.getElementById('import-profiles');
if (importBtn) importBtn.addEventListener('click', async () => {
  const picker = document.createElement('input');
  picker.type = 'file';
  picker.accept = 'application/json';
  picker.onchange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const text = await file.text();
    try {
      const data = JSON.parse(text);
      writeProfiles(data);
      renderProfilesList();
      alert('Profiles imported successfully');
    } catch(err){
      alert('Invalid JSON file');
    }
  };
  picker.click();
});
```

### Feature 2: Calculate Total Time to Upgrade

**What it does:** Show how many days it takes to gather resources

**In `Scripts/calculator.js`, after computing `grand` inside `calculateAll()`, add:**

```javascript
function estimateDaysNeeded(totals){
  // Example rates; tweak as needed
  const daysForGuides = Math.ceil(totals.guides / 100);
  const daysForDesigns = Math.ceil(totals.designs / 50);
  const daysForSecrets = Math.ceil(totals.secrets / 10);
  return Math.max(daysForGuides, daysForDesigns, daysForSecrets);
}
```

Call it in the results:
```javascript
const days = estimateDaysNeeded(grand);
const timeHtml = `<p>Estimated: <strong>${days} days</strong></p>`;
out.innerHTML = totalsHtml + timeHtml + tableHtml;
```

### Feature 3: Add a Notes Field to Profiles

**What it does:** Store notes with each profile (e.g., "Farm runes first")

**In `charms.html`**, add a textarea to profiles section:

```html
<textarea id="profile-notes" placeholder="Add notes..."></textarea>
```

**In `Scripts/profiles.js`**, modify `captureCurrent()`:

```javascript
function captureCurrent(){
  // ... existing code ...
  const notes = document.getElementById('profile-notes').value || '';
  obj._notes = notes;  // Store notes with underscore prefix
  return obj;
}
```

**And modify `applyProfileObject()` in `Scripts/profiles.js`:**

```javascript
function applyProfileObject(obj){
  if(!obj) return;
  
  // Restore notes if they exist
  if(obj._notes) {
    document.getElementById('profile-notes').value = obj._notes;
  }
  
  // ... rest of existing code ...
}
```

---

## 🔍 Testing Checklist

After making changes:

- [ ] Open the calculator (charms.html)
- [ ] Verify it loads without JavaScript errors (F12 → Console)
- [ ] Test dark/light mode toggle
- [ ] Set charm values and see calculations
- [ ] Try sorting the table
- [ ] Save/load a profile
- [ ] Test on mobile (narrow screen)
- [ ] Run linter: `npx stylelint "style/style.css"`

---

## 📞 Need Help?

- **Check the code comments** - Most functions have explanation comments
- **Compare with the original** - Look at similar working sections
- **Test one change at a time** - Makes it easier to find problems
- **Use browser DevTools** (F12) - Console shows error messages

---

## 🚀 When You're Ready to Deploy

1. Run linter to catch CSS issues:
   ```powershell
   npx stylelint "style/style.css"
   ```

2. Commit your changes:
   ```powershell
   git add .
   git commit -m "Describe what you changed"
   git push origin main
   ```

3. Upload to web hosting or share the folder

**That's it!** You're maintaining the calculator! 🎉
