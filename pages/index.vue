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
          :disabled="!turnstileToken || loading"
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
            <img src="https://www.svgrepo.com/show/445633/apple.svg" alt="Apple" class="w-5 h-5 invert" />
          </div>
          <span class="btn-text">Войти через Apple</span>
        </button>
      </div>

      <!-- Cloudflare Turnstile -->
      <div class="turnstile-wrapper">
        <TurnstileWidget @verify="onTurnstileVerify" @expire="onTurnstileExpire" />
      </div>

      <p v-if="error" class="text-red-500 text-xs text-center mt-1">{{ error }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const { $auth } = useNuxtApp();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const turnstileToken = ref('');

const onTurnstileVerify = (token: string) => {
  turnstileToken.value = token;
  error.value = '';
};

const onTurnstileExpire = () => {
  turnstileToken.value = '';
  error.value = 'Проверка безопасности истекла.';
};

const handleGoogleLogin = async () => {
  if (!turnstileToken.value) {
    error.value = 'Пожалуйста, пройдите проверку безопасности.';
    return;
  }

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

.google-btn:hover:not(:disabled) {
  background-color: #f9fafb;
  border-color: #d1d5db;
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

.turnstile-wrapper {
  transform: scale(0.85); /* Make widget slightly smaller to fit better */
  transform-origin: center;
}
</style>