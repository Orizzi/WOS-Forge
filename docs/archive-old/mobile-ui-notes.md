# Mobile UI Changes (Nov 2025)

## Consent Modal
- Profiles.js shows consent dialog on Charms & Chief Gear only.
- CSS `.modal-body` gains line-height and paragraph spacing so text wraps cleanly on phone/desktop.

## Warning Banner (Charms & Chief Gear)
- Sticky `.calc-warning` banner with low opacity warns calculations are uncertain.
- Only injected on Charms and Chief Gear pages.

## Button Redesign
- Profile/save/delete/Reset All buttons now use gradient backgrounds & consistent icon-friendly padding.
- In mobile media query, these buttons center text and span panel width for readability.

## Back-to-Top + Nav Centering
- Added back-to-top link and `#top` anchor across all main pages.
- Bottom nav scrolls active tab into view on load (mobile only).

## Results Tables (mobile)
- Wrappers overflow-x auto; first column sticky; totals stack vertically.
- Applied consistently so large tables remain usable.

## Favicon
- `src/assets/app-icon.png` referenced via `<link rel="icon">` on every page.

## Implementation Notes
1. Edit `src/style/style.css`, re-run minifier command in repo root to update `style.min.css`.
2. For new pages, include back-to-top anchor, warning banner where needed, and nav-centering script.
3. Run `git status` to confirm cleanliness before commit/push.

