# WOS Calculator - Setup, Lint & Verification Guide

## Overview
This guide walks you through setting up the project for linting, running automated checks, and verifying the visual/functional changes made to the calculator.

---

## Part 1: Install Node.js & npm (One-time setup)

### Prerequisites
- You need Node.js (v14+) and npm installed on your Windows machine.

### Steps
1. **Download Node.js** from [https://nodejs.org](https://nodejs.org) (LTS version recommended).
2. **Run the installer** and follow the prompts (leave all defaults checked).
3. **Verify installation** in PowerShell:
```powershell
node --version
npm --version
```
Both should print version numbers (e.g., `v18.17.1`, `9.6.7`). If not, restart PowerShell or your machine.

---

## Part 2: Install stylelint & Configure Project

### Steps
1. **Navigate to the project folder** in PowerShell:
```powershell
Set-Location -LiteralPath 'D:\CODE\Projet\Wos calculator'
```

2. **Initialize npm** (if you don't have a `package.json` yet):
```powershell
npm init -y
```

3. **Install stylelint and the standard config**:
```powershell
npm install --save-dev stylelint stylelint-config-standard
```

This will create:
- `node_modules/` folder (dependencies)
- `package-lock.json` (lock file)
- Updated `package.json` with dev dependencies

**Note:** `.stylelintrc.json` is already created in the project root.

---

## Part 3: Run the CSS Linter

### Check for CSS errors:
```powershell
npx stylelint "style/style.css"
```

**Expected output:**
- If successful: no output or a message like "0 problems" (clean!).
- If there are issues: a list of line numbers, problems, and suggestions.

### Auto-fix simple issues:
```powershell
npx stylelint "style/style.css" --fix
```

This will automatically correct:
- Indentation issues
- Extra whitespace
- Some property/value problems

Then re-run the linter to confirm all fixes applied:
```powershell
npx stylelint "style/style.css"
```

---

## Part 4: Visual & Functional Verification Checklist

### Open the Calculator
1. Open `charms.html` in your browser (double-click the file or open in VS Code's Live Server).
   - Expected: Page loads with dark theme by default.

### Test Dark/Light Theme Toggle
2. Click the **"Dark mode toggle"** button in the top-right navigation.
   - Expected:
     - Button text changes to "Light" (now in light mode).
     - Background becomes white, text becomes dark.
     - All selects, inputs, buttons update colors (white background on light mode).
   - Click again to return to dark mode.

### Test Selects & Buttons
3. Interact with the select dropdowns (e.g., "Hat Charm 1 - Start").
   - Expected:
     - Selects have a custom downward arrow (not the native browser arrow).
     - On hover: selects show a subtle highlight/shadow.
     - On focus (Tab key): a visible purple outline appears around the select.
   - Light mode: arrow and text are dark/black; background is white.

4. Click the **"Reset all charms to 0"** button.
   - Expected:
     - All charm inputs reset to 0.
     - Button shows a slight lift/shadow on hover.
     - Button has a visible outline when focused (keyboard navigation).

### Test Profiles
5. Try saving a profile:
   - Enter a name in the "New profile name" field.
   - Click **"Save as new"**.
   - Expected: Profile appears in the dropdown; can select and load it.

### Test Results Table
6. Set a few charm values (e.g., Hat Charm 1: From 0 To 5).
   - Expected:
     - Results table appears below with slot, from, to, guides, designs, secrets.
     - Each resource column has a small **colored dot** (yellow for guides, green for designs, purple for secrets).
     - Table headers have colored dots as well.

7. **Click table headers to sort**:
   - Click "Slot", "Guides", "Designs", or "Secrets" header.
   - Expected: Table rows re-order by that column; clicking again reverses the sort order.
   - The header you just clicked should show a subtle visual indicator (light background/shadow).

### Test Accessibility (Keyboard Navigation)
8. Press **Tab** to navigate through all buttons and inputs.
   - Expected: Each interactive element gets a clear focus outline (purple/blue ring).
   - All buttons and selects are reachable via Tab key.

9. With focus on a button, press **Enter** or **Space** to activate it.
   - Expected: Button behaves as if clicked (same result).

10. With focus on a table header (after clicking it), press **Enter** or **Space** to sort.
    - Expected: Table re-sorts by that column.

### Test Responsive Layout
11. Resize the browser window to mobile width (~375px).
    - Expected:
      - Batch controls (quick-set dropdowns) stack vertically or shrink gracefully.
      - Results table remains readable (may horizontal-scroll).
      - All text and buttons remain accessible.

### Check for Console Errors
12. Open **Browser Developer Tools** (F12 → Console tab).
    - Expected: No red errors or warnings related to the calculator (CSS/JS).
    - OK to see browser warnings unrelated to the app.

---

## Part 5: Final Checks & Commit

### Re-run Linter (Final)
```powershell
npx stylelint "style/style.css"
```
Expected: **0 problems**.

### Files Modified/Created
Check that the following are updated/created:
- `d:/CODE/Projet/Wos calculator/.stylelintrc.json` ✓ (linter config)
- `d:/CODE/Projet/Wos calculator/style/style.css` ✓ (enhanced selects, buttons, focus rings)
- `d:/CODE/Projet/Wos calculator/Scripts/script.js` ✓ (sortable table, resource dots, accessibility)
- `d:/CODE/Projet/Wos calculator/charms.html` ✓ (aria-live, aria-label, aria-pressed)
- `d:/CODE/Projet/Wos calculator/index.html` ✓ (aria-pressed, title attributes)
- `d:/CODE/Projet/Wos calculator/package.json` ✓ (npm dependencies)

### Optional: Commit to Git
```powershell
cd 'D:\CODE\Projet\Wos calculator'
git add .
git commit -m "Improve CSS styling (selects, buttons, focus), enhance accessibility, add sortable table with resource dots"
git push origin main
```

---

## Troubleshooting

### stylelint not found?
```powershell
npm install --save-dev stylelint stylelint-config-standard
```

### Changes not visible in browser?
- Hard refresh: **Ctrl+Shift+R** (Windows/Linux) or **Cmd+Shift+R** (Mac).
- Clear browser cache or open in an incognito window.

### Focus outlines not visible?
- Browser default focus is sometimes overridden. The CSS now includes explicit focus outlines on all interactive elements. If you see none, check:
  - Browser accessibility settings (Preferences → Accessibility).
  - That you're using Tab (not mouse) to focus.

### Sorts not working?
- Ensure JavaScript console (F12) shows no errors.
- Verify `Scripts/script.js` is loaded (Network tab in DevTools).
- Try entering values for a few charms and clicking a table header again.

---

## Quick Command Reference

```powershell
# Navigate to project
Set-Location -LiteralPath 'D:\CODE\Projet\Wos calculator'

# Install dependencies (one-time)
npm install --save-dev stylelint stylelint-config-standard

# Run linter
npx stylelint "style/style.css"

# Auto-fix CSS
npx stylelint "style/style.css" --fix

# View linter in watch mode (re-runs on file changes)
npx stylelint "style/style.css" --watch
```

---

## Summary of Changes

### CSS (`style/style.css`)
- **Selects:** Custom appearance with dropdown arrow (cross-browser), better padding/border, light/dark theme support.
- **Buttons:** Enhanced hover (lift effect), active state (press down), focus ring (visible outline), smoother transitions.
- **Inputs:** Consistent styling with selects, dark/light theme support, visible focus states.
- **Focus rings:** All interactive elements now have a 3px purple/blue outline for accessibility.

### JavaScript (`Scripts/script.js`)
- **Sortable table headers:** Click any column header to sort rows; click again to reverse sort. Keyboard accessible (Enter/Space).
- **Resource color dots:** Small colored circles (yellow=guides, green=designs, purple=secrets) appear in table headers and cells for visual clarity.
- **Accessibility:** aria-sort attribute on headers, aria-live on results container, all headers are keyboard-focusable.

### HTML (`charms.html`, `index.html`)
- **aria-live:** Results section announces changes to screen readers.
- **aria-label:** Better semantic labels for profiles, results, and key inputs.
- **aria-pressed:** Dark-mode toggle indicates its current state.
- **title attributes:** Hover hints for buttons (e.g., "Toggle dark/light theme").

### Configuration
- **`.stylelintrc.json`:** Stylelint config enforcing CSS standards; can be extended with more rules as needed.
- **`package.json`:** Lists stylelint and dependencies for reproducible project setup.

---

## Next Steps

If you run into any issues or want to extend the calculator:
1. Check console for errors (F12 → Console).
2. Re-run the linter to catch CSS issues early.
3. Test across different screen sizes (mobile, tablet, desktop).
4. Open an issue or PR if you find bugs.

Enjoy the improved calculator! 🎉
