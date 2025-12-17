<template>
  <div class="email-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('auth_pages.email.title')">
        <span class="title-shadow">{{ t('auth_pages.email.title') }}</span>
        <span class="title-front">{{ t('auth_pages.email.title') }}</span>
      </h1>
      <p class="subtitle">{{ t('auth_pages.email.subtitle') }}</p>
    </div>

    <!-- Content -->
    <div class="content-body" :class="{ visible: showContent }">
      <div class="glass-card">
        
        <!-- Tabs -->
        <div class="tabs-header">
           <button 
             class="tab-btn" 
             :class="{ active: mode === 'password' }"
             @click="mode = 'password'"
           >
             {{ t('auth_pages.login.tab_password') || 'Пароль' }}
           </button>
           <button 
             class="tab-btn" 
             :class="{ active: mode === 'link' }"
             @click="mode = 'link'"
           >
             {{ t('auth_pages.login.tab_link') || 'Регистрация' }}
           </button>
        </div>

        <!-- Password Login Form -->
        <form v-if="mode === 'password'" @submit.prevent="loginWithPassword" class="auth-form">
            <div class="form-group">
                <label>{{ t('auth_pages.login.email_label') }}</label>
                <input v-model="email" type="email" required class="input-field" :placeholder="t('auth_pages.login.email_placeholder')" />
            </div>
            <div class="form-group">
                <label>{{ t('auth_pages.login.password_label') }}</label>
                <input v-model="password" type="password" required class="input-field" placeholder="••••••" />
            </div>
            <button type="submit" :disabled="loading" class="action-btn primary submit-btn">
                <span v-if="loading">{{ t('auth_pages.login.loading') }}</span>
                <span v-else>{{ t('auth_pages.login.submit_btn') }}</span>
            </button>
             <div class="back-link-container">
               <a href="#" @click.prevent="$emit('navigate', 'login')" class="text-blue-400 hover:text-blue-300">
                   Назад
               </a>
            </div>
        </form>

        <div v-else-if="mode === 'link'">
            <div v-if="sent" class="success-state">
          <div class="icon-circle">
            <svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
          </div>
          <h3 class="success-title">{{ t('auth_pages.email.sent_title') }}</h3>
          <p class="text-gray-300 mb-6">
            {{ t('auth_pages.email.sent_text_1') }} <strong>{{ email }}</strong>.<br>
            {{ t('auth_pages.email.sent_text_2') }}
          </p>

          <a 
              v-if="mailProviderLink"
              :href="mailProviderLink" 
              target="_blank"
              class="action-btn primary mb-4"
          >
              {{ t('auth_pages.email.open_mail') }}
          </a>

          <button @click="sent = false" class="text-blue-400 hover:text-blue-300 underline">
            {{ t('auth_pages.email.use_other_mail') }}
          </button>
        </div>

        <form v-else @submit.prevent="sendLink" class="auth-form">
          <!-- Name Input -->
          <div class="form-group">
            <label>{{ t('auth_pages.email.name_label') }}</label>
            <input 
              v-model="name"
              type="text" 
              required
              class="input-field"
              :placeholder="t('auth_pages.email.name_placeholder')"
            />
          </div>

          <!-- Email Input -->
          <div class="form-group">
            <label>{{ t('auth_pages.email.email_label') }}</label>
            <input 
              v-model="email"
              type="email" 
              required
              class="input-field"
              :placeholder="t('auth_pages.email.email_placeholder')"
            />
          </div>

          <!-- Avatar Upload -->
          <div class="form-group">
            <label>{{ t('auth_pages.email.avatar_label') }}</label>
            <div class="avatar-upload">
              <div class="avatar-preview">
                  <img v-if="avatarPreview" :src="avatarPreview" />
                  <div v-else class="placeholder-icon">
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                  </div>
              </div>
              <label class="upload-btn">
                  {{ t('auth_pages.email.upload_btn') }}
                  <input type="file" class="hidden" accept="image/*" @change="handleFile" />
              </label>
            </div>
            <p class="hint">{{ t('auth_pages.email.hint') }}</p>
          </div>

          <button 
            type="submit" 
            :disabled="loading"
            class="action-btn primary submit-btn"
          >
            <span v-if="loading">{{ t('auth_pages.email.submit_loading') }}</span>
            <span v-else>{{ t('auth_pages.email.submit') }}</span>
          </button>

          <div id="recaptcha-container"></div>

           <div class="back-link-container">
              <a href="#" @click.prevent="$emit('navigate', 'login')" class="text-blue-400 hover:text-blue-300">
                  {{ t('auth_pages.email.back') }}
              </a>
           </div>
        </form>
        </div> <!-- End of mode === 'link' wrapper -->

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, nextTick } from 'vue';
import { sendSignInLinkToEmail, signInWithEmailAndPassword } from 'firebase/auth'; // Added import
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  triggerAnim: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['navigate'])

