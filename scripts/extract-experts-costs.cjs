#!/usr/bin/env node
/**
 * Extract expert level-up and skill costs from resource_data.xlsx
 * Generates: src/assets/experts_costs.csv
 * 
 * Output format:
 * ExpertName,Level,Affinity,Sigils,Attack,BearPlus,Power,Skill1Books,Skill1XP,Skill1Power,Skill2Books,Skill2XP,Skill2Power,Skill3Books,Skill3XP,Skill3Power,Skill4Books,Skill4XP,Skill4Power
 */

const ExcelJS = require('exceljs');
const fs = require('fs');
const path = require('path');

const INPUT = path.resolve('src/assets/resource_data.xlsx');
const OUTPUT = path.resolve('src/assets/experts_costs.csv');

// Expert names matching sheet names in workbook
const EXPERTS = ['Cyrille', 'Agnes', 'Holger', 'Romulus', 'Fabian', 'Baldur'];

/**
 * Extract costs from a single expert sheet
 * @param {ExcelJS.Worksheet} sheet 
 * @param {string} expertName 
 * @returns {Array<Object>} Array of cost objects
 */
function extractExpertCosts(sheet, expertName) {
  const costs = [];
  
  // Start from row 7 (first data row after headers)
  // Column mapping (1-indexed):
  // A: (empty), B: Relationship, C: Level, D: Affinity, E: Sigils, F: Attack, G: Bear+, H: Power
  // K (11): Skill1 Books, L (12): Skill1 XP, N (14): Skill1 Power
  // O (15): Skill2 Books, P (16): Skill2 XP, R (18): Skill2 Power
  // S (19): Skill3 Books, T (20): Skill3 XP, V (22): Skill3 Power
  // W (23): Skill4 Books, X (24): Skill4 XP, Z (26): Skill4 Power
  
  let currentRelationship = '';
  
  for (let rowNum = 7; rowNum <= sheet.rowCount; rowNum++) {
    const row = sheet.getRow(rowNum);
    
    // Column B (2): Relationship name
    const relationshipCell = row.getCell(2).value;
    if (relationshipCell && typeof relationshipCell === 'string' && relationshipCell.trim()) {
      currentRelationship = relationshipCell.trim();
    }
    
    // Column C (3): Level
    const levelCell = row.getCell(3).value;
    if (!levelCell && levelCell !== 0) continue; // Skip empty rows
    
    const level = typeof levelCell === 'number' ? levelCell : parseFloat(levelCell);
    if (isNaN(level)) continue;
    
    // Extract values, handling formulas and various cell types
    const getValue = (cell) => {
      let val = cell.value;
      if (!val && val !== 0) return 0;
      if (typeof val === 'object' && val.result !== undefined) {
        val = val.result;
      }
      if (typeof val === 'number') return val;
      if (typeof val === 'string') {
        const parsed = parseFloat(val);
        return isNaN(parsed) ? 0 : parsed;
      }
      return 0;
    };
    
    const affinity = getValue(row.getCell(4));       // D: Affinity cost
    const sigils = getValue(row.getCell(5));         // E: Sigils
    const attack = getValue(row.getCell(6));         // F: Attack
    const bearPlus = getValue(row.getCell(7));       // G: Bear+
    const power = getValue(row.getCell(8));          // H: Power
    
    // Skill costs (4 skills with Books, XP, Power each)
    const skill1Books = getValue(row.getCell(11));   // K
    const skill1XP = getValue(row.getCell(12));      // L
    const skill1Power = getValue(row.getCell(14));   // N
    
    const skill2Books = getValue(row.getCell(15));   // O
    const skill2XP = getValue(row.getCell(16));      // P
    const skill2Power = getValue(row.getCell(18));   // R
    
    const skill3Books = getValue(row.getCell(19));   // S
    const skill3XP = getValue(row.getCell(20));      // T
    const skill3Power = getValue(row.getCell(22));   // V
    
    const skill4Books = getValue(row.getCell(23));   // W
    const skill4XP = getValue(row.getCell(24));      // X
    const skill4Power = getValue(row.getCell(26));   // Z
    
    costs.push({
      expertName,
      relationship: currentRelationship,
      level,
      affinity,
      sigils,
      attack,
      bearPlus,
      power,
      skill1Books,
      skill1XP,
      skill1Power,
      skill2Books,
      skill2XP,
      skill2Power,
      skill3Books,
      skill3XP,
      skill3Power,
      skill4Books,
      skill4XP,
      skill4Power
    });
  }
  
  return costs;
}

(async () => {
  console.log('Loading workbook...');
  const workbook = new ExcelJS.Workbook();
  await workbook.xlsx.readFile(INPUT);
  
  let allCosts = [];
  
  // Extract costs from each expert sheet
  for (const expertName of EXPERTS) {
    console.log(`Extracting ${expertName}...`);
    const sheet = workbook.getWorksheet(expertName);
    
    if (!sheet) {
      console.warn(`  WARNING: Sheet "${expertName}" not found, skipping`);
      continue;
    }
    
    const costs = extractExpertCosts(sheet, expertName);
    console.log(`  Extracted ${costs.length} levels`);
    allCosts = allCosts.concat(costs);
  }
  
  // Sort by expert name, then level
  allCosts.sort((a, b) => {
    if (a.expertName !== b.expertName) {
      return a.expertName.localeCompare(b.expertName);
    }
    return a.level - b.level;
  });
  
  console.log(`\nTotal entries: ${allCosts.length}`);
  
  // Generate CSV
  console.log('Generating CSV...');
  const header = [
    'ExpertName',
    'Relationship',
    'Level',
    'Affinity',
    'Sigils',
    'Attack',
    'BearPlus',
    'Power',
    'Skill1Books',
    'Skill1XP',
    'Skill1Power',
    'Skill2Books',
    'Skill2XP',
    'Skill2Power',
    'Skill3Books',
    'Skill3XP',
    'Skill3Power',
    'Skill4Books',
    'Skill4XP',
    'Skill4Power'
  ].join(',');
  
  const rows = allCosts.map(c => [
    c.expertName,
    c.relationship,
    c.level,
    c.affinity,
    c.sigils,
    c.attack,
    c.bearPlus,
    c.power,
    c.skill1Books,
    c.skill1XP,
    c.skill1Power,
    c.skill2Books,
    c.skill2XP,
    c.skill2Power,
    c.skill3Books,
    c.skill3XP,
    c.skill3Power,
    c.skill4Books,
    c.skill4XP,
    c.skill4Power
  ].join(','));
  
  const csv = [header, ...rows].join('\n');
  
  fs.writeFileSync(OUTPUT, csv, 'utf-8');
  console.log(`\n✓ Written to: ${OUTPUT}`);
  console.log(`  Rows: ${allCosts.length}`);
  console.log(`  Columns: 20`);
  
  // Show sample for verification
  console.log('\n=== Sample (first 5 entries) ===');
  allCosts.slice(0, 5).forEach(c => {
    console.log(`${c.expertName} Lv${c.level} (${c.relationship}): Affinity=${c.affinity}, Power=${c.power}`);
  });
})();
