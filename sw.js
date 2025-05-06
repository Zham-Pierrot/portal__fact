// Service Worker para Portal Fact

// Versión de la caché
const CACHE_NAME = 'portal-fact-v1';

// Archivos a cachear
const urlsToCache = [
  './',
  './index.html',
  './facturacion.html',
  './offline.html',
  './css/styles.css',
  './js/script.js',
  './images/logo.jpg',
  './images/zhp.png',
  './images/zhp2.png',
  './manifest.json'
];

// Evento de instalación
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caché abierta');
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting();
});

// Evento de activación
self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
  self.clients.claim();
});

// Evento fetch
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Devuelve la respuesta cacheada si existe
        if (response) {
          return response;
        }
        
        // Si no está en caché, intenta obtenerlo de la red
        return fetch(event.request)
          .then((response) => {
            // Verifica que la respuesta sea válida
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clona la respuesta para guardarla en caché
            const responseToCache = response.clone();
            
            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache);
              });
              
            return response;
          })
          .catch(() => {
            // Si falla la red, muestra la página offline
            if (event.request.mode === 'navigate') {
              return caches.match('./offline.html');
            }
          });
      })
  );
});