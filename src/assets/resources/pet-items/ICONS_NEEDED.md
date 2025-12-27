# Pet Resource Icons Needed

## Required Icons (4 resource types)

This directory should contain 4 pet resource item icons (PNG format, transparent background recommended):

1. `food.png` - Pet Food
2. `manual.png` - Pet Manual
3. `potion.png` - Pet Potion
4. `serum.png` - Pet Serum

## Specifications
- Format: PNG with transparency
- Size: 64x64px or higher (will be scaled to fit)
- Style: Match existing WOS game resource icons
- Naming: Use lowercase (as shown above)

## SVS Points
SVS Points icon is located in `/assets/resources/base/svs-points.png` and is shared across calculators.

## Temporary Workaround
Until icons are added, the HTML and JavaScript use `onerror="this.style.display='none'"` to gracefully hide missing images.
