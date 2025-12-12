<template>
  <div class="tracking-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('features.tracking')">
        <span class="title-shadow">{{ t('features.tracking') }}</span>
        <span class="title-front">{{ t('features.tracking') }}</span>
      </h1>
      <p class="subtitle">{{ t('search.placeholder') }}</p>
    </div>

    <!-- Fade-in Content Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      
      <!-- Search Box -->
      <div class="search-box">
        <div class="input-wrapper">
          <input 
            v-model="trackingNumber" 
            :placeholder="t('search.placeholder')" 
            class="glow-input"
            @keyup.enter="searchByTrackingNumber"
          />
          <button @click="searchByTrackingNumber" class="btn search-btn" :disabled="loading">
            {{ loading ? t('search.loading') : t('search.button') }}
          </button>
        </div>
        
        <!-- CAPTCHA -->
        <div class="captcha-wrapper">
             <ClientOnly>
                <GoogleRecaptcha 
                    :site-key="siteKey" 
                    @verify="onCaptchaVerify" 
                    @expire="onCaptchaExpire"
                />
             </ClientOnly>
        </div>
      </div>

      <!-- Results Section -->
      <div v-if="results && results.length" class="results-grid">
        <div v-for="(track, index) in results" :key="index" class="result-card">
          <div class="card-header">
            <span class="track-num">{{ track.number }}</span>
            <span :class="['status-badge', getStatusClass(track.status)]">
              {{ t('status.' + track.status) }}
            </span>
          </div>
          <div class="card-body">
             <!-- Current Info -->
             <div class="current-info-grid">
                 <div v-if="track.lastChinaStatus" class="status-box china">
                     <span class="box-label">🇨🇳 Китай</span>
                     <span class="box-val">{{ track.lastChinaStatus }}</span>
                 </div>
                 <div v-if="track.lastSecondaryStatus" class="status-box world">
                     <span class="box-label">🌍 Статус</span>
                     <span class="box-val">{{ track.lastSecondaryStatus }}</span>
                 </div>
             </div>

             <!-- History Timeline -->
             <div v-if="track.history && track.history.length" class="history-timeline">
                 <div class="timeline-title">История отслеживания</div>
                 <div class="timeline-items">
                     <!-- Sort history by date desc -->
                     <div v-for="(item, hIdx) in sortHistory(track.history)" :key="hIdx" class="timeline-item">
                         <div class="dot"></div>
                         <div class="line"></div>
                         <div class="time-content">
                             <div class="date">{{ formatDate(item.date) }}</div>
                             <div class="status-text">{{ item.status }}</div>
                             <div class="location-badge" :class="item.location === 'Китай' ? 'cn' : 'int'">
                                 {{ item.location }}
                             </div>
                         </div>
                     </div>
                 </div>
             </div>

            <!-- Legacy Description Fallback -->
            <div v-else-if="track.description" class="detail-row">
              <span class="label">{{ t('search.desc') }}:</span>
              <span class="value">{{ track.description }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- No Results / Status -->
      <div v-else-if="searched" class="status-msg">
        <p>{{ t('search.no_results') }} "{{ trackingNumber }}"</p>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'
import GoogleRecaptcha from './GoogleRecaptcha.vue'

const props = defineProps({
  triggerAnim: {
    type: Boolean,
    default: false
  }
})

const showContent = ref(false)
const trackingNumber = ref('')
const results = ref([])
const searched = ref(false)
const loading = ref(false)
const captchaToken = ref('')
const { t } = useI18n()
const config = useRuntimeConfig()
const siteKey = config.public.recaptchaSiteKey || '6LeA3SgsAAAAAONjIzFrYpzZBADfLB-OwtnP_xWB'

const onCaptchaVerify = (token) => {
    captchaToken.value = token
}

const onCaptchaExpire = () => {
    captchaToken.value = ''
}

// Animation Trigger
watch(() => props.triggerAnim, (val) => {
  if (val) {
    setTimeout(() => {
      showContent.value = true
    }, 100)
  }
}, { immediate: true })

// Search Logic
async function searchByTrackingNumber() {
  if (!trackingNumber.value.trim()) return
  
  // Check CAPTCHA
  if (!captchaToken.value) {
      alert('Пожалуйста, подтвердите, что вы не робот (CAPTCHA)')
      return
  }
  
  // ...

  
  loading.value = true
  searched.value = false
  results.value = []

  try {
    // Call Server API with Token
    const response = await $fetch('/api/track', {
        method: 'POST',
        body: {
            trackingNumber: trackingNumber.value.trim(),
            token: captchaToken.value
        }
    })
    
    if (response.found) {
        results.value = response.results
    }
    searched.value = true
  } catch (error) {
    console.error("Error search:", error)
    if (error.statusCode === 403) {
        alert('Ошибка проверки CAPTCHA. Обновите страницу.')
    } else {
        alert('Ошибка поиска.')
    }
    searched.value = true
  } finally {
    loading.value = false
  }
}

const getStatusClass = (status) => {
  const map = {
    pending: 'pending',
    in_transit: 'transit',
    arrived: 'arrived',
    delivered: 'delivered',
    lost: 'lost'
  }
  return map[status] || ''
}

const formatDate = (val) => {
  if (!val) return ''
  // Handle Firestore Timestamp or Date String
  const date = val.seconds ? new Date(val.seconds * 1000) : new Date(val)
  return date.toLocaleString('ru-RU')
}

const sortHistory = (history) => {
    return [...history].sort((a, b) => {
        const dateA = a.date.seconds ? new Date(a.date.seconds * 1000) : new Date(a.date)
        const dateB = b.date.seconds ? new Date(b.date.seconds * 1000) : new Date(b.date)
        return dateB - dateA // Descending
    })
}
</script>

<style scoped>
.tracking-content {
  position: absolute;
  top: 0;
  left: 100px; 
  z-index: 5; 
  width: calc(100vw - 120px - 20vw);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 10vh 20px 20px 20px;
  overflow: hidden;
  color: white;
  font-family: 'Poppins', sans-serif;
  pointer-events: none;
}

.tracking-content * {
  pointer-events: auto;
}

/* Title Styles */
.title-container {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s ease-out, transform 1s ease-out;
  margin-bottom: 30px;
}

.title-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.main-title {
  position: relative;
  font-family: helvetica, arial, sans-serif;
  font-weight: 800;
  font-size: clamp(1.5em, 3.5vw, 4.5em);
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
  margin-top: 10px;
  font-weight: 300;
}

/* Content Body */
.content-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
  width: 100%;
  max-width: 800px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Search Box */
.search-box {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 20px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
}

.input-wrapper {
  display: flex;
  gap: 10px;
}

.glow-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  padding: 15px;
  color: white;
  font-size: 1rem;
  font-family: inherit;
  transition: all 0.3s;
}

