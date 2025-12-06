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

      <!-- Telegram App Login Button (Deep Link) -->
      <button 
        @click="signInWithTelegramApp" 
        :disabled="loading || telegramPolling"
        class="w-full flex items-center justify-center gap-3 bg-[#0088cc] text-white font-medium py-3 px-4 rounded-lg hover:bg-[#006699] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0088cc]"
      >
        <svg class="w-6 h-6" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
        </svg>
        <span v-if="telegramPolling">Ожидание подтверждения...</span>
        <span v-else>Войти через Telegram</span>
      </button>

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
const telegramPolling = ref(false);
let pollInterval: any = null;

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

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval);
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

const signInWithTelegramApp = async () => {
  error.value = '';
  
  try {
    // 1. Get auth token and deep link
    const response = await $fetch<{ token: string; deepLink: string }>('/api/auth/telegram-init', {
      method: 'POST'
    });
    
    // 2. Open Telegram app
    window.location.href = response.deepLink;
    
    // 3. Start polling for confirmation
    telegramPolling.value = true;
    
    pollInterval = setInterval(async () => {
      try {
        const status = await $fetch<{ status: string; token?: string }>('/api/auth/telegram-status', {
          params: { token: response.token }
        });
        
        if (status.status === 'confirmed' && status.token) {
          clearInterval(pollInterval);
          telegramPolling.value = false;
          
          await signInWithCustomToken($auth, status.token);
          router.push('/dashboard');
        } else if (status.status === 'expired') {
          clearInterval(pollInterval);
          telegramPolling.value = false;
          error.value = 'Время ожидания истекло. Попробуйте снова.';
        }
      } catch (e) {
        console.error('Polling error:', e);
      }
    }, 2000); // Poll every 2 seconds
    
    // Stop polling after 5 minutes
    setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval);
        telegramPolling.value = false;
      }
    }, 5 * 60 * 1000);
    
  } catch (e: any) {
    console.error('Telegram app login error:', e);
    error.value = 'Ошибка при открытии Telegram. Попробуйте снова.';
    telegramPolling.value = false;
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

