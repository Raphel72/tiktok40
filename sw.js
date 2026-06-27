// sw.js
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open('tiktok-40-store').then((cache) => cache.addAll([
      'index.html',
      'manifest.json',
      'logo.png', // Assure-toi que ton logo est bien nommé comme ça
      // Ajoute ici tes fichiers vidéos si nécessaire
    ]))
  );
});

self.addEventListener('fetch', (e) => {
  e.respondWith(
    caches.match(e.request).then((response) => response || fetch(e.request))
  );
});