const showContent = ref(false)
const { $auth } = useNuxtApp()
const config = useRuntimeConfig()
const { t } = useI18n()

// Logic Vars
const mode = ref('password'); // 'password' | 'link' - Default to password as per request logic ("not only reg but auth")
const name = ref('');
const email = ref('');
const password = ref(''); // New
const avatarPreview = ref(null);
const loading = ref(false);
const sent = ref(false);
const recaptchaVerified = ref(false);
const recaptchaWidgetId = ref(null);

// Animation
watch(() => props.triggerAnim, (val) => {
  if (val) setTimeout(() => { showContent.value = true }, 100)
})
onMounted(() => {
  if (props.triggerAnim) setTimeout(() => { showContent.value = true }, 100)
})

const initRecaptcha = () => {
    if (recaptchaWidgetId.value !== null) return;
    
    // Ensure container exists
    nextTick(() => {
        const container = document.getElementById('recaptcha-container');
        if (container && window.grecaptcha) {
             grecaptcha.ready(() => {
                try {
                    recaptchaWidgetId.value = grecaptcha.render('recaptcha-container', {
                        'sitekey': config.public.recaptchaSiteKey,
                        'callback': (response) => {
                            recaptchaVerified.value = !!response;
                        },
                        'expired-callback': () => {
                            recaptchaVerified.value = false;
                        }
                    });
                } catch (e) {
                    // Already rendered or error
                    console.log('Recaptcha render error or already rendered', e);
                }
             });
        }
    });
};

watch(mode, (newMode) => {
    if (newMode === 'link') {
        setTimeout(initRecaptcha, 500); // Give time for transition
    }
});

const mailProviderLink = computed(() => {
    if (!email.value) return null;
    const domain = email.value.split('@')[1]?.toLowerCase();
    if (!domain) return null;

    const providers = {
        'gmail.com': 'https://mail.google.com/',
        'mail.ru': 'https://e.mail.ru/inbox/',
        'bk.ru': 'https://e.mail.ru/inbox/',
        'list.ru': 'https://e.mail.ru/inbox/',
        'inbox.ru': 'https://e.mail.ru/inbox/',
        'yandex.ru': 'https://mail.yandex.ru/',
        'ya.ru': 'https://mail.yandex.ru/',
        'icloud.com': 'https://www.icloud.com/mail',
        'me.com': 'https://www.icloud.com/mail',
        'yahoo.com': 'https://mail.yahoo.com/',
        'outlook.com': 'https://outlook.live.com/mail/',
        'hotmail.com': 'https://outlook.live.com/mail/',
        'proton.me': 'https://mail.proton.me/',
        'protonmail.com': 'https://mail.proton.me/',
        'ukr.net': 'https://mail.ukr.net/'
    };

    return providers[domain] || `http://${domain}`;
});

// Simple Image handler (no compression for simplicity in this file, adding logic directly)
const handleFile = (event) => {
    const file = event.target.files[0];
    if (!file) return;
    
    // Basic Size check (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert(t('auth_pages.email.error_file_size'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      avatarPreview.value = e.target.result;
    };
    reader.readAsDataURL(file);
};

const sendLink = async () => {
    if (!recaptchaVerified.value) {
        alert('Пожалуйста, подтвердите, что вы не робот (капча)');
        return;
    }
    loading.value = true;
    
    try {
        localStorage.setItem('emailForSignIn', email.value);
        localStorage.setItem('tempName', name.value);
        
        if (avatarPreview.value) {
            localStorage.setItem('tempAvatar', avatarPreview.value);
        }

        const actionCodeSettings = {
            // Updated to match your app structure - relying on page handling /auth/finish
            // In Hash mode or SPA, this might need to be specific.
            // Using /auth-finish route key logic
            url: window.location.origin + '/auth/finish?email=' + encodeURIComponent(email.value),
            handleCodeInApp: true,
        };

        await sendSignInLinkToEmail($auth, email.value, actionCodeSettings);
        sent.value = true;

    } catch (error) {
        console.error('Email Auth Error:', error);
        alert(t('auth_pages.finish.error_title') + ': ' + error.message);
    } finally {
        loading.value = false;
    }
};

