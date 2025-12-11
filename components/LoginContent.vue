<template>
  <div class="login-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('auth_pages.login.title')">
        <span class="title-shadow">{{ t('auth_pages.login.title') }}</span>
        <span class="title-front">{{ t('auth_pages.login.title') }}</span>
      </h1>
      <p class="subtitle">{{ t('auth_pages.login.subtitle') }}</p>
    </div>

    <!-- Fade-in Content Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      <div class="login-card">
        
        <!-- Google Button -->
        <button 
          @click="signInWithGoogle" 
          :disabled="loading"
          class="auth-btn google"
        >
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" class="icon" alt="Google" />
          <span>{{ loading ? t('auth_pages.login.loading') : t('auth_pages.login.google') }}</span>
        </button>

        <!-- Telegram Button -->
        <button 
          @click="signInWithTelegramApp" 
          :disabled="loading || telegramPolling"
          class="auth-btn telegram"
        >
          <svg class="icon tg-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
          </svg>
          <span v-if="telegramPolling">{{ t('auth_pages.login.telegram_confirm') }}</span>
          <span v-else>{{ t('auth_pages.login.telegram') }}</span>
        </button>

        <!-- Email Button -->
        <button @click="goToEmailAuth" class="auth-btn email">
          <svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
          <span>{{ t('auth_pages.login.email_btn') }}</span>
        </button>

        <p v-if="error" class="error-msg">
          {{ error }}
        </p>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted } from 'vue'
import { GoogleAuthProvider, signInWithPopup, signInWithCustomToken } from 'firebase/auth'
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  triggerAnim: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navigate'])

const showContent = ref(false)
const loading = ref(false)
const error = ref('')
const telegramPolling = ref(false)
let pollInterval = null
const { t } = useI18n()

// Use Nuxt App for Auth
const { $auth } = useNuxtApp()
const router = useRouter()

// Animation Trigger
watch(() => props.triggerAnim, (val) => {
  if (val) {
    setTimeout(() => { showContent.value = true }, 100)
  }
})

onMounted(() => {
  if (props.triggerAnim) {
    setTimeout(() => { showContent.value = true }, 100)
  }
})

onUnmounted(() => {
  if (pollInterval) {
    clearInterval(pollInterval)
  }
})

// Handlers
const signInWithGoogle = async () => {
  loading.value = true
  error.value = ''
  
  try {
    const provider = new GoogleAuthProvider()
    const result = await signInWithPopup($auth, provider)
    
    // Check if admin
    const user = result.user
    const ADMIN_EMAIL = 'kairfakomylife@gmail.com'
    
    // In this SPA context, we might redirect or emit success.
    // For now, mirroring user's router logic
    if (user.email === ADMIN_EMAIL) {
      router.push('/admin')
    } else {
      router.push('/dashboard')
    }
  } catch (e) {
    console.error('Login error:', e)
    if (e.code === 'auth/popup-closed-by-user') {
      error.value = t('auth_pages.login.error_user_cancel')
    } else {
      error.value = t('auth_pages.login.error_generic')
    }
  } finally {
    loading.value = false
  }
}

const signInWithTelegramApp = async () => {
  error.value = ''
  
  try {
    // 1. Get auth token and deep link
    const response = await $fetch('/api/auth/telegram-init', {
      method: 'POST'
    })
    
    // 2. Open Telegram app
    window.location.href = response.deepLink
    
    // 3. Start polling for confirmation
    telegramPolling.value = true
    
    pollInterval = setInterval(async () => {
      try {
        const status = await $fetch('/api/auth/telegram-status', {
          params: { token: response.token }
        })
        
        if (status.status === 'confirmed' && status.token) {
          clearInterval(pollInterval)
          telegramPolling.value = false
          
          await signInWithCustomToken($auth, status.token)
          router.push('/dashboard')
        } else if (status.status === 'expired') {
          clearInterval(pollInterval)
          telegramPolling.value = false
          error.value = t('auth_pages.login.error_timeout')
        }
      } catch (e) {
        console.error('Polling error:', e)
      }
    }, 2000) // Poll every 2 seconds
    
    // Stop polling after 5 minutes
    setTimeout(() => {
      if (pollInterval) {
        clearInterval(pollInterval)
        telegramPolling.value = false
      }
    }, 5 * 60 * 1000)
    
  } catch (e) {
    console.error('Telegram app login error:', e)
    error.value = t('auth_pages.login.error_tg_open')
    telegramPolling.value = false
  }
}

