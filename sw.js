const CacheName = 'Cache:v1'

self.addEventListener('install', (event) => {
    console.log('ServiceWorker install:', event);
})

self.addEventListener('activate', (event) => {
    console.log('ServiceWorker activate:', event);
})

const networkFallingBackToCache = async (request) => {
    const cache = await caches.open(CacheName);
    try {
        const response = await fetch(request);
        await cache.put(request, response.clone()); // レスポンスをキャッシュに保存(cloneをする必要がある)
        return response;
    } catch (err) {
        console.error(err);
        return cache.match(request);
    }
};


// fetch とはネットワークなどを経由してリソースを取得するために使用するAPI
// ここにサービスワーカーは介入できるので、リソース取得に対して様々な処理を挟むことが可能
self.addEventListener('fetch', (event) => {
    console.log('Fetch to:', event.request.url);

    // ネットワークリクエストを行って結果をメインスレッドに戻す処理
    // event.respondWith は簡潔に言うと、非同期処理（Promise）の実行終了まで待機してくれるメソッド
    event.respondWith(networkFallingBackToCache(event.request));
})
