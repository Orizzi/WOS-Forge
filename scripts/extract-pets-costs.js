#!/usr/bin/env node
/*
Extract pet upgrade costs from the 'Pet Data' sheet and write to CSV.
Sheet structure: Row 4 = Pet names, Row 5-6 = Resource type headers, Row 7+ = Level data
Each pet has 10 columns: Food (Base/Required), Manual (Base/Required), Potion (Base/Required), Serum (Base/Required), SVS (Points/Points)
Output: src/assets/pets_costs.csv with header: petName,level,foodBase,foodRequired,manualBase,manualRequired,potionBase,potionRequired,serumBase,serumRequired,svsPointsBase,svsPointsRequired
*/

const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/pets_costs.csv');
const SHEET_NAME = 'Pet Data';

function getCellValue(cell) {
  if (!cell) return '';
  if (typeof cell === 'object') {
    if ('text' in cell) return cell.text;
    if ('result' in cell) return cell.result;
    if ('richText' in cell && Array.isArray(cell.richText)) return cell.richText.map(rt => rt.text).join('');
    if ('hyperlink' in cell && 'text' in cell) return cell.text;
    return '';
  }
  return cell;
}

async function main() {
  if (!fs.existsSync(INPUT)) {
    console.error('Workbook not found:', INPUT);
    process.exit(1);
  }
  
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  const worksheet = workbook.getWorksheet(SHEET_NAME);
  if (!worksheet) {
    console.error('Sheet not found:', SHEET_NAME);
    process.exit(1);
  }

  // Row 4 contains pet names
  const petNamesRow = worksheet.getRow(4);
  const pets = [];
  
  // Identify pet columns (each pet spans 10 columns)
  petNamesRow.eachCell((cell, colNumber) => {
    const petName = getCellValue(cell.value);
    if (petName && colNumber >= 4) {
      // Check if this is the start of a new pet (not already tracked)
      if (pets.length === 0 || pets[pets.length - 1].name !== petName) {
        pets.push({ name: petName, startCol: colNumber });
      }
    }
  });

  console.log(`Found ${pets.length} pets:`, pets.map(p => p.name).join(', '));

  const out = [];
  
  // Process data rows (starting from row 7)
  worksheet.eachRow((row, rowNumber) => {
    if (rowNumber < 7) return; // Skip header rows
    
    const values = row.values;
    const level = getCellValue(values[3]); // Column C contains level
    
    if (!level || (typeof level === 'number' && level <= 0)) return; // Skip invalid levels
    
    // Extract data for each pet
    for (const pet of pets) {
      const col = pet.startCol;
      const foodBase = Number(getCellValue(values[col])) || 0;
      const foodRequired = Number(getCellValue(values[col + 1])) || 0;
      const manualBase = Number(getCellValue(values[col + 2])) || 0;
      const manualRequired = Number(getCellValue(values[col + 3])) || 0;
      const potionBase = Number(getCellValue(values[col + 4])) || 0;
      const potionRequired = Number(getCellValue(values[col + 5])) || 0;
      const serumBase = Number(getCellValue(values[col + 6])) || 0;
      const serumRequired = Number(getCellValue(values[col + 7])) || 0;
      const svsPointsBase = Number(getCellValue(values[col + 8])) || 0;
      const svsPointsRequired = Number(getCellValue(values[col + 9])) || 0;
      
      out.push({
        petName: pet.name,
        level,
        foodBase,
        foodRequired,
        manualBase,
        manualRequired,
        potionBase,
        potionRequired,
        serumBase,
        serumRequired,
        svsPointsBase,
        svsPointsRequired
      });
    }
  });
  
  if (out.length === 0) {
    console.error('No valid data rows found in sheet:', SHEET_NAME);
    process.exit(1);
  }

  // Write CSV
  const header = 'petName,level,foodBase,foodRequired,manualBase,manualRequired,potionBase,potionRequired,serumBase,serumRequired,svsPointsBase,svsPointsRequired';
  const lines = [header];
  for (const r of out) {
    lines.push(`"${r.petName}",${r.level},${r.foodBase},${r.foodRequired},${r.manualBase},${r.manualRequired},${r.potionBase},${r.potionRequired},${r.serumBase},${r.serumRequired},${r.svsPointsBase},${r.svsPointsRequired}`);
  }

  fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
  fs.writeFileSync(OUTPUT, lines.join('\n'), 'utf8');
  console.log(`Extracted ${out.length} rows (${pets.length} pets × ${out.length / pets.length} levels) to ${OUTPUT}`);
}

main();
