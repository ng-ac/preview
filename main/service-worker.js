// /preview/sw-main.js
const CACHE_NAME = 'main-shell-v1';
const urlsToCache = [
    '/preview/main/main.html',
    '/preview/main/main.jpg',
    // 必要なら他の静的ファイルを追加（例：CSS/JS/ロゴ）
    // '/preview/styles.css',
];

// インストール時にプリキャッシュ
self.addEventListener('install', event => {
    event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(urlsToCache)));
    self.skipWaiting();
});

// 古いキャッシュを掃除
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(keys.map(key => (key !== CACHE_NAME ? caches.delete(key) : undefined)))
        )
    );
    self.clients.claim();
});

// cache-first（なければネット）戦略
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request, { ignoreSearch: true }).then(resp => resp || fetch(event.request))
    );
});
