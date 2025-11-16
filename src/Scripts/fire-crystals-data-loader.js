// Fire Crystal Costs Data Loader
// This module loads costs from CSV extracted from Excel

(function() {
    'use strict';

    let fireCrystalCostsCache = null;

    /**
     * Load and parse the CSV file
     */
    async function loadFireCrystalCosts() {
        try {
            // Fetch relative to the document location (src/fireCrystals.html)
            // Assets folder is at src/assets
            const response = await fetch('assets/fire_crystals_costs.csv', { cache: 'no-cache' });
            const csvText = await response.text();
            
            const lines = csvText.trim().split('\n');
            
            // Parse CSV into flat array
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
            return flatData;
        } catch (error) {
            console.error('Error loading fire crystal costs:', error);
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
