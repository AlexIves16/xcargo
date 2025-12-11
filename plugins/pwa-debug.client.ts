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
            // Make it available globally for testing in console
            (window as any).deferredPrompt = e;
        });

        window.addEventListener('appinstalled', () => {
            console.log('✅ PWA was installed successfully');
        });

        // 3. Check Manifest
        const link = document.querySelector('link[rel="manifest"]') as HTMLLinkElement;
        if (link) {
            console.log('📄 Manifest found:', link.href);
            fetch(link.href)
                .then(res => {
                    if (res.ok) return res.json();
                    throw new Error(`Manifest fetch failed: ${res.status}`);
                })
                .then(manifest => {
                    console.log('📄 Manifest content:', manifest);
                    // Check icons
                    if (manifest.icons && Array.isArray(manifest.icons)) {
                        manifest.icons.forEach((icon: any) => {
                            fetch(icon.src)
                                .then(res => {
                                    if (res.ok) console.log(`✅ Icon found: ${icon.src}`);
                                    else console.error(`❌ Icon missing: ${icon.src} (${res.status})`);
                                })
                                .catch(err => console.error(`❌ Icon error: ${icon.src}`, err));
                        });
                    }
                })
                .catch(err => console.error('❌ Error loading manifest:', err));
        } else {
            console.error('❌ Manifest link not found in DOM!');
        }

        // 4. Check Service Worker with retry (max 5 attempts)
        let swRetryCount = 0;
        const maxRetries = 5;
        const checkSW = () => {
            if ('serviceWorker' in navigator) {
                navigator.serviceWorker.getRegistrations().then(registrations => {
                    if (registrations.length > 0) {
                        console.log('⚙️ Service Worker registered:', registrations[0]);
                        console.log('   Scope:', registrations[0].scope);
                        console.log('   State:', registrations[0].active ? 'Active' : 'Installing/Waiting');
                    } else if (swRetryCount < maxRetries) {
                        swRetryCount++;
                        console.warn(`⚠️ No Service Worker registered yet. Retry ${swRetryCount}/${maxRetries}...`);
                        setTimeout(checkSW, 1000);
                    } else {
                        console.warn('⚠️ Service Worker not registered after max retries');
                    }
                });
            } else {
                console.error('❌ Service Worker not supported in this browser');
            }
        };
        checkSW();
    }
});
