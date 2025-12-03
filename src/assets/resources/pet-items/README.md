# Pet Resource Icons

Place icons for all pet upgrade resources in this folder.

## Naming Convention
- Use lowercase, hyphen-separated names matching resource keys
- Recommended size: 32x32px or 48x48px PNG/SVG
- Icons display at `clamp(1.125rem, 1rem + 0.5vw, 1.375rem)` in results

## Required Images (5 resources)
- **food.png** - Pet Food (base resource)
- **manual.png** - Training Manual (base resource)
- **potion.png** - Enhancement Potion (base resource)
- **serum.png** - Evolution Serum (base resource)
- **svs-points.png** - SVS Points (should be in `assets/resources/base/`)

## Implementation Notes
- Icons appear in results grid with class `.res-icon`
- Used by `labelWithIcon()` function in pets-calculator.js
- Missing images gracefully degrade with `onerror="this.style.display='none'"`
- SVS Points icon should ideally be moved to `assets/resources/base/` for consistency

## CSS Styling
```css
.res-icon {
    width: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
    height: clamp(1.125rem, 1rem + 0.5vw, 1.375rem);
    vertical-align: middle;
    margin-right: 0.375rem;
}
```

## License
- Use official Whiteout Survival game art
- Wiki images with proper attribution  
- Custom icons (with permission)

