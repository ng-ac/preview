const CACHE_NAME = 'yomogi-v4';  // バージョンアップ
const urlsToCache = [
    '/preview/main/main.html',
    '/preview/main/main.css',
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

// 動画は別途キャッシュ
const VIDEO_CACHE = 'video-cache-v4';

self.addEventListener('install', event => {
    event.waitUntil(
        Promise.all([
            caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)),
            caches.open(VIDEO_CACHE).then(cache =>
                cache.add('/preview/main/main.mp4')
            )
        ])
    );
    self.skipWaiting();
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys.map(key => {
                    if (key !== CACHE_NAME && key !== VIDEO_CACHE) {
                        return caches.delete(key);
                    }
                })
            )
        )
    );
    self.clients.claim();
});

self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // 動画ファイルの特別処理
    if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
        event.respondWith(
            caches.open(VIDEO_CACHE).then(cache => {
                return cache.match(event.request).then(cachedResponse => {
                    if (cachedResponse) {
                        // キャッシュされた動画を返す（Range Request無視）
                        return cachedResponse.clone();
                    }
                    // キャッシュになければネットワークから取得
                    return fetch(event.request).then(networkResponse => {
                        if (networkResponse.ok) {
                            cache.put(event.request, networkResponse.clone());
                        }
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // その他のファイル
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(response => {
            return response || fetch(event.request).catch(() => {
                if (event.request.mode === 'navigate') {
                    return caches.match('/preview/main/main.html');
                }
            });
        })
    );
});
