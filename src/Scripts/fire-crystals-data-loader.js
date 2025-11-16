// Fire Crystal Costs Data Loader
// This module loads costs from CSV extracted from Excel

(function() {
    'use strict';

    let fireCrystalCostsCache = null;
    // Public status for UI badges
    window.FCDataStatus = { loaded: false, rows: 0, source: 'loading' };

    // Attempt in-memory JS only (embedded artifact is authoritative)
    async function loadFireCrystalCosts() {
        try {
            if (Array.isArray(window.FireCrystalFlatCosts) && window.FireCrystalFlatCosts.length > 0) {
                console.info(`[FireCrystals] Using inline JS costs: ${window.FireCrystalFlatCosts.length} rows`);
                window.FCDataStatus = { loaded: true, rows: window.FireCrystalFlatCosts.length, source: 'js' };
                try { window.dispatchEvent(new CustomEvent('fc-data-ready', { detail: { rows: window.FireCrystalFlatCosts.length } })); } catch(_) {}
                return window.FireCrystalFlatCosts;
            }
        } catch (error) {
            console.error('Error reading inline fire crystal costs:', error);
        }
        console.error('[FireCrystals] Inline JS costs not found.');
        window.FCDataStatus = { loaded: false, rows: 0, source: 'missing' };
        try { window.dispatchEvent(new CustomEvent('fc-data-ready', { detail: { rows: 0, error: true } })); } catch(_) {}
        return null;
    }

    /**
     * Get costs for a specific building between two levels using flat CSV data
     */
    window.calculateFireCrystalCosts = async function(buildingName, fromLevel, toLevel, levelsArray) {
        // Load data if not cached
        if (!fireCrystalCostsCache) {
            fireCrystalCostsCache = await loadFireCrystalCosts();
            if (!fireCrystalCostsCache) {
                console.error('Failed to load fire crystal costs');
                return null;
            }
        }
        
        const fromIndex = levelsArray.indexOf(fromLevel);
        const toIndex = levelsArray.indexOf(toLevel);
        
        if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
            return null;
        }
        
        // Get relevant levels to upgrade (from fromLevel to toLevel, inclusive of both)
        const levelsToUpgrade = levelsArray.slice(fromIndex, toIndex + 1);
        
        // Sum up costs for these levels
        let totalFC = 0;
        let totalRFC = 0;
        
        levelsToUpgrade.forEach(level => {
            const costRow = fireCrystalCostsCache.find(row => 
                row.building === buildingName && row.level === level
            );
            
            if (costRow) {
                totalFC += costRow.fc;
                totalRFC += costRow.rfc;
            }
        });
        
        return {
            normalFC: totalFC,
            refineFC: totalRFC
        };
    };
    
})();
