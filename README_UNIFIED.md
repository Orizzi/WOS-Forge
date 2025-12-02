# Unified Calculators & Data (Overview)

This repo now uses unified CSV data sources and a shared calculation core. The UI is unchanged; only data loading and calculation wiring were unified.

## Data files
- Fire Crystals: `src/assets/fire_crystals_unified.csv` (fc, rfc, timeSeconds, meat, wood, coal, iron, power) for all buildings/levels. Supersedes `fire_crystals_costs.csv`, `resource_costs.csv`, `fire_crystals_steps.json`.
- Charms: `src/assets/charms_unified.csv` (level, guides, designs, secrets, power, svsPoints).
- Chief Gear: `src/assets/chief_gear_unified.csv` (level, hardenedAlloy, polishingSolution, designPlans, lunarAmber, power, svsPoints).
- War Lab: `src/assets/war_lab_unified.csv` (extracted from helios data) used to build runtime data; schema includes node metadata, per-level costs/stats/time/power.

## Scripts
- `Scripts/calculation-core.js`: unified dispatcher; adapters register and `runActive()` triggers recalcs on input/profile/translation changes. Auto-binds form inputs/inventory.
- Calculators:
  - Fire Crystals: `Scripts/min/fire-crystals-calculator.min.js` reads unified FC CSV.
  - Charms: `Scripts/min/calculator.min.js` reads unified Charms CSV.
  - Chief Gear: `Scripts/min/chief-gear-calculator.min.js` reads unified Chief Gear CSV.
  - War Lab: `Scripts/min/war-laboratory.min.js` can build data from `war_lab_unified.csv` (fallback to JS helios data).

## Service worker
- Version v7 precaches unified FC CSV and War Lab CSV plus current minified scripts. Hard-refresh/unregister if changes don’t appear.

## Adding/updating data
- Edit the relevant unified CSV; the calculators load these directly (no inline defaults).
- If you add new buildings/levels (FC) or nodes (War Lab), keep the CSV schema consistent and ensure the page loads the updated file.

## Pending/notes
- War Academy has no 30-x rows in FC data (not present in sources).
- War Lab still supports existing JSON; CSV is now available for adapter use.
