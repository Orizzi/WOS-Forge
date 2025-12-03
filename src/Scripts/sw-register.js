(function(){
  'use strict';

  const SW_VERSION = 'v6';
  const SW_FILE = 'service-worker.js';
  const LOCAL_HOSTS = new Set(['localhost', '127.0.0.1']);

  if(!('serviceWorker' in navigator)) return;
  if(LOCAL_HOSTS.has(location.hostname)) return;

  const swUrl = `${SW_FILE}?v=${SW_VERSION}`;

  const register = () => {
    navigator.serviceWorker.register(swUrl).catch(err => {
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
})();
