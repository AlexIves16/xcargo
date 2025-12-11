// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-12-10',

  // Proper viewport for mobile + PWA
  app: {
    head: {
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'theme-color', content: '#4F46E5' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'CargoXpress' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icons/pwa-192x192.png' },
      ]
    }
  },

  // CSP headers for production
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api-maps.yandex.ru https://yandex.ru",
          "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://cdnjs.cloudflare.com https://yandex.ru",
          "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
          "img-src 'self' data: blob: https: http:",
          "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://xcargo-4853b.firebaseapp.com https://firestore.googleapis.com https://www.google-analytics.com https://firebaseinstallations.googleapis.com https://cdnjs.cloudflare.com https://api-maps.yandex.ru https://yandex.ru",
          "frame-src 'self' https://*.firebaseapp.com https://yandex.kz https://yandex.ru https://*.yandex.kz https://*.yandex.ru",
          "worker-src 'self' blob:",
        ].join('; ')
      }
    }
  },
  css: ['~/assets/css/tailwind.css'],
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  runtimeConfig: {
    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID,
    }
  },
})