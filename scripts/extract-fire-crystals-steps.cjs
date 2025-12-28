const fs = require('fs');
const path = require('path');
const ExcelJS = require('exceljs');

/**
 * Extract Fire Crystal per-step costs/time from resource_data.xlsx.
 *
 * Source sheets (building sheets):
 *  - Furnace, Command Center, Embassy, Infirmary, Infantry Camp, Marksman Camp, Lancer Camp, War Academy
 *    (War Academy has no F30/30-x rows in-game; it starts at FC1)
 * Columns used (1-based):
 *  B: levelId (must start with "FC")
 *  C: order index (optional)
 *  D: Meat
 *  F: Wood
 *  H: Coal
 *  J: Iron
 *  L: Fire Crystals (fc)
 *  N: Refined Fire Crystals (rfc)
 *  U: Total seconds (timeSeconds)
 * Only rows where column B starts with "FC" are kept.
 *
 * Output: src/assets/fire_crystals_steps.json
 */
async function main() {
  const workbookPath = path.join(__dirname, '..', 'src', 'assets', 'resource_data.xlsx');
  const outPath = path.join(__dirname, '..', 'src', 'assets', 'fire_crystals_steps.json');
  const buildingSheets = [
    'Furnace',
    'Command Center',
    'Embassy',
    'Infirmary',
    'Infantry Camp',
    'Marksman Camp',
    'Lancer Camp',
    'War Academy'
  ];

  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(workbookPath);

  const rowsOut = [];

  buildingSheets.forEach((sheetName) => {
    const sheet = workbook.getWorksheet(sheetName);
    if (!sheet) {
      console.warn(`Sheet ${sheetName} not found; skipping.`);
      return;
    }
    let orderCounter = 0;
    sheet.eachRow((row, rowNumber) => {
      if (rowNumber < 6) return;
      const levelId = stringVal(row.getCell(2).value);
      if (!levelId || !/^FC/i.test(levelId)) return;
      const entry = {
        building: sheetName,
        levelId,
        orderIndex: toNum(row.getCell(3).value, orderCounter++),
        meat: toNum(row.getCell(4).value, 0),    // D
        wood: toNum(row.getCell(6).value, 0),    // F
        coal: toNum(row.getCell(8).value, 0),    // H
        iron: toNum(row.getCell(10).value, 0),   // J
        fc: toNum(row.getCell(12).value, 0),     // L
        rfc: toNum(row.getCell(14).value, 0),    // N
        timeSeconds: toNum(row.getCell(21).value, 0) // U
      };
      rowsOut.push(entry);
    });
  });

  if (rowsOut.length === 0) {
    console.error('No Fire Crystal step rows found across building sheets.');
    process.exit(1);
  }

  fs.writeFileSync(outPath, JSON.stringify(rowsOut, null, 2), 'utf8');
  console.log(`Wrote ${outPath} (${rowsOut.length} rows)`);
}

function stringVal(v) {
  if (v === null || v === undefined) return '';
  if (typeof v === 'object' && v.text) return String(v.text).trim();
  return String(v).trim();
}

function toNum(v, fallback = 0) {
  if (v === null || v === undefined || v === '') return fallback;
  if (typeof v === 'object' && v.result !== undefined) {
    return toNum(v.result, fallback);
  }
  const n = typeof v === 'number' ? v : parseFloat(String(v).replace(/[^0-9.-]/g, ''));
  return Number.isFinite(n) ? n : fallback;
}

if (require.main === module) {
  main().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
