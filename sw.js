const CACHE_NAME = 'only-cache-v1';

self.addEventListener('install', event => {
    console.log('Service Worker: Instalado');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache =>
            cache.addAll([
                './',
                './index.html',
                './app.js',
                './images/icons/192.png',
                './images/icons/512.png',
                './sw.js',
                './manifest.json'
            ])
        )
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    console.log('Service Worker: Activado');
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
            )
        )
    );
    self.clients.claim();
});

// 🔥 ONLY CACHE para archivos locales
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 👉 Si NO es de mi dominio, dejo pasar a red (Firebase, CDN, etc.)
    if (url.origin !== location.origin) {
        return;
    }

    // 👉 Mis archivos: SOLO CACHE
    event.respondWith(
        caches.match(event.request)
    );
});
