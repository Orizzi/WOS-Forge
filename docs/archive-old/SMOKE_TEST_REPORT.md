# Smoke Test Report – WOS Calculator (2025-12-27)

Environment
- Server: http://127.0.0.1:8080
- Browser: VS Code Simple Browser

Pages Tested
- Charms: src/charms.html
- Chief Gear: src/chiefGear.html
- Fire Crystals: src/fireCrystals.html
- War Academy: src/war-academy.html
- Experts: src/experts.html

Checks & Observations
- Translations: Loaded without errors (strings present where expected).
- Theme toggle: Button visible; toggles class on html.
- Table sorting: Sort headers present; sorting works on results tables.
- Profiles: Controls render; save/rename/delete visible (full CRUD not deeply exercised).
- Inventory inputs: Numeric inputs restrict length; changes trigger recalculation.
- Error notifications: `error-handler.js` loaded across pages; CSV failures display alerts (verified by dispatch wiring).
- Fire Crystals: Uses unified CSV via `ensureUnifiedData()`; no reliance on removed defaults.
- War Academy: Node grid renders; some research icon 404s observed (non-blocking UI).

Network/Console Highlights
- CSV assets (charms/chief gear/fire crystals) returned 304/200 as expected.
- War Academy research icons: multiple 404s for `/research-icons/*.png` (missing assets) – recommend adding or silencing with fallback.

Action Items
- Add fallback or host assets for War Academy research icons to remove 404s.
- Optionally add a persistent notifications area to surface events beyond transient banners.
- Expand profile CRUD smoke tests and verify storage.

Conclusion
- Core calculators load and compute with CSV data, error notifications are wired, and UI interactions behave as expected. Minor asset 404s noted but do not block functionality.
