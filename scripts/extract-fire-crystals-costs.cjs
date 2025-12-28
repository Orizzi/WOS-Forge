#!/usr/bin/env node
/*
Extract Fire Crystal and Refined Crystal costs from Excel building sheets
and generate a JavaScript data structure or CSV
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT_JS = path.resolve('src/assets/fire_crystals_costs.js');

const BUILDING_SHEETS = [
  'Furnace', 'Embassy', 'Command Center', 'Infirmary',
  'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
];

// Level mapping: row 36 = F30, then 30-1, 30-2, 30-3, 30-4, FC1, FC1-1, ...
function getLevelName(rowNum) {
    if (rowNum < 36) return null;
    const offset = rowNum - 36;
    
    // F30 section: rows 36-40 (F30=31, 31=30-1, 32=30-2, 33=30-3, 34=30-4, 35=FC1)
    if (offset === 0) return { major: 'F30', sub: null, nextMajor: 'FC1' };
    if (offset >= 1 && offset <= 4) return { major: 'F30', sub: offset, nextMajor: 'FC1' };
    if (offset === 5) return { major: 'FC1', sub: null, nextMajor: 'FC2' };
    
    // FC1-FC9: each takes 5 rows (1 major + 4 subs)
    // offset 5 = FC1, 6-9 = FC1-1 to FC1-4, 10 = FC2, 11-14 = FC2-1 to FC2-4, ...
    const fcSection = offset - 5; // starts at 0 for FC1
    const fcIndex = Math.floor(fcSection / 5) + 1; // FC1, FC2, FC3...
    const subIndex = fcSection % 5;
    
    if (fcIndex >= 1 && fcIndex <= 9) {
        if (subIndex === 0) {
            return { major: `FC${fcIndex}`, sub: null, nextMajor: `FC${fcIndex + 1}` };
        } else {
            return { major: `FC${fcIndex}`, sub: subIndex, nextMajor: `FC${fcIndex + 1}` };
        }
    }
    
    // FC10 section: offset 50 onwards
    if (offset === 50) return { major: 'FC10', sub: null, nextMajor: null };
    if (offset >= 51 && offset <= 54) return { major: 'FC10', sub: offset - 50, nextMajor: null };
    
    return null;
}

async function main() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT);
    
    const allData = {};
    
    for (const sheetName of BUILDING_SHEETS) {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            console.warn(`Sheet "${sheetName}" not found, skipping`);
            continue;
        }
        
        console.log(`Processing ${sheetName}...`);
        const buildingData = {};
        let currentMajor = null;
        let currentMajorData = null;
        
        // War Academy starts at FC1 (row 41), not F30
        const startRow = sheetName === 'War Academy' ? 41 : 36;
        const endRow = 86; // Up to and including FC10
        
        for (let rowNum = startRow; rowNum <= endRow; rowNum++) {
            const row = worksheet.getRow(rowNum);
            const levelInfo = getLevelName(rowNum);
            
            if (!levelInfo) continue;
            
            // Read values from row
            const col2Val = row.getCell(2).value; // Major level indicator (FC1, FC2, etc.)
            const numLevel = row.getCell(3).value; // Numerical level
            const fcTotal = row.getCell(12).value; // Fire Crystals Total
            const rfcTotal = row.getCell(14).value; // Refined FCs Total
            
            // Skip if no FC data
            if (typeof fcTotal !== 'number' && typeof rfcTotal !== 'number') continue;
            
            const fc = typeof fcTotal === 'number' ? fcTotal : 0;
            const rfc = typeof rfcTotal === 'number' ? rfcTotal : 0;
            
            // Handle major level transition
            if (levelInfo.sub === null) {
                // This is a major level (F30, FC1, FC2, ...)
                currentMajor = levelInfo.major;
                currentMajorData = {};
                buildingData[currentMajor] = currentMajorData;
                
                // This row represents the "toNextMajor" cost
                if (levelInfo.nextMajor) {
                    if (rfc > 0) {
                        // FC5+ format
                        if (!currentMajorData.normal) currentMajorData.normal = {};
                        if (!currentMajorData.refine) currentMajorData.refine = {};
                        currentMajorData.normal['to' + levelInfo.nextMajor] = fc;
                        currentMajorData.refine['to' + levelInfo.nextMajor] = rfc;
                    } else {
                        // Pre-FC5 format
                        currentMajorData['to' + levelInfo.nextMajor] = fc;
                    }
                }
            } else {
                // This is a sub-level (30-1, FC1-1, etc.)
                if (!currentMajorData) continue;
                
                const subKey = String(levelInfo.sub);
                
                if (rfc > 0) {
                    // FC5+ format
                    if (!currentMajorData.normal) currentMajorData.normal = {};
                    if (!currentMajorData.refine) currentMajorData.refine = {};
                    currentMajorData.normal[subKey] = fc;
                    currentMajorData.refine[subKey] = rfc;
                } else {
                    // Pre-FC5 format
                    currentMajorData[subKey] = fc;
                }
            }
        }
        
        allData[sheetName] = buildingData;
    }
    
    // Generate JavaScript output
    const jsContent = `// Auto-generated from resource_data.xlsx
// DO NOT EDIT MANUALLY - run: node scripts/extract-fire-crystals-costs.js

export const fireCrystalCosts = ${JSON.stringify(allData, null, 4)};
`;
    
    fs.writeFileSync(OUTPUT_JS, jsContent, 'utf8');
    console.log(`\nExtracted Fire Crystal costs to ${OUTPUT_JS}`);
    
    // Also calculate totals for verification
    console.log('\n=== VERIFICATION TOTALS ===');
    let grandFC = 0, grandRFC = 0;
    
    for (const [building, data] of Object.entries(allData)) {
        let buildingFC = 0, buildingRFC = 0;
        
        for (const [level, levelData] of Object.entries(data)) {
            if (levelData.normal) {
                for (const val of Object.values(levelData.normal)) buildingFC += val;
                for (const val of Object.values(levelData.refine)) buildingRFC += val;
            } else {
                for (const [key, val] of Object.entries(levelData)) {
                    if (typeof val === 'number') buildingFC += val;
                }
            }
        }
        
        console.log(`${building}: FC=${buildingFC}, RFC=${buildingRFC}`);
        grandFC += buildingFC;
        grandRFC += buildingRFC;
    }
    
    console.log(`\nGRAND TOTAL: FC=${grandFC}, RFC=${grandRFC}`);
    console.log(`EXPECTED:    FC=39694, RFC=2958`);
    console.log(`DIFFERENCE:  FC=${grandFC - 39694}, RFC=${grandRFC - 2958}`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
