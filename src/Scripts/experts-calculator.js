// Experts calculator: sums costs for a single expert over a level range using CSV overrides
const ExpertsCalculatorModule = (function(){
  'use strict';

  const CSV_URL = 'assets/experts_costs.csv';
  const EXPERTS = ['Agnes', 'Baldur', 'Cyrille', 'Fabian', 'Holger', 'Romulus'];
  const MAX_LEVEL = 110; // 0-110 based on extracted CSV (111 rows per expert)

  const materialIcons = {
    affinity: 'assets/resources/experts/expert-placeholder.svg',
    sigils: 'assets/resources/experts/expert-placeholder.svg',
    books: 'assets/resources/experts/expert-placeholder.svg',
    xp: 'assets/resources/experts/expert-placeholder.svg',
    power: 'assets/resources/experts/expert-placeholder.svg',
    default: 'assets/resources/experts/expert-placeholder.svg'
  };

  // costs[expertName][level] = { affinity, sigils, attack, bearPlus, power, skills: [ {books,xp,power} x4 ] }
  const costs = {};

  function ensureExpert(name){
    if(!costs[name]) costs[name] = {};
    return costs[name];
  }

  function parseNumber(value){
    if(value === null || value === undefined) return 0;
    if(typeof value === 'number') return value;
    const n = parseFloat(value);
    return Number.isNaN(n) ? 0 : n;
  }

  function applyCsv(rows){
    for(const row of rows){
      if(!row || row.length < 20) continue;
      const expertName = row[0];
      const level = parseFloat(row[2]);
      if(!expertName || Number.isNaN(level)) continue;
      const expert = ensureExpert(expertName.trim());
      expert[level] = {
        relationship: row[1] || '',
        affinity: parseNumber(row[3]),
        sigils: parseNumber(row[4]),
        attack: parseNumber(row[5]),
        bearPlus: parseNumber(row[6]),
        power: parseNumber(row[7]),
        skills: [
          { books: parseNumber(row[8]), xp: parseNumber(row[9]), power: parseNumber(row[10]) },
          { books: parseNumber(row[11]), xp: parseNumber(row[12]), power: parseNumber(row[13]) },
          { books: parseNumber(row[14]), xp: parseNumber(row[15]), power: parseNumber(row[16]) },
          { books: parseNumber(row[17]), xp: parseNumber(row[18]), power: parseNumber(row[19]) }
        ]
      };
    }
  }

  async function loadCsv(){
    try {
      const { rows } = await window.DataLoader.loadCsv(CSV_URL, { useCache: true });
      if(!rows || rows.length === 0){
        console.warn('[Experts] CSV empty or missing');
        return;
      }
      applyCsv(rows.slice(1)); // skip header
      console.info(`[Experts] Applied ${rows.length - 1} overrides from CSV`);
    } catch (err) {
      console.warn('[Experts] CSV override skipped:', err.message);
    }
  }

  // Detect tier gates (unlock levels where sigils are required: 10, 20, 30, etc.)
  function getTierUnlocks(startLevel, endLevel){
    const unlocks = [];
    for(let tier = 10; tier <= endLevel; tier += 10){
      if(tier > startLevel && tier <= endLevel){
        unlocks.push(tier);
      }
    }
    return unlocks;
  }

  // Sum costs from start (inclusive) to end (exclusive), separating affinity from sigil unlocks
  function sumRange(expertName, startLevel, endLevel){
    const table = costs[expertName];
    if(!table) return null;
    const start = Math.max(0, Math.min(startLevel, MAX_LEVEL));
    const end = Math.max(0, Math.min(endLevel, MAX_LEVEL));
    if(end <= start) return null;

    const affinity = {
      amount: 0,
      skills: [ {books:0,xp:0,power:0}, {books:0,xp:0,power:0}, {books:0,xp:0,power:0}, {books:0,xp:0,power:0} ],
      bonuses: { attack: 0, bearPlus: 0, power: 0 }
    };

    const sigilUnlocks = {
      amount: 0,
      list: [],
      bonuses: { attack: 0, bearPlus: 0, power: 0 }
    };

    const tierGates = getTierUnlocks(start, end);

    const levels = Object.keys(table)
      .map(k => parseFloat(k))
      .filter(lvl => !Number.isNaN(lvl) && lvl >= start && lvl < end)
      .sort((a, b) => a - b);

    for(const lvl of levels){
      const entry = table[lvl];
      if(!entry) continue;

      // Separate affinity costs from sigil tier unlocks
      if(entry.sigils > 0){
        // This is a tier unlock (e.g., 10.1, 20.1, etc.)
        sigilUnlocks.amount += entry.sigils;
        sigilUnlocks.list.push({ level: lvl, sigils: entry.sigils, relationship: entry.relationship });
        sigilUnlocks.bonuses.attack += entry.attack;
        sigilUnlocks.bonuses.bearPlus += entry.bearPlus;
        sigilUnlocks.bonuses.power += entry.power;
      } else {
        // Affinity progression
        affinity.amount += entry.affinity;
        affinity.bonuses.attack += entry.attack;
        affinity.bonuses.bearPlus += entry.bearPlus;
        affinity.bonuses.power += entry.power;
        for(let i=0;i<4;i++){
          affinity.skills[i].books += entry.skills[i].books;
          affinity.skills[i].xp += entry.skills[i].xp;
          affinity.skills[i].power += entry.skills[i].power;
        }
      }
    }

    return {
      affinity,
      sigilUnlocks,
      tierGates,
      warning: tierGates.length > 0 ? `Crosses tier unlocks at levels: ${tierGates.join(', ')}` : null
    };
  }

  function fmt(num){
    return Number(num || 0).toLocaleString();
  }

  function renderResults(model, inventory){
    const el = document.getElementById('experts-results');
    if(!el) return;

    if(!model || !model.perExpert || model.perExpert.length === 0){
      el.innerHTML = '<p data-i18n="experts-invalid-range">Select a valid range.</p>';
      return;
    }

    const materialRows = [
      { key: 'affinity', label: 'experts-affinity', total: model.totals.affinity, inventory: inventory.affinity },
      { key: 'sigils', label: 'experts-sigils', total: model.totals.sigils, inventory: inventory.sigils },
      { key: 'books', label: 'experts-books', total: model.totals.books, inventory: inventory.books },
      { key: 'xp', label: 'experts-xp', total: model.totals.xp, inventory: inventory.xp },
      { key: 'power', label: 'experts-power', total: model.totals.power, inventory: 0 }
    ];

    const summary = materialRows.map(row => {
      const remaining = Math.max(0, row.total - (row.inventory || 0));
      const needsIcon = materialIcons[row.key] || materialIcons.default;
      return `
        <div class="material-row">
          <div class="material-label">
            <img src="${needsIcon}" alt="${row.key}" class="material-icon" onerror="this.style.display='none'">
            <span data-i18n="${row.label}">${row.key}</span>
          </div>
          <div class="material-values">
            <span class="material-total"><span data-i18n="total">Total</span>: ${fmt(row.total)}</span>
            ${row.inventory !== undefined ? `<span class="material-inventory">Inv: ${fmt(row.inventory)}</span>` : ''}
            <span class="material-need">Need: ${fmt(remaining)}</span>
          </div>
        </div>
      `;
    }).join('');

    const perExpertCards = model.perExpert.map(entry => {
      const warning = entry.warning ? `<div class="inline-warning">⚠ ${entry.warning}</div>` : '';
      const unlocks = entry.unlocks && entry.unlocks.length > 0 ? `
        <div class="sigil-unlocks-compact">
          ${entry.unlocks.map(u => `<span class="unlock-chip">${u.level.toString().replace('.1','→')} : ${fmt(u.sigils)} Sigils</span>`).join('')}
        </div>
      ` : '';
      return `
        <div class="expert-result-card">
          <div class="expert-result-head">
            <span class="expert-name">${entry.expertName}</span>
            <span class="expert-range">${entry.from} → ${entry.to}</span>
          </div>
          <div class="expert-result-body">
            <span class="chip">${fmt(entry.affinity)} <small data-i18n="experts-affinity">Affinity</small></span>
            <span class="chip">${fmt(entry.sigils)} <small data-i18n="experts-sigils">Sigils</small></span>
            <span class="chip">${fmt(entry.skills.books)} <small data-i18n="experts-books">Books</small></span>
            <span class="chip">${fmt(entry.skills.xp)} <small data-i18n="experts-xp">XP</small></span>
            <span class="chip">${fmt(entry.power)} <small data-i18n="experts-power">Power</small></span>
          </div>
          ${unlocks}
          ${warning}
        </div>
      `;
    }).join('');

    el.innerHTML = `
      <div class="materials-summary">
        ${summary}
      </div>
      <div class="per-expert-results">
        ${perExpertCards}
      </div>
    `;
  }

  function readSelectValue(selectEl){
    if(!selectEl) return null;
    const val = parseFloat(selectEl.value);
    return Number.isNaN(val) ? null : val;
  }

  function collectSelections(){
    const cards = document.querySelectorAll('.expert-card');
    const selections = [];
    cards.forEach(card => {
      const name = card.dataset.expert;
      const fromEl = card.querySelector('.expert-from');
      const toEl = card.querySelector('.expert-to');
      const hint = card.querySelector('.validation-hint');
      const from = readSelectValue(fromEl);
      const to = readSelectValue(toEl);
      const valid = from !== null && to !== null && to >= from && from >= 0 && to <= MAX_LEVEL;
      card.classList.toggle('invalid', !valid);
      if(hint){
        hint.textContent = valid ? '' : 'Set TO ≥ FROM';
      }
      if(valid){
        selections.push({ name, from, to });
      }
    });
    return selections;
  }

  function sumSkills(skillsArr){
    return skillsArr.reduce((acc, s) => {
      acc.books += s.books;
      acc.xp += s.xp;
      acc.power += s.power;
      return acc;
    }, { books: 0, xp: 0, power: 0 });
  }

  function calculateAll(){
    const selections = collectSelections();
    if(selections.length === 0) return { perExpert: [], totals: { affinity: 0, sigils: 0, books: 0, xp: 0, power: 0 } };

    const perExpert = [];
    const totals = { affinity: 0, sigils: 0, books: 0, xp: 0, power: 0 };

    for(const sel of selections){
      const result = sumRange(sel.name, sel.from, sel.to);
      if(!result) continue;
      const skills = sumSkills(result.affinity.skills);
      const powerGain = result.affinity.bonuses.power + result.sigilUnlocks.bonuses.power;
      perExpert.push({
        expertName: sel.name,
        from: sel.from,
        to: sel.to,
        affinity: result.affinity.amount,
        sigils: result.sigilUnlocks.amount,
        skills,
        power: powerGain,
        unlocks: result.sigilUnlocks.list,
        warning: result.warning
      });
      totals.affinity += result.affinity.amount;
      totals.sigils += result.sigilUnlocks.amount;
      totals.books += skills.books;
      totals.xp += skills.xp;
      totals.power += powerGain;
    }

    return { perExpert, totals };
  }

  function buildOptions(){
    const opts = [];
    for(let i=0; i<=MAX_LEVEL; i++){
      opts.push(`<option value="${i}">${i}</option>`);
    }
    return opts.join('');
  }

  function populateExpertCards(){
    const options = buildOptions();
    document.querySelectorAll('.expert-card').forEach(card => {
      const from = card.querySelector('.expert-from');
      const to = card.querySelector('.expert-to');
      if(from) from.innerHTML = options;
      if(to) {
        to.innerHTML = options;
        to.value = '10';
      }
    });
  }

  function getInventory(){
    const ids = {
      affinity: 'inventory-expert-affinity',
      sigils: 'inventory-expert-sigils',
      books: 'inventory-expert-books',
      xp: 'inventory-expert-xp'
    };
    const inv = {};
    Object.entries(ids).forEach(([key, id]) => {
      const el = document.getElementById(id);
      inv[key] = parseNumber(el?.value || 0);
    });
    return inv;
  }

  function handleCalculate(){
    const model = calculateAll();
    const inventory = getInventory();
    renderResults(model, inventory);
  }

  function attachEvents(){
    document.querySelectorAll('.expert-card select').forEach(sel => {
      sel.addEventListener('change', handleCalculate);
    });
    document.querySelectorAll('.expert-inventory input').forEach(inp => {
      inp.addEventListener('input', handleCalculate);
      inp.addEventListener('change', handleCalculate);
    });
  }

  function init(){
    populateExpertCards();
    attachEvents();
    loadCsv().then(handleCalculate);
  }

  document.addEventListener('DOMContentLoaded', init);

  return {
    sumRange,
    handleCalculate
  };
})();

window.ExpertsCalculatorModule = ExpertsCalculatorModule;
