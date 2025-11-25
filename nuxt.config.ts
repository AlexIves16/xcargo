import 'dotenv/config';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL || '/',
    head: {
      title: 'Xpress Cargo',
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' },
        { name: 'theme-color', content: '#ffffff' }
      ],
      link: [
        { rel: 'manifest', href: '/manifest.webmanifest' },
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    },
    // Настройка переходов между страницами - временно отключены для решения проблемы с отображением контента
    // pageTransition: { name: 'page', mode: 'out-in', duration: 300 },
    // layoutTransition: { name: 'layout', mode: 'out-in', duration: 300 }
  },

  nitro: {
    plugins: ['~/server/plugins/coep.ts']
  },
  routeRules: {
    '/**': {
      headers: {
        'Content-Security-Policy': "default-src 'self'; script-src 'self' 'unsafe-eval' 'unsafe-inline' https://www.gstatic.com https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://apis.google.com https://www.googletagmanager.com https://firebase.googleapis.com; style-src 'self' 'unsafe-inline'; img-src 'self' data: https: https://www.svgrepo.com; connect-src 'self' https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://xcargo-4853b.firebaseapp.com https://firestore.googleapis.com https://www.google-analytics.com https://firebaseinstallations.googleapis.com; font-src 'self' data:; frame-src 'self' https://xcargo-4853b.firebaseapp.com https://www.googletagmanager.com https://yandex.kz https://accounts.google.com; frame-ancestors 'self';",
      }
    }
  },

  modules: ['@nuxtjs/tailwindcss', '@vite-pwa/nuxt'],

  // Добавляем плагин анимаций
  plugins: [
    '~/plugins/animations.client.ts'
  ],

  pwa: {
    registerType: 'autoUpdate',
    manifest: {
      id: '/',
      name: 'Xpress Cargo',
      short_name: 'Xcargo',
      description: 'Доставка грузов из Китая в Казахстан',
      theme_color: '#ffffff',
      background_color: '#ffffff',
      display: 'standalone',
      orientation: 'portrait',
      start_url: '/',
      scope: '/',
      icons: [
        {
          src: '/pwa-192x192.png',
          sizes: '192x192',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/pwa-512x512.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any maskable'
        },
        {
          src: '/logo.png',
          sizes: '512x512',
          type: 'image/png',
          purpose: 'any'
        }
      ],
      screenshots: [
        {
          src: '/b1.jpg',
          sizes: '1280x720',
          type: 'image/jpeg',
          form_factor: 'wide',
          label: 'Главная страница'
        },
        {
          src: '/b2.jpg',
          sizes: '1280x720',
          type: 'image/jpeg',
          form_factor: 'narrow',
          label: 'Мобильная версия'
        }
      ]
    },
    workbox: {
      navigateFallback: '/',
      skipWaiting: true,
      clientsClaim: true,
      globPatterns: ['**/*.{js,css,html,png,svg,ico,woff,woff2}'],
      cleanupOutdatedCaches: true,
      runtimeCaching: [
        {
          urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
          handler: 'CacheFirst',
          options: {
            cacheName: 'google-fonts-cache',
            expiration: {
              maxEntries: 10,
              maxAgeSeconds: 60 * 60 * 24 * 365 // 1 год
            },
            cacheableResponse: {
              statuses: [0, 200]
            }
          }
        },
        {
          urlPattern: /^\//,
          handler: 'NetworkFirst',
          options: {
            cacheName: 'pages-cache',
            expiration: {
              maxEntries: 50,
              maxAgeSeconds: 60 * 60 * 24 // 24 часа
            }
          }
        }
      ]
    },
    devOptions: {
      enabled: true,
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