.glow-input:focus {
  outline: none;
  border-color: #06B6D4;
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.3);
}

.search-btn {
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  border: none;
  padding: 0 30px;
  border-radius: 12px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
}

.search-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.search-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

/* Results */
.results-grid {
  display: grid;
  gap: 15px;
  max-height: 50vh;
  overflow-y: auto;
}

.result-card {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 20px;
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
  padding-bottom: 15px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
}

.track-num {
  font-size: 1.2rem;
  font-weight: bold;
  color: #fff;
}

.status-badge {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.85rem;
  font-weight: 600;
  text-transform: uppercase;
  background: rgba(255,255,255,0.1);
}

.status-badge.pending { background: rgba(255, 165, 0, 0.2); color: #ffa500; }
.status-badge.transit { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.status-badge.arrived { background: rgba(147, 51, 234, 0.2); color: #c084fc; }
.status-badge.delivered { background: rgba(34, 197, 94, 0.2); color: #4ade80; }
.status-badge.lost { background: rgba(239, 68, 68, 0.2); color: #f87171; }

.detail-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
  font-size: 0.95rem;
}

.label {
  color: rgba(255,255,255,0.6);
}

.value {
  color: white;
  text-align: right;
}

.status-msg {
  text-align: center;
  color: #a5b4fc;
  font-size: 1.1rem;
  background: rgba(255,255,255,0.05);
  padding: 20px;
  border-radius: 12px;
}

@media (max-width: 1024px) {
  .tracking-content {
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
    height: auto;
    overflow-y: auto;
    padding-right: 0;
    gap: 20px;
  }
  .content-body::-webkit-scrollbar { display: none; }

  /* Search Box */
  .search-box {
    padding: 20px;
    width: 100%;
  }

  .input-wrapper {
    flex-direction: column;
    gap: 20px;
  }

  .glow-input {
    font-size: 2rem; /* Increased input text */
    padding: 30px;
  }

  .search-btn {
    padding: 30px;
    font-size: 4rem; /* Requested 3x size */
    width: 100%;
    line-height: 1;
  }

  /* Results */
  .result-card {
    padding: 20px;
    text-align: left;
  }

  .track-num {
    font-size: 1.6rem;
  }
  
  .status-badge {
    font-size: 1.2rem;
    padding: 8px 16px;
  }

  .detail-row {
    font-size: 1.4rem;
    margin-bottom: 12px;
  }
  
  .status-msg {
    font-size: 1.4rem;
  }
  .status-msg {
    font-size: 1.4rem;
  }
}

/* Timeline Styles */
.current-info-grid {
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
}

.status-box {
    flex: 1;
    background: rgba(255,255,255,0.05);
    padding: 10px;
    border-radius: 8px;
    border: 1px solid rgba(255,255,255,0.1);
}
.box-label { font-size: 0.8rem; color: #94a3b8; display: block; margin-bottom: 4px; }
.box-val { font-size: 0.95rem; color: #fff; font-weight: 500; }

.history-timeline {
    margin-top: 20px;
    border-top: 1px solid rgba(255,255,255,0.1);
    padding-top: 15px;
}
.timeline-title { font-size: 0.9rem; color: #94a3b8; margin-bottom: 15px; }
.timeline-items { display: flex; flex-direction: column; gap: 0; }
.timeline-item { position: relative; padding-left: 25px; padding-bottom: 20px; border-left: 1px solid rgba(255,255,255,0.1); }
.timeline-item:last-child { border-left: none; padding-bottom: 0; }

.dot {
    position: absolute;
    left: -5px;
    top: 0;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: #60a5fa;
    box-shadow: 0 0 5px rgba(96, 165, 250, 0.5);
}

.time-content { display: flex; flex-direction: column; gap: 2px; }
.date { font-size: 0.75rem; color: #64748b; }
.status-text { font-size: 0.95rem; color: #e2e8f0; }
.location-badge { 
    display: inline-block; 
    font-size: 0.7rem; 
    padding: 2px 6px; 
    border-radius: 10px; 
    background: rgba(255,255,255,0.1); 
    width: fit-content; 
    margin-top: 4px;
}
.location-badge.cn { color: #fca5a5; background: rgba(239, 68, 68, 0.1); }
.location-badge.int { color: #86efac; background: rgba(34, 197, 94, 0.1); }
</style>
