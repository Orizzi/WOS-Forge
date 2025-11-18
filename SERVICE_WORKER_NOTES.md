# Service Worker Notes (Draft)

Files
- `src/service-worker.js`, `src/manifest.json`

Open Questions
- Scope relative to GitHub Pages (`index.html` at root, assets under src/`).
- Cache list should match actual deployed paths (minified bundles, CSS, assets, data files).
- Strategy: likely cache-first for static assets, network-first for data if needed.

Next Steps
- Audit current service worker for path correctness and cache versioning.
- Ensure manifest icons/paths align with hosting base URL.