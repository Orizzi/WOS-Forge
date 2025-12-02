# UI Flow (Draft)

Pages
- `index.html` (root): landing/nav
- `src/charms.html`: charms calculator UI
- `src/chiefGear.html`: chief gear calculator UI
- `src/fireCrystals.html`: fire crystal calculator UI (status badge)
- `src/coming-soon.html` etc.: placeholder pages using nav/translation/theme

Script load (typical)
- icon-helper.min.js -> theme.min.js -> table-sort.min.js -> calculator-specific bundle -> profiles.min.js -> translations.min.js -> page-specific helpers (fc-status-ui.js on fireCrystals)

Runtime flow
- DOMContentLoaded: calculator scripts bind inputs/selects and render totals
- Translations apply to elements with data-i18n; language selector switches language
- Profiles autosave on change
- Fire Crystals: inline data + loader -> fc-data-ready event -> status badge update
- Theme toggle applies data-theme and persists

Events
- `fc-data-ready` (detail: rows/source/error) consumed by status badge