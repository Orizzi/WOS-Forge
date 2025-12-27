# CSS Breakpoints Audit

This audit catalogs media queries in `src/style/style.css` and `src/style/style.min.css`, highlights overlaps or inconsistencies, and proposes minimal, safe improvements.

## Current Breakpoint Map (em → px at 16px root)

- 80em (1280px): narrow shim with `min-width: 75.0625em` → `max-width: 80em` to keep nav visible near 1200–1280px.
- 75em (1200px): large desktop threshold; nav layout reflows; results grid collapses to 2 cols.
- 68.75em (1100px): inventory compact grid expands to 4 cols.
- 64em (1024px): tablet threshold for touch-friendly layout and bottom nav; paired with `min-width: 64.0625em` for desktop.
- 63.9375em (~1023px): mobile/tablet edge used (War Lab) to avoid overlap with the 64em+ pair.
- 56.25em (900px): mobile reflow for nav and stacked content.
- 48em (768px): small tablet / large phone adjustments.
- 43.75em (700px): results grid collapses to 1 col.
- 37.5em (600px): table `min-width` safeguard.
- 30em (480px): small phone tweaks.

Notes:
- The 64em breakpoint is intentionally paired with `min-width: 64.0625em` (desktop) and `max-width: 63.9375em` (mobile) in some sections to eliminate overlap and flicker at the 1024–1025px boundary.
- The 75.0625–80em shim prevents the nav from disappearing in a narrow band above 1200px without forcing a full column layout too early.

## Overlaps and Consistency Findings

- Pair usage is consistent around 64em and in War Lab (`63.9375em` and `64.0625em`). No direct conflicts detected.
- The `75.0625em–80em` shim duplicates some visibility and flex settings already present at other breakpoints. It’s functionally harmless, but atypical in the palette.
- The layout switches between `grid` and `flex` for `.main-layout-wrapper` depending on breakpoint; this is intentional, but makes merging rules more delicate.

## Recommendations (Minimal & Safe)

1. Keep the offset-paired thresholds around 64em. They prevent 1px boundary overlaps.
2. Document the breakpoint palette centrally (this audit file) and reference it in `docs/RESPONSIVE_LAYOUT_PATTERN.md` to guide future edits.
3. Consider consolidating the `75.0625em–80em` nav shim once the underlying nav visibility issue is fully addressed. For now, leave it in place to avoid regressions.
4. Prefer grouping related rules at common breakpoints (e.g., consolidate multiple `@media (max-width: 64em)` blocks) only when you’re actively editing those sections to reduce churn.

## Optional Normalization (Deferred)

- If desired later, rename `@media (max-width: 80em) and (min-width: 75.0625em)` to use a symmetric offset (`@media (min-width: 75.0625em) and (max-width: 79.9375em)`) for explicit non-overlap. This is cosmetic and not urgent.
- Introduce a design-time SCSS layer (future) to centralize breakpoint variables while preserving generated CSS in `src/style/style.css`. Not applicable to the current plain CSS setup.

## Quick Checks Completed

- Verified breakpoint presence and intent in `style.css` and `style.min.css`.
- Confirmed no contradictory media blocks for nav, layout wrappers, or War Lab views.
- Noted the single-purpose 43.75em collapse for results grid.

## Next Steps (if you want me to proceed)

- Apply small consolidation where trivial (merge adjacent 64em blocks) and add inline comments in `style.css` explaining the 75.0625–80em shim, if allowed.
- Run `npm run lint` to ensure formatting stays consistent after edits.
- Smoke test pages at widths: 480, 700, 768, 900, 1024/1025, 1100, 1200/1201, 1280.
