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

    const CELL = 140;
    const PADDING = 40;
    const minX = Math.min(...nodes.map((n) => n.position.x));
    const maxX = Math.max(...nodes.map((n) => n.position.x));
    const minY = Math.min(...nodes.map((n) => n.position.y));
    const maxY = Math.max(...nodes.map((n) => n.position.y));
    const width = (maxX - minX + 1) * CELL + PADDING * 2;
    const height = (maxY - minY + 1) * CELL + PADDING * 2;

    tree.innerHTML = '';
    tree.style.position = 'relative';
    tree.style.overflow = 'auto';
    tree.style.display = 'flex';
    tree.style.justifyContent = 'center';
    tree.style.alignItems = 'center';
    tree.style.minHeight = '620px';

    const wrapper = document.createElement('div');
    wrapper.style.position = 'relative';
    wrapper.style.width = `${width}px`;
    wrapper.style.height = `${height}px`;
    wrapper.style.margin = '0 auto';
    wrapper.style.transformOrigin = 'top left';
    tree.appendChild(wrapper);

    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('width', `${width}`);
    svg.setAttribute('height', `${height}`);
    svg.style.position = 'absolute';
    svg.style.top = '0';
    svg.style.left = '0';
    wrapper.appendChild(svg);

    // connections
    nodes.forEach((node) => {
      node.parents.forEach((pid) => {
        const parent = nodes.find((n) => n.id === pid);
        if (!parent) return;
        const x1 = PADDING + (parent.position.x - minX) * CELL + CELL / 2;
        const y1 = PADDING + (parent.position.y - minY) * CELL + CELL / 2;
        const x2 = PADDING + (node.position.x - minX) * CELL + CELL / 2;
        const y2 = PADDING + (node.position.y - minY) * CELL + CELL / 2;
        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
        line.setAttribute('x1', x1);
        line.setAttribute('y1', y1);
        line.setAttribute('x2', x2);
        line.setAttribute('y2', y2);
        line.setAttribute('stroke', BRANCH_COLORS[node.branch] || '#888');
        line.setAttribute('stroke-width', '4');
        line.setAttribute('stroke-linecap', 'round');
        svg.appendChild(line);
      });
    });

    const baseSize = 104;
    nodes.forEach((node) => {
      const size = node.variant === 'unlock' ? baseSize + 16 : baseSize;
      const btn = document.createElement('button');
      btn.className = 'tree-node';
      btn.style.position = 'absolute';
      btn.style.left = `${PADDING + (node.position.x - minX) * CELL - size / 2 + CELL / 2}px`;
      btn.style.top = `${PADDING + (node.position.y - minY) * CELL - size / 2 + CELL / 2}px`;
      btn.style.width = `${size}px`;
      btn.style.height = `${size}px`;
      btn.style.border = `3px solid ${BRANCH_COLORS[node.branch] || '#fff'}`;
      btn.style.borderRadius = '14px';
      btn.style.background = 'rgba(255,255,255,0.06)';
      btn.style.backdropFilter = 'blur(4px)';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.flexDirection = 'column';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.padding = '8px 6px';
      btn.style.transition = 'transform 120ms ease, box-shadow 120ms ease';
      btn.setAttribute('data-id', node.id);
      const range = selections[node.id];
      const levelText = range ? `${range.start}→${range.end}` : `0→${node.maxLevel}`;
      btn.innerHTML = `
        <img src="${node.icon}" alt="${node.name}" style="max-width:72px;max-height:72px;object-fit:contain;">
        <span style="font-size:12px;color:var(--text,#e8f4f8);display:block;margin-top:4px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:100%;">${node.name}</span>
        <span style="font-size:11px;color:var(--muted-text,#a8c5d4);">${levelText}</span>
      `;
      btn.addEventListener('click', () => selectNode(node.id));
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.04)';
        btn.style.boxShadow = `0 8px 18px rgba(0,0,0,0.35)`;
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
        btn.style.boxShadow = 'none';
      });
      wrapper.appendChild(btn);
    });

    // scale down if overflowing
    requestAnimationFrame(() => {
      const available = tree.clientWidth - 48;
      const target = available * 0.8;
      const rawScale = target > 0 ? target / width : 1;
      const scale = Math.min(1.1, Math.max(0.85, rawScale));
      wrapper.style.transform = `scale(${scale})`;
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
