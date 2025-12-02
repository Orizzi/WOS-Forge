# Theme System (Draft)

Overview
- theme.js toggles light/dark modes, likely via data-theme and localStorage persistence.
- Triggered by button in nav; affects global styles in `style.css`/`style.min.css`.

Goals
- Centralize theme helpers (apply, set, get) under `WOS.ui.theme` while keeping legacy global.
- Ensure accessible contrast; avoid layout shift.
- Persist choice (storage key `wos-theme`).

Behavioral Notes
- No changes to CSS paths; keep current class/attr usage.