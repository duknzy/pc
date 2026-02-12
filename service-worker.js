const CACHE_NAME = 'rb-hybrid-v6-karen-spec'; 
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './arietty.jpg',       // manifest.json で指定されているアイコン
  './arietty.jpg',    // ★ HTMLの poster と apple-touch-icon で使用 (追加)
  './karen.mp4'       // ★ HTMLの videoタグ で使用 (test.mp4 から変更)
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[Service Worker] Caching App Shell & Video');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

/* --- ここから下は変更なしだが、念のため記載 --- */
self.addEventListener('fetch', (event) => {
  if (event.request.url.includes('firestore.googleapis.com') || 
      event.request.url.includes('googleapis.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keyList) => {
      return Promise.all(keyList.map((key) => {
        if (key !== CACHE_NAME) {
          // 古いバージョンのキャッシュ（v4以前）を削除してゴミ掃除
          return caches.delete(key);
        }
      }));
    })
  );
});
