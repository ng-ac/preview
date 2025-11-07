const CACHE_NAME = 'yomogi-v1';
const urlsToCache = [
    '/preview/main/main.html',
    '/preview/main/main.jpg',
    '/preview/yomogi/yomogi.html',
    '/preview/yomogiphoto/よもぎ1.jpg',
    '/preview/yomogiphoto/よもぎ2.jpg',
    '/preview/yomogiphoto/よもぎ3.jpg',
    '/preview/yomogiphoto/よもぎ4.jpg',
    '/preview/yomogiphoto/よもぎ5.jpg',
    '/preview/yomogiphoto/よもぎ6.jpg',
    '/preview/yomogiphoto/よもぎ7.jpg',
    '/preview/yomogiphoto/よもぎ8.jpg',
    '/preview/yomogiphoto/よもぎ9.jpg'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache))
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => key !== CACHE_NAME && caches.delete(key)))
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request).catch(() => {
                // オフラインで未キャッシュのリソースの場合、main.htmlを代わりに返す
                if (event.request.mode === 'navigate') {
                    return caches.match('/preview/main/main.html');
                }
            });
        })
    );
});

