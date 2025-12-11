// Service Worker v3 - Aggressive cache clearing
// Forces fresh content on every deployment

const CACHE_VERSION = 'v3';

self.addEventListener('install', (event) => {
    console.log('SW v3: Installing...');
    // Skip waiting to activate immediately
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    console.log('SW v3: Activating...');
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            // Delete ALL caches to force fresh start
            return Promise.all(
                cacheNames.map((cacheName) => {
                    console.log('SW v3: Deleting cache:', cacheName);
                    return caches.delete(cacheName);
                })
            );
        }).then(() => {
            console.log('SW v3: All caches cleared, taking control...');
            // Take control of all clients immediately
            return self.clients.claim();
        })
    );
});

// Network-first strategy - no caching
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Always fetch from network, fall back to nothing
    event.respondWith(
        fetch(event.request)
            .then(response => response)
            .catch(() => {
                // If network fails, return nothing - forces browser to use its own cache
                return new Response('Network error', { status: 503 });
            })
    );
});
