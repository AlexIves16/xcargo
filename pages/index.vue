<template>
  <div class="home flex items-center justify-center min-h-screen p-4 relative">
    <!-- Navigation -->
    <NavBar />

    <!-- Glassmorphism Card -->
    <div class="glass-card w-full max-w-md p-8 rounded-2xl flex flex-col items-center gap-6 mt-16">
      
      <h1 class="text-xl font-semibold text-gray-800 dark:text-white text-center mb-2">
        Вход в систему
      </h1>

      <div class="w-full flex flex-col gap-3">
        <!-- Google Sign In -->
        <button 
          @click="handleGoogleLogin" 
          :disabled="loading"
          class="auth-button google-btn"
        >
          <div class="icon-wrapper">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-5 h-5" />
          </div>
          <span class="btn-text">{{ loading ? 'Вход...' : 'Войти через Google' }}</span>
        </button>

        <!-- Apple Sign In (Placeholder) -->
        <button 
          disabled
          class="auth-button apple-btn"
        >
          <div class="icon-wrapper">
            <img src="/apple.svg" alt="Apple" class="w-5 h-5 invert" />
          </div>
          <span class="btn-text">Войти через Apple</span>
        </button>
      </div>

      <p v-if="error" class="text-red-500 text-xs text-center mt-1">{{ error }}</p>
      <p class="text-xs text-gray-500 text-center mt-2">Защищено Google reCAPTCHA</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const { $auth } = useNuxtApp();
const router = useRouter();

const loading = ref(false);
const error = ref('');

const handleGoogleLogin = async () => {
  loading.value = true;
  error.value = '';

  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup($auth, provider);
    router.push('/dashboard');
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
.glass-card {
  background: rgba(255, 255, 255, 0.7);
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
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
  transition: all 0.15s ease;
  cursor: pointer;
}

.auth-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.google-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
  transform: translateY(-1px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.apple-btn {
  background-color: #000;
  color: white;
  border: 1px solid #000;
}

.apple-btn:hover:not(:disabled) {
  background-color: #1a1a1a;
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