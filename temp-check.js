const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
wb.xlsx.readFile('src/assets/resource_data.xlsx').then(() => {
    const ws = wb.getWorksheet('Furnace');
    console.log('Furnace rows 30-45:');
    for (let r = 30; r <= 45; r++) {
        const row = ws.getRow(r);
        const b = row.getCell(2).value;
        const c = row.getCell(3).value;
        const l = row.getCell(12).value;
        console.log(`Row ${r}: B=${b}, C=${c}, L=${l}`);
    }
});
