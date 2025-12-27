# Unified Profiles & Shared Inventory

This document explains how the unified profile system works today, how shared inventories stay in sync across pages, and how to onboard new pages/fields without rewriting `profiles.js`.

## What profiles store
- Storage key: `wos-unified-profiles` (last selected name: `wos-last-profile`).
- Payload per profile: `{ charms, chiefGear, fireCrystals, warLab, inventory, meta, dynamic }`.
  - `charms`, `chiefGear`, `fireCrystals`: level selectors on their respective pages.
  - `inventory`: all inventory inputs currently on the page (guides/designs/secrets, alloys/ambers, FC/refine crystals, speedups, base resources, etc.).
  - `warLab`: delegated to `WarLabProfile.captureState()` / `.applyState()`.
  - `meta`: extra singletons (e.g., `zinmanLevel`).
  - `dynamic`: anything tagged with `data-profile-key` that is not covered by the fixed sections.
- Shared base resources and cross-page consumables (Meat/Wood/Coal/Iron, Fire/Refine crystals, FC shards) are mirrored to `wos-shared-base-resources` so these inventories stay consistent between pages (Fire Crystals, War Academy, etc.). Aliased IDs like `inventory-fire-crystals`/`inventory-fc` are grouped so a change in one applies to all.

## Runtime flow
1. On load, storage consent is requested. If granted:
   - Event listeners are attached to all calculator selects, inventory inputs, and any `[data-profile-key]` fields. Changing a value triggers autosave.
   - Shared base resources are applied from `wos-shared-base-resources` with `input`/`change` events so existing calculators update immediately.
   - Profiles list is populated; last-used profile autoloads once calculators signal ready (charms/chief-gear/fire-crystals) or after a short fallback delay.
2. Capturing (`captureCurrent()`):
   - Detects active pages (charms/chief-gear/fire-crystals/war-lab).
   - Collects all known level selectors/inventory fields on the current page.
   - Captures War Lab state via `WarLabProfile.captureState()`.
   - Captures any `[data-profile-key]` fields into `dynamic` or into a named scope (see below).
3. Applying (`applyProfileObject()`):
   - Restores values with `input` + `change` events so page-level listeners recalc immediately.
   - Re-runs per-page validations and calculators after values are set.
   - Persists shared base resources after inventory is applied.

## Shared inventory rules
- Base resources (`inventory-meat`, `inventory-wood`, `inventory-coal`, `inventory-iron`) are synced across pages via `wos-shared-base-resources`.
- When these inputs change, they persist immediately and fire `input`/`change` so other calculators (and War Lab) update their local state.
- Applying a profile replays these events too, keeping real-time displays accurate.

## Adding new fields or pages
Prefer data attributes so no JS edits are needed:
- Add `data-profile-key="unique-key"` to any `input`, `select`, or `textarea` that must persist.
- Optional: add `data-profile-scope="inventory"` (or another section name) to store under that scope; otherwise it goes to `dynamic`.
- Ensure the element has the correct `id`/`name` for your calculator; autosave will fire on `input`/`change`.
- For brand new pages, include `Scripts/profiles.js` and keep existing profile controls (`#profiles-list`, save/rename/delete buttons). The page will be detected if:
  - You reuse existing selectors (charms/chief gear/fire crystals/war-lab), or
  - You rely entirely on `data-profile-key` fields (they will persist under `dynamic` or the provided scope).

## Considerations / edge cases
- If storage consent is denied, profile UI is disabled but calculators still work.
- War Lab inventory updates now dispatch events when profiles are applied, keeping its local `inventory` object in sync with base resource sharing.
- Older profiles remain compatible; new fields simply add extra keys to the stored payload.
