// Service Worker v4 - Minimal, don't intercept external resources
// Only handles same-origin requests, lets external resources pass through

const CACHE_VERSION = 'v4';

self.addEventListener('install', (event) => {
    console.log('SW v4: Installing...');
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('SW v4: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('SW v4: Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log('SW v4: All caches cleared');
            return self.clients.claim();
        })
    );
});

// Only intercept same-origin GET requests, let everything else pass through
self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only handle same-origin requests
    if (url.origin !== self.location.origin) {
        // Don't intercept external requests at all - let browser handle them
        return;
    }

    // For same-origin, just fetch from network
    if (event.request.method === 'GET') {
        event.respondWith(fetch(event.request));
    }
});
