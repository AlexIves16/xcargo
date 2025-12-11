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
            <div v-if="track.description" class="detail-row">
              <span class="label">{{ t('search.desc') }}:</span>
              <span class="value">{{ track.description }}</span>
            </div>
            <div v-if="track.sentAt" class="detail-row">
              <span class="label">{{ t('search.sent') }}:</span>
              <span class="value">{{ track.sentAt }}</span>
            </div>
            <div v-if="track.arrivedAt" class="detail-row">
              <span class="label">{{ t('search.arrived') }}:</span>
              <span class="value">{{ formatDate(track.arrivedAt) }}</span>
            </div>
            <div v-if="track.batchNumber" class="detail-row">
              <span class="label">{{ t('search.batch') }}:</span>
              <span class="value">{{ track.batchNumber }}</span>
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
import { collection, query, where, getDocs } from 'firebase/firestore'
import { useI18n } from '@/composables/useI18n'

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
const { t } = useI18n()

// Use Nuxt App for DB
const { $db } = useNuxtApp()

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

// Search Logic
async function searchByTrackingNumber() {
  if (!trackingNumber.value.trim()) return
  
  loading.value = true
  searched.value = false
  results.value = []

  try {
    const q = query(
      collection($db, 'tracks'), 
      where('number', '==', trackingNumber.value.trim())
    )
    
    const querySnapshot = await getDocs(q)
    results.value = querySnapshot.docs.map(doc => doc.data())
    searched.value = true
  } catch (error) {
    console.error("Error search:", error)
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

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('ru-RU')
  }
  return new Date(timestamp).toLocaleDateString('ru-RU')
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
}
</style>
