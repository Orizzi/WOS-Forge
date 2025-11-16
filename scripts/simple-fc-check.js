#!/usr/bin/env node
/*
Simple extraction: just read all FC costs row by row from Excel
and match them against the expected calculator structure
*/

const ExcelJS = require('exceljs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');

const BUILDING_SHEETS = [
  'Furnace', 'Embassy', 'Command Center', 'Infirmary',
  'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'
];

async function main() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT);
    
    console.log('=== RAW FC/RFC COSTS BY ROW ===\n');
    
    for (const sheetName of BUILDING_SHEETS) {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            console.warn(`Sheet "${sheetName}" not found`);
            continue;
        }
        
        console.log(`\n${sheetName}:`);
        
        const startRow = sheetName === 'War Academy' ? 41 : 36;
        let totalFC = 0, totalRFC = 0;
        
        for (let rowNum = startRow; rowNum <= 85; rowNum++) {
            const row = worksheet.getRow(rowNum);
            const levelName = row.getCell(2).value;
            const fc = row.getCell(12).value;
            const rfc = row.getCell(14).value;
            
            if (!levelName) break; // End of data
            
            const fcVal = typeof fc === 'number' ? fc : 0;
            const rfcVal = typeof rfc === 'number' ? rfc : 0;
            
            if (fcVal || rfcVal) {
                console.log(`  ${levelName}: FC=${fcVal}, RFC=${rfcVal}`);
                totalFC += fcVal;
                totalRFC += rfcVal;
            }
        }
        
        console.log(`  TOTAL: FC=${totalFC}, RFC=${totalRFC}`);
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
