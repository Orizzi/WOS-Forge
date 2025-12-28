# Experts Page - Outstanding Issues

## Layout Problems
- [x] Expert cards too large - reduced sizes
- [x] Avatar images were hidden - removed onerror handlers
- [x] CSV note text removed
- [x] FROM validation - now allows FROM ≤ TO
- [ ] **Expert grid still not displaying properly on desktop** - cards stacking vertically instead of 3-column grid
  - `.experts-grid` set to `grid-template-columns: repeat(3, minmax(0, 1fr))` but not working
  - Main layout wrapper seems to be collapsing expert grid section
  - Results panel not sticky on right as intended
  - **Reference**: Fire Crystals page has working 2-column layout (buildings left, results right)

## Next Steps
1. Debug why 3-column expert grid is not rendering (inspect computed styles)
2. Check if `.main-layout-wrapper` grid is properly inheriting width/sizing
3. May need to restructure HTML to match fire-crystals.html pattern exactly
4. Consider using separate sections like fire-crystals does (buildings-section vs results-section)
5. Review responsive breakpoints - may be forcing single column on desktop unintentionally

## Current Structure Issues
- Expert grid gap reduced to 0.5rem (working)
- Cards are compact (working)
- But grid layout itself not rendering as 3 columns
- Results section styling added but layout collapsed

## Testing Checklist
- [ ] Verify grid displays 3 columns on desktop (≥1024px)
- [ ] Verify results sticky on right side
- [ ] Verify responsive collapse to single column on mobile
- [ ] Verify material cost display is prominent
- [ ] Test with data (change FROM/TO levels)
