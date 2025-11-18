# I18N System (Draft)

Overview
- translations.js defines language map and applies translations to elements with `data-i18n`.
- Language selection via dropdown; language stored (key likely `wos-language`).

Current Behavior
- Pages load translations.min.js; some pages also import module version asynchronously.
- Mojibake observed in language options (encoding issue to correct later).

Goals
- Single-pass DOM binding to avoid repeated scans; optional observer for dynamic nodes.
- Preserve all existing keys and game-specific wording.
- Keep language persistence; expose translator function `t(key)` for UI modules.
- Avoid duplicate imports; streamline script loading.

Future
- Namespace under `WOS.ui.i18n` with helpers to apply translations and manage language; keep legacy global for compatibility.