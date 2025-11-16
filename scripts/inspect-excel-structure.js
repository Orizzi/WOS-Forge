#!/usr/bin/env node
/*
Inspect Excel structure to find Fire Crystal and Refined Crystal columns
*/

const ExcelJS = require('exceljs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');

async function main() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT);
    
    const sheets = ['Furnace', 'Embassy', 'Command Center', 'Infirmary', 
                    'Infantry Camp', 'Marksman Camp', 'Lancer Camp', 'War Academy'];
    
    for (const sheetName of sheets) {
        const worksheet = workbook.getWorksheet(sheetName);
        if (!worksheet) {
            console.log(`Sheet "${sheetName}" not found\n`);
            continue;
        }
        
        console.log(`\n=== ${sheetName} ===`);
        
        // Get first 5 rows to inspect structure
        let rowCount = 0;
        worksheet.eachRow((row, rowNumber) => {
            if (rowCount < 5) {
                console.log(`Row ${rowNumber}:`);
                const values = {};
                row.eachCell((cell, colNumber) => {
                    values[colNumber] = cell.value;
                });
                console.log(values);
                rowCount++;
            }
        });
        
        // Only inspect first sheet in detail
        if (sheetName === 'Furnace') {
            console.log('\nShowing more rows for Furnace:');
            rowCount = 0;
            worksheet.eachRow((row, rowNumber) => {
                if (rowCount < 15) {
                    const values = {};
                    row.eachCell((cell, colNumber) => {
                        values[colNumber] = cell.value;
                    });
                    console.log(`Row ${rowNumber}:`, values);
                    rowCount++;
                }
            });
            break; // Only show Furnace in detail
        }
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
