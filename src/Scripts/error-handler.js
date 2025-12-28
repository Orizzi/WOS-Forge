(function(){
  'use strict';

  const csvLoading = new Set();
  let loadingBanner = null;
  let loadingTimeout = null;

  function csvLabel(detail){
    if(detail && detail.calculator) return detail.calculator;
    if(detail && detail.url){
      const parts = String(detail.url).split('/');
      return parts[parts.length - 1] || detail.url;
    }
    return 'Data';
  }

  function palette(type){
    const root = getComputedStyle(document.documentElement);
    const accent = root.getPropertyValue('--accent') || '#00d9ff';
    const success = root.getPropertyValue('--success') || '#00d9ff';
    const danger = root.getPropertyValue('--danger') || '#ff7b7b';
    const muted = root.getPropertyValue('--muted') || '#2f2b45';
    if(type === 'success') return success.trim() || '#00d9ff';
    if(type === 'warning') return danger.trim() || '#ff7b7b';
    if(type === 'error') return danger.trim() || '#ff7b7b';
    if(type === 'muted') return muted.trim() || '#2f2b45';
    return accent.trim() || '#00d9ff';
  }

  function createNotification(type, title, message){
    try{
      const container = document.createElement('div');
      container.setAttribute('role', 'alert');
      container.setAttribute('aria-live', 'polite');
      container.style.position = 'fixed';
      container.style.top = '16px';
      container.style.right = '16px';
      container.style.zIndex = '10000';
      container.style.padding = '12px 14px';
      container.style.borderRadius = '8px';
      container.style.boxShadow = '0 4px 12px rgba(0,0,0,0.25)';
      container.style.display = 'flex';
      container.style.alignItems = 'center';
      container.style.gap = '10px';
      const bg = getComputedStyle(document.documentElement).getPropertyValue('--panel') || '#1f1d32';
      const fg = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#e9eef8';
      const tone = palette(type);
      container.style.background = bg;
      container.style.color = fg;
      container.style.border = `1px solid ${tone}`;
      container.style.boxShadow = `0 4px 14px color-mix(in srgb, ${tone} 30%, rgba(0,0,0,0.3))`;

      const strong = document.createElement('strong');
      strong.textContent = title || 'Notice';
      const span = document.createElement('span');
      span.textContent = message || '';

      const close = document.createElement('button');
      close.setAttribute('aria-label', 'Close notification');
      close.textContent = '×';
      close.style.background = 'transparent';
      close.style.border = 'none';
      close.style.color = 'inherit';
      close.style.cursor = 'pointer';
      close.style.fontSize = '18px';
      close.style.lineHeight = '18px';
      close.style.marginLeft = '8px';
      close.addEventListener('click', () => container.remove());

      container.appendChild(strong);
      container.appendChild(span);
      container.appendChild(close);
      document.body.appendChild(container);

      setTimeout(() => {
        try{ container.remove(); }catch(_e){}
      }, 5000);
    }catch(e){
      try{ alert(title + (message ? ('\n' + message) : '')); }catch(_ea){}
    }
  }

  function notify(type, title, message){
    createNotification(type, title, message);
  }

  function renderCsvLoading(){
    if(typeof document === 'undefined') return;
    if(csvLoading.size === 0){
      if(loadingBanner){ loadingBanner.remove(); loadingBanner = null; }
      return;
    }
    const label = Array.from(csvLoading)[0] || 'Data';
    if(!loadingBanner){
      loadingBanner = document.createElement('div');
      loadingBanner.setAttribute('role', 'status');
      loadingBanner.setAttribute('aria-live', 'polite');
      loadingBanner.style.position = 'fixed';
      loadingBanner.style.bottom = '16px';
      loadingBanner.style.left = '16px';
      loadingBanner.style.zIndex = '10000';
      loadingBanner.style.padding = '10px 12px';
      loadingBanner.style.borderRadius = '8px';
      loadingBanner.style.display = 'flex';
      loadingBanner.style.alignItems = 'center';
      loadingBanner.style.gap = '8px';
      loadingBanner.style.background = getComputedStyle(document.documentElement).getPropertyValue('--panel') || '#1f1d32';
      loadingBanner.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#e9eef8';
      loadingBanner.style.border = `1px solid ${palette('info')}`;
      loadingBanner.style.boxShadow = `0 4px 14px color-mix(in srgb, ${palette('info')} 35%, rgba(0,0,0,0.35))`;
      document.body.appendChild(loadingBanner);
    }
    loadingBanner.textContent = `Loading ${label}…`;
  }

  function onCsvLoadStarted(e){
    const d = (e && e.detail) || {};
    const label = csvLabel(d);
    csvLoading.add(label);
    clearTimeout(loadingTimeout);
    renderCsvLoading();
  }

  function onCsvLoadFailed(e){
    const d = e && e.detail ? e.detail : {};
    const calc = csvLabel(d);
    const url = d.url || '';
    const msg = d.message || d.error || 'Failed to load CSV.';
    const title = `⚠️ ${calc} Update Unavailable`;
    const body = url ? `${msg} (${url})` : msg;
    csvLoading.clear();
    renderCsvLoading();
    notify('warning', title, body);
  }

  function onCsvLoadSucceeded(e){
    const d = e && e.detail ? e.detail : {};
    const label = csvLabel(d);
    csvLoading.delete(label);
    clearTimeout(loadingTimeout);
    loadingTimeout = setTimeout(renderCsvLoading, 150);
    const rowInfo = (d.rows || 0) > 0 ? ` (${d.rows} rows)` : '';
    const cacheInfo = d.fromCache ? ' [cached]' : '';
    notify('success', `${label} updated`, `Latest CSV applied${rowInfo}${cacheInfo}`);
  }

  if (typeof window !== 'undefined'){
    window.ErrorHandler = { notify };
    if (typeof document !== 'undefined'){
      document.addEventListener('csv-load-started', onCsvLoadStarted);
      document.addEventListener('csv-load-succeeded', onCsvLoadSucceeded);
      document.addEventListener('csv-load-failed', onCsvLoadFailed);
    }
  }
})();
