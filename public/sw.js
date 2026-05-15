// Service Worker v5 - XCargo Improved
const version = 'v5';
const CACHE_NAME = `xcargo-cache-${version}`;

const ASSETS_TO_CACHE = [
    '/',
    '/manifest.json',
    '/Moon.webp'
];

self.addEventListener('install', (event) => {
    console.log(`[SW ${version}] Installing...`);
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return cache.addAll(ASSETS_TO_CACHE);
        }).then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', (event) => {
    console.log(`[SW ${version}] Activating...`);
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log(`[SW ${version}] Deleting old cache:`, cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            console.log(`[SW ${version}] Activation complete`);
            return self.clients.claim();
        })
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);
    
    // 1. Bypass SW for API calls and Admin panel to avoid auth/sync issues
    if (url.pathname.startsWith('/api') || url.pathname.startsWith('/admin') || url.host.includes('google')) {
        return; // Let browser handle it
    }

    // 2. Handle navigations (HTML pages)
    if (event.request.mode === 'navigate') {
        event.respondWith(
            fetch(event.request).catch(() => caches.match('/'))
        );
        return;
    }

    // 3. Static Assets & Local files
    if (url.origin === self.location.origin) {
        event.respondWith(
            caches.match(event.request).then((cachedResponse) => {
                const fetchPromise = fetch(event.request).then((networkResponse) => {
                    if (networkResponse && networkResponse.status === 200 && event.request.method === 'GET') {
                        const responseToCache = networkResponse.clone();
                        caches.open(CACHE_NAME).then((cache) => {
                            cache.put(event.request, responseToCache);
                        });
                    }
                    return networkResponse;
                }).catch(() => {
                    // Network failed
                    return null;
                });
                
                return cachedResponse || fetchPromise || fetch(event.request);
            })
        );
    }
});
