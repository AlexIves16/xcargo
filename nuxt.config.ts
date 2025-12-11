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
          "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://xcargo-4853b.firebaseapp.com https://firestore.googleapis.com https://www.google-analytics.com https://firebaseinstallations.googleapis.com https://cdnjs.cloudflare.com https://api-maps.yandex.ru https://yandex.ru https://fcmregistrations.googleapis.com",
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
  modules: ['nuxt-turnstile'],
  turnstile: {
    siteKey: '0x4AAAAAACCekjF3mSEvD-2s',
  },
  runtimeConfig: {
    // Server-only config (auto-populated by NUXT_TELEGRAM_BOT_TOKEN, etc.)
    telegramBotToken: '',
    googleClientEmail: '',
    googlePrivateKey: '',
    spreadsheetId: '',
    turnstileSecretKey: '', /* NUXT_TURNSTILE_SECRET_KEY */

    public: {
      // Auto-populated by NUXT_PUBLIC_FIREBASE_API_KEY, etc.
      firebaseApiKey: '',
      firebaseAuthDomain: '',
      firebaseProjectId: '',
      firebaseStorageBucket: '',
      firebaseMessagingSenderId: '',
      firebaseAppId: '',
      firebaseMeasurementId: '',
      telegramBotName: '',
      spreadsheetId: '',
      // turnstileSiteKey is handled by the module options above usually, but keeping for ref if needed
      turnstileSiteKey: '',
      firebaseVapidKey: 'BO91snwciBEECru5uzrbeRLjlgWf878kyNdiU6xDSFB3a3AQ1CCsMCQp3Rod4-SGIUIORH6S8TOcTL6i054vdGI',
    }
  },
})