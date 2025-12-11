<template>
  <div class="auth-finish-content">
    <div class="glass-card">
      
      <!-- Processing State -->
      <div v-if="processing" class="state-container">
        <div class="spinner"></div>
        <h2 class="state-title">{{ t('auth_pages.finish.processing_title') }}</h2>
        <p class="state-desc">{{ t('auth_pages.finish.processing_desc') }}</p>
      </div>

      <!-- Confirm Email State -->
      <div v-else-if="waitingForEmail" class="state-container left-align">
         <h2 class="state-title">{{ t('auth_pages.finish.confirm_title') }}</h2>
         <p class="state-desc">{{ t('auth_pages.finish.confirm_desc') }}</p>
         
         <form @submit.prevent="confirmEmail" class="auth-form">
            <input 
                v-model="emailInput"
                type="email" 
                required
                class="input-field"
                placeholder="name@example.com"
            />
            <p v-if="error" class="error-text">{{ error }}</p>
            <button 
                type="submit" 
                class="action-btn primary"
            >
                {{ t('auth_pages.finish.confirm_btn') }}
            </button>
         </form>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="state-container">
        <h3 class="error-title">{{ t('auth_pages.finish.error_title') }}</h3>
        <p class="error-text">{{ error }}</p>
        <button @click="goToEmail" class="text-blue-400 hover:underline mt-4">
            {{ t('auth_pages.finish.retry') }}
        </button>
      </div>

      <!-- Set Password State (New) -->
      <div v-else-if="settingPassword" class="state-container left-align">
          <h2 class="state-title">Создание пароля</h2>
          <p class="state-desc">Придумайте пароль, чтобы в следующий раз входить без письма.</p>
          
          <form @submit.prevent="savePassword" class="auth-form">
             <input 
                 v-model="passwordInput"
                 type="password" 
                 required
                 minlength="6"
                 class="input-field"
                 placeholder="Новый пароль (минимум 6 символов)"
             />
             <button type="submit" class="action-btn primary">
                 Сохранить и войти
             </button>
             <button type="button" @click="skipPassword" class="text-gray-400 hover:text-white mt-4 text-sm w-full">
                 Пропустить (входить по ссылке)
             </button>
          </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { isSignInWithEmailLink, signInWithEmailLink, updateProfile, updatePassword } from 'firebase/auth';
import { getStorage, ref as storageRef, uploadString, getDownloadURL } from 'firebase/storage';
import { useI18n } from '@/composables/useI18n'

const { $auth } = useNuxtApp();
const router = useRouter();
const { t } = useI18n()

const processing = ref(true);
const waitingForEmail = ref(false);
const settingPassword = ref(false); // New state
const emailInput = ref('');
const passwordInput = ref('');
const error = ref('');

const goToEmail = () => {
    // Navigate back to email auth start
    if (typeof window !== 'undefined') {
        window.history.pushState({ view: 'login' }, '', '/auth/email')
        // Ideally emit event to page.vue to change view
        // But here we are likely mounted via page.vue routing logic
    }
}

const confirmEmail = async () => {
  if (!emailInput.value) return;
  waitingForEmail.value = false;
  processing.value = true;
  await completeSignIn(emailInput.value);
};

const completeSignIn = async (email) => {
  try {
    const result = await signInWithEmailLink($auth, email, window.location.href);
    const user = result.user;

    // Restore temp profile data
    const tempName = localStorage.getItem('tempName');
    const tempAvatar = localStorage.getItem('tempAvatar'); // Base64

    let photoURL = user.photoURL;

    // Upload Avatar if exists
    if (tempAvatar) {
      try {
          const storage = getStorage();
          const avatarRef = storageRef(storage, `avatars/${user.uid}/profile.webp`);
          
          await uploadString(avatarRef, tempAvatar, 'data_url');
          photoURL = await getDownloadURL(avatarRef);
      } catch (e) {
          console.error('Avatar upload failed:', e);
      }
    }

    // Update Profile
    if (tempName || photoURL !== user.photoURL) {
        await updateProfile(user, {
            displayName: tempName || user.displayName,
            photoURL: photoURL
        });
    }

    // Cleanup
    localStorage.removeItem('emailForSignIn');
    localStorage.removeItem('tempName');
    localStorage.removeItem('tempAvatar');

    // Prompt for password creation instead of redirecting immediately
    processing.value = false;
    settingPassword.value = true;
    
  } catch (e) {
    console.error('Auth Error:', e);
    if (e.code === 'auth/invalid-action-code') {
       error.value = 'Ссылка устарела или уже использована. Попробуйте войти заново.';
       processing.value = false;
    } else if (e.code === 'auth/invalid-email' || e.code === 'auth/user-mismatch') {
       error.value = t('auth_pages.finish.error_invalid_email');
       waitingForEmail.value = true;
       processing.value = false;
    } else {
       error.value = e.message;
       processing.value = false;
    }
  }
};

