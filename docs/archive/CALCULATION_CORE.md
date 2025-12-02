# Calculation Core (WOSCalcCore)

A tiny dispatcher that runs the right calculator(s) on any page and auto-recalculates whenever inventories change. Loaded via `Scripts/calculation-core.js` (and `Scripts/min/calculation-core.min.js` in production).

## What it does
- Registers page calculators as adapters (charms, chief gear, fire crystals, war lab).
- Detects the active page and calls the matching `calculateAll`.
- Listens to all `input[id^="inventory-"]` changes and triggers a recalculation immediately.
- Also listens to most form inputs (`input`, `select`, `textarea`) except profile/language controls to keep results in sync with user edits across pages.
- Provides a single entry point for other modules (profiles, translations, theme) to force a recalculation.

## API
- `WOSCalcCore.registerAdapter({ id, isActive, run })`
  - `id`: unique string.
  - `isActive()`: return true if the adapter should run on the current page.
  - `run()`: performs the page’s calculation.
- `WOSCalcCore.run(id)`: run a specific adapter by id.
- `WOSCalcCore.runActive()`: run adapters whose `isActive` returns true (fallback: attempts all).
- `WOSCalcCore.runAll()`: run every registered adapter.

## Built-in adapters
- `charms` → `CalculatorModule.calculateAll()` if a charms selector exists.
- `chiefGear` → `ChiefGearCalculator.calculateAll()` if `#helmet-start` exists.
- `fireCrystals` → `FireCrystalsCalculator.calculateAll()` if `#furnace-start` exists.
- `warLab` → `WarLabCalculator.calculateAll()` if `.war-lab-page` exists.

## Inventory auto-recalc
- All elements matching `input[id^="inventory-"]` dispatch `input`/`change` handlers that call `runActive()` (throttled via `requestAnimationFrame`). No heavy debounce is applied to keep live feedback immediate.
- Other form controls also trigger `runActive()` (excludes profile/language controls and button types) so per-page calculators update as the user edits values.

## How to add a new calculator page
1. Include `Scripts/calculation-core.js` (or the minified build) on the page.
2. Register an adapter once your calculator is loaded:
   ```js
   WOSCalcCore.registerAdapter({
     id: 'myPage',
     isActive: () => !!document.querySelector('.my-page'),
     run: () => MyPageCalculator.calculateAll(),
   });
   ```
3. Ensure your page’s inventory inputs follow the `inventory-*` id pattern if you want auto-recalc on inventory changes, or manually call `WOSCalcCore.runActive()` in your own input listeners.

## Usage from other modules
- Profiles: after applying saved values, call `WOSCalcCore.runActive()` instead of page-specific calculators.
- Translations/theme toggles: call `WOSCalcCore.runActive()` to refresh displayed numbers after text/UI updates.
