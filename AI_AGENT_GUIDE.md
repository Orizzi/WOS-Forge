# AI Agent Guide (Draft)

Mental Model
- Static GH Pages site; `index.html` at repo root. App pages live in `src/` with relative asset/script paths. Minified bundles in `src/Scripts/min/` are what pages load today.
- Data comes from `src/assets/resource_data.xlsx` converted to CSV/JS via scripts in `/scripts/`.
- Calculators: charms, chief gear, fire crystals. Loaders fetch CSV/JS; fire crystals prefer inline JS and emit `fc-data-ready`.
- Cross-cutting: translations.js (data-i18n), theme.js (data-theme), profiles.js (autosave/localStorage), table-sort.js (sortable tables), IconHelper (labels), DataLoader (fetch/cache).

Conventions & Vocabulary
- Preserve WOS game terms (building/resource names, level labels). Do not “correct” them unless clearly a typo unrelated to the game.
- Keep `index.html` at root. Preserve script/asset paths; when rebuilding, output minified bundles with the same filenames under `src/Scripts/min/`.
- Namespace future code under `window.WOS` (helpers, data, calcs, ui) while keeping legacy globals bridged.

Fragile Areas
- Duplicate script tags / mixed relative paths in HTML; avoid breaking includes.
- Stale minified bundles vs sources (only update when ready to rebuild all needed files).
- FC data events: `FCDataStatus` + `fc-data-ready` used by status badge.
- Language options show mojibake; fix encoding but keep keys.
- Relative asset paths (`../src/...` vs `Scripts/...`) are brittle—verify before changes.

System Locations
- Calculators and UI logic: `src/Scripts/*.js`; minified in `src/Scripts/min/`.
- Data loader: `src/Scripts/data-loader.js` (basic); fire-crystal loader in `src/Scripts/fire-crystals-data-loader.js`.
- Translations: `src/Scripts/translations.js` and min.
- Theme: `src/Scripts/theme.js`; Profiles: `src/Scripts/profiles.js`; Table sort: `src/Scripts/table-sort.js`.
- Assets: `src/assets/` (images, csv/js/json, workbook).
- Service worker/manifest: `src/service-worker.js`, `src/manifest.json`.
- Draft shared modules: `src/Scripts/modules/` (helpers, data, calculators, ui drafts).

Safe Refactor Checklist
- Introduce new modules under `WOS` but leave legacy globals delegating until HTML is updated.
- Keep file names/paths; when rebuilding minified bundles, overwrite in `src/Scripts/min/` with same names.
- Preserve `fc-data-ready` event semantics and `FCDataStatus` structure.
- Validate relative paths on each HTML page after script changes.

Minified Bundles Regeneration
- Build from updated sources into `src/Scripts/min/` using same filenames (e.g., calculator.min.js, chief-gear-calculator.min.js, fire-crystals-data-loader.min.js). Include source maps if desired, under same names.

Interactions
- Translations + UI: data-i18n attributes populated by translations module; language selector switches language and persists.
- Theme + UI: toggle in nav updates data-theme; theme stored in localStorage.
- Profiles + calculators: inputs trigger autosave via ProfilesModule.
- Data loaders + calculators: loaders fetch/normalize data; calculators compute totals; UI renders; status events notify badges.

Refactor Safety
- Change one page at a time; verify calculations, translations, themes, profiles, table sort, fc status.
- Keep GitHub Pages constraint (root index.html) and asset paths intact.
