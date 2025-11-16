const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
wb.xlsx.readFile('src/assets/resource_data.xlsx').then(() => {
    const ws = wb.getWorksheet('Fire Crystal Refinement');
    if (!ws) {
        console.log('Fire Crystal Refinement sheet not found');
        return;
    }
    
    console.log('Fire Crystal Refinement sheet - first 30 rows:\n');
    let rowCount = 0;
    ws.eachRow((row, rowNum) => {
        if (rowCount < 30) {
            const values = {};
            row.eachCell((cell, colNum) => {
                if (cell.value !== null && cell.value !== undefined && cell.value !== '') {
                    if (typeof cell.value === 'object' && cell.value.formula) {
                        values[colNum] = '{formula}';
                    } else {
                        values[colNum] = cell.value;
                    }
                }
            });
            if (Object.keys(values).length > 0) {
                console.log(`Row ${rowNum}:`, values);
            }
            rowCount++;
        }
    });
});