const goToEmailAuth = () => {
   emit('navigate', 'email-auth')
}
</script>

<style scoped>
.login-content {
  position: absolute;
  top: 0;
  left: 100px; 
  z-index: 20; 
  width: calc(100vw - 120px - 20vw);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  padding: 15vh 20px 20px 20px;
  overflow: hidden;
  color: white;
  font-family: 'Poppins', sans-serif;
  pointer-events: auto;
}

/* Title Styles */
.title-container {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s ease-out, transform 1s ease-out;
  margin-bottom: 30px;
  text-align: left;
}

.title-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.main-title {
  position: relative;
  font-family: helvetica, arial, sans-serif;
  font-weight: 800;
  font-size: clamp(2em, 4vw, 5em);
  line-height: 1em;
  margin: 0;
  padding: 0;
  display: inline-block;
}

.title-front {
  position: relative;
  z-index: 2;
  color: #fff;
  display: block;
}

.title-shadow {
  position: absolute;
  top: 6px;
  left: 6px;
  z-index: 1;
  color: transparent;
  background: linear-gradient(90deg, #4F46E5, #06B6D4, #9333EA, #2563EB, #4F46E5);
  background-size: 300% 100%;
  animation: shadow-flow 20s linear infinite;
  -webkit-background-clip: text;
  background-clip: text;
  width: 100%;
  height: 100%;
  -webkit-text-fill-color: transparent; 
  opacity: 0.8; 
}

@keyframes shadow-flow {
  0% { background-position: 0% 50%; }
  100% { background-position: 100% 50%; }
}

.subtitle {
  font-size: 1.1rem;
  color: #c7d2fe;
  margin-top: 15px;
  font-weight: 300;
}

/* Content Body */
.content-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
  width: 100%;
  display: flex;
  justify-content: flex-start;
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

.login-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 40px;
  border-radius: 20px;
  backdrop-filter: blur(10px);
  width: 100%;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.auth-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 14px;
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  font-family: inherit;
  color: white;
  width: 100%;
}

.auth-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}

.auth-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.google {
  background: white;
  color: #333;
}
.google:hover:not(:disabled) {
  background: #f1f1f1;
}

.telegram {
  background: #0088cc;
}
.telegram:hover:not(:disabled) {
  background: #0077b3;
}

.email {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
}
.email:hover {
  background: rgba(255,255,255,0.15);
}

.icon {
  width: 24px;
  height: 24px;
}

.tg-icon {
  color: white;
}

.error-msg {
  color: #ff6b6b;
  text-align: center;
  font-size: 0.9rem;
  margin-top: 10px;
}

@media (max-width: 1024px) {
  .login-content {
    left: 0;
    width: 100%;
    padding: 95px 10px 140px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center; /* Center vertically */
    text-align: center;
    gap: 15px;
  }

  .title-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 20px;
    padding-top: 90px;
    text-align: center;
  }

  .main-title {
    font-size: 4.3rem;
    line-height: 1;
  }

  .subtitle {
    font-size: 1.6rem;
    padding: 24px;
    margin: 0;
    line-height: 1.2;
  }

  .content-body {
    width: 100%;
    justify-content: center;
  }

  .login-card {
    max-width: 100%;
    padding: 20px;
    background: transparent; /* Cleaner look on mobile or keep it? user likes premium. let's keep tint but maybe less padding */
    border: none;
    gap: 25px;
  }
  
  .auth-btn {
    padding: 30px;
    font-size: 2rem; /* Large but fits text */
    border-radius: 16px;
    gap: 20px;
  }

  .icon {
    width: 40px;
    height: 40px;
  }

  .error-msg {
    font-size: 1.4rem;
  }
}
</style>
