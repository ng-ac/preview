// キャッシュ名（バージョンを上げると一括更新）
const CACHE_NAME = 'yomogi-v6';

// 事前キャッシュ
const urlsToCache = [
    '/preview/main/main.html',
    '/preview/main/main.css',
    '/preview/main/main.jpeg',
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
        (async () => {
            const cache = await caches.open(CACHE_NAME);
            await cache.addAll(urlsToCache);
        })()
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        (async () => {
            const keys = await caches.keys();
            await Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME) return caches.delete(key);
                })
            );
            await self.clients.claim();
        })()
    );
});

// fetch 戦略：キャッシュ優先
self.addEventListener('fetch', event => {
    const req = event.request;

    event.respondWith((async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        try {
            const net = await fetch(req);
            if (net && net.ok && req.method === 'GET' && req.url.startsWith(self.location.origin)) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(req, net.clone());
            }
            return net;
        } catch (_) {
            if (req.mode === 'navigate') {
                const fallback = await caches.match('/preview/main/main.html');
                if (fallback) return fallback;
            }
            return new Response('', { status: 504, statusText: 'Gateway Timeout' });
        }
    })());
});
