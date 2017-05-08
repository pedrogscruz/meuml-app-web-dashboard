var CACHE_NAME = '1.0.0_2017-05-04_12-00';

var urlsToCache = [
  '/',
  '/?utm_source=homescreen',
  '/index.html',
  '/index.html?utm_source=homescreen',
  '/assets/images/icons/favicon.ico',
  '/assets/meuml-app-web-1.0.0.js',
  '/assets/meuml-app-web-1.0.0.css',
  '/assets/images/icons/android-chrome-192x192.png',
  '/assets/images/icons/android-chrome-512x512.png',
];

self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function(cache) {
      return cache.addAll(urlsToCache).then(function() {
        self.skipWaiting();
      });
    })
  );
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());

  // Limpa o cache antigo
  event.waitUntil(
    caches.keys().then(function(keyList) {
      return Promise.all(keyList.map(function(key) {
        if (key != CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request).then(function(response) {
      return response || fetch(event.request);
    })
  );
});
