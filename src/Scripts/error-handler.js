(function(){
  'use strict';

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
      container.style.background = getComputedStyle(document.documentElement).getPropertyValue('--panel') || '#1f1d32';
      container.style.color = getComputedStyle(document.documentElement).getPropertyValue('--text') || '#e9eef8';
      container.style.border = `1px solid ${getComputedStyle(document.documentElement).getPropertyValue('--muted') || '#2f2b45'}`;

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

  function onCsvLoadFailed(e){
    const d = e && e.detail ? e.detail : {};
    const calc = d.calculator || 'Data';
    const url = d.url || '';
    const msg = d.message || d.error || 'Failed to load CSV.';
    const title = `⚠️ ${calc} Update Unavailable`;
    const body = url ? `${msg} (${url})` : msg;
    notify('warning', title, body);
  }

  if (typeof window !== 'undefined'){
    window.ErrorHandler = { notify };
    if (typeof document !== 'undefined'){
      document.addEventListener('csv-load-failed', onCsvLoadFailed);
    }
  }
})();
