// Fire Crystal Costs Data Loader
// This module loads costs from CSV extracted from Excel

(function() {
    'use strict';

    let fireCrystalCostsCache = null;
    // Public status for UI badges
    window.FCDataStatus = { loaded: false, rows: 0, source: 'loading' };

    // Attempt in-memory JS first, then JSON, then CSV
    async function loadFireCrystalCosts() {
        // Direct JS data (preferred if included)
        try {
            if (Array.isArray(window.FireCrystalFlatCosts) && window.FireCrystalFlatCosts.length > 0) {
                console.info(`[FireCrystals] Using inline JS costs: ${window.FireCrystalFlatCosts.length} rows`);
                window.FCDataStatus = { loaded: true, rows: window.FireCrystalFlatCosts.length, source: 'js' };
                try { window.dispatchEvent(new CustomEvent('fc-csv-ready', { detail: { rows: window.FireCrystalFlatCosts.length } })); } catch(_) {}
                return window.FireCrystalFlatCosts;
            }
        } catch (_) {}

        // Try JSON
        try {
            const rj = await fetch('assets/fire_crystals_costs.json', { cache: 'no-cache' });
            if (rj.ok) {
                const flat = await rj.json();
                if (Array.isArray(flat) && flat.length > 0) {
                    console.info(`[FireCrystals] Loaded FC JSON rows: ${flat.length}`);
                    window.FCDataStatus = { loaded: true, rows: flat.length, source: 'json' };
                    try { window.dispatchEvent(new CustomEvent('fc-csv-ready', { detail: { rows: flat.length } })); } catch(_) {}
                    return flat;
                }
            }
        } catch (_) {}

        // Fallback to CSV
        try {
            const response = await fetch('assets/fire_crystals_costs.csv', { cache: 'no-cache' });
            const csvText = await response.text();
            const lines = csvText.trim().split('\n');
            const flatData = [];
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                flatData.push({
                    building: values[0],
                    level: values[1],
                    fc: parseInt(values[2]) || 0,
                    rfc: parseInt(values[3]) || 0
                });
            }
            console.info(`[FireCrystals] Loaded FC CSV rows: ${flatData.length}`);
            window.FCDataStatus = { loaded: true, rows: flatData.length, source: 'csv' };
            try { window.dispatchEvent(new CustomEvent('fc-csv-ready', { detail: { rows: flatData.length } })); } catch(_) {}
            return flatData;
        } catch (error) {
            console.error('Error loading fire crystal costs:', error);
            window.FCDataStatus = { loaded: false, rows: 0, source: 'fallback' };
            try { window.dispatchEvent(new CustomEvent('fc-csv-ready', { detail: { rows: 0, error: true } })); } catch(_) {}
            return null;
        }
    }

    /**
     * Get costs for a specific building between two levels using flat CSV data
     */
    window.calculateFireCrystalCostsFromCSV = async function(buildingName, fromLevel, toLevel, levelsArray) {
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
        
        // Get relevant levels to upgrade (from fromLevel to toLevel, exclusive of fromLevel, inclusive of toLevel)
        const levelsToUpgrade = levelsArray.slice(fromIndex + 1, toIndex + 1);
        
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
