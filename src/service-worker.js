const CACHE_VERSION = 'v4';
const CACHE_NAME = `wos-cache-${CACHE_VERSION}`;
const PRECACHE_URLS = [
  './index.html',
  './charms.html',
  './chiefGear.html',
  './fireCrystals.html',
  './style/style.min.css',
  './Scripts/min/calculator.min.js',
  './Scripts/min/chief-gear-calculator.min.js',
  './Scripts/min/fire-crystals-calculator.min.js',
  './Scripts/min/profiles.min.js',
  './assets/wos-forge-banner.png'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys
        .filter(key => key.startsWith('wos-cache-') && key !== CACHE_NAME)
        .map(key => caches.delete(key))
    )).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(CACHE_NAME).then(cache => 
      cache.match(event.request).then(response => {
        if(response) return response;
        return fetch(event.request).then(networkResponse => {
          if(networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic'){
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        });
      })
    ).catch(() => fetch(event.request))
  );
});