const loginWithPassword = async () => {
    loading.value = true;
    try {
        await signInWithEmailAndPassword($auth, email.value, password.value);
        emit('navigate', 'dashboard');
    } catch (e) {
        console.error("Login Error:", e);
        alert('Ошибка входа: ' + (e.message === 'Firebase: Error (auth/invalid-credential).' ? 'Неверный email или пароль' : e.message));
    } finally {
        loading.value = false;
    }
};
</script>

<style scoped>
.email-content {
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
  padding: 10vh 20px 20px 20px;
  overflow: hidden; /* Remove scrollbar */
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
  font-size: clamp(1.5em, 3vw, 3em);
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
  top: 4px;
  left: 4px;
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
  font-size: 1rem;
  color: #c7d2fe;
  margin-top: 10px;
  font-weight: 300;
}

/* Content Body */
.content-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
  width: 100%;
  max-width: 400px; /* Reduced width */
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

.glass-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px; /* Reduced padding */
  border-radius: 20px;
  backdrop-filter: blur(10px);
  width: 100%;
}

.tabs-header {
  display: flex;
  gap: 10px;
  margin-bottom: 15px; /* Reduced margin */
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 10px;
}

.tab-btn {
  background: transparent;
  border: none;
  color: #94a3b8;
  font-size: 1rem;
  padding: 8px 15px;
  cursor: pointer;
  transition: all 0.2s;
  border-radius: 8px;
}

.tab-btn.active {
  color: white;
  background: rgba(255,255,255,0.1);
  font-weight: 600;
}

.auth-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 4px; /* Reduced gap */
}

.form-group label {
  font-size: 0.9rem;
  color: #c7d2fe;
}

.input-field {
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  padding: 8px 12px; /* Reduced padding */
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.input-field:focus {
  border-color: #818CF8;
}

/* Avatar */
.avatar-upload {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-preview {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.2);
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.placeholder-icon {
  width: 24px;
  height: 24px;
  color: rgba(255, 255, 255, 0.5);
}

.upload-btn {
  background: rgba(255, 255, 255, 0.1);
  padding: 8px 15px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.2s;
  border: 1px solid rgba(255, 255, 255, 0.1);
}
.upload-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

.hint {
  font-size: 0.75rem;
  color: #7b86aa;
  margin: 0;
}

/* Buttons */
.action-btn {
  width: 100%;
  padding: 10px; /* Reduced padding */
  border: none;
  border-radius: 12px;
  font-size: 1rem;
  font-weight: 600;
  cursor: pointer;
  transition: transform 0.2s, background 0.2s;
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  text-decoration: none;
}
.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
}
.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.primary {
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.success-state {
  text-align: center;
}

.icon-circle {
  width: 60px;
  height: 60px;
  background: rgba(52, 211, 153, 0.2);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px auto;
}

.success-title {
  font-size: 1.5rem;
  margin-bottom: 10px;
  color: white;
}

.back-link-container {
  text-align: center;
  /* margin-top: 10px; removed */
}

.hidden {
  display: none;
}

@media (max-width: 1024px) {
  .email-content {
    left: 0;
    width: 100%;
    padding: 95px 10px 140px 10px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
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
    padding-top: 100px;
    text-align: center;
  }

  .main-title {
    font-size: 2rem;
    line-height: 1.1;
  }

  .subtitle {
    font-size: 0.9rem;
    padding: 10px;
    margin: 0;
    line-height: 1.2;
  }

  .content-body {
    width: 100%;
    max-width: 100%;
    justify-content: center;
    display: flex;
  }

  .glass-card {
    max-width: 100%;
    padding: 20px;
    background: transparent;
    border: none;
  }

  .form-group label {
    font-size: 0.9rem;
    text-align: left;
    width: 100%;
  }

  .input-field {
    padding: 12px;
    font-size: 1rem;
    border-radius: 10px;
  }

  .action-btn {
    padding: 12px;
    font-size: 1rem;
    border-radius: 10px;
  }
  
  .hint {
    font-size: 1.2rem;
  }

  .success-title {
    font-size: 2rem;
  }
}
</style>
