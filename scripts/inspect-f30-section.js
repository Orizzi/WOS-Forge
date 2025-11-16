#!/usr/bin/env node
/*
Detailed inspection of Furnace F30 and FC1 sections to understand the exact structure
*/

const ExcelJS = require('exceljs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');

async function main() {
    const workbook = new ExcelJS.Workbook();
    await workbook.xlsx.readFile(INPUT);
    
    const worksheet = workbook.getWorksheet('Furnace');
    console.log('=== Furnace Rows 36-50 (F30 to FC2) ===\n');
    
    for (let rowNum = 36; rowNum <= 50; rowNum++) {
        const row = worksheet.getRow(rowNum);
        const col1 = row.getCell(1).value;
        const col2 = row.getCell(2).value;
        const col3 = row.getCell(3).value;
        const col12 = row.getCell(12).value;
        const col14 = row.getCell(14).value;
        
        console.log(`Row ${rowNum}:`);
        console.log(`  Col1(A): ${col1}`);
        console.log(`  Col2(B): ${col2}`);
        console.log(`  Col3(C): ${col3}`);
        console.log(`  Col12(L) FC: ${typeof col12 === 'number' ? col12 : 'N/A'}`);
        console.log(`  Col14(N) RFC: ${typeof col14 === 'number' ? col14 : 'N/A'}`);
        console.log('');
    }
}

main().catch(err => {
    console.error('Error:', err);
    process.exit(1);
});
