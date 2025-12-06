<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Вход в систему</h1>
      
      <button 
        @click="signInWithGoogle" 
        :disabled="loading"
        class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <img src="/icons/google.svg" alt="Google" class="w-6 h-6" />
        <span>{{ loading ? 'Вход...' : 'Войти через Google' }}</span>
      </button>

      <div class="relative my-6">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-gray-300"></div>
        </div>
        <div class="relative flex justify-center text-sm">
          <span class="px-2 bg-white text-gray-500">Или через Telegram</span>
        </div>
      </div>

      <TelegramLogin @callback="handleTelegramLogin" />

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithRedirect, getRedirectResult, signInWithCustomToken } from 'firebase/auth';

const { $auth } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const error = ref('');

onMounted(async () => {
  // 1. Check Redirect Result (Browser flow - Google)
  try {
    const result = await getRedirectResult($auth);
    if (result?.user) {
      router.push('/dashboard');
      return;
    }
  } catch (e: any) {
    console.error('Redirect result error:', e);
    // Don't show error here, as it might be just no redirect result
  }

  // 2. Check Telegram WebApp (TMA flow)
  const tg = (window as any).Telegram?.WebApp;
  if (tg && tg.initData) {
    console.log('Telegram WebApp detected');
    loading.value = true;
    
    try {
      tg.expand();
      
      const response = await $fetch<{ token: string }>('/api/auth/telegram', {
        method: 'POST',
        body: {
          initData: tg.initData
        }
      });
      
      await signInWithCustomToken($auth, response.token);
      router.push('/dashboard');
    } catch (e) {
      console.error('TMA Login error:', e);
      error.value = 'Ошибка автоматического входа через Telegram';
      loading.value = false;
    }
  }
});

const signInWithGoogle = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const provider = new GoogleAuthProvider();
    await signInWithRedirect($auth, provider);
  } catch (e: any) {
    console.error('Login error:', e);
    error.value = 'Ошибка при входе. Проверьте консоль Firebase.';
    loading.value = false;
  }
};

const handleTelegramLogin = async (user: any) => {
  loading.value = true;
  error.value = '';

  try {
    const response = await $fetch<{ token: string }>('/api/auth/telegram', {
      method: 'POST',
      body: user
    });
    
    await signInWithCustomToken($auth, response.token);
    router.push('/dashboard');
  } catch (e: any) {
    console.error('Telegram login error:', e);
    error.value = 'Ошибка входа через Telegram. Попробуйте снова.';
    loading.value = false;
  }
};
</script>
