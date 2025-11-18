# Module Graph (Draft)

Top-level runtime (per page)
- icon-helper.min.js (IconHelper)
- theme.min.js (theme toggle)
- table-sort.min.js (sorting)
- calculator-specific bundle (charms / chief-gear / fire-crystals)
- profiles.min.js (autosave/profiles)
- translations.min.js (I18n bindings)
- fire-crystals data loader + status UI (fireCrystals page)
- fc-status-ui.js listens to fc-data-ready events

Data flow
Excel -> scripts/extract-* -> CSV/JS in src/assets -> loaders (browser fetch) -> calculators -> UI render -> DOM

Events
- fc-data-ready (detail: rows, source, error) dispatched when fire crystal data loads.

Draft namespaces (future)
- WOS.helpers (icons, number-format, csv)
- WOS.data (data-loader)
- WOS.calcs (charms, chiefGear, fireCrystals)
- WOS.ui (charms-ui, chief-gear-ui, fire-crystals-ui, i18n-ui, theme-ui)
- Legacy globals stay bridged for compatibility during migration.