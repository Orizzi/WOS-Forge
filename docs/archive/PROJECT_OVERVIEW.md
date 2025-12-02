# Project Overview (Draft)

Whiteout Survival (WOS) Calculator provides web-based calculators for charms, chief gear, and fire crystals. Data is sourced from an authoritative Excel workbook and converted to CSV/JS artifacts consumed by static pages hosted via GitHub Pages (index.html stays at repo root).

## Scope
- Pages: root `index.html` (landing), `src/charms.html`, `src/chiefGear.html`, `src/fireCrystals.html`, plus coming-soon sections (War Academy, Pets, Experts).
- Data: `src/assets/resource_data.xlsx` -> CSV/JS (charms_costs, chief_gear_costs, fire_crystals_costs, resource_costs).
- Runtime: Browser loads minified bundles from `src/Scripts/min/`, computes totals, updates DOM, applies translations and theme.

## Key Systems
- Calculators: charms, chief gear, fire crystals (per-building costs).
- Loaders: fetch CSV/JS datasets; fire-crystals supports inline JS plus CSV fallback.
- UI: profile autosave, table sorting, status badges, theme toggle, translations.
- Assets: resources/buildings images, CSV/JSON/JS datasets, service worker + manifest.

## Constraints
- `index.html` must remain at repo root for GitHub Pages.
- Game vocabulary must be preserved (do not “correct” domain terms).
- Paths referenced by HTML (scripts/assets) must stay stable.
