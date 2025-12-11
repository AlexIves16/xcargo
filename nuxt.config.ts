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
    siteKey: process.env.NUXT_PUBLIC_TURNSTILE_SITE_KEY || '',
  },
  runtimeConfig: {
    // Server-only config (auto-populated by NUXT_TELEGRAM_BOT_TOKEN, etc.)
    telegramBotToken: '8242139331:AAHnVKS4frKtr68VeoRpdw4lpw4PKGvOgyQ',
    googleClientEmail: 'firebase-adminsdk-fbsvc@xcargo-4853b.iam.gserviceaccount.com',
    googlePrivateKey: '-----BEGIN PRIVATE KEY-----\\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDadfZcdJn2MXXy\\nfm/eQsJmSZnwtCFE1rtkONLGSIRjY+StWDKVZcUKey89sS6MTcTPilYFb6iuBNCa\\nsjqu/OdcbQZTyQCFA5dfzHAwd0NrFjyKCTzF3dS61ETGyMWcbV1HB4LMQZItxa7t\\n38m5z9bPEX6DrI9fopJU2O90PAPg+lQra0qLMpYxYnUWab5g99lvFW12zWRSyXUF\\n4SPl8E5PWph1RJ9Et1o4jDNkj1TApUzOvLPQjqDv1nauaT27y3Tgp6zFbfQ7ZdXW\\nTy1mdUNBKvM04FO87Hc7AsZujzsH17GEETDewj/U8DyzIe/Zn/U2RcsADiKoaR4m\\nc3NV368NAgMBAAECggEAOJzcOK5w3aeIqMxSQjdruGU3cvTDMFszWbAOExtkz3rq\\nHm/eP/ANJX+xyNt7NBnNOHlhfGwoutv9kTFB2uooLMAGJT1QGKhLGKTap/yoKH6t\\nNppZOO+ZOsdagWczKqv+wbL1FuihMKJriDJ3zOLLCINAlW/pAcAYCsvjFeydlrXd\\nuHkY7/ysBufGF9AumGDsvQnca80Z4UGRFtomRx3lkJXU27pmwLwRFEJ4G1zJ7S2y\\nwb+ASa1QmaRKUybDgwlHk9Tuof9A9j6dVIKY16qBv6uZxljggyOI/M8F6ouClCg9\\n3tTKOlO9B1wRz/EyMFh/pK81nGFbU0snArCXK2dUEwKBgQD8a1tKnCPyjhL4Q/VX\\nUD7JhIbwr7Sox5CRWYs0coqTdEq8QT9vpigYsLo3St1M6xK0KY6U0SWwiocFKL9O\\n6LkkJlUqmlIiGWCM0BpN1anIqVgqCMTo/ORcGWG/blPTfIXTub6zVQKjy2ZPphcK\\nh42bVWhg5Whk034gpXeg6QcEMwKBgQDdj0mcoO4I/ZxsKiPvMVld2Lc1fi+cgn7Y\\n+tO8h1RTKmrvUMD+dnl2axrGx9NWrSyFErrqBPSVN5JTKkHNk1JO14rDXLWnURgJ\\nFpuIhR18vvLkowynmAiWICTk4ZDztbGoYkxDn8Vz4U5l+FLv+CfcbzDPulvTZFt0\\nzCslrvk/vwKBgHeWQS0K5nj+2Hvobm7MZMLCV8/l3phr29EQ9EOH1KFhYhroaq5x\\nsONprv+NJ2VOpZDXc2aL4+hM6QUHtgMjfLtkscq6TBk9nqF34k5n4MVhfZSEjQ24\\n6lO77rRsB6jVgO27PV7m8pY5QiKQFLB3Yh5qi0YEyb2i+UlsO03vuNRDAoGAOdK7\\nk3UsqowF1vToi/SFLkjxB7T3GBG2qUpNGFb5WvsnDW418DNbX9x0EIz2SxjHFbPd\\ntFW2v3rRZYMRyWU5hfoa7QG1JwWzECwmS2ryVyw+mA01sEetdgDNoC5+dhxlUVzW\\nKo/4KFYU7+fvPVG2lYEvbAdnD7SRadofKKaRxmECgYEAkCOQU96F8YVxsyBZ3RGk\\n0fBImjZnG8bdGgDPmuIOtyCAKGdKoXOxUjZWKDZRIRx+UmPJQjTBvTpYiNeyVyN9\\n90qNbbfvjib9Y/AjHuCXDQ+avYGSOjc2vzyfxQ0e687teY1lh2hdtTetDjNkyJPt\\nqY83veQ0qBygnlsW+UYhPtk=\\n-----END PRIVATE KEY-----\\n',
    spreadsheetId: '1JofB8mYGEyfg8t0CbkZC0o-8GMKY0s63QqXRl3ddWVc',
    turnstileSecretKey: '0x4AAAAAACCekkzYfeZ8s9ENMGhNlKB-rS8', /* NUXT_TURNSTILE_SECRET_KEY */

    public: {
      // Auto-populated by NUXT_PUBLIC_FIREBASE_API_KEY, etc.
      firebaseApiKey: 'AIzaSyB9qDKhlcNW-A9yPI078g6qhpQjd2X8bxw',
      firebaseAuthDomain: 'xcargo-4853b.firebaseapp.com',
      firebaseProjectId: 'xcargo-4853b',
      firebaseStorageBucket: 'xcargo-4853b.firebasestorage.app',
      firebaseMessagingSenderId: '1048897485718',
      firebaseAppId: '1:1048897485718:web:03a8bac14032a4c28a3bb7',
      firebaseMeasurementId: 'G-80KPD0XMVM',
      telegramBotName: 'xcargovbot',
      spreadsheetId: '1JofB8mYGEyfg8t0CbkZC0o-8GMKY0s63QqXRl3ddWVc',
      // turnstileSiteKey is handled by the module options above usually, but keeping for ref if needed
      turnstileSiteKey: '0x4AAAAAACCekjF3mSEvD-2s',
      firebaseVapidKey: 'BO91snwciBEECru5uzrbeRLjlgWf878kyNdiU6xDSFB3a3AQ1CCsMCQp3Rod4-SGIUIORH6S8TOcTL6i054vdGI',
    }
  },
})