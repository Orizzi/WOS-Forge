# New Calculator Page Checklist

Use this checklist when adding a new calculator page to ensure consistency and maintainability. For details, see [CALCULATOR_PAGE_TEMPLATE.md](docs/CALCULATOR_PAGE_TEMPLATE.md).

## 1. Data Source
- [ ] Export source data to embedded JS (`window.YourCalculatorData`) using scripts (prefer JS, fallback JSON/CSV if needed).
- [ ] Emit a readiness event (e.g., `your-calc-data-ready`) after loading.

## 2. Profiles Integration
- [ ] Capture/apply only this page’s fields in the unified profiles system.
- [ ] Use `-start`/`-finish` for level selects; map legacy keys if needed.
- [ ] Auto-save inventory/resource inputs on change.

## 3. Validation
- [ ] Enforce `start <= finish` for level selection.
- [ ] Snap finish to start if user selects an invalid range.

## 4. UI Consistency
- [ ] Use the shared banner (`logo-link` + `site-logo`).
- [ ] Inventory inputs in a single row (flex, scrollable if needed).
- [ ] Results breakdown as a sortable table with compact K/M/B formatting.
- [ ] Responsive column widths; ensure time/resource columns are readable.

## 5. Formatting & Sorting
- [ ] Format large numbers with K/M/B suffixes in breakdown.
- [ ] Use a sorter that understands compact formats.

## 6. Migration & Compatibility
- [ ] Support legacy profile keys if applicable.
- [ ] Keep CSV/JSON exports for debugging.

## 7. Testing
- [ ] Verify calculations match source data for all ranges.
- [ ] Confirm profile switching only updates this page’s fields.
- [ ] Check UI on desktop and mobile for layout issues.

---

For full details and code examples, see [CALCULATOR_PAGE_TEMPLATE.md](docs/CALCULATOR_PAGE_TEMPLATE.md).
