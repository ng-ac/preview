const CACHE_NAME = 'yomogi-v1';
const urlsToCache = [
    '/preview/yomogi/yomogi.html',
    '/preview/yomogiphoto/よもぎ1.png',
    '/preview/yomogiphoto/よもぎ2.png',
    '/preview/yomogiphoto/よもぎ3.png',
    '/preview/yomogiphoto/よもぎ4.png',
    '/preview/yomogiphoto/よもぎ5.png',
    '/preview/yomogiphoto/よもぎ6.png',
    '/preview/yomogiphoto/よもぎ7.png',
    '/preview/yomogiphoto/よもぎ8.png',
    '/preview/yomogiphoto/よもぎ9.png'
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

