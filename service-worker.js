const CACHE_NAME = 'nav-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/mc.html',
    '/htc.html',
    '/masakari.html',
    '/鉞組ロゴグレイ.PNG',
    '/鉞組_丸ロゴ.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(urlsToCache))
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => response || fetch(event.request))
    );
});
