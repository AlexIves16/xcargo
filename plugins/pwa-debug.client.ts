export default defineNuxtPlugin(() => {
    if (process.client) {
        console.log('🕵️ PWA Debugger v2 initialized');

        // 1. Check if already installed
        if (window.matchMedia('(display-mode: standalone)').matches) {
            console.log('✅ App is running in standalone mode (Installed)');
        } else {
            console.log('ℹ️ App is running in browser mode');
        }

        // 2. Listen for install prompt
        window.addEventListener('beforeinstallprompt', (e) => {
            console.log('🔥 PWA Install Prompt fired! App IS installable.');
            (window as any).deferredPrompt = e;
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA was installed successfully');
        });

        // 3. Check Manifest
        const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
        if (link) {
            console.log('📄 Manifest found:', link.href);
        } else {
            console.error('❌ Manifest link not found in DOM!');
        }

        // 4. Register Service Worker with auto-update
        if ('serviceWorker' in navigator) {
            // First, unregister any old service workers
            navigator.serviceWorker.getRegistrations().then(registrations => {
                registrations.forEach(registration => {
                    // Check if it's an old workbox SW
                    if (registration.active?.scriptURL?.includes('workbox')) {
                        console.log('🗑️ Unregistering old Workbox SW:', registration.scope);
                        registration.unregister();
                    }
                });
            });

            // Register new service worker
            navigator.serviceWorker.register('/sw.js', { scope: '/' })
                .then(registration => {
                    console.log('⚙️ Service Worker registered:', registration.scope);

                    // Check for updates
                    registration.addEventListener('updatefound', () => {
                        const newWorker = registration.installing;
                        console.log('🔄 New Service Worker found, installing...');

                        newWorker?.addEventListener('statechange', () => {
                            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                                console.log('🔄 New version available! Refresh to update.');
                            }
                        });
                    });
                })
                .catch(error => {
                    console.error('❌ Service Worker registration failed:', error);
                });

            // Listen for SW updates and reload
            let refreshing = false;
            navigator.serviceWorker.addEventListener('controllerchange', () => {
                if (!refreshing) {
                    refreshing = true;
                    console.log('🔄 New Service Worker activated, reloading...');
                    window.location.reload();
                }
            });
        }
    }
});

