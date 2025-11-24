
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
  const inventory = { fc: 0, meat: 0, wood: 0, coal: 0, iron: 0, steel: 0, speedups: 0, reduction: 0 };
  let lastSelected = null;
  let editorEl = null;
  let editorNodeId = null;
  let editorOutsideHandler = null;
  const LOCAL_STATE_KEY = 'wos-war-lab-last-state';

  function mainStatKey(stats) {
    if (!stats) return null;
    const entries = Object.entries(stats);
    if (!entries.length) return null;
    const [k, v] = entries[0];
    return `${k}: ${typeof v === 'number' ? v.toFixed(2) : v}`;
  }

  function autoSaveProfileSelections() {
    if (window.ProfilesModule && typeof window.ProfilesModule.autoSaveCurrentProfile === 'function') {
      try { window.ProfilesModule.autoSaveCurrentProfile(); } catch (e) { /* silent */ }
    }
    persistLocalState();
  }

  function persistLocalState() {
    try {
      const payload = captureProfileState();
      localStorage.setItem(LOCAL_STATE_KEY, JSON.stringify(payload));
    } catch (e) {
      // ignore
    }
  }

  function restoreLocalState() {
    try {
      const raw = localStorage.getItem(LOCAL_STATE_KEY);
      if (!raw) return;
      const state = JSON.parse(raw);
      applyProfileState(state);
    } catch (e) {
      // ignore
    }
  }

  function captureProfileState() {
    return {
      selections: { ...selections },
      inventory: { ...inventory }
    };
  }

  function applyProfileState(state) {
    if (!state) return;
    Object.keys(selections).forEach((k) => delete selections[k]);
    Object.assign(selections, state.selections || {});
    Object.assign(inventory, state.inventory || {});
    // Repaint UI with inventory values
    const invIds = {
      fc: 'inventory-fc',
      meat: 'inventory-meat',
      wood: 'inventory-wood',
      coal: 'inventory-coal',
      iron: 'inventory-iron',
      steel: 'inventory-steel',
      speedups: 'inventory-speedups',
      reduction: 'inventory-reduction'
    };
    Object.entries(invIds).forEach(([key, id]) => {
      const el = document.getElementById(id);
      if (el) el.value = state.inventory && state.inventory[key] != null ? state.inventory[key] : 0;
    });
    renderTree();
    renderSelectionList();
    updateSummary();
    persistLocalState();
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
      selections[nodeId] = { start: 0, end: 0 };
    }
    renderSelectionPanel();
    renderSelectionList();
    updateSummary();
    renderTree();
    autoSaveProfileSelections();
  }

  function showNodeEditor(btn, node) {
    if (!btn || !node) return;
    hideEditor();
    editorNodeId = node.id;
    const portal = document.createElement('div');
    portal.className = 'helios-editor-portal';
    portal.style.position = 'absolute';
    portal.style.inset = '0';
    portal.style.zIndex = '3000';
    portal.style.pointerEvents = 'none';

    editorEl = document.createElement('div');
    editorEl.className = 'helios-editor-pop';
    editorEl.style.position = 'absolute';
    editorEl.style.zIndex = '3100';
    editorEl.style.background = 'rgba(15,31,53,0.95)';
    editorEl.style.border = '1px solid var(--border, #0af)';
    editorEl.style.borderRadius = '8px';
    editorEl.style.boxShadow = '0 8px 24px rgba(0,0,0,0.55)';
    editorEl.style.padding = '8px';
    editorEl.style.display = 'flex';
    editorEl.style.gap = '8px';
    editorEl.style.alignItems = 'center';
    editorEl.style.pointerEvents = 'auto';

    const current = selections[node.id] || { start: 0, end: 0 };
    const fromSelect = document.createElement('select');
    const toSelect = document.createElement('select');
    const buildOptions = (select, start, max, selectedVal) => {
      select.innerHTML = '';
      for (let i = start; i <= max; i++) {
        const opt = document.createElement('option');
        opt.value = String(i);
        opt.textContent = String(i);
        if (i === selectedVal) opt.selected = true;
        select.appendChild(opt);
      }
    };
    buildOptions(fromSelect, 0, node.maxLevel, current.start);
    buildOptions(toSelect, current.start, node.maxLevel, current.end);
    const apply = () => {
      const startRaw = parseInt(fromSelect.value, 10);
      const endRaw = parseInt(toSelect.value, 10);
      const safeFrom = Math.max(0, Math.min(isNaN(startRaw) ? 0 : startRaw, node.maxLevel));
      const safeTo = Math.max(safeFrom, Math.min(isNaN(endRaw) ? safeFrom : endRaw, node.maxLevel));
      selections[node.id] = { start: safeFrom, end: safeTo };
      renderSelectionList();
      updateSummary();
      renderTree();
      autoSaveProfileSelections();
    };
    fromSelect.addEventListener('change', () => {
      const start = parseInt(fromSelect.value, 10);
      const end = parseInt(toSelect.value, 10);
      const safeFrom = Math.max(0, Math.min(isNaN(start) ? 0 : start, node.maxLevel));
      const safeEnd = Math.max(safeFrom, Math.min(isNaN(end) ? safeFrom : end, node.maxLevel));
      buildOptions(toSelect, safeFrom, node.maxLevel, safeEnd);
      selections[node.id] = { start: safeFrom, end: safeEnd };
      renderSelectionList();
      updateSummary();
      renderTree();
      autoSaveProfileSelections();
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

    portal.appendChild(editorEl);
    (document.body || document.documentElement).appendChild(portal);
    const rect = btn.getBoundingClientRect();
    const scrollX = window.pageXOffset || document.documentElement.scrollLeft;
    const scrollY = window.pageYOffset || document.documentElement.scrollTop;
    editorEl.style.left = `${rect.left + scrollX}px`;
    editorEl.style.top = `${rect.bottom + scrollY + 6}px`;

    const outsideClick = (e) => {
      if (editorEl && !editorEl.contains(e.target)) {
        hideEditor();
      }
    };
    editorOutsideHandler = outsideClick;
    setTimeout(() => document.addEventListener('click', outsideClick, true), 0);
  }

  function hideEditor() {
    if (editorOutsideHandler) {
      document.removeEventListener('click', editorOutsideHandler, true);
      editorOutsideHandler = null;
    }
    if (editorEl) {
      const portal = editorEl.parentElement;
      editorEl.remove();
      if (portal && portal.parentElement === document.body) {
        portal.remove();
      }
    }
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
    tree.style.gap = isDesktop ? '18px' : '0';
    tree.style.justifyContent = 'center';
    tree.style.alignItems = 'start';
    tree.style.minHeight = '50vh';

    branchesToRender.forEach((branch) => {
      const nodes = (window.WOSData?.helios?.nodes || []).filter((n) => n.branch === branch);
      if (!nodes.length) return;

      const CELL = 56;
      const PADDING = 16;
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

      const baseSize = 64;
      const btnMap = {};
      nodes.forEach((node) => {
        const size = node.variant === 'unlock' ? baseSize + 10 : baseSize;
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
        const defaultText = '0 -> 0';
        const levelText = range ? `${range.start} -> ${range.end}` : defaultText;
        btn.innerHTML = `
          <div style="position:relative;width:100%;height:100%;aspect-ratio:1/1;display:flex;align-items:center;justify-content:center;overflow:hidden;border-radius:inherit;">
            <div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;">
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
        const enlarged = rawScale * 1.2;
        const scale = Math.min(1.25, Math.max(0.9, enlarged));
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
    panel.innerHTML = `<p>Ranges are edited directly on each node. Click a node to set From -> To.</p>`;
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
              Range: ${range.start} -> ${range.end} / ${node.maxLevel}${statPreview ? ` • ${statPreview}` : ''}${summary ? ` • Time: ${formatTime(summary.timeSeconds)}` : ''}
            </div>
          </div>
        `;
        list.appendChild(li);
      });
  }

  function renderRecap(totals) {
    const table = document.getElementById('helios-slot-table');
    const slotHead = table?.querySelector('thead');
    const tbody = document.getElementById('war-lab-slot-body');
    const tfoot = document.getElementById('war-lab-slot-foot');
    if (slotHead) {
      slotHead.innerHTML = `
        <tr>
          <th>Icon</th>
          <th>Name</th>
          <th>From</th>
          <th>To</th>
          <th>Meat</th>
          <th>Wood</th>
          <th>Coal</th>
          <th>Iron</th>
          <th>Steel</th>
          <th>FCs</th>
          <th>Power</th>
          <th>SvS</th>
        </tr>
      `;
    }
    if (!tbody || !tfoot) return;
    tbody.innerHTML = '';
    tfoot.innerHTML = '';
    const entries = Object.entries(selections);
    if (!entries.length) {
      tbody.innerHTML = '<tr><td colspan="12">No slots selected yet.</td></tr>';
      return;
    }
    const rows = entries
      .map(([id, range]) => ({ id, range, node: window.WOSData.helios.nodeMap[id] }))
      .filter((e) => e.node)
      .filter((e) => e.range.start < e.range.end)
      .sort((a, b) => a.node.branch.localeCompare(b.node.branch) || a.node.name.localeCompare(b.node.name));
    if (!rows.length) {
      tbody.innerHTML = '<tr><td colspan="12">No slots selected yet.</td></tr>';
      return;
    }
    const body = rows
      .map(({ id, range, node }) => {
        const summary = window.WOSData.helios.sumRange(id, range.start, range.end) || {};
        return `
          <tr>
            <td class="col-icon"><img src="${node.icon}" alt="${node.name}" style="width:34px;height:34px;object-fit:contain;"></td>
            <td class="col-name">${node.name}</td>
            <td>${range.start}</td>
            <td>${range.end}</td>
            <td>${(summary.meat || 0).toLocaleString()}</td>
            <td>${(summary.wood || 0).toLocaleString()}</td>
            <td>${(summary.coal || 0).toLocaleString()}</td>
            <td>${(summary.iron || 0).toLocaleString()}</td>
            <td>${(summary.steel || 0).toLocaleString()}</td>
            <td>${(summary.fc || 0).toLocaleString()}</td>
            <td>${(summary.power || 0).toLocaleString()}</td>
            <td>${(summary.svsPoints || 0).toLocaleString()}</td>
          </tr>
        `;
      })
      .join('');
    tbody.innerHTML = body;
    if (totals) {
      tfoot.innerHTML = `
        <tr>
          <td colspan="2"><strong>Totals</strong></td>
          <td></td>
          <td></td>
          <td>${(totals.meat || 0).toLocaleString()}</td>
          <td>${(totals.wood || 0).toLocaleString()}</td>
          <td>${(totals.coal || 0).toLocaleString()}</td>
          <td>${(totals.iron || 0).toLocaleString()}</td>
          <td>${(totals.steel || 0).toLocaleString()}</td>
          <td>${(totals.fc || 0).toLocaleString()}</td>
          <td>${(totals.power || 0).toLocaleString()}</td>
          <td>${(totals.svsPoints || 0).toLocaleString()}</td>
        </tr>
      `;
    }
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
    const branchStats = {
      marksman: {},
      infantry: {},
      lancer: {}
    };
    for (const [id, range] of Object.entries(selections)) {
      const [branch] = id.split('-');
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
        branchStats[branch][k] = (branchStats[branch][k] || 0) + v;
      }
    }
    return { totals, branchStats };
  }

  function renderStatRecap(branchStats) {
    const grid = document.getElementById('stat-recap-grid');
    if (!grid) return;
    grid.innerHTML = '';
    const branches = ['marksman', 'infantry', 'lancer'];
    const formatStat = (label, value) => {
      const hasPercent = label.includes('%');
      const cleanLabel = label.replace('%', '').trim();
      const displayVal = hasPercent ? `${value.toFixed(2)}%` : value.toFixed(2);
      return `<strong>${cleanLabel}</strong>: +${displayVal}`;
    };
    branches.forEach((branch) => {
      const stats = branchStats?.[branch] || {};
      const entries = Object.entries(stats).filter(([, v]) => v);
      const list =
        entries.length === 0
          ? '<li class="muted">No stats selected.</li>'
          : entries.map(([k, v]) => `<li>${formatStat(k, v)}</li>`).join('');
      const col = document.createElement('div');
      col.className = 'stat-col';
      col.innerHTML = `
        <h4 style="margin:0 0 6px;color:${BRANCH_COLORS[branch]};">${BRANCH_LABELS[branch]}</h4>
        <ul class="stat-list">${list}</ul>
      `;
      grid.appendChild(col);
    });
  }

  function renderSummaryEmpty() {
    const summary = document.getElementById('summary-content');
    if (!summary) return;
    summary.querySelector('.gift-code-status-text').textContent = 'Select a node and set a level range to see totals here.';
    const costs = document.getElementById('costs-cards');
    if (costs) costs.innerHTML = '';
    const tbody = document.getElementById('war-lab-slot-body');
    const tfoot = document.getElementById('war-lab-slot-foot');
    if (tbody) tbody.innerHTML = '';
    if (tfoot) tfoot.innerHTML = '';
    const powerPill = document.getElementById('power-pill');
    const svsPill = document.getElementById('svs-pill');
    if (powerPill) powerPill.textContent = 'Total Power: 0';
    if (svsPill) svsPill.textContent = 'Total SvS Points: 0';
    renderStatRecap(null);
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
      .map(([label, arr]) => `<li class="gift-code-log__item"><strong>${label}</strong> ${arr.join(' -> ')}</li>`)
      .join('');
  }

  function updateSummary() {
    const summary = document.getElementById('summary-content');
    const costsCards = document.getElementById('costs-cards');
    if (!summary || !costsCards) return;
    const hasSelections = Object.keys(selections).length > 0;
    if (!hasSelections) {
      renderSummaryEmpty();
      return;
    }
    const { totals, branchStats } = accumulateTotals();
    const owned = inventory;
    summary.querySelector('.gift-code-status-text').textContent = `Aggregated totals for ${Object.keys(selections).length} selection(s).`;
    const rows = [
      { label: 'FCs', key: 'fc', icon: 'assets/resources/base/fire-crystal-shards.png' },
      { label: 'Meat', key: 'meat', icon: 'assets/resources/base/meat.png' },
      { label: 'Wood', key: 'wood', icon: 'assets/resources/base/wood.png' },
      { label: 'Coal', key: 'coal', icon: 'assets/resources/base/coal.png' },
      { label: 'Iron', key: 'iron', icon: 'assets/resources/base/iron.png' },
      { label: 'Steel', key: 'steel', icon: 'assets/resources/base/steel.png' }
    ];
    const resourceCards = rows
      .map((r) => {
        const req = totals[r.key] || 0;
        const have = owned[r.key] || 0;
        const diff = have - req;
        const missing = diff < 0 ? Math.abs(diff) : diff;
        const gapClass = diff < 0 ? 'gap-line deficit' : 'gap-line surplus';
        const gapText = diff < 0 ? `⚠ need ${missing.toLocaleString()} more` : `left ${missing.toLocaleString()}`;
        return `
          <div class="result-card">
            <div class="label-with-icon" style="gap:8px;">
              <img class="res-icon" src="${r.icon}" alt="${r.label}">
              <strong>${r.label}:</strong>
            </div>
            <div class="result-value">${req.toLocaleString()}</div>
            <div class="${gapClass}">${gapText}</div>
          </div>
        `;
      })
      .join('');

    // Time + speedups handling
    const researchPct =
      (owned.reduction || 0) +
      Object.entries(totals.stats || {})
        .filter(([k]) => k.toLowerCase().includes('research'))
        .reduce((acc, [, v]) => acc + v, 0);
    const factor = 100 / (100 + (researchPct || 0));
    const effectiveSeconds = totals.timeSeconds * factor;
    const speedupDays = Number(owned.speedups || 0);
    const speedupSeconds = speedupDays * 24 * 60 * 60;
    const remainingSeconds = effectiveSeconds - speedupSeconds;
    const stripeClass = remainingSeconds > 0 ? 'gap-line deficit' : 'gap-line surplus';
    const daysVal = Math.abs(remainingSeconds) / (24 * 60 * 60);
    const stripeText =
      remainingSeconds > 0 ? `⚠ need ${daysVal.toFixed(1)} days more` : `left ${daysVal.toFixed(1)} days`;

    const timeCard = `
      <div class="result-card">
        <div><strong>Time (after research):</strong> ${formatTime(effectiveSeconds)}</div>
        <div class="${stripeClass}">${stripeText}</div>
      </div>
    `;

    costsCards.innerHTML = resourceCards + timeCard;

    const powerPill = document.getElementById('power-pill');
    const svsPill = document.getElementById('svs-pill');
    if (powerPill) powerPill.textContent = `Total Power: ${totals.power.toLocaleString()}`;
    if (svsPill) svsPill.textContent = `Total SvS Points: ${totals.svsPoints.toLocaleString()}`;
    renderRecap(totals);
    renderStatRecap(branchStats);
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
      autoSaveProfileSelections();
    });
  }

  function wireInventory() {
    const map = [
      ['inventory-fc', 'fc'],
      ['inventory-meat', 'meat'],
      ['inventory-wood', 'wood'],
      ['inventory-coal', 'coal'],
      ['inventory-iron', 'iron'],
      ['inventory-steel', 'steel'],
      ['inventory-speedups', 'speedups'],
      ['inventory-reduction', 'reduction']
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

  // Expose hooks for unified Profiles module
  window.WarLabProfile = {
    captureState: captureProfileState,
    applyState: applyProfileState
  };

  document.addEventListener('DOMContentLoaded', () => {
    renderBranchTabs();
    renderTree();
    renderSelectionPanel();
    renderSelectionList();
    updateSummary();
    wireReset();
    wireInventory();
    restoreLocalState();
    window.addEventListener('resize', () => {
      renderTree();
    });
  });
})();
