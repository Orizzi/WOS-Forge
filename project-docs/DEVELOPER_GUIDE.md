# Developer Guide (Draft)

Setup
- `npm install`
- `npm start` (serves ./src on http://localhost:8080)

Lint
- CSS: `npm run lint`, auto-fix: `npm run lint:fix`

Structure
- Root `index.html` (must stay for GitHub Pages)
- App in `src/`: HTML pages, scripts, styles, assets
- Bundles in `src/Scripts/min/` (keep filenames/paths stable)
- Docs in `docs/`
- Data extractors in `scripts/`
- Draft shared modules in `src/Scripts/modules/`

Conventions
- Preserve WOS game vocabulary; do not rename domain terms unless confirmed typo.
- Use shared helpers (icons, number-format, csv, data-loader) instead of duplicating logic.
- Namespace under `window.WOS` while keeping legacy globals bridged during migration.
- Keep relative paths intact (`../src/` vs `Scripts/` as currently referenced) until coordinated update.

Build/Deploy
- After logic changes, rebuild minified bundles into `src/Scripts/min/` with same names.
- Verify pages load via file-relative paths consistent with GH Pages.

Testing (manual)
- Load charms/chiefGear/fireCrystals pages: verify calculations, CSV overrides, translations, theme toggle, profiles autosave, table sorting, fc status badge.