import 'dotenv/config';

export default defineNuxtConfig({
  app: {
    baseURL: process.env.BASE_URL || '',
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
      navigateFallback: '/'
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
    turnstileSecretKey: process.env.TURNSTILE_SECRET_KEY,

    public: {
      baseURL: process.env.BASE_URL || 'https://xcargo.kz',
      firebaseApiKey: process.env.FIREBASE_API_KEY || '',
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN || '',
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID || '',
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET || '',
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID || '',
      firebaseAppId: process.env.FIREBASE_APP_ID || '',
      firebaseMeasurementId: process.env.FIREBASE_MEASUREMENT_ID || '',
      turnstileSiteKey: process.env.TURNSTILE_SITE_KEY || ''
    }
  },

  vite: {
    assetsInclude: ['/**/*.{mp4,mov,png,jpg}']
  },

  compatibilityDate: '2024-11-10'
})