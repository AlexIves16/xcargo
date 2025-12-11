
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// Config will be injected or need to be hardcoded if we can't inject in SW
// For simplicity in this env, we often need to hardcode specific values inside SW or use a query param hack
// But let's try to just listen for background messages first.

// We need to initialize app in SW for onBackgroundMessage
// This is tricky because we don't have access to runtimeConfig here easily.
// Usually we use `self.__WB_MANIFEST` or similar if building, but this is a static file.

// WORKAROUND: We will register this SW in the main logic, so we might not strictly need
// a full init HERE if we only want "display notification" default behavior.
// But to customize it, we do.

// See if we can get away with just this for now:
self.addEventListener('push', function (event) {
    if (event.data) {
        const payload = event.data.json();
        console.log('Background push received', payload);

        const notificationTitle = payload.notification.title;
        const notificationOptions = {
            body: payload.notification.body,
            icon: '/icons/pwa-192x192.png'
        };

        self.registration.showNotification(notificationTitle, notificationOptions);
    }
});
