#!/usr/bin/env node
/*
Extract Fire Crystal costs from Excel building sheets and update the JavaScript calculator
This creates a flat CSV that can be loaded at runtime
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT_CSV = path.resolve('src/assets/fire_crystals_costs.csv');
const OUTPUT_JSON = path.resolve('src/assets/fire_crystals_costs.json');

const BUILDING_SHEETS = [
  'Furnace', 'Embassy', 'Command Center', 'Infirmary',
  'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
];

async function main() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT);
    
    const rows = [['building', 'level', 'fire_crystals', 'refined_crystals']];
    const flat = [];
    
    for (const sheetName of BUILDING_SHEETS) {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            console.warn(`Sheet "${sheetName}" not found, skipping`);
            continue;
        }
        
        console.log(`Processing ${sheetName}...`);
        
        const startRow = sheetName === 'War Academy' ? 41 : 36;
        
        for (let rowNum = startRow; rowNum <= 85; rowNum++) {
            const row = worksheet.getRow(rowNum);
            const levelName = row.getCell(2).value;
            const fc = row.getCell(12).value;
            const rfc = row.getCell(14).value;
            
            if (!levelName || levelName === 'Total') break;
            
            const fcVal = typeof fc === 'number' ? fc : 0;
            const rfcVal = typeof rfc === 'number' ? rfc : 0;
            
                rows.push([sheetName, levelName, fcVal, rfcVal]);
                flat.push({ building: sheetName, level: String(levelName), fc: fcVal, rfc: rfcVal });
        }
    }
    
    // Write CSV
    const csvContent = rows.map(r => r.join(',')).join('\n');
    fs.writeFileSync(OUTPUT_CSV, csvContent, 'utf8');
    // Write JSON (flat array)
    fs.writeFileSync(OUTPUT_JSON, JSON.stringify(flat, null, 2), 'utf8');
    
    console.log(`\nExtracted ${rows.length - 1} rows to ${OUTPUT_CSV}`);
    console.log(`Also wrote JSON to ${OUTPUT_JSON}`);
    
    // Calculate totals
    let grandFC = 0, grandRFC = 0;
    for (let i = 1; i < rows.length; i++) {
        grandFC += rows[i][2];
        grandRFC += rows[i][3];
    }
    
    console.log(`\nTOTALS FROM EXCEL:`);
    console.log(`  Fire Crystals: ${grandFC}`);
    console.log(`  Refined Crystals: ${grandRFC}`);
    console.log(`\nEXPECTED (from user):`);
    console.log(`  Fire Crystals: 39694`);
    console.log(`  Refined Crystals: 2958`);
    console.log(`\nDIFFERENCE:`);
    console.log(`  Fire Crystals: ${grandFC - 39694} (${grandFC < 39694 ? 'missing' : 'extra'})`);
    console.log(`  Refined Crystals: ${grandRFC - 2958} (${grandRFC < 2958 ? 'missing' : 'extra'})`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
