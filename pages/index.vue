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
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult } from 'firebase/auth';

const { $auth } = useNuxtApp();
const router = useRouter();

const loading = ref(false);
const error = ref('');
const turnstileToken = ref('');

// Check for redirect result on mount
onMounted(async () => {
  loading.value = true;
  try {
    const result = await getRedirectResult($auth);
    if (result?.user) {
      console.log('Redirect auth successful, user:', result.user.email);
      await router.push('/dashboard');
    } else {
      console.log('No redirect result found');
    }
  } catch (e: any) {
    console.error('Redirect error:', e);
    if (e.code === 'auth/unauthorized-domain') {
      error.value = 'Домен не авторизован в Firebase Console.';
    } else if (e.code && e.code !== 'auth/popup-closed-by-user') {
      error.value = 'Ошибка при входе: ' + e.message;
    }
  } finally {
    loading.value = false;
  }
});

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
    console.log('Starting Google redirect...');
    await signInWithRedirect($auth, provider);
    // Redirect will happen automatically
  } catch (e: any) {
    console.error('Login error:', e);
    error.value = 'Ошибка при входе.';
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

.turnstile-wrapper {
  transform: scale(0.85);
  transform-origin: center;
}
</style>