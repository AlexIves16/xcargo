// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  compatibilityDate: '2025-12-10',

  // Proper viewport for mobile + PWA
  app: {
    head: {
      script: [
        { src: 'https://www.google.com/recaptcha/api.js', async: true, defer: true }
      ],
      viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no',
      meta: [
        { name: 'theme-color', content: '#4F46E5' },
        { name: 'mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-capable', content: 'yes' },
        { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
        { name: 'apple-mobile-web-app-title', content: 'CargoXpress' },
        // SEO meta tags for bot indexing
        { name: 'robots', content: 'index, follow' },
        { name: 'description', content: 'Xcargo - Доставка грузов из Китая в Казахстан. Быстро, надежно, для бизнеса и частных лиц. Отслеживание посылок, карго доставка.' },
        { name: 'keywords', content: 'доставка из китая, карго казахстан, грузоперевозки, taobao, 1688, alibaba, отслеживание посылок' },
        // Open Graph for social sharing
        { property: 'og:type', content: 'website' },
        { property: 'og:title', content: 'Xcargo - Доставка из Китая в Казахстан' },
        { property: 'og:description', content: 'Доставка грузов из Китая в Казахстан. Быстро, надежно, для бизнеса и частных лиц.' },
        { property: 'og:site_name', content: 'Xcargo' },
        { property: 'og:locale', content: 'ru_RU' },
      ],
      link: [
        { rel: 'manifest', href: '/manifest.json' },
        { rel: 'apple-touch-icon', href: '/icons/pwa-192x192.png' },
      ]
    }
  },

  // Route rules: CSP + Caching for performance and SEO
  routeRules: {
    // Static assets - cache for 30 days (immutable)
    '/_nuxt/**': {
      headers: {
        'Cache-Control': 'public, max-age=2592000, immutable'
      }
    },
    // Images - cache for 30 days
    '/icons/**': {
      headers: {
        'Cache-Control': 'public, max-age=2592000'
      }
    },
    '/images/**': {
      headers: {
        'Cache-Control': 'public, max-age=2592000'
      }
    },
    // Dynamic pages - NO cache (user data, tracking)
    '/dashboard/**': {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    },
    '/tracking/**': {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    },
    '/admin/**': {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    },
    '/auth/**': {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    },
    '/login': {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    },
    '/api/**': {
      headers: { 'Cache-Control': 'no-store, no-cache, must-revalidate' }
    },
    // Pages - cache for 1 hour, allow bot indexing
    '/**': {
      headers: {
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
        'Content-Security-Policy': [
          "default-src 'self'",
          "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://www.gstatic.com https://apis.google.com https://cdnjs.cloudflare.com https://cdn.jsdelivr.net https://api-maps.yandex.ru https://yandex.ru https://www.google.com https://accounts.google.com https://ssl.gstatic.com",
          "style-src 'self' 'unsafe-inline' https: https://fonts.googleapis.com https://cdnjs.cloudflare.com https://yandex.ru",
          "font-src 'self' https://fonts.gstatic.com https://cdnjs.cloudflare.com data:",
          "img-src 'self' data: blob: https: http:",
          "connect-src 'self' https://fonts.googleapis.com https://fonts.gstatic.com https://firebasestorage.googleapis.com https://identitytoolkit.googleapis.com https://securetoken.googleapis.com https://www.googleapis.com https://firebase.googleapis.com https://xcargo-4853b.firebaseapp.com https://firestore.googleapis.com https://www.google-analytics.com https://firebaseinstallations.googleapis.com https://cdnjs.cloudflare.com https://api-maps.yandex.ru https://yandex.ru https://fcmregistrations.googleapis.com https://www.google.com https://accounts.google.com",
          "frame-src 'self' https://*.google.com https://*.googleapis.com https://*.firebaseapp.com https://yandex.kz https://yandex.ru https://*.yandex.kz https://*.yandex.ru https://www.google.com",
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
  modules: [],
  runtimeConfig: {
    // Server-only config (Private)
    googleClientEmail: process.env.GOOGLE_CLIENT_EMAIL,
    googlePrivateKey: process.env.GOOGLE_PRIVATE_KEY,
    spreadsheetId: process.env.SPREADSHEET_ID,
    firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
    recaptchaSecretKey: process.env.RECAPTCHA_SECRET_KEY,
    telegramBotToken: process.env.TELEGRAM_BOT_TOKEN,
    telegramChatId: process.env.TELEGRAM_CHAT_ID,
    
    // SMTP for Alerts
    smtpHost: process.env.SMTP_HOST,
    smtpPort: process.env.SMTP_PORT,
    smtpUser: process.env.SMTP_USER,
    smtpPass: process.env.SMTP_PASS,
    smtpFrom: process.env.SMTP_FROM,

    public: {
      // Public config (Accessible on client)
      firebaseApiKey: process.env.FIREBASE_API_KEY,
      firebaseAuthDomain: process.env.FIREBASE_AUTH_DOMAIN,
      firebaseProjectId: process.env.FIREBASE_PROJECT_ID,
      firebaseStorageBucket: process.env.FIREBASE_STORAGE_BUCKET,
      firebaseMessagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
      firebaseAppId: process.env.FIREBASE_APP_ID,
      recaptchaSiteKey: process.env.RECAPTCHA_SITE_KEY,
    }
  },
})