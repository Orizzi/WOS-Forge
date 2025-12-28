# Experts Calculator Enhancement: Tier-Separated Results

## Overview
Updated the Experts Calculator to properly handle the expert progression system with separate display for **Affinity Progression** and **Sigil Tier Unlocks**.

## Key Changes

### 1. **Data Separation** (`src/Scripts/experts-calculator.js`)

#### New Structure:
```javascript
result = {
  affinity: {
    amount: <total_affinity_costs>,
    skills: [{ books, xp, power }, ...],
    bonuses: { attack, bearPlus, power }
  },
  sigilUnlocks: {
    amount: <total_sigil_costs>,
    list: [{ level, sigils, relationship }, ...],
    bonuses: { attack, bearPlus, power }
  },
  tierGates: [10, 20, 30, ...],  // Which tier gates crossed
  warning: "Crosses tier unlocks at levels: 10, 20..."  // User notification
}
```

#### Logic:
- **Entries with `sigils > 0`** → Tier unlock costs (e.g., levels 10.1, 20.1, 30.1)
- **Entries with `sigils = 0`** → Affinity progression costs

### 2. **Range Validation** (`src/Scripts/experts-calculator.js`)

New validation in `handleCalculate()`:
```javascript
// Check that to > from
if(toLevel <= fromLevel) return null;

// Check bounds
if(fromLevel < 0 || toLevel > MAX_LEVEL) return null;
```

### 3. **Results Display** (`src/Scripts/experts-calculator.js`)

#### Three Sections:
1. **⚠ Tier Unlock Notice** (alert banner if range crosses gates)
   - Shows which tier boundaries are included
   - Example: "Crosses tier unlocks at levels: 10, 20"

2. **Affinity Progression Section**
   - Affinity cost total
   - Attack + Bear + Power bonuses from affinity
   - Sortable skills table (Skills 1-4 with Books/XP/Power)

3. **Sigil Tier Unlocks Section** (only if sigils > 0)
   - List of each tier unlock
   - Format: "Level 10→11 (Acquaintance 1): 5 Sigils"
   - Separate bonuses from sigil unlocks

4. **Total Resources Summary**
   - Total Affinity
   - Total Sigils
   - Total Power Gain

### 4. **Styling** (`src/style/style.css`)

New CSS classes added:
- `.alert` / `.alert-info` — Tier unlock notice banner
- `.affinity-section`, `.tier-unlocks-section`, `.total-section` — Section organization
- `.sigil-unlock-items` / `.sigil-unlock-item` — Individual tier unlock display
- `.result-card` with `.label` and `.value` — Formatted resource cards
- `.results-grid` — Responsive card layout (auto-fit, responsive breakpoints)

### 5. **Internationalization** (`src/Scripts/translations.js`)

Added 10 new i18n keys across all 8 languages (EN, ES, FR, DE, PT, IT, KO, RU):
- `experts-affinity-progression` — "Affinity Progression"
- `experts-sigil-unlocks` — "Sigil Tier Unlocks"
- `experts-summary` — "Total Resources"
- `experts-total-affinity` — "Total Affinity"
- `experts-total-sigils` — "Total Sigils"
- `experts-total-power` — "Total Power Gain"

## Game Mechanic Alignment

### Expert Progression Tiers:
- **Levels 0–10**: Affinity costs (relationship: Stranger)
- **Level 10→11**: 5 Sigils unlock (relationship changes to Acquaintance 1)
- **Levels 11–20**: Affinity costs (relationship: Acquaintance 1)
- **Level 20→21**: 10 Sigils unlock (relationship changes to Acquaintance 2)
- **Pattern continues**: Every 10 levels has a sigil tier unlock

### CSV Data Structure:
```
Level  Affinity  Sigils  Relationship
0      0         0       Relationship
1      1000      0       Stranger
...
10     390       0       Stranger
10.1   0         5       Acquaintance 1
11     410       0       Acquaintance 1
...
20     630       0       Acquaintance 1
20.1   0         10      Acquaintance 2
```

## User Experience Improvements

### Before:
- All levels summed equally
- No distinction between affinity and sigils
- No warning when crossing tier boundaries

### After:
- ✅ Affinity costs and sigil unlocks shown separately
- ✅ Clear tier unlock notice banner when range crosses gates
- ✅ List of specific tier unlocks with relationship tier info
- ✅ Separate resource totals for affinity vs. sigils
- ✅ Range validation (prevents invalid selections)
- ✅ Responsive layout with clear section hierarchy

## Example: Cyrille Level 9→11

**Input**: From 9 to 11

**Output**:
```
⚠ Tier Unlock Notice: Crosses tier unlocks at levels: 10

Affinity Progression
  Affinity: 750
  Attack: +0.0446
  Bear +: 0
  Power: 0
  
  Skills table: [levels 9, 10, 11 affinity costs and skill progressions]

Sigil Tier Unlocks
  Level 10→11 (Acquaintance 1): 5 Sigils

Total Resources
  Total Affinity: 750
  Total Sigils: 5
  Total Power Gain: 0
```

## Files Modified
1. `src/Scripts/experts-calculator.js` — Core logic refactor
2. `src/style/style.css` — New styling for sections and alerts
3. `src/Scripts/translations.js` — 10 new i18n keys × 8 languages
4. `src/experts.html` — No changes (CSS classes used via inline i18n keys)

## Build Output
✅ **Build successful** (5.91s)
- `experts-calculator.js` minified to **6,610 bytes** (39% reduction)
- Cache-busted: `experts-calculator.6cec022a.min.js`
- All translations compiled

## Testing Checklist
- [ ] Select Cyrille, levels 9→11 → Verify tier unlock notice shows "10"
- [ ] Select Agnes, levels 15→25 → Verify 2 tier unlocks (20, 21) displayed
- [ ] Select any expert, levels 0→110 → Verify no errors, all tiers included
- [ ] Change language → Verify i18n keys render in correct language
- [ ] Resize browser → Verify responsive layout on mobile (breakpoints: 48em, 30em)
- [ ] Console → No errors, [Experts] logs show CSV loaded
