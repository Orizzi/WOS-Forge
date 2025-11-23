(function () {
  'use strict';

  const BRANCH_COLORS = {
    marksman: '#f68b1e',
    infantry: '#3ec66f',
    lancer: '#4ea8ff'
  };

  const selections = {};
  let selectedId = null;

  function formatTime(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    return parts.join(' ') || '0m';
  }

  function renderTree() {
    const tree = document.getElementById('helios-tree');
    if (!tree || !window.WOSData?.helios) return;
    const { nodes } = window.WOSData.helios;

    // compute size
    const cell = 96;
    const padding = 32;
    const maxX = Math.max(...nodes.map((n) => n.position.x)) + 1;
    const maxY = Math.max(...nodes.map((n) => n.position.y)) + 1;
    tree.style.position = 'relative';
    tree.style.minHeight = `${maxY * cell + padding * 2}px`;
    tree.style.minWidth = `${maxX * cell + padding * 2}px`;
    tree.style.border = '1px solid var(--border, #28405d)';
    tree.style.borderRadius = '12px';
    tree.style.background = 'linear-gradient(180deg, rgba(15,31,53,0.7), rgba(10,22,40,0.9))';
    tree.style.overflow = 'auto';

    // connectors
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${maxX * cell + padding * 2}`);
    svg.setAttribute('height', `${maxY * cell + padding * 2}`);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    tree.appendChild(svg);

    // draw lines
    nodes.forEach((node) => {
      node.parents.forEach((pid) => {
        const parent = nodes.find((n) => n.id === pid);
        if (!parent) return;
        const x1 = padding + parent.position.x * cell + cell / 2;
        const y1 = padding + parent.position.y * cell + cell / 2;
        const x2 = padding + node.position.x * cell + cell / 2;
        const y2 = padding + node.position.y * cell + cell / 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', BRANCH_COLORS[node.branch] || '#888');
        line.setAttribute('stroke-width', '3');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);
      });
    });

    nodes.forEach((node) => {
      const btn = document.createElement('button');
      btn.className = 'tree-node';
      btn.style.position = 'absolute';
      btn.style.left = `${padding + node.position.x * cell}px`;
      btn.style.top = `${padding + node.position.y * cell}px`;
      btn.style.width = `${cell - 12}px`;
      btn.style.height = `${cell - 12}px`;
      btn.style.border = `2px solid ${BRANCH_COLORS[node.branch] || '#fff'}`;
      btn.style.borderRadius = '12px';
      btn.style.background = 'rgba(255,255,255,0.05)';
      btn.style.backdropFilter = 'blur(4px)';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.padding = '6px';
      btn.style.transition = 'transform 120ms ease, box-shadow 120ms ease';
      btn.setAttribute('data-id', node.id);
      btn.innerHTML = `<img src="${node.icon}" alt="${node.name}" style="max-width:100%;max-height:100%;object-fit:contain;">`;
      btn.addEventListener('click', () => selectNode(node.id));
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.03)';
        btn.style.boxShadow = `0 6px 14px rgba(0,0,0,0.3)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = 'none';
      });
      tree.appendChild(btn);
    });
  }

  function selectNode(id) {
    selectedId = id;
    const panel = document.getElementById('selection-panel');
    const node = window.WOSData?.helios?.nodeMap?.[id];
    if (!panel || !node) return;
    const sel = selections[id] || { start: 0, end: node.maxLevel };
    panel.innerHTML = `
      <div class="card" style="margin:0;">
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${node.icon}" alt="${node.name}" style="width:64px;height:64px;object-fit:contain;">
          <div>
            <h3 style="margin:0;">${node.name}</h3>
            <p style="margin:4px 0;">Branch: <span style="color:${BRANCH_COLORS[node.branch]};text-transform:capitalize;">${node.branch}</span></p>
            <p style="margin:4px 0;">Type: ${node.type}</p>
          </div>
        </div>
        <label class="gift-code-panel" style="margin-top:12px;display:block;">
          Start level
          <input type="number" id="start-level" min="0" max="${node.maxLevel - 1}" value="${sel.start}">
        </label>
        <label class="gift-code-panel" style="margin-top:8px;display:block;">
          End level
          <input type="number" id="end-level" min="1" max="${node.maxLevel}" value="${sel.end}">
        </label>
        <button class="primary" id="save-selection" style="margin-top:10px;">Save selection</button>
      </div>
    `;
    panel.querySelector('#save-selection').addEventListener('click', () => {
      const start = Math.max(0, Math.min(node.maxLevel - 1, parseInt(panel.querySelector('#start-level').value || '0', 10)));
      const end = Math.max(start + 1, Math.min(node.maxLevel, parseInt(panel.querySelector('#end-level').value || `${node.maxLevel}`, 10)));
      selections[id] = { start, end };
      renderSelectionList();
      updateSummary();
    });
  }

  function renderSelectionList() {
    const list = document.getElementById('selection-list');
    if (!list) return;
    list.innerHTML = '';
    Object.entries(selections).forEach(([id, range]) => {
      const node = window.WOSData.helios.nodeMap[id];
      if (!node) return;
      const li = document.createElement('li');
      li.className = 'gift-code-log__item';
      li.textContent = `${node.name}: ${range.start} → ${range.end}`;
      const remove = document.createElement('button');
      remove.textContent = '✕';
      remove.className = 'secondary';
      remove.style.float = 'right';
      remove.onclick = () => {
        delete selections[id];
        renderSelectionList();
        updateSummary();
      };
      li.appendChild(remove);
      list.appendChild(li);
    });
  }

  function accumulateTotals() {
    const totals = {
      fc: 0,
      meat: 0,
      wood: 0,
      coal: 0,
      iron: 0,
      steel: 0,
      timeSeconds: 0,
      power: 0,
      svsPoints: 0,
      stats: {}
    };
    for (const [id, range] of Object.entries(selections)) {
      const sum = window.WOSData.helios.sumRange(id, range.start, range.end);
      if (!sum) continue;
      totals.fc += sum.fc;
      totals.meat += sum.meat;
      totals.wood += sum.wood;
      totals.coal += sum.coal;
      totals.iron += sum.iron;
      totals.steel += sum.steel;
      totals.timeSeconds += sum.timeSeconds;
      totals.power += sum.power;
      totals.svsPoints += sum.svsPoints;
      for (const [k, v] of Object.entries(sum.stats || {})) {
        totals.stats[k] = (totals.stats[k] || 0) + v;
      }
    }
    return totals;
  }

  function updateSummary() {
    const summary = document.getElementById('summary-content');
    const costsList = document.getElementById('costs-list');
    const statsList = document.getElementById('stats-list');
    if (!summary || !costsList || !statsList) return;
    const hasSelections = Object.keys(selections).length > 0;
    if (!hasSelections) {
      summary.querySelector('.gift-code-status-text').textContent = 'Select a node to view totals.';
      costsList.innerHTML = '';
      statsList.innerHTML = '';
      return;
    }
    const totals = accumulateTotals();
    summary.querySelector('.gift-code-status-text').textContent = `Aggregated totals for ${Object.keys(selections).length} node(s).`;
    costsList.innerHTML = `
      <li class="gift-code-log__item">Fire Crystals: ${totals.fc.toLocaleString()}</li>
      <li class="gift-code-log__item">Meat: ${totals.meat.toLocaleString()}</li>
      <li class="gift-code-log__item">Wood: ${totals.wood.toLocaleString()}</li>
      <li class="gift-code-log__item">Coal: ${totals.coal.toLocaleString()}</li>
      <li class="gift-code-log__item">Iron: ${totals.iron.toLocaleString()}</li>
      <li class="gift-code-log__item">Steel: ${totals.steel.toLocaleString()}</li>
      <li class="gift-code-log__item">Time: ${formatTime(totals.timeSeconds)}</li>
    `;
    const statsEntries = Object.entries(totals.stats);
    statsList.innerHTML = `
      <li class="gift-code-log__item">Power: ${totals.power.toLocaleString()}</li>
      <li class="gift-code-log__item">SVS Points: ${totals.svsPoints.toLocaleString()}</li>
      ${statsEntries.length ? statsEntries.map(([k, v]) => `<li class="gift-code-log__item">${k}: ${v.toFixed(2)}</li>`).join('') : '<li class="gift-code-log__item">No stat gains</li>'}
    `;
  }

  function wireReset() {
    const resetBtn = document.getElementById('reset-selections');
    if (!resetBtn) return;
    resetBtn.addEventListener('click', () => {
      Object.keys(selections).forEach((k) => delete selections[k]);
      renderSelectionList();
      updateSummary();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderTree();
    renderSelectionList();
    updateSummary();
    wireReset();
  });
})();
