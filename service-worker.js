// キャッシュ名（バージョンを上げると一括更新）
const CACHE_NAME = 'yomogi-v5';
const VIDEO_CACHE = 'video-cache-v5';

// 事前キャッシュ（動画は重いのでプリキャッシュしない）
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
                    if (key !== CACHE_NAME && key !== VIDEO_CACHE) return caches.delete(key);
                })
            );
            // iOS/Safariでの更新即反映
            await self.clients.claim();
        })()
    );
});

// fetch 戦略
self.addEventListener('fetch', event => {
    const req = event.request;
    const url = new URL(req.url);

    // 動画ファイルの特別処理
    if (url.pathname.endsWith('.mp4') || url.pathname.endsWith('.webm')) {
        const range = req.headers.get('Range');
        // Rangeリクエスト（部分取得）はネット直でサーバに任せる：シーク安定化
        if (range) {
            event.respondWith(fetch(req));
            return;
        }

        // クエリを正規化したキーでキャッシュ管理（?reload=...等で増殖させない）
        event.respondWith((async () => {
            const cache = await caches.open(VIDEO_CACHE);
            const normalizedKey = new Request(url.origin + url.pathname, { method: 'GET' });
            const cached = await cache.match(normalizedKey);
            if (cached) return cached;

            // ネット → 正常時のみ正規化キーで保存
            const net = await fetch(req);
            if (net.ok) {
                try { await cache.put(normalizedKey, net.clone()); } catch (_) { }
            }
            return net;
        })());
        return;
    }

    // それ以外：キャッシュ優先（クエリは無視してヒット率向上）
    event.respondWith((async () => {
        const cached = await caches.match(req, { ignoreSearch: true });
        if (cached) return cached;

        try {
            const net = await fetch(req);
            // 成功したら静的キャッシュに入れておく（任意）
            if (net && net.ok && req.method === 'GET' && req.url.startsWith(self.location.origin)) {
                const cache = await caches.open(CACHE_NAME);
                cache.put(req, net.clone());
            }
            return net;
        } catch (_) {
            // ナビゲーション失敗時は main.html をフォールバック
            if (req.mode === 'navigate') {
                const fallback = await caches.match('/preview/main/main.html');
                if (fallback) return fallback;
            }
            // 画像等は落とさない
            return new Response('', { status: 504, statusText: 'Gateway Timeout' });
        }
    })());
});
