<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-lg shadow-md w-full max-w-md">
      <h1 class="text-2xl font-bold mb-6 text-center text-gray-800">Вход в систему</h1>
      
      <button 
        @click="signInWithGoogle" 
        :disabled="loading"
        class="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 text-gray-700 font-medium py-3 px-4 rounded-lg hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" class="w-6 h-6" />
        <span>{{ loading ? 'Вход...' : 'Войти через Google' }}</span>
      </button>

      <p v-if="error" class="mt-4 text-sm text-red-600 text-center">
        {{ error }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

const { $auth } = useNuxtApp();
const router = useRouter();
const loading = ref(false);
const error = ref('');

const signInWithGoogle = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const provider = new GoogleAuthProvider();
    await signInWithPopup($auth, provider);
    router.push('/dashboard');
  } catch (e: any) {
    console.error('Login error:', e);
    if (e.code === 'auth/popup-closed-by-user') {
      error.value = 'Вход отменен пользователем.';
    } else {
      error.value = 'Ошибка при входе. Проверьте консоль Firebase.';
    }
  } finally {
    loading.value = false;
  }
};
</script>
