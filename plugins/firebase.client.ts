import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const firebaseConfig = {
    apiKey: config.public.firebaseApiKey,
    authDomain: config.public.firebaseAuthDomain,
    projectId: config.public.firebaseProjectId,
    storageBucket: config.public.firebaseStorageBucket,
    messagingSenderId: config.public.firebaseMessagingSenderId,
    appId: config.public.firebaseAppId,
    measurementId: config.public.firebaseMeasurementId
  };

  console.log('🔥 Firebase Config Loaded:', {
    apiKey: firebaseConfig.apiKey ? 'Present' : 'MISSING',
    senderId: firebaseConfig.messagingSenderId ? 'Present' : 'MISSING',
    projectId: firebaseConfig.projectId ? 'Present' : 'MISSING'
  });

  if (!firebaseConfig.apiKey) {
    console.warn("⚠️ Firebase API Key missing. Running in UI-only mode.");
    return {
      provide: {
        auth: null,
        db: null
      }
    };
  }

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
  // const analytics = getAnalytics(app);
  const auth = getAuth(app);
  const db = getFirestore(app);

  let messaging = null;

  if (process.client) {
    import('firebase/messaging').then(({ getMessaging }) => {
      // Create messaging instance
      try {
        messaging = getMessaging(app);
      } catch (e) {
        console.warn('Firebase Messaging not supported:', e);
      }
    });

    onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Check if running in PWA (Standalone) mode
        const isPWA = window.matchMedia('(display-mode: standalone)').matches || (window.navigator as any).standalone === true;

        if (!isPWA) {
          // Browser mode: Check if session is older than 24 hours
          const lastSignInTime = user.metadata.lastSignInTime;
          if (lastSignInTime) {
            const loginTime = new Date(lastSignInTime).getTime();
            const now = Date.now();
            const twentyFourHours = 24 * 60 * 60 * 1000;

            if (now - loginTime > twentyFourHours) {
              console.log("Session expired (Browser mode > 24h). Logging out.");
              await signOut(auth);
              window.location.href = '/login';
            }
          }
        }
      }
    });
  }

  return {
    provide: {
      auth,
      db,
      messaging: () => messaging // Return as function or getter to handle async import
    }
  };
});
