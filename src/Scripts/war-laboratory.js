
(function () {
  'use strict';

  const BRANCH_COLORS = {
    marksman: '#f68b1e',
    infantry: '#3ec66f',
    lancer: '#4ea8ff'
  };
  const BRANCH_LABELS = {
    marksman: 'Marksman',
    infantry: 'Infantry',
    lancer: 'Lancer'
  };

  let currentBranch = 'marksman';
  const selections = {}; // nodeId -> { start, end }
  let lastSelected = null;

  function mainStatKey(stats) {
    if (!stats) return null;
    const entries = Object.entries(stats);
    if (!entries.length) return null;
    const [k, v] = entries[0];
    return `${k}: ${typeof v === 'number' ? v.toFixed(2) : v}`;
  }

  function formatTime(totalSeconds) {
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes || (!days && !hours)) parts.push(`${minutes}m`);
    return parts.join(' ');
  }

  function branchNodes() {
    return (window.WOSData?.helios?.nodes || []).filter((n) => n.branch === currentBranch);
  }

  function handleNodeClick(nodeId) {
    const node = window.WOSData.helios.nodeMap[nodeId];
    if (!node) return;
    lastSelected = nodeId;
    if (selections[nodeId]) {
      delete selections[nodeId];
    } else {
      selections[nodeId] = { start: 0, end: node.maxLevel };
    }
    renderSelectionPanel();
    renderSelectionList();
    updateSummary();
    renderTree();
  }

  function renderBranchTabs() {
    const tabs = document.querySelectorAll('#branch-tabs .tab');
    tabs.forEach((tab) => {
      const branch = tab.getAttribute('data-branch');
      tab.classList.toggle('is-active', branch === currentBranch);
      tab.setAttribute('aria-selected', branch === currentBranch ? 'true' : 'false');
      tab.onclick = () => {
        if (branch === currentBranch) return;
        currentBranch = branch;
        lastSelected = null;
        renderBranchTabs();
        renderTree();
        renderSelectionPanel();
        renderSelectionList();
        updateSummary();
      };
    });
  }

  function renderTree() {
    const tree = document.getElementById('helios-tree');
    if (!tree || !window.WOSData?.helios) return;
    const nodes = branchNodes();
    if (!nodes.length) return;

    // Tighter vertical spacing to fit on laptop screens.
    const CELL = 90;
    const PADDING = 36;
    const minX = Math.min(...nodes.map((n) => n.position.x));
    const maxX = Math.max(...nodes.map((n) => n.position.x));
    const minY = Math.min(...nodes.map((n) => n.position.y));
    const maxY = Math.max(...nodes.map((n) => n.position.y));
    const width = (maxX - minX + 1) * CELL + PADDING * 2;
    const height = (maxY - minY + 1) * CELL + PADDING * 2;

    tree.innerHTML = '';
    tree.style.position = 'relative';
    tree.style.overflowX = 'auto';
    tree.style.overflowY = 'auto';
    tree.style.display = 'flex';
    tree.style.justifyContent = 'center';
    tree.style.alignItems = 'center';
    tree.style.minHeight = '55vh';

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

    const baseSize = 66;
    nodes.forEach((node) => {
      const size = node.variant === 'unlock' ? baseSize + 18 : baseSize;
      const iconSrc = node.icon || 'assets/app-icon.png';
      const btn = document.createElement('button');
      btn.className = 'tree-node';
      btn.style.position = 'absolute';
      btn.style.left = `${PADDING + (node.position.x - minX) * CELL - size / 2 + CELL / 2}px`;
      btn.style.top = `${PADDING + (node.position.y - minY) * CELL - size / 2 + CELL / 2}px`;
      btn.style.width = `${size}px`;
      btn.style.height = `${size}px`;
      btn.style.border = `3px solid ${BRANCH_COLORS[node.branch] || '#fff'}`;
      btn.style.borderRadius = '14px';
      btn.style.background = 'rgba(255,255,255,0.08)';
      btn.style.backdropFilter = 'blur(4px)';
      btn.style.cursor = 'pointer';
      btn.style.display = 'flex';
      btn.style.flexDirection = 'column';
      btn.style.alignItems = 'center';
      btn.style.justifyContent = 'center';
      btn.style.overflow = 'hidden';
      btn.style.padding = '6px 4px';
      btn.style.transition = 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease';
      btn.setAttribute('data-id', node.id);
      const range = selections[node.id];
      const levelText = range ? `${range.start} → ${range.end} / ${node.maxLevel}` : `0 → ${node.maxLevel}`;
      btn.innerHTML = `
        <div style="width:100%;height:100%;display:flex;flex-direction:column;gap:4px;align-items:center;justify-content:flex-start;overflow:hidden;">
          <div style="flex:1;width:100%;display:flex;align-items:center;justify-content:center;aspect-ratio:1/1;overflow:hidden;border-radius:12px;padding:4px;">
            <img src="${iconSrc}" alt="${node.name}" onerror="this.src='../assets/app-icon.png';" style="width:100%;height:100%;object-fit:contain;display:block;">
          </div>
          <div style="width:100%;text-align:center;font-size:8px;color:var(--text,#e8f4f8);line-height:1.2;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${node.name}</div>
          <div style="width:100%;text-align:center;font-size:8px;color:var(--muted-text,#a8c5d4);line-height:1.2;">${levelText}</div>
        </div>
      `;
      const isSelected = !!selections[node.id];
      if (isSelected) {
        btn.style.boxShadow = `0 0 0 3px ${BRANCH_COLORS[node.branch]}55, 0 10px 22px rgba(0,0,0,0.45)`;
      }
      const statHint = mainStatKey((node.levels && node.levels[0] && node.levels[0].stats) || {}) || 'Stat';
      btn.title = `${node.name} (${BRANCH_LABELS[node.branch]})\nMax level: ${node.maxLevel}\n${statHint}`;
      btn.addEventListener('click', () => handleNodeClick(node.id));
      btn.addEventListener('mouseenter', () => {
        btn.style.transform = 'scale(1.04)';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'scale(1)';
      });
      wrapper.appendChild(btn);
    });

    // scale down if overflowing
    requestAnimationFrame(() => {
      const available = tree.clientWidth - 48;
      const target = available * 0.8;
      const rawScale = target > 0 ? target / width : 1;
      const scale = Math.min(1.05, Math.max(0.65, rawScale));
      wrapper.style.transform = `scale(${scale})`;
    });
  }

  function renderSelectionPanel() {
    const panel = document.getElementById('selection-panel');
    if (!panel) return;
    if (!lastSelected) {
      panel.innerHTML = '<p>Select a node in the tree to configure its level range.</p>';
      return;
    }
    const node = window.WOSData.helios.nodeMap[lastSelected];
    if (!node) return;
    panel.innerHTML = `
      <div class="card" style="margin:0;">
        <div style="display:flex;gap:12px;align-items:center;">
          <img src="${node.icon}" alt="${node.name}" style="width:56px;height:56px;object-fit:contain;">
          <div>
            <h3 style="margin:0;">${node.name}</h3>
            <p style="margin:2px 0;">Branch: <span style="color:${BRANCH_COLORS[node.branch]};text-transform:capitalize;">${node.branch}</span></p>
            <p style="margin:2px 0;">Max level: ${node.maxLevel}</p>
          </div>
        </div>
      </div>
    `;
  }

  function renderSelectionList() {
    const list = document.getElementById('selection-list');
    if (!list) return;
    list.innerHTML = '';
    const entries = Object.entries(selections);
    if (!entries.length) {
      const empty = document.createElement('li');
      empty.className = 'gift-code-log__item';
      empty.textContent = 'No active selections. Pick nodes in the tree to begin.';
      list.appendChild(empty);
      return;
    }
    entries
      .map(([id, range]) => ({ id, range, node: window.WOSData.helios.nodeMap[id] }))
      .filter((e) => e.node)
      .sort((a, b) => a.node.branch.localeCompare(b.node.branch) || a.node.name.localeCompare(b.node.name))
      .forEach(({ id, range, node }) => {
        const summary = window.WOSData.helios.sumRange(id, range.start, range.end) || null;
        const statPreview = summary ? mainStatKey(summary.stats) : null;
        const li = document.createElement('li');
        li.className = 'gift-code-log__item';
        li.style.display = 'grid';
        li.style.gridTemplateColumns = 'auto 1fr auto';
        li.style.alignItems = 'center';
        li.style.gap = '8px';
        li.innerHTML = `
          <img src="${node.icon}" alt="${node.name}" style="width:42px;height:42px;object-fit:contain;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <strong>${node.name}</strong>
              <span style="color:${BRANCH_COLORS[node.branch]};text-transform:capitalize;">${node.branch}</span>
            </div>
            <div style="display:flex;gap:6px;align-items:center;margin-top:6px;">
              <label style="display:flex;flex-direction:column;font-size:12px;gap:2px;">
                Start
                <input type="number" min="0" max="${node.maxLevel - 1}" value="${range.start}" data-role="start" data-id="${id}" style="width:80px;">
              </label>
              <label style="display:flex;flex-direction:column;font-size:12px;gap:2px;">
                End
                <input type="number" min="1" max="${node.maxLevel}" value="${range.end}" data-role="end" data-id="${id}" style="width:80px;">
              </label>
              <span style="font-size:12px;color:var(--muted-text);">/ ${node.maxLevel}</span>
            </div>
            ${
              summary
                ? `<div style="margin-top:6px;font-size:12px;color:var(--muted-text);">
                    FC: ${summary.fc.toLocaleString()} • Time: ${formatTime(summary.timeSeconds)}${statPreview ? ` • ${statPreview}` : ''}
                  </div>`
                : ''
            }
          </div>
          <button class="secondary" data-remove="${id}" aria-label="Remove selection">Remove</button>
        `;
        list.appendChild(li);
      });

    list.querySelectorAll('input[type="number"]').forEach((input) => {
      input.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const node = window.WOSData.helios.nodeMap[id];
        if (!node) return;
        const role = e.target.getAttribute('data-role');
        const startVal = role === 'start' ? parseInt(e.target.value || '0', 10) : selections[id].start;
        const endVal = role === 'end' ? parseInt(e.target.value || `${node.maxLevel}`, 10) : selections[id].end;
        const start = Math.max(0, Math.min(node.maxLevel - 1, startVal));
        const end = Math.max(start + 1, Math.min(node.maxLevel, endVal));
        selections[id] = { start, end };
        renderSelectionList();
        updateSummary();
        renderTree();
      });
    });

    list.querySelectorAll('button[data-remove]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const id = btn.getAttribute('data-remove');
        delete selections[id];
        if (lastSelected === id) lastSelected = null;
        renderSelectionPanel();
        renderSelectionList();
        updateSummary();
        renderTree();
      });
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
      const [branch] = id.split('-');
      const slotId = id.replace(`${branch}-`, '');
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

  function renderSummaryEmpty() {
    const summary = document.getElementById('summary-content');
    if (!summary) return;
    summary.querySelector('.gift-code-status-text').textContent = 'Select a node and set a level range to see totals here.';
    document.getElementById('costs-list').innerHTML = '';
    document.getElementById('stats-list').innerHTML = '';
  }

  function renderStats(stats) {
    if (!stats) return '';
    const groups = { Infantry: [], Lancer: [], Marksman: [], Other: [] };
    Object.entries(stats).forEach(([k, v]) => {
      const target = k.toLowerCase().includes('infantry')
        ? 'Infantry'
        : k.toLowerCase().includes('lancer')
        ? 'Lancer'
        : k.toLowerCase().includes('marksman')
        ? 'Marksman'
        : 'Other';
      groups[target].push(`${k}: ${v.toFixed(2)}`);
    });
    return Object.entries(groups)
      .filter(([, arr]) => arr.length)
      .map(([label, arr]) => `<li class="gift-code-log__item"><strong>${label}</strong> ${arr.join(' ? ')}</li>`)
      .join('');
  }

  function updateSummary() {
    const summary = document.getElementById('summary-content');
    const costsList = document.getElementById('costs-list');
    const statsList = document.getElementById('stats-list');
    if (!summary || !costsList || !statsList) return;
    const hasSelections = Object.keys(selections).length > 0;
    if (!hasSelections) {
      renderSummaryEmpty();
      return;
    }
    const totals = accumulateTotals();
    summary.querySelector('.gift-code-status-text').textContent = `Aggregated totals for ${Object.keys(selections).length} selection(s).`;
    costsList.innerHTML = `
      <li class="gift-code-log__item">Fire Crystals: ${totals.fc.toLocaleString()}</li>
      <li class="gift-code-log__item">Meat: ${totals.meat.toLocaleString()}</li>
      <li class="gift-code-log__item">Wood: ${totals.wood.toLocaleString()}</li>
      <li class="gift-code-log__item">Coal: ${totals.coal.toLocaleString()}</li>
      <li class="gift-code-log__item">Iron: ${totals.iron.toLocaleString()}</li>
      <li class="gift-code-log__item">Steel: ${totals.steel.toLocaleString()}</li>
      <li class="gift-code-log__item">Time: ${formatTime(totals.timeSeconds)}</li>
    `;
    const statsMarkup = renderStats(totals.stats);
    statsList.innerHTML = `
      <li class="gift-code-log__item">Power: ${totals.power.toLocaleString()}</li>
      <li class="gift-code-log__item">SVS Points: ${totals.svsPoints.toLocaleString()}</li>
      ${statsMarkup || '<li class="gift-code-log__item">No stat gains</li>'}
    `;
  }

  function wireReset() {
    const resetBtn = document.getElementById('reset-selections');
    if (!resetBtn) return;
    resetBtn.addEventListener('click', () => {
      Object.keys(selections).forEach((k) => delete selections[k]);
      currentBranch = 'marksman';
      lastSelected = null;
      renderBranchTabs();
      renderSelectionPanel();
      renderSelectionList();
      updateSummary();
      renderTree();
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderBranchTabs();
    renderTree();
    renderSelectionPanel();
    renderSelectionList();
    updateSummary();
    wireReset();
  });
})();
