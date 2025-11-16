const ExcelJS = require('exceljs');
const wb = new ExcelJS.Workbook();
wb.xlsx.readFile('src/assets/resource_data.xlsx').then(() => {
    console.log('All sheets in workbook:');
    wb.eachSheet((sheet, id) => {
        console.log(`  ${id}. ${sheet.name}`);
    });
});
