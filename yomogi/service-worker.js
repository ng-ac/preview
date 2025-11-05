const CACHE_NAME = 'yomogi-v1';
const urlsToCache = [
    '/preview/yomogi/yomogi.html',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_1.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_2.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_3.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_4.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_5.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_6.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_7.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_8.png',
    '/preview/yomogiphoto/セルフよもぎ蒸し_ページ_9.png'
];

self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('[SW] キャッシュ開始');
                
                // 個別にキャッシュしてエラーを特定
                return Promise.all(
                    urlsToCache.map((url) => {
                        return cache.add(url)
                            .then(() => {
                                console.log('[SW] ✅ キャッシュ成功:', url);
                            })
                            .catch((err) => {
                                console.error('[SW] ❌ キャッシュ失敗:', url, err);
                            });
                    })
                );
            })
            .then(() => {
                console.log('[SW] キャッシュ完了');
                return self.skipWaiting();
            })
    );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
            .then((keys) => Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log('[SW] 古いキャッシュ削除:', key);
                        return caches.delete(key);
                    }
                })
            ))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).catch((err) => {
                    console.log('[SW] Fetch失敗:', event.request.url);
                });
            })
    );
});





