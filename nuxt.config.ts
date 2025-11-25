import 'dotenv/config';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL || '/',
  },

  nitro: {
    plugins: ['~/server/plugins/coep.ts']
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com https://www.googletagmanager.com https://firebase.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://www.svgrepo.com; connect-src 'self' https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://xcargo-4853b.firebaseapp.com https://firestore.googleapis.com https://www.google-analytics.com; font-src 'self' data:; frame-src 'self' https://xcargo-4853b.firebaseapp.com https://www.googletagmanager.com https://yandex.kz https://accounts.google.com; frame-ancestors 'self';",
      }
    }
  },



  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  pwa: {
    manifest: {
      name: 'Xpress Cargo',
      short_name: 'Xcargo',
      description: 'Доставка грузов из Китая в Казахстан',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      icons: [
        {
          src: 'pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png'
        },
        {
          src: 'pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png'
        }
      ]
    },
    workbox: {
      navigateFallback: '/index.html',
      // Исправляем precache ошибку
      globPatterns: ['**/*.{js,css,html,png,svg,ico}'],
      navigateFallbackDenylist: [/^\/api\//],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^\/$/,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'homepage-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 // 24 часа
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: false, // Отключаем PWA в режиме разработки
      type: 'module',
      suppressWarnings: true
    }
  },

  runtimeConfig: {
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL || '',
    googlePrivateKey: (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n'),
    spreadsheetId: process.env.SPREADSHEET_ID || '',
    baseURL: process.env.BASE_URL || '/',

    public: {
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.FIREBASE_APP_ID || '',
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
    }
  },

  vite: {
    assetsInclude: ['/**/*.{mp4,mov,png,jpg}']
  },

  compatibilityDate: '2024-11-10'
})