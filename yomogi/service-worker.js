const CACHE_NAME = 'yomogi-app-v1';
const urlsToCache = [
    './',
    './yomogi.html',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_1.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_2.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_3.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_4.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_5.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_6.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_7.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_8.png',
    '../yomogiphoto/セルフよもぎ蒸し_ページ_9.png'
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