onMounted(async () => {
  if (isSignInWithEmailLink($auth, window.location.href)) {
    let email = localStorage.getItem('emailForSignIn');
    
    // Check URL params if local storage is empty
    if (!email) {
       const params = new URLSearchParams(window.location.search);
       email = params.get('email');
    }

    if (!email) {
      waitingForEmail.value = true;
      processing.value = false;   
    } else {
      await completeSignIn(email);
    }
  } else {
      error.value = t('auth_pages.finish.error_invalid_link');
      processing.value = false;
  }
});
</script>

<script>
// Separate block for additional functions if needed, simply modifying usage above in <script setup>
</script>

<script setup>
// Adding savePassword and skipPassword functions
const savePassword = async () => {
    if (!passwordInput.value || passwordInput.value.length < 6) {
        alert('Пароль должен быть не менее 6 символов');
        return;
    }
    try {
        await updatePassword($auth.currentUser, passwordInput.value);
        router.push('/dashboard');
    } catch (e) {
        console.error('Password set error:', e);
        alert('Ошибка сохранения пароля: ' + e.message);
    }
};

const skipPassword = () => {
    router.push('/dashboard');
};
</script>

<style scoped>
.auth-finish-content {
  position: absolute;
  top: 0;
  left: 0; /* Full screen centralized for finish logic? */
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50; /* Top level */
  background: rgba(0,0,0,0.8); /* Dim background */
  color: white;
  font-family: 'Poppins', sans-serif;
  pointer-events: auto;
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  width: 90%;
  max-width: 400px;
  text-align: center;
}

.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.state-container.left-align {
    align-items: flex-start;
    text-align: left;
}

.spinner {
  width: 50px;
  height: 50px;
  border: 4px solid rgba(255,255,255,0.1);
  border-top-color: #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 20px;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state-title {
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 10px;
}

.state-desc {
  color: #c7d2fe;
}

.auth-form {
    width: 100%;
    margin-top: 20px;
}

.input-field {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 12px 15px;
  color: white;
  font-size: 1rem;
  outline: none;
  margin-bottom: 10px;
}

.input-field:focus {
  border-color: #818CF8;
}

.action-btn {
  width: 100%;
  padding: 12px;
  border: none;
  border-radius: 10px;
  font-weight: 600;
  cursor: pointer;
}

.primary {
  background: #2563EB;
  color: white;
}

.error-text {
    color: #ef4444;
    font-size: 0.9rem;
    margin-bottom: 10px;
}

.error-title {
    color: #ef4444;
    font-size: 1.2rem;
    margin-bottom: 5px;
}
@media (max-width: 1024px) {
  .glass-card {
    max-width: 100%;
    padding: 20px;
    background: transparent;
    border: none;
    width: 100%;
  }

  .state-title {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  .state-desc {
    font-size: 1.6rem;
    margin-bottom: 30px;
  }

  .input-field {
    padding: 30px;
    font-size: 2rem;
    border-radius: 16px;
    margin-bottom: 20px;
  }

  .action-btn {
    padding: 30px;
    font-size: 2rem;
    border-radius: 16px;
  }

  .spinner {
    transform: scale(1.5);
    margin-bottom: 40px;
  }
}
</style>
