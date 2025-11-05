const CACHE_NAME = 'yomogi-v1';

console.log('🚀 Service Worker ファイル読み込み開始');

const swPath = new URL(self.location).pathname;
const basePath = swPath.substring(0, swPath.lastIndexOf('/'));
const parentPath = basePath.substring(0, basePath.lastIndexOf('/'));

console.log('📍 SW Path:', swPath);
console.log('📍 Base Path:', basePath);
console.log('📍 Parent Path:', parentPath);


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

console.log('📋 キャッシュ対象URL:', urlsToCache);

self.addEventListener('install', (event) => {
    console.log('⚙️ INSTALL イベント発火');
    
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('✅ キャッシュストレージオープン:', CACHE_NAME);
                
                // 1つずつキャッシュ
                const promises = urlsToCache.map((url, index) => {
                    console.log(`🔄 [${index + 1}/${urlsToCache.length}] キャッシュ試行:`, url);
                    
                    return cache.add(url)
                        .then(() => {
                            console.log(`✅ [${index + 1}/${urlsToCache.length}] 成功:`, url);
                        })
                        .catch((err) => {
                            console.error(`❌ [${index + 1}/${urlsToCache.length}] 失敗:`, url);
                            console.error('   エラー詳細:', err);
                            console.error('   エラーメッセージ:', err.message);
                        });
                });
                
                return Promise.all(promises);
            })
            .then(() => {
                console.log('🎉 全てのキャッシュ処理完了');
                return self.skipWaiting();
            })
            .catch((err) => {
                console.error('💥 INSTALLエラー:', err);
            })
    );
});

self.addEventListener('activate', (event) => {
    console.log('🔥 ACTIVATE イベント発火');
    
    event.waitUntil(
        caches.keys()
            .then((keys) => {
                console.log('📦 既存キャッシュ一覧:', keys);
                
                return Promise.all(
                    keys.map((key) => {
                        if (key !== CACHE_NAME) {
                            console.log('🗑️ 古いキャッシュ削除:', key);
                            return caches.delete(key);
                        }
                    })
                );
            })
            .then(() => {
                console.log('✅ ACTIVATE 完了');
                return self.clients.claim();
            })
    );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request);
            })
    );
});

console.log('✅ Service Worker ファイル読み込み完了');









