# PowerShell script to fix all pets page layout issues
Write-Host "Fixing pets page layout issues..." -ForegroundColor Cyan

$cssFile = "d:\CODE\Projet\Wos calculator\src\style\style.css"
$content = Get-Content $cssFile -Raw

# Add CSS rules at the end for pets page fixes
$newCss = @"


/* ========== PETS PAGE SPECIFIC FIXES ========== */

/* Hide mobile bottom-nav on desktop */
.bottom-nav {
    display: flex;
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    background: var(--panel);
    border-top: 1px solid var(--border);
    z-index: 1000;
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
}

.bottom-nav__list {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    width: 100%;
}

.bottom-nav__item {
    flex: 0 0 auto;
}

.bottom-nav__item a {
    display: block;
    padding: 0.75rem 1rem;
    text-decoration: none;
    color: var(--text);
    white-space: nowrap;
    border-bottom: 2px solid transparent;
}

.bottom-nav__item a.is-active,
.bottom-nav__item a[aria-current="page"] {
    color: var(--accent);
    border-bottom-color: var(--accent);
}

/* Hide bottom-nav on desktop (>=64em / 1024px) */
@media (min-width: 64em) {
    .bottom-nav {
        display: none;
    }
}

/* Pets page: Full viewport height background */
.pets-page {
    min-height: 100vh;
    background-attachment: fixed;
    background-size: cover;
}

.pets-page body {
    min-height: 100vh;
}

/* Pets page: Inventory on single line on desktop */
.pets-page .inventory-profiles-row {
    display: grid;
    grid-template-columns: 1.8fr 1fr;
    gap: 1rem;
    align-items: start;
    margin-bottom: 1.5rem;
}

.pets-page .inventory-section .inventory-inputs {
    display: flex;
    flex-wrap: wrap;
    gap: 0.75rem;
    align-items: center;
}

.pets-page .inventory-section .inventory-item {
    flex: 1 1 auto;
    min-width: 140px;
    max-width: 180px;
}

.pets-page .inventory-section .inventory-item label {
    font-size: 0.85rem;
    margin-bottom: 0.25rem;
    display: block;
}

.pets-page .inventory-section .inventory-item input {
    width: 100%;
}

/* Results in single column */
.pets-page .totals-summary.vertical {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.pets-page .totals-summary.vertical .total-item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem 1rem;
    background: var(--muted);
    border-radius: 0.5rem;
    border: 1px solid var(--border);
}

.pets-page .totals-summary.vertical .total-label {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    font-weight: 500;
}

.pets-page .totals-summary.vertical .total-value {
    font-weight: 700;
    font-size: 1.1rem;
    color: var(--accent);
}

/* Pet slot FROM/TO labels and selects - prevent overflow */
.pets-page .pet-slot .level-controls {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
}

.pets-page .pet-slot .select-group {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.pets-page .pet-slot .select-group label {
    font-size: 0.75rem;
    font-weight: 600;
    text-transform: uppercase;
    color: var(--muted-text);
    white-space: nowrap;
}

.pets-page .pet-slot .select-group select {
    width: 100%;
    font-size: 0.9rem;
}

/* Pets grid optimization - maximize space for 5 columns */
.pets-page .pets-grid {
    display: grid;
    grid-template-columns: repeat(5, 1fr) !important;
    gap: 0.75rem;
    width: 100%;
}

.pets-page .pet-slot {
    background: var(--panel);
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
}

.pets-page .pet-header {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
}

.pets-page .pet-icon {
    width: 2rem;
    height: 2rem;
    object-fit: contain;
}

.pets-page .pet-header h4 {
    font-size: 0.9rem;
    margin: 0;
    line-height: 1.2;
}

/* Resource icons in results */
.pets-page .res-icon {
    width: 1.5rem;
    height: 1.5rem;
    object-fit: contain;
}

/* Mobile responsive */
@media (max-width: 48em) {
    .pets-page .inventory-profiles-row {
        grid-template-columns: 1fr;
        gap: 1rem;
    }
    
    .pets-page .inventory-section .inventory-inputs {
        flex-direction: column;
    }
    
    .pets-page .inventory-section .inventory-item {
        max-width: 100%;
    }
    
    .pets-page .pets-grid {
        grid-template-columns: 1fr !important;
    }
    
    /* Show bottom-nav on mobile */
    .bottom-nav {
        display: flex;
    }
}

/* Tablet responsive */
@media (min-width: 48.0625em) and (max-width: 64em) {
    .pets-page .pets-grid {
        grid-template-columns: repeat(3, 1fr) !important;
    }
}

"@

# Append new CSS
Add-Content -Path $cssFile -Value $newCss

Write-Host "CSS fixes applied successfully!" -ForegroundColor Green
Write-Host "Regenerating minified CSS..." -ForegroundColor Cyan

# Regenerate minified CSS
Push-Location "d:\CODE\Projet\Wos calculator\src\style"
npx csso style.css -o style.min.css
Pop-Location

Write-Host "Minified CSS regenerated!" -ForegroundColor Green
