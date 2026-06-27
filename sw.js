// sw.js
const CACHE_NAME = 'tiktok-40-store-v3'; // <-- On change de version pour forcer la mise à jour
const ASSETS = [
  'index.html',
  'manifest.json',
  'logo.png',
  // N'ajoute PAS tes vidéos .mp4 ici !
];

self.addEventListener('install', (e) => {
  self.skipWaiting();
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
  return self.clients.claim();
});

// Récupération des ressources
self.addEventListener('fetch', (e) => {
  const url = new URL(e.request.url);

  // CORRECTION : Si c'est une vidéo ou une requête partielle (Range), 
  // on laisse le réseau la gérer directement sans passer par le cache.
  if (url.pathname.endsWith('.mp4') || e.request.headers.get('range')) {
    return; // En ne faisant pas de "e.respondWith", le navigateur gère la requête normalement
  }

  // Pour le reste (HTML, CSS, JSON, images), on utilise le cache
  e.respondWith(
    caches.match(e.request).then((response) => {
      return response || fetch(e.request);
    })
  );
});
