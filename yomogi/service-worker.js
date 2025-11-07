const CACHE_NAME = 'yomogi-v4';
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

// インストール
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => cache.addAll(CACHE_FILES))
            .then(() => self.skipWaiting())
    );
});

// アクティベート
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames.map((cacheName) => {
                        if (cacheName !== CACHE_NAME) {
                            return caches.delete(cacheName);
                        }
                    })
                );
            })
            .then(() => self.clients.claim())
    );
});

// フェッチ
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                return response || fetch(event.request);
            })
    );
});

