self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('wos-cache-v1').then(cache => {
      return cache.addAll([
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
      ]);
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
