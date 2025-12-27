# Pet Images

Place one clear PNG or SVG image for each pet in this folder.

## Naming Convention
- Use lowercase, hyphen-separated names matching pet IDs
- Recommended size: 64x64px or 128x128px PNG/SVG
- Images display at `clamp(2rem, 1.5rem + 1vw, 2.5rem)` responsive size

## Required Images (15 pets)
- **cave-hyena.png** - Cave Hyena
- **arctic-wolf.png** - Arctic Wolf  
- **musk-ox.png** - Musk Ox
- **giant-tapir.png** - Giant Tapir
- **titan-roc.png** - Titan Roc
- **giant-elk.png** - Giant Elk
- **snow-leopard.png** - Snow Leopard
- **cave-lion.png** - Cave Lion
- **snow-ape.png** - Snow Ape
- **iron-rhino.png** - Iron Rhino
- **sabertooth-tiger.png** - Sabertooth Tiger
- **mammoth.png** - Mammoth
- **frost-gorilla.png** - Frost Gorilla
- **frostscale-chameleon.png** - Frostscale Chameleon
- **abyssal-shelldragon.png** - Abyssal Shelldragon

## Implementation Notes
- Icons appear next to pet names in `.pet-header` with class `.pet-icon`
- Missing images gracefully degrade with `onerror="this.style.display='none'"`
- All images have alt text for accessibility

## License
- Use official Whiteout Survival game art
- Wiki images with proper attribution
- Custom icons (with permission)

