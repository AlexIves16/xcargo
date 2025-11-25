<template>
  <div class="home flex items-center justify-center w-full overflow-hidden relative">
    <!-- Убрали NavBar, так как он теперь глобальный -->

    <div class="glass-card w-full max-w-md p-8 rounded-2xl flex flex-col items-center gap-6">
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white text-center mb-2">
        Вход в систему
      </h1>

      <div class="w-full flex flex-col gap-3">
        <button 
          @click="handleGoogleLogin" 
          :disabled="loading"
          class="auth-button google-btn"
        >
          <div class="icon-wrapper">
            <img src="/icons/google.svg" alt="Google" class="w-5 h-5" />
          </div>
          <span class="btn-text">{{ loading ? 'Вход...' : 'Войти через Google' }}</span>
        </button>

        <button 
          disabled
          class="auth-button apple-btn"
        >
          <div class="icon-wrapper">
            <div class="w-5 h-5 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" viewBox="0 0 24 24" fill="currentColor">
                <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
              </svg>
            </div>
          </div>
          <span class="btn-text">Войти через Apple</span>
        </button>
      </div>

      <p v-if="error" class="text-red-500 text-xs text-center mt-1">{{ error }}</p>
      <p class="text-xs text-gray-500 text-center mt-2">Защищено Google reCAPTCHA</p>
      
      <!-- Кнопка установки PWA только на главной странице и только если приложение не установлено -->
      <InstallPwa />
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import InstallPwa from '~/components/InstallPwa.vue';

const { $auth } = useNuxtApp();
const router = useRouter();

const loading = ref(false);
const error = ref('');

const handleGoogleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const provider = new GoogleAuthProvider();
    const result = await signInWithPopup($auth, provider);
    
    const ADMIN_EMAIL = 'kairfakomylife@gmail.com';
    const userEmail = result.user.email;
    
    if (userEmail === ADMIN_EMAIL) {
      await router.push('/admin');
    } else {
      await router.push('/dashboard');
    }
  } catch (e: any) {
    console.error('Login error:', e);
    if (e.code === 'auth/popup-closed-by-user') {
      error.value = 'Вход отменен.';
    } else {
      error.value = 'Ошибка при входе.';
    }
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.home {
  min-height: calc(100vh - 70px - 50px); /* Высота экрана минус высота шапки и футера в ПК версии */
  opacity: 1 !important;
}

/* Для мобильной версии */
@media (max-width: 768px) {
  .home {
    min-height: calc(100vh - 50px - 50px); /* Высота экрана минус высота шапки и футера в мобильной версии */
    opacity: 1 !important;
  }
}

.glass-card {
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  margin-top: 0; /* Убираем отступ, так как он компенсируется через page-wrapper */
  width: 100%;
  max-width: 400px;
}

.auth-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 500;
  background: white;
  border: 1px solid #e5e7eb;
  transition: all 0.3s ease;
  cursor: pointer;
  width: 100%;
  position: relative;
  overflow: hidden;
}

.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.google-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.apple-btn {
  background-color: #000;
  color: white;
  border: 1px solid #000;
}

.apple-btn:hover:not(:disabled) {
  background-color: #1a1a1a;
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-right: 12px;
}

.btn-text {
  flex: 1;
  text-align: left;
}
</style>