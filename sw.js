//este es el service worker
const CACHE_NAME = 'examen1-cache-v1';
const ASSETS = [
    './',
    './index.html',
    './app.js',
    './manifest.json',
    './images/icons/192.png',
    './images/icons/512.png',
    './sw.js',
    './firebase-messaging-sw.js'
]

//INSTALACION
self.addEventListener('install', (event) => {
    console.log('Service Worker: Instalado');
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => { cache.addAll(ASSETS) })
    );
    self.skipWaiting();
});

//ACTIVACION
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                return cachedResponse || fetch(event.request);
            })
    );
});