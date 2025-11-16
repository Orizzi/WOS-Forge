// CSV Data Loader for Fire Crystals Calculator
// Loads fire_crystals_costs.csv and converts to lookup structure

(function() {
    'use strict';

    let fireCrystalCostsCSV = null;

    // Load CSV data
    async function loadFireCrystalCosts() {
        try {
            const response = await fetch('assets/fire_crystals_costs.csv');
            const csvText = await response.text();
            
            const lines = csvText.trim().split('\n');
            const headers = lines[0].split(',');
            
            const data = {};
            
            for (let i = 1; i < lines.length; i++) {
                const values = lines[i].split(',');
                const building = values[0];
                const level = values[1];
                const fc = parseInt(values[2]) || 0;
                const rfc = parseInt(values[3]) || 0;
                
                if (!data[building]) {
                    data[building] = {};
                }
                
                data[building][level] = { fc, rfc };
            }
            
            return data;
        } catch (error) {
            console.error('Error loading fire crystal costs CSV:', error);
            return null;
        }
    }

    // Initialize and export
    window.FireCrystalCSVLoader = {
        load: loadFireCrystalCosts,
        getData: () => fireCrystalCostsCSV,
        setData: (data) => { fireCrystalCostsCSV = data; }
    };
})();
