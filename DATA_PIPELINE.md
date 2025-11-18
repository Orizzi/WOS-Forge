# Data Pipeline (Draft)

Source
- Authoritative workbook: `src/assets/resource_data.xlsx`

Extraction (Node scripts in `scripts/`)
- `npm run import:all` -> runs `extract-building-resources`, `extract-charms-costs`, `extract-chief-gear-costs`, `extract-fc-csv`, `extract-building-power`
- Individual: `npm run import:charms`, `import:chief-gear`, `import:fc`, `import:power`, `export:sheets`, `analyze:sheets`
- Outputs: CSVs in `src/assets/` (charms_costs.csv, chief_gear_costs.csv, fire_crystals_costs.csv, resource_costs.csv); JS/JSON for fire crystals.

Runtime (browser)
- Loaders fetch CSV/JS via fetch (no-cache).
- Calculators normalize data; UI renders totals.
- Fire Crystals: prefers inline `FireCrystalFlatCosts` JS; CSV fallback (`fire_crystals_costs.csv`).

Caveats
- Keep file paths stable for GH Pages.
- Ensure CSV headers match expected columns before overriding defaults.- Fire Crystals per-step data: 
ode scripts/extract-fire-crystals-steps.js -> src/assets/fire_crystals_steps.json (using building sheets for FC rows and time in seconds)
