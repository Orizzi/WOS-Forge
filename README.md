# WOS Calculator

Whiteout Survival calculators for charms, chief gear, and fire crystals. Data is sourced from `src/assets/resource_data.xlsx` and converted to CSV/JS assets for the UI.

## Project Layout
- `index.html` (GitHub Pages entry)
- `src/` HTML pages, scripts, styles, assets (csv/png/xlsx)
- `src/Scripts/min/` shipped bundles used by pages
- `src/Scripts/modules/` shared helpers + calculator modules (drafted for reuse)
- `scripts/` data extractors and analyzers (Excel -> CSV/JS)
- `docs/` documentation

## Getting Started
```bash
npm install
npm start   # serves ./src on http://localhost:8080
```

## Data Pipeline
The authoritative workbook is `src/assets/resource_data.xlsx`.
- Extract all data after workbook updates: `npm run import:all`
- Individual extractors: `npm run import:charms`, `npm run import:chief-gear`, `npm run import:fc`, `npm run import:power`
- Export all sheets to CSV: `npm run export:sheets`
- Analyze workbook structure: `npm run analyze:sheets`

## Calculators
- **Charms**: defaults + optional CSV overrides from `src/assets/charms_costs.csv`.
- **Chief Gear**: defaults + optional CSV overrides from `src/assets/chief_gear_costs.csv`.
- **Fire Crystals**: prefers inline `FireCrystalFlatCosts` JS, falls back to `src/assets/fire_crystals_costs.csv`.

## Internationalization
`src/Scripts/translations.js` provides UI strings. Pages use `data-i18n` attributes to bind translations.

## Build/Deploy
- Keep `index.html` in the repository root for GitHub Pages.
- Static hosting: scripts and assets are loaded directly from `src/` paths; ensure relative paths remain valid when deploying.

## Contributing
- CSS lint: `npm run lint` (stylelint). `npm run lint:fix` to auto-fix.
- Prefer shared helpers in `src/Scripts/modules/` for icons, numbers, CSV parsing, and data loading.
- Avoid duplicating icon maps/formatting logic; reuse helpers.
