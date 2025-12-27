(function(){
  'use strict';

  const SW_VERSION = 'v8';
  const SW_FILE = 'service-worker.js';
  const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

  if(!('serviceWorker' in navigator)) return;
  if(LOCAL_HOSTS.has(location.hostname)) return;

  const swUrl = `${SW_FILE}?v=${SW_VERSION}`;

  const register = () => {
    navigator.serviceWorker.register(swUrl).then(reg => {
      // Attempt immediate update without hard refresh
      if (reg.update) reg.update();
      // If there is a waiting SW, tell it to skip waiting
      if (reg.waiting) {
        reg.waiting.postMessage({ type: 'SKIP_WAITING' });
      }
      // When an update is found, also ask the new worker to activate
      reg.addEventListener('updatefound', () => {
        const newSW = reg.installing;
        if (!newSW) return;
        newSW.addEventListener('statechange', () => {
          if (newSW.state === 'installed' && navigator.serviceWorker.controller) {
            newSW.postMessage({ type: 'SKIP_WAITING' });
          }
        });
      });
    }).catch(err => {
      console.error('[SW] Failed to register service worker', err);
    });
  };

  const cleanupOldRegistrations = () => {
    return navigator.serviceWorker.getRegistrations().then(regs => {
      regs.forEach(reg => {
        const scriptURL = reg.active && reg.active.scriptURL;
        if(!scriptURL || !scriptURL.endsWith(swUrl)){
          reg.unregister();
        }
      });
    }).catch(err => {
      console.warn('[SW] Unable to enumerate registrations', err);
    });
  };

  window.addEventListener('load', () => {
    cleanupOldRegistrations().finally(register);
  });

  // Reload pages automatically when the controller changes (new SW activates)
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    // Soft reload to pick up latest assets without manual hard refresh
    if (document.visibilityState === 'visible') {
      location.reload();
    }
  });
})();
