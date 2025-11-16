#!/usr/bin/env node
/*
Find the row mapping between numerical level and level names (F30, FC1, etc.)
*/

const ExcelJS = require('exceljs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');

async function main() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT);
    
    const worksheet = workbook.getWorksheet('Furnace');
    if (!worksheet) {
        console.log('Furnace sheet not found');
        return;
    }
    
    console.log('Looking for level name column and F30/FC rows...\n');
    
    let foundLevelColumn = null;
    let rowCount = 0;
    
    worksheet.eachRow((row, rowNumber) => {
        if (rowCount < 80) { // Check first 80 rows
            const values = {};
            row.eachCell((cell, colNumber) => {
                const val = cell.value;
                // Look for F30, FC1, FC2, etc. in any column
                if (val && typeof val === 'string' && (val.includes('F30') || val.match(/^FC\d+$/))) {
                    values[colNumber] = val;
                    if (!foundLevelColumn) foundLevelColumn = colNumber;
                }
                // Also capture the numerical column (3) and FC/RFC columns (12, 14)
                if (colNumber === 3 || colNumber === 12 || colNumber === 14 || colNumber === 1) {
                    if (val && typeof val === 'object' && val.formula) {
                        values[colNumber] = `{formula}`;
                    } else if (val !== undefined && val !== null && val !== '') {
                        values[colNumber] = val;
                    }
                }
            });
            
            if (Object.keys(values).length > 0) {
                console.log(`Row ${rowNumber}:`, values);
            }
            rowCount++;
        }
    });
    
    console.log('\n\nFound level name column:', foundLevelColumn);
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
