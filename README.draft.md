# WOS Calculator (Draft README)

Whiteout Survival calculators for charms, chief gear, and fire crystals. This draft cleans encoding and outlines the intended project structure without changing any file paths.

## Project Layout (current)
- `index.html` (root for GitHub Pages)
- `src/` HTML pages, scripts, styles, assets (csv/png/xlsx)
- `src/Scripts/min/` shipped bundles used by pages
- `scripts/` data extractors and analyzers (Excel -> CSV)
- `docs/` documentation

## Proposed Documentation Structure
- **Getting Started**: overview, prerequisites, how to run locally (`npm start`, `npm run import:*`).
- **Data Pipeline**: how `resource_data.xlsx` is converted to CSV (scripts in `scripts/`).
- **Calculators**: charms, chief gear, fire crystals (what data they use; how UI reads data).
- **Internationalization**: how translations are structured and applied.
- **Build/Deploy**: keeping `index.html` at root; static hosting expectations.
- **Contributing**: coding style, linting (`stylelint`), where to place new assets/scripts.

## Notes
- Existing files remain unchanged; this README is a draft for review.
- No imports or script tags are updated; new helper modules live under `src/Scripts/modules/` for future integration.