#!/usr/bin/env node
/*
Extract Fire Crystal costs from Excel building sheets and update the JavaScript calculator
This creates a flat CSV that can be loaded at runtime
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT_JS = path.resolve('src/Scripts/fire-crystals-costs.js');

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

        // Aggregate milestone costs by summing sub-rows (e.g., 30-1..30-4 into F30, FCx main + FCx-1..4 into FCx)
        const maxRows = worksheet.actualRowCount || 300;
        const agg = { F30: { fc: 0, rfc: 0 } };
        const ensure = (k) => { if (!agg[k]) agg[k] = { fc: 0, rfc: 0 }; return agg[k]; };
        const fcCol = 12; // L
        const rfcCol = 14; // N

        for (let rowNum = 1; rowNum <= maxRows; rowNum++) {
            const row = worksheet.getRow(rowNum);
            const raw = row.getCell(2).value; // Column B labels
            const label = (raw == null) ? '' : String(raw).trim();
            if (!label) continue;

            const fc = row.getCell(fcCol).value;
            const rfc = row.getCell(rfcCol).value;
            const fcVal = typeof fc === 'number' ? fc : 0;
            const rfcVal = typeof rfc === 'number' ? rfc : 0;

            // Match patterns
            if (/^30-\d+$/.test(label)) {
                const a = ensure('F30');
                a.fc += fcVal; a.rfc += rfcVal;
            } else if (/^FC(\d+)$/.test(label)) {
                const m = label.match(/^FC(\d+)$/);
                const key = `FC${m[1]}`;
                const a = ensure(key);
                a.fc += fcVal; a.rfc += rfcVal;
            } else if (/^FC(\d+)-\d+$/.test(label)) {
                const m = label.match(/^FC(\d+)-\d+$/);
                const key = `FC${m[1]}`;
                const a = ensure(key);
                a.fc += fcVal; a.rfc += rfcVal;
            }
        }

        const order = ['F30', 'FC1','FC2','FC3','FC4','FC5','FC6','FC7','FC8','FC9','FC10'];
        let found = 0;
        for (const lvl of order) {
            if (!agg[lvl]) continue;
            rows.push([sheetName, lvl, agg[lvl].fc, agg[lvl].rfc]);
            flat.push({ building: sheetName, level: lvl, fc: agg[lvl].fc, rfc: agg[lvl].rfc });
            found++;
        }

        if (found === 0) {
            console.warn(`  Warning: No milestone levels aggregated for ${sheetName}. Check sheet layout/labels.`);
        } else if (found < order.length) {
            console.warn(`  Note: Aggregated ${found}/${order.length} levels for ${sheetName}.`);
        }
    }
    
    console.log(`\nExtracted ${rows.length - 1} milestone rows from Excel.`);
    // Write JS assigning to window for direct browser use
    const jsContent = `/* Auto-generated: Fire Crystal flat costs */\n(function(){\n  try { window.FireCrystalFlatCosts = ${JSON.stringify(flat, null, 2)}; } catch(_) {}\n})();\n`;
    fs.writeFileSync(OUTPUT_JS, jsContent, 'utf8');
    console.log(`Wrote embedded JS to ${OUTPUT_JS}`);
    
    // Calculate totals
    let grandFC = 0, grandRFC = 0;
    for (let i = 1; i < rows.length; i++) {
        grandFC += rows[i][2];
        grandRFC += rows[i][3];
    }
    
    console.log(`\nTOTALS FROM EXCEL (authoritative):`);
    console.log(`  Fire Crystals: ${grandFC}`);
    console.log(`  Refined Crystals: ${grandRFC}`);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
