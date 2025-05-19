self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('finance-app').then((cache) => {
      return cache.addAll([
        '/',
        '/dashboard.html',
        '/style.css',
        '/script.js',
        '/static/icon-192.png'
      ]);
    })
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => {
      return res || fetch(e.request);
    })
  );
});
