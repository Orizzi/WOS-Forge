
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
  const inventory = { fc: 0, meat: 0, wood: 0, coal: 0, iron: 0, steel: 0 };
  let lastSelected = null;
  let editorEl = null;
  let editorNodeId = null;

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
    if (!selections[nodeId]) {
      selections[nodeId] = { start: 0, end: node.maxLevel };
    }
    renderSelectionPanel();
    renderSelectionList();
    updateSummary();
    renderTree();
  }

  function showNodeEditor(btn, node) {
    if (!btn || !node) return;
    if (editorEl && editorEl.parentNode) {
      editorEl.parentNode.removeChild(editorEl);
    }
    editorNodeId = node.id;
    editorEl = document.createElement('div');
    editorEl.className = 'helios-editor-pop';
    editorEl.style.position = 'absolute';
    editorEl.style.zIndex = '3000';
    editorEl.style.background = 'rgba(15,31,53,0.95)';
    editorEl.style.border = '1px solid var(--border, #0af)';
    editorEl.style.borderRadius = '8px';
    editorEl.style.boxShadow = '0 8px 24px rgba(0,0,0,0.55)';
    editorEl.style.padding = '8px';
    editorEl.style.display = 'flex';
    editorEl.style.gap = '8px';
    editorEl.style.alignItems = 'center';
    editorEl.style.pointerEvents = 'auto';

    const current = selections[node.id] || { start: 0, end: node.maxLevel };
    const fromSelect = document.createElement('select');
    const toSelect = document.createElement('select');
    for (let i = 0; i <= node.maxLevel; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = String(i);
      if (i === current.start) opt.selected = true;
      fromSelect.appendChild(opt);
    }
    for (let i = current.start; i <= node.maxLevel; i++) {
      const opt = document.createElement('option');
      opt.value = String(i);
      opt.textContent = String(i);
      if (i === current.end) opt.selected = true;
      toSelect.appendChild(opt);
    }
    const apply = () => {
      const start = parseInt(fromSelect.value, 10);
      let end = parseInt(toSelect.value, 10);
      if (end < start) end = start;
      selections[node.id] = { start, end };
      renderSelectionList();
      updateSummary();
      renderTree();
      hideEditor();
    };
    fromSelect.addEventListener('change', () => {
      const start = parseInt(fromSelect.value, 10);
      toSelect.innerHTML = '';
      for (let i = start; i <= node.maxLevel; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = String(i);
        toSelect.appendChild(opt);
      }
    });
    toSelect.addEventListener('change', apply);

    const labelFrom = document.createElement('label');
    labelFrom.style.fontSize = '11px';
    labelFrom.style.color = 'var(--text,#e8f4f8)';
    labelFrom.textContent = 'From';
    labelFrom.appendChild(fromSelect);

    const labelTo = document.createElement('label');
    labelTo.style.fontSize = '11px';
    labelTo.style.color = 'var(--text,#e8f4f8)';
    labelTo.textContent = 'To';
    labelTo.appendChild(toSelect);

    editorEl.appendChild(labelFrom);
    editorEl.appendChild(labelTo);

    (document.body || document.documentElement).appendChild(editorEl);
    const rect = btn.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    editorEl.style.left = `${rect.left + scrollX}px`;
    editorEl.style.top = `${rect.bottom + scrollY + 6}px`;

    const outsideClick = (e) => {
      if (editorEl && !editorEl.contains(e.target)) {
        hideEditor();
        document.removeEventListener('click', outsideClick, true);
      }
    };
    setTimeout(() => document.addEventListener('click', outsideClick, true), 0);
  }

  function hideEditor() {
    if (editorEl && editorEl.parentNode) editorEl.parentNode.remove();
    editorEl = null;
    editorNodeId = null;
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
    const isDesktop = window.innerWidth >= 1024;
    const branchesToRender = isDesktop ? window.WOSData.helios.branches : [currentBranch];

    tree.innerHTML = '';
    tree.style.position = 'relative';
    tree.style.overflowX = 'auto';
    tree.style.overflowY = 'auto';
    tree.style.display = isDesktop ? 'grid' : 'flex';
    tree.style.gridTemplateColumns = isDesktop ? 'repeat(3, minmax(260px, 1fr))' : '';
    tree.style.gap = isDesktop ? '24px' : '0';
    tree.style.justifyContent = 'center';
    tree.style.alignItems = 'start';
    tree.style.minHeight = '50vh';

    branchesToRender.forEach((branch) => {
      const nodes = (window.WOSData?.helios?.nodes || []).filter((n) => n.branch === branch);
      if (!nodes.length) return;

      const CELL = 55;
      const PADDING = 22;
      const minX = Math.min(...nodes.map((n) => n.position.x));
      const maxX = Math.max(...nodes.map((n) => n.position.x));
      const minY = Math.min(...nodes.map((n) => n.position.y));
      const maxY = Math.max(...nodes.map((n) => n.position.y));
      const width = (maxX - minX + 1) * CELL + PADDING * 2;
      const height = (maxY - minY + 1) * CELL + PADDING * 2;

      const col = document.createElement('div');
      col.style.position = 'relative';
      col.style.padding = '8px';
      col.style.display = 'flex';
      col.style.flexDirection = 'column';
      col.style.alignItems = 'center';
      const label = document.createElement('div');
      label.textContent = BRANCH_LABELS[branch];
      label.style.marginBottom = '8px';
      label.style.fontWeight = '700';
      label.style.color = BRANCH_COLORS[branch];
      col.appendChild(label);

      const wrapper = document.createElement('div');
      wrapper.style.position = 'relative';
      wrapper.style.width = `${width}px`;
      wrapper.style.height = `${height}px`;
      wrapper.style.margin = '0 auto';
      wrapper.style.transformOrigin = 'top left';
      col.appendChild(wrapper);

      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', `${width}`);
      svg.setAttribute('height', `${height}`);
      svg.style.position = 'absolute';
      svg.style.top = '0';
      svg.style.left = '0';
      wrapper.appendChild(svg);

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

      const baseSize = 60;
      const btnMap = {};
      nodes.forEach((node) => {
        const size = node.variant === 'unlock' ? baseSize + 14 : baseSize;
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
        btn.style.justifyContent = 'flex-start';
        btn.style.overflow = 'visible';
        btn.style.padding = '0';
        btn.style.transition = 'transform 120ms ease, box-shadow 120ms ease, border-color 120ms ease';
        btn.setAttribute('data-id', node.id);
        const range = selections[node.id];
        const levelText = range ? `${range.start} → ${range.end}` : `0 → ${node.maxLevel}`;
        btn.innerHTML = `
          <div style="position:relative;width:100%;height:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:inherit;">
            <div style="width:96%;height:96%;display:flex;align-items:center;justify-content:center;">
              <img src="${iconSrc}" alt="${node.name}" onerror="this.src='../assets/app-icon.png';" style="width:100%;height:100%;object-fit:contain;display:block;">
            </div>
            <div style="position:absolute;left:0;right:0;bottom:0;background:rgba(0,0,0,0.55);color:#fff;font-size:10px;line-height:1.1;padding:1px 3px;text-align:center;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">
              ${levelText}
            </div>
          </div>
          `;
        const isSelected = !!selections[node.id];
        if (isSelected) {
          btn.style.boxShadow = `0 0 0 3px ${BRANCH_COLORS[node.branch]}55, 0 10px 22px rgba(0,0,0,0.45)`;
        }
        const statHint = mainStatKey((node.levels && node.levels[0] && node.levels[0].stats) || {}) || 'Stat';
        btn.title = `${node.name} (${BRANCH_LABELS[node.branch]})\nMax level: ${node.maxLevel}\n${statHint}`;
        btn.addEventListener('click', (e) => {
          e.stopPropagation();
          handleNodeClick(node.id);
          showNodeEditor(btn, node);
        });
        btn.addEventListener('mouseenter', () => {
          btn.style.transform = 'scale(1.04)';
        });
        btn.addEventListener('mouseleave', () => {
          btn.style.transform = 'scale(1)';
        });
        wrapper.appendChild(btn);
        btnMap[node.id] = { btn, node };
      });

      requestAnimationFrame(() => {
        const available = (tree.clientWidth / (isDesktop ? 3 : 1)) - 24;
        const target = available * 0.9;
        const rawScale = target > 0 ? target / width : 1;
        const scale = Math.min(1.05, Math.max(0.55, rawScale));
        wrapper.style.transform = `scale(${scale})`;
        if (lastSelected && btnMap[lastSelected]) {
          showNodeEditor(btnMap[lastSelected].btn, btnMap[lastSelected].node);
        }
      });

      tree.appendChild(col);
    });
  }

  function renderSelectionPanel() {
    const panel = document.getElementById('selection-panel');
    if (!panel) return;
    panel.innerHTML = `<p>Ranges are edited directly on each node. Click a node to set From → To.</p>`;
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
        li.style.gridTemplateColumns = 'auto 1fr';
        li.style.alignItems = 'center';
        li.style.gap = '8px';
        li.innerHTML = `
          <img src="${node.icon}" alt="${node.name}" style="width:42px;height:42px;object-fit:contain;">
          <div>
            <div style="display:flex;justify-content:space-between;align-items:center;gap:8px;">
              <strong>${node.name}</strong>
              <span style="color:${BRANCH_COLORS[node.branch]};text-transform:capitalize;">${node.branch}</span>
            </div>
            <div style="margin-top:4px;font-size:12px;color:var(--muted-text);">
              Range: ${range.start} → ${range.end} / ${node.maxLevel}${statPreview ? ` • ${statPreview}` : ''}${summary ? ` • Time: ${formatTime(summary.timeSeconds)}` : ''}
            </div>
          </div>
        `;
        list.appendChild(li);
      });
  }

  function renderRecap() {
    const recap = document.getElementById('recap-list');
    if (!recap) return;
    recap.innerHTML = '';
    const entries = Object.entries(selections);
    if (!entries.length) {
      const empty = document.createElement('li');
      empty.className = 'gift-code-log__item';
      empty.textContent = 'No slots selected yet.';
      recap.appendChild(empty);
      return;
    }
    entries
      .map(([id, range]) => ({ id, range, node: window.WOSData.helios.nodeMap[id] }))
      .filter((e) => e.node)
      .sort((a, b) => a.node.branch.localeCompare(b.node.branch) || a.node.name.localeCompare(b.node.name))
      .forEach(({ id, range, node }) => {
        const summary = window.WOSData.helios.sumRange(id, range.start, range.end) || null;
        const li = document.createElement('li');
        li.className = 'gift-code-log__item';
        li.style.display = 'grid';
        li.style.gridTemplateColumns = 'auto 1fr';
        li.style.alignItems = 'center';
        li.style.gap = '8px';
        li.innerHTML = `
          <img src="${node.icon}" alt="${node.name}" style="width:42px;height:42px;object-fit:contain;">
          <div>
            <div style="display:flex;justify-content:space-between;gap:8px;">
              <strong>${node.name}</strong>
              <span style="color:${BRANCH_COLORS[node.branch]};text-transform:capitalize;">${node.branch}</span>
            </div>
            <div style="font-size:12px;color:var(--muted-text);margin-top:2px;">${range.start} → ${range.end} / ${node.maxLevel}</div>
            ${
              summary
                ? `<div style="font-size:12px;color:var(--muted-text);margin-top:2px;">FC: ${summary.fc.toLocaleString()} • Time: ${formatTime(summary.timeSeconds)}</div>`
                : ''
            }
          </div>
        `;
        recap.appendChild(li);
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
    renderRecap();
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
    const owned = inventory;
    summary.querySelector('.gift-code-status-text').textContent = `Aggregated totals for ${Object.keys(selections).length} selection(s).`;
    const rows = [
      { label: 'Fire Crystal shards', key: 'fc' },
      { label: 'Meat', key: 'meat' },
      { label: 'Wood', key: 'wood' },
      { label: 'Coal', key: 'coal' },
      { label: 'Iron', key: 'iron' },
      { label: 'Steel', key: 'steel' }
    ];
    const iconMap = {
      fc: 'assets/resources/base/fire-crystal-shards.png',
      meat: 'assets/resources/base/meat.png',
      wood: 'assets/resources/base/wood.png',
      coal: 'assets/resources/base/coal.png',
      iron: 'assets/resources/base/iron.png',
      steel: 'assets/resources/base/steel.png'
    };
    costsList.innerHTML = rows
      .map((r) => {
        const req = totals[r.key] || 0;
        const have = owned[r.key] || 0;
        const missing = req - have;
        const status = missing > 0 ? `Missing: ${missing.toLocaleString()}` : `Surplus: ${(have - req).toLocaleString()}`;
        return `<li class="gift-code-log__item label-with-icon"><img class="res-icon" src="${iconMap[r.key] || ''}" alt="${r.label}"> ${r.label}: Required ${req.toLocaleString()} | Owned ${have.toLocaleString()} | ${status}</li>`;
      })
      .concat([`<li class="gift-code-log__item">Time: ${formatTime(totals.timeSeconds)}</li>`])
      .join('');
    const statsMarkup = renderStats(totals.stats);
    statsList.innerHTML = `
      <li class="gift-code-log__item">Power: ${totals.power.toLocaleString()}</li>
      <li class="gift-code-log__item">SVS Points: ${totals.svsPoints.toLocaleString()}</li>
      ${statsMarkup || '<li class="gift-code-log__item">No stat gains</li>'}
    `;
    renderRecap();
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

  function wireInventory() {
    const map = [
      ['inv-fc', 'fc'],
      ['inv-meat', 'meat'],
      ['inv-wood', 'wood'],
      ['inv-coal', 'coal'],
      ['inv-iron', 'iron'],
      ['inv-steel', 'steel']
    ];
    map.forEach(([id, key]) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', () => {
        const val = parseInt(el.value || '0', 10);
        inventory[key] = isNaN(val) ? 0 : val;
        updateSummary();
      });
    });
  }

  document.addEventListener('DOMContentLoaded', () => {
    renderBranchTabs();
    renderTree();
    renderSelectionPanel();
    renderSelectionList();
    updateSummary();
    wireReset();
    wireInventory();
    window.addEventListener('resize', () => {
      renderTree();
    });
  });
})();
