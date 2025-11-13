// Chief Gear Calculator Module
// Handles cost calculations, batch controls, and UI updates for Chief Gear

(function() {
    'use strict';

    // Gear levels in order
    const GEAR_LEVELS = [
        "Green", "Green 1",
        "Blue", "Blue 1", "Blue 2", "Blue 3",
        "Purple", "Purple 1", "Purple 2", "Purple 3",
        "Purple T1", "Purple T1 1", "Purple T1 2", "Purple T1 3",
        "Gold", "Gold 1", "Gold 2", "Gold 3",
        "Gold T1", "Gold T1 1", "Gold T1 2", "Gold T1 3",
        "Gold T2", "Gold T2 1", "Gold T2 2", "Gold T2 3",
        "Red", "Red 1", "Red 2", "Red 3",
        "Red T1", "Red T1 1", "Red T1 2", "Red T1 3",
        "Red T2", "Red T2 1", "Red T2 2", "Red T2 3",
        "Red T3", "Red T3 1", "Red T3 2", "Red T3 3",
        "Red T4", "Red T4 1", "Red T4 2", "Red T4 3"
    ];

    // Chief Gear cost data (46 levels)
    const chiefGearCosts = {
        "Green": { hardenedAlloy: 0, polishingSolution: 0, designPlans: 0, lunarAmber: 0 },
        "Green 1": { hardenedAlloy: 10, polishingSolution: 10, designPlans: 1, lunarAmber: 0 },
        "Blue": { hardenedAlloy: 20, polishingSolution: 20, designPlans: 2, lunarAmber: 0 },
        "Blue 1": { hardenedAlloy: 30, polishingSolution: 30, designPlans: 3, lunarAmber: 0 },
        "Blue 2": { hardenedAlloy: 40, polishingSolution: 40, designPlans: 4, lunarAmber: 0 },
        "Blue 3": { hardenedAlloy: 50, polishingSolution: 50, designPlans: 5, lunarAmber: 0 },
        "Purple": { hardenedAlloy: 60, polishingSolution: 60, designPlans: 6, lunarAmber: 1 },
        "Purple 1": { hardenedAlloy: 70, polishingSolution: 70, designPlans: 7, lunarAmber: 1 },
        "Purple 2": { hardenedAlloy: 80, polishingSolution: 80, designPlans: 8, lunarAmber: 1 },
        "Purple 3": { hardenedAlloy: 90, polishingSolution: 90, designPlans: 9, lunarAmber: 1 },
        "Purple T1": { hardenedAlloy: 100, polishingSolution: 100, designPlans: 10, lunarAmber: 2 },
        "Purple T1 1": { hardenedAlloy: 110, polishingSolution: 110, designPlans: 11, lunarAmber: 2 },
        "Purple T1 2": { hardenedAlloy: 120, polishingSolution: 120, designPlans: 12, lunarAmber: 2 },
        "Purple T1 3": { hardenedAlloy: 130, polishingSolution: 130, designPlans: 13, lunarAmber: 2 },
        "Gold": { hardenedAlloy: 140, polishingSolution: 140, designPlans: 14, lunarAmber: 3 },
        "Gold 1": { hardenedAlloy: 150, polishingSolution: 150, designPlans: 15, lunarAmber: 3 },
        "Gold 2": { hardenedAlloy: 160, polishingSolution: 160, designPlans: 16, lunarAmber: 3 },
        "Gold 3": { hardenedAlloy: 170, polishingSolution: 170, designPlans: 17, lunarAmber: 3 },
        "Gold T1": { hardenedAlloy: 180, polishingSolution: 180, designPlans: 18, lunarAmber: 4 },
        "Gold T1 1": { hardenedAlloy: 190, polishingSolution: 190, designPlans: 19, lunarAmber: 4 },
        "Gold T1 2": { hardenedAlloy: 200, polishingSolution: 200, designPlans: 20, lunarAmber: 4 },
        "Gold T1 3": { hardenedAlloy: 210, polishingSolution: 210, designPlans: 21, lunarAmber: 4 },
        "Gold T2": { hardenedAlloy: 220, polishingSolution: 220, designPlans: 22, lunarAmber: 5 },
        "Gold T2 1": { hardenedAlloy: 230, polishingSolution: 230, designPlans: 23, lunarAmber: 5 },
        "Gold T2 2": { hardenedAlloy: 240, polishingSolution: 240, designPlans: 24, lunarAmber: 5 },
        "Gold T2 3": { hardenedAlloy: 250, polishingSolution: 250, designPlans: 25, lunarAmber: 5 },
        "Red": { hardenedAlloy: 260, polishingSolution: 260, designPlans: 26, lunarAmber: 6 },
        "Red 1": { hardenedAlloy: 270, polishingSolution: 270, designPlans: 27, lunarAmber: 6 },
        "Red 2": { hardenedAlloy: 280, polishingSolution: 280, designPlans: 28, lunarAmber: 6 },
        "Red 3": { hardenedAlloy: 290, polishingSolution: 290, designPlans: 29, lunarAmber: 6 },
        "Red T1": { hardenedAlloy: 300, polishingSolution: 300, designPlans: 30, lunarAmber: 7 },
        "Red T1 1": { hardenedAlloy: 310, polishingSolution: 310, designPlans: 31, lunarAmber: 7 },
        "Red T1 2": { hardenedAlloy: 320, polishingSolution: 320, designPlans: 32, lunarAmber: 7 },
        "Red T1 3": { hardenedAlloy: 330, polishingSolution: 330, designPlans: 33, lunarAmber: 7 },
        "Red T2": { hardenedAlloy: 340, polishingSolution: 340, designPlans: 34, lunarAmber: 8 },
        "Red T2 1": { hardenedAlloy: 350, polishingSolution: 350, designPlans: 35, lunarAmber: 8 },
        "Red T2 2": { hardenedAlloy: 360, polishingSolution: 360, designPlans: 36, lunarAmber: 8 },
        "Red T2 3": { hardenedAlloy: 370, polishingSolution: 370, designPlans: 37, lunarAmber: 8 },
        "Red T3": { hardenedAlloy: 380, polishingSolution: 380, designPlans: 38, lunarAmber: 9 },
        "Red T3 1": { hardenedAlloy: 390, polishingSolution: 390, designPlans: 39, lunarAmber: 9 },
        "Red T3 2": { hardenedAlloy: 400, polishingSolution: 400, designPlans: 40, lunarAmber: 9 },
        "Red T3 3": { hardenedAlloy: 410, polishingSolution: 410, designPlans: 41, lunarAmber: 9 },
        "Red T4": { hardenedAlloy: 420, polishingSolution: 420, designPlans: 42, lunarAmber: 10 },
        "Red T4 1": { hardenedAlloy: 430, polishingSolution: 430, designPlans: 43, lunarAmber: 10 },
        "Red T4 2": { hardenedAlloy: 440, polishingSolution: 440, designPlans: 44, lunarAmber: 10 },
        "Red T4 3": { hardenedAlloy: 450, polishingSolution: 450, designPlans: 45, lunarAmber: 10 }
    };

    // SvS Points earned per upgrade
    const svsPoints = {
        "Green": 0, "Green 1": 100,
        "Blue": 200, "Blue 1": 300, "Blue 2": 400, "Blue 3": 500,
        "Purple": 600, "Purple 1": 700, "Purple 2": 800, "Purple 3": 900,
        "Purple T1": 1000, "Purple T1 1": 1100, "Purple T1 2": 1200, "Purple T1 3": 1300,
        "Gold": 1400, "Gold 1": 1500, "Gold 2": 1600, "Gold 3": 1700,
        "Gold T1": 1800, "Gold T1 1": 1900, "Gold T1 2": 2000, "Gold T1 3": 2100,
        "Gold T2": 2200, "Gold T2 1": 2300, "Gold T2 2": 2400, "Gold T2 3": 2500,
        "Red": 2600, "Red 1": 2700, "Red 2": 2800, "Red 3": 2900,
        "Red T1": 3000, "Red T1 1": 3100, "Red T1 2": 3200, "Red T1 3": 3300,
        "Red T2": 3400, "Red T2 1": 3500, "Red T2 2": 3600, "Red T2 3": 3700,
        "Red T3": 3800, "Red T3 1": 3900, "Red T3 2": 4000, "Red T3 3": 4100,
        "Red T4": 4200, "Red T4 1": 4300, "Red T4 2": 4400, "Red T4 3": 4500
    };

    // Power earned per upgrade (will be overridden by CSV)
    const power = {
        "Green": 0, "Green 1": 0,
        "Blue": 0, "Blue 1": 0, "Blue 2": 0, "Blue 3": 0,
        "Purple": 0, "Purple 1": 0, "Purple 2": 0, "Purple 3": 0,
        "Purple T1": 0, "Purple T1 1": 0, "Purple T1 2": 0, "Purple T1 3": 0,
        "Gold": 0, "Gold 1": 0, "Gold 2": 0, "Gold 3": 0,
        "Gold T1": 0, "Gold T1 1": 0, "Gold T1 2": 0, "Gold T1 3": 0,
        "Gold T2": 0, "Gold T2 1": 0, "Gold T2 2": 0, "Gold T2 3": 0,
        "Red": 0, "Red 1": 0, "Red 2": 0, "Red 3": 0,
        "Red T1": 0, "Red T1 1": 0, "Red T1 2": 0, "Red T1 3": 0,
        "Red T2": 0, "Red T2 1": 0, "Red T2 2": 0, "Red T2 3": 0,
        "Red T3": 0, "Red T3 1": 0, "Red T3 2": 0, "Red T3 3": 0,
        "Red T4": 0, "Red T4 1": 0, "Red T4 2": 0, "Red T4 3": 0
    };

    // Gear types
    const GEAR_TYPES = ['helmet', 'chestplate', 'ring', 'watch', 'pants', 'staff'];

    /**
     * loadChiefGearCostsFromCsv()
     * Loads chief gear costs from CSV file and overrides default values
     * CSV uses a "number" field (2-111) to map to GEAR_LEVELS array indices
     * This allows the sheet data to override hard-coded values
     */
    async function loadChiefGearCostsFromCsv() {
        try {
            const response = await fetch('assets/chief_gear_costs.csv');
            if (!response.ok) {
                console.warn('Could not load chief_gear_costs.csv, using default values');
                return;
            }
            
            const text = await response.text();
            const lines = text.trim().split('\n');
            
            // Skip header row
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i].trim();
                if (!line) continue;
                
                const parts = line.split(',');
                if (parts.length < 8) continue;
                
                const gearLevel = parts[0].trim();
                const number = parseInt(parts[1]);
                const alloy = parseFloat(parts[2]) || 0;
                const polish = parseFloat(parts[3]) || 0;
                const plans = parseFloat(parts[4]) || 0;
                const amber = parseFloat(parts[5]) || 0;
                const powerValue = parseFloat(parts[6]) || 0;
                const svsPointsValue = parseFloat(parts[7]) || 0;
                
                // Skip aggregated rows (HatDesiredLevel, etc.)
                if (gearLevel.includes('DesiredLevel')) continue;
                
                // Map number to GEAR_LEVELS array index (number 1 = index 0, number 2 = index 1, etc.)
                const arrayIndex = number - 1;
                if (arrayIndex >= 0 && arrayIndex < GEAR_LEVELS.length) {
                    const levelName = GEAR_LEVELS[arrayIndex];
                    
                    // Update costs
                    if (chiefGearCosts[levelName]) {
                        chiefGearCosts[levelName].hardenedAlloy = alloy;
                        chiefGearCosts[levelName].polishingSolution = polish;
                        chiefGearCosts[levelName].designPlans = plans;
                        chiefGearCosts[levelName].lunarAmber = amber;
                    }
                    
                    // Update svsPoints
                    if (svsPoints[levelName] !== undefined) {
                        svsPoints[levelName] = svsPointsValue;
                    }
                    
                    // Update power
                    if (power[levelName] !== undefined) {
                        power[levelName] = powerValue;
                    }
                }
            }
            
            console.log('Chief gear costs loaded from CSV');
        } catch (error) {
            console.error('Error loading chief gear costs from CSV:', error);
        }
    }

    // Validate that current level is not higher than desired level
    function validateLevels(currentSelect, desiredSelect) {
        const currentValue = currentSelect.value;
        const desiredValue = desiredSelect.value;
        
        if (!currentValue || !desiredValue) return;
        
        const currentIndex = GEAR_LEVELS.indexOf(currentValue);
        const desiredIndex = GEAR_LEVELS.indexOf(desiredValue);
        
        if (currentIndex !== -1 && desiredIndex !== -1 && currentIndex > desiredIndex) {
            // If current > desired, set current = desired
            currentSelect.value = desiredValue;
        }
    }

    // Calculate costs between two levels
    function calculateCosts(fromLevel, toLevel) {
        if (!fromLevel || !toLevel) return null;
        
        const fromIndex = GEAR_LEVELS.indexOf(fromLevel);
        const toIndex = GEAR_LEVELS.indexOf(toLevel);
        
        if (fromIndex === -1 || toIndex === -1 || fromIndex >= toIndex) {
            return null;
        }

        const costs = {
            hardenedAlloy: 0,
            polishingSolution: 0,
            designPlans: 0,
            lunarAmber: 0,
            power: 0,
            svsPoints: 0
        };

        // Sum up material costs and SvS points across levels
        for (let i = fromIndex + 1; i <= toIndex; i++) {
            const level = GEAR_LEVELS[i];
            const levelCost = chiefGearCosts[level];
            costs.hardenedAlloy += levelCost.hardenedAlloy;
            costs.polishingSolution += levelCost.polishingSolution;
            costs.designPlans += levelCost.designPlans;
            costs.lunarAmber += levelCost.lunarAmber;
            costs.svsPoints += svsPoints[level] || 0;
        }

        // Power is NOT accumulated; set to the target level's power only
        const targetLevel = GEAR_LEVELS[toIndex];
        costs.power = (typeof power[targetLevel] === 'number') ? power[targetLevel] : 0;

        return costs;
    }

    // Calculate all gear and update results
    function calculateAll() {
        const totals = {
            hardenedAlloy: 0,
            polishingSolution: 0,
            designPlans: 0,
            lunarAmber: 0,
            power: 0,
            svsPoints: 0
        };

        const gearResults = [];

        GEAR_TYPES.forEach(gear => {
            const currentSelect = document.getElementById(`${gear}-current`);
            const desiredSelect = document.getElementById(`${gear}-desired`);
            
            if (!currentSelect || !desiredSelect) return;

            const current = currentSelect.value;
            const desired = desiredSelect.value;
            
            if (!current || !desired) return;

            const costs = calculateCosts(current, desired);
            if (costs) {
                totals.hardenedAlloy += costs.hardenedAlloy;
                totals.polishingSolution += costs.polishingSolution;
                totals.designPlans += costs.designPlans;
                totals.lunarAmber += costs.lunarAmber;
                totals.svsPoints += costs.svsPoints;

                gearResults.push({
                    name: gear.charAt(0).toUpperCase() + gear.slice(1),
                    from: current,
                    to: desired,
                    costs: costs
                });
            }
        });

        // Compute total power as the sum of desired-level power across all 6 gear pieces
        let desiredTotalPower = 0;
        GEAR_TYPES.forEach(gear => {
            const desiredSelect = document.getElementById(`${gear}-desired`);
            const desired = desiredSelect && desiredSelect.value ? desiredSelect.value : '';
            if (desired) {
                const p = (typeof power[desired] === 'number') ? power[desired] : 0;
                desiredTotalPower += p;
            }
        });
        totals.power = desiredTotalPower;

        displayResults(totals, gearResults);
    }

    // Display calculation results
    function displayResults(totals, gearResults) {
        const resultsDiv = document.getElementById('calculation-results');
        if (!resultsDiv) return;

        // Get inventory values
        const inventory = {
            hardenedAlloy: parseInt(document.getElementById('inventory-alloy')?.value || 0),
            polishingSolution: parseInt(document.getElementById('inventory-solution')?.value || 0),
            designPlans: parseInt(document.getElementById('inventory-plans')?.value || 0),
            lunarAmber: parseInt(document.getElementById('inventory-amber')?.value || 0)
        };

        // Calculate gaps
        const gaps = {
            hardenedAlloy: Math.max(0, totals.hardenedAlloy - inventory.hardenedAlloy),
            polishingSolution: Math.max(0, totals.polishingSolution - inventory.polishingSolution),
            designPlans: Math.max(0, totals.designPlans - inventory.designPlans),
            lunarAmber: Math.max(0, totals.lunarAmber - inventory.lunarAmber)
        };

        const hasGaps = gaps.hardenedAlloy > 0 || gaps.polishingSolution > 0 || 
                       gaps.designPlans > 0 || gaps.lunarAmber > 0;

        // Get translation function
        const t = window.I18n ? window.I18n.t : (key) => key;

        let html = '<div class="calculation-output">';
        
        // Totals summary
        html += '<div class="result-totals">';
        html += `<p><strong>${t('hardened-alloy')}:</strong> ${totals.hardenedAlloy.toLocaleString()}</p>`;
        html += `<p><strong>${t('polishing-solution')}:</strong> ${totals.polishingSolution.toLocaleString()}</p>`;
        html += `<p><strong>${t('design-plans')}:</strong> ${totals.designPlans.toLocaleString()}</p>`;
        html += `<p><strong>${t('lunar-amber')}:</strong> ${totals.lunarAmber.toLocaleString()}</p>`;
        html += `<p style="background: var(--accent-secondary); color: white;"><strong>Power:</strong> ${totals.power.toLocaleString()}</p>`;
        html += `<p style="background: var(--accent); color: white;"><strong>${t('svs-points')}:</strong> ${totals.svsPoints.toLocaleString()}</p>`;
        html += '</div>';

        // Show gaps if any
        if (hasGaps) {
            html += '<div class="result-totals" style="margin-top: 12px;">';
            html += `<p style="background: var(--danger); color: white; font-weight: bold;">${t('still-needed')}:</p>`;
            if (gaps.hardenedAlloy > 0) {
                html += `<p style="background: var(--danger); color: white;">${t('hardened-alloy')}: ${gaps.hardenedAlloy.toLocaleString()}</p>`;
            }
            if (gaps.polishingSolution > 0) {
                html += `<p style="background: var(--danger); color: white;">${t('polishing-solution')}: ${gaps.polishingSolution.toLocaleString()}</p>`;
            }
            if (gaps.designPlans > 0) {
                html += `<p style="background: var(--danger); color: white;">${t('design-plans')}: ${gaps.designPlans.toLocaleString()}</p>`;
            }
            if (gaps.lunarAmber > 0) {
                html += `<p style="background: var(--danger); color: white;">${t('lunar-amber')}: ${gaps.lunarAmber.toLocaleString()}</p>`;
            }
            html += '</div>';
        }

        // Detailed breakdown table
        if (gearResults.length > 0) {
            html += '<div class="results-wrap" style="margin-top: 16px;">';
            html += '<table class="results-table">';
            html += '<thead><tr>';
            html += `<th>${t('gear-type', 'en')}</th><th>${t('gear-current')}</th><th>${t('gear-desired')}</th>`;
            html += `<th>${t('hardened-alloy')}</th><th>${t('polishing-solution')}</th>`;
            html += `<th>${t('design-plans')}</th><th>${t('lunar-amber')}</th><th>${t('svs-points')}</th>`;
            html += '</tr></thead><tbody>';

            gearResults.forEach(result => {
                html += '<tr>';
                html += `<td>${t(result.name)}</td>`;
                html += `<td>${result.from}</td>`;
                html += `<td>${result.to}</td>`;
                html += `<td>${result.costs.hardenedAlloy.toLocaleString()}</td>`;
                html += `<td>${result.costs.polishingSolution.toLocaleString()}</td>`;
                html += `<td>${result.costs.designPlans.toLocaleString()}</td>`;
                html += `<td>${result.costs.lunarAmber.toLocaleString()}</td>`;
                html += `<td>${result.costs.svsPoints.toLocaleString()}</td>`;
                html += '</tr>';
            });

            html += '</tbody></table></div>';
        }

        html += '</div>';
        resultsDiv.innerHTML = html;
    }

    // Apply batch level to all gear selects
    function applyBatchCurrent(level) {
        if (!level) return;
        
        GEAR_TYPES.forEach(gear => {
            const select = document.getElementById(`${gear}-current`);
            if (select) {
                select.value = level;
            }
        });
        
        calculateAll();
    }

    function applyBatchDesired(level) {
        if (!level) return;
        
        GEAR_TYPES.forEach(gear => {
            const select = document.getElementById(`${gear}-desired`);
            if (select) {
                select.value = level;
            }
        });
        
        calculateAll();
    }

    // Reset all gear selects
    function resetAll() {
        GEAR_TYPES.forEach(gear => {
            const currentSelect = document.getElementById(`${gear}-current`);
            const desiredSelect = document.getElementById(`${gear}-desired`);
            if (currentSelect) currentSelect.value = '';
            if (desiredSelect) desiredSelect.value = '';
        });
        
        const resultsDiv = document.getElementById('calculation-results');
        if (resultsDiv) {
            resultsDiv.innerHTML = '<p style="text-align: center; color: var(--muted-text);">Select gear levels to see calculations</p>';
        }
    }

    // Initialize the module
    async function init() {
        // Load chief gear costs from CSV (overrides default values)
        await loadChiefGearCostsFromCsv();

        // Batch controls - auto-apply on change
        const batchCurrent = document.getElementById('batch-current');
        const batchDesired = document.getElementById('batch-desired');
        
        if (batchCurrent) {
            batchCurrent.addEventListener('change', (e) => {
                applyBatchCurrent(e.target.value);
            });
        }
        
        if (batchDesired) {
            batchDesired.addEventListener('change', (e) => {
                applyBatchDesired(e.target.value);
            });
        }

        // Reset button
        const resetBtn = document.getElementById('reset-all');
        if (resetBtn) {
            resetBtn.addEventListener('click', resetAll);
        }

        // Individual gear selects - validate and recalculate on change
        GEAR_TYPES.forEach(gear => {
            const currentSelect = document.getElementById(`${gear}-current`);
            const desiredSelect = document.getElementById(`${gear}-desired`);
            
            if (currentSelect && desiredSelect) {
                currentSelect.addEventListener('change', () => {
                    validateLevels(currentSelect, desiredSelect);
                    calculateAll();
                });
                desiredSelect.addEventListener('change', () => {
                    validateLevels(currentSelect, desiredSelect);
                    calculateAll();
                });
            }
        });

        // Inventory inputs - recalculate on change
        ['inventory-alloy', 'inventory-solution', 'inventory-plans', 'inventory-amber'].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener('input', calculateAll);
            }
        });

        // Initial message
        resetAll();
    }

    // Auto-initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Public API
    window.ChiefGearCalculator = {
        calculateAll,
        resetAll,
        applyBatchCurrent,
        applyBatchDesired
    };

})();
