# Unified Calculator Refactor Plan (Step 1)

Goal: Keep the existing UI unchanged while moving all calculators to a single adapter-driven core with CSV-only data sources per page.

## Target Architecture
- `calculation-core.js` (dispatcher): one entry point (`runActive`) wired to form changes, profiles, translations, and page-ready events.
- Adapters (one per page): `{ id, isActive, loadData, validate, compute, render }`.
- Shared helpers: CSV loader, level validation, number formatting, gap/deficit calculation, and a reusable renderer for totals/tables/pills.
- Data: One canonical CSV per page (no hardcoded fallbacks).

## Data Schemas (proposed)
- Fire Crystals: `building,level,fc,rfc,timeSeconds,meat,wood,coal,iron[,power]` (replace `fire_crystals_costs.csv`, `resource_costs.csv`, `fire_crystals_steps.json`; optional merge of `building_power.csv`).
- Charms: `level,guides,designs,secrets,power,svsPoints` (CSV authoritative; remove inline defaults).
- Chief Gear: `level,hardenedAlloy,polishingSolution,designPlans,lunarAmber,power,svsPoints` (CSV authoritative; remove inline defaults).
- War Lab (optional CSV): define node/level/stats schema if we decide to move off JSON.

## Migration Steps
1) Fire Crystals (template):
   - Build unified FC CSV from existing sources. ✅
   - Use unified FC CSV in calculator (page now loads min build); remove legacy overrides. ✅
2) Charms:
   - Point calculator to CSV-only; convert to adapter + shared render/validation. ✅ (CSV unified; UI still native)
3) Chief Gear:
   - Same as Charms with its CSV schema; remove inline defaults. ✅ (CSV unified; UI still native)
4) War Lab:
   - Either wrap existing JSON in an adapter or move to CSV if we define a schema. (CSV placeholder added: `war_lab_unified.csv`; needs population from helios data)
5) Cleanup:
   - Remove obsolete loaders/fallbacks, update precache/service worker, regenerate min builds. ✅ (FC/CG loaders removed; SW v6)
6) Docs:
   - Final README explaining adapter API, data schemas, how to add a new page, and how profiles/translations hook into the core.

## What’s next (needs approval)
- Build the unified Fire Crystals CSV and adapter, then roll the same pattern to Charms/Chief Gear. ✅ FC/Charms data now have unified CSVs; FC calculator reads from unified CSV.
- Decide whether to merge `building_power.csv` into the FC CSV. ✅ merged into `fire_crystals_unified.csv`.
- Decide whether War Lab should move to CSV or stay JSON.
