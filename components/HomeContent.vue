<template>
  <div class="home-content">
    
    <!-- Animated Title Wrapper -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('hero.title')">
        <span class="title-shadow">{{ t('hero.title') }}</span>
        <span class="title-front">{{ t('hero.title') }}</span>
      </h1>
    </div>

    <!-- Fade-in Content Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      
      <!-- Intro & Buttons -->
      <div class="intro-block">
        <h2>{{ t('hero.subtitle') }}</h2>
        <p class="subtitle">{{ t('hero.desc') }}</p>
        
        <div class="buttons-row">
          <button class="cta-btn primary" @click="installPwa">
             <!-- Install Icon -->
             <svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:8px;">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
             </svg>
             {{ t('hero.install_btn') }}
          </button>
          <button class="cta-btn secondary" @click="$emit('navigate', 'tracking')">{{ t('hero.track_btn_hero') }}</button>
          <a href="https://wa.me/77087648100" target="_blank" class="cta-btn whatsapp">{{ t('hero.whatsapp_btn') }}</a>
        </div>
      </div>

      <!-- Info Grid -->
      <div class="info-grid">
        
        <!-- B2C -->
        <div class="info-card b2c">
          <h3>{{ t('home.b2c.title') }}</h3>
          <ul>
            <li v-for="(item, i) in t('home.b2c.items')" :key="i">{{ item }}</li>
          </ul>
        </div>

        <!-- B2B -->
        <div class="info-card b2b">
          <h3>{{ t('home.b2b.title') }}</h3>
          <ul>
            <li v-for="(item, i) in t('home.b2b.items')" :key="i">{{ item }}</li>
          </ul>
        </div>

        <!-- Why Us -->
        <div class="info-card why">
          <h3>{{ t('home.why.title') }}</h3>
          <ul>
            <li v-for="(item, i) in t('home.why.items')" :key="i" v-html="boldify(item)"></li>
          </ul>
        </div>

         <!-- Steps -->
         <div class="info-card steps">
          <h3>{{ t('home.steps.title') }}</h3>
          <ol>
            <li v-for="(item, i) in t('home.steps.items')" :key="i">{{ item }}</li>
          </ol>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  triggerAnim: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['navigate'])

const showContent = ref(false)
const { t } = useI18n()

// Helper to boldify key terms
const boldify = (text) => {
  if (text && text.includes(':')) {
    const parts = text.split(':')
    return `<strong>${parts[0]}:</strong>${parts.slice(1).join(':')}`
  }
  return text
}

watch(() => props.triggerAnim, (val) => {
  if (val) {
    setTimeout(() => {
      showContent.value = true
    }, 500)
  }
})

const deferredPrompt = ref(null)

const installPwa = async () => {
  if (deferredPrompt.value) {
    deferredPrompt.value.prompt()
    const { outcome } = await deferredPrompt.value.userChoice
    if (outcome === 'accepted') {
      deferredPrompt.value = null
    }
  } else {
     alert('Функция установки недоступна или приложение уже установлено')
  }
}

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault()
    deferredPrompt.value = e
  })

  if (props.triggerAnim) {
    setTimeout(() => {
      showContent.value = true
    }, 100)
  }
})
</script>

<style scoped>
.home-content {
  position: absolute;
  top: 0;
  left: 100px; 
  z-index: 20; 
  width: calc(100vw - 120px - 20vw);
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0vh 20px 20px 20px;
  overflow: hidden;
  color: white;
  font-family: 'Poppins', sans-serif;
  pointer-events: none;
}

.home-content * {
  pointer-events: auto;
}

/* Title Container */
.title-container {
  opacity: 0;
  transform: translateY(-20px);
  transition: opacity 1s ease-out, transform 1s ease-out;
  margin-bottom: 20px;
}

.title-container.visible {
  opacity: 1;
  transform: translateY(0);
}

.main-title {
  position: relative;
  font-family: helvetica, arial, sans-serif;
  font-weight: 800;
  font-size: clamp(1.5em, 3.5vw, 4.5em); /* Keeps reduced size */
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
  /* CSS Gradient Liquid Effect */
  background: linear-gradient(
    90deg,
    #4F46E5,
    #06B6D4,
    #9333EA,
    #2563EB,
    #4F46E5
  );
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

/* Content Body Animations */
.content-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1.5s ease 0.5s, transform 1.5s ease 0.5s;
  display: flex;
  flex-direction: column;
  gap: 20px; /* Increased gap */
  max-width: 1000px; /* Wider content area */
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

.intro-block h2 {
  font-size: clamp(1rem, 1.5vw, 1.8rem);
  margin-bottom: 5px;
  color: #fff;
}

.intro-block .subtitle {
  font-size: clamp(0.7rem, 1vw, 1rem);
  color: #ccc;
  margin-bottom: 20px;
}

.buttons-row {
  display: flex;
  flex-wrap: wrap;
  gap: 15px;
  margin-bottom: 10px;
}

.cta-btn {
  display: inline-flex; /* Use flex for icon alignment */
  align-items: center;
  justify-content: center;
  border: none;
  padding: 12px 25px; /* Bigger buttons */
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s, box-shadow 0.2s;
  font-family: 'Poppins', sans-serif;
  font-size: 0.9rem;
  text-decoration: none;
}

.cta-btn:hover {
  transform: scale(1.05);
}

.cta-btn.primary {
  background: linear-gradient(135deg, #4F46E5, #9333EA);
  box-shadow: 0 4px 15px rgba(79, 70, 229, 0.4);
}

.cta-btn.secondary {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(5px);
}
.cta-btn.secondary:hover {
  background: rgba(255, 255, 255, 0.2);
}

.cta-btn.whatsapp {
  background: #25D366;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

/* Compact Grid */
.info-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  grid-template-rows: repeat(2, auto);
  gap: 15px; /* Increased gap */
}

.info-card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px; /* Rounded more */
  padding: 20px; /* Increased padding */
  font-size: 0.9rem; /* Increased size */
  transition: background 0.3s;
}

.info-card:hover {
  background: rgba(255, 255, 255, 0.05);
}

.info-card h3 {
  color: #818CF8;
  margin-bottom: 12px;
  font-size: 1rem;
}

.info-card ul, .info-card ol {
  padding-left: 20px;
  margin: 0;
}

.info-card li {
  margin-bottom: 6px; /* Spaced out lines */
  line-height: 1.4;
  color: rgba(255,255,255,0.9);
}

@media (max-width: 1024px) {
  .home-content {
    left: 0;
    width: 100%;
    padding: 170px 10px 140px 10px; /* Reduced side padding for more space */
    display: flex;
    flex-direction: column;
    gap: 15px; /* Tighter vertical gap */
    align-items: center;
    text-align: center;
  }
  .title-container {
    width: 100%;
    display: flex;
    justify-content: center;
    margin-bottom: 0;
    padding-bottom: 20px;
  }
  /* Main Title increased 1.5x */
  .main-title {
    font-size: 4.5rem; 
    line-height: 1;
  }
  
  /* Intro Block also huge */
  .intro-block h2 {
    font-size: 4rem; 
    margin: 0;
    line-height: 1.1;
  }
  .intro-block .subtitle {
    font-size: 1.4rem;
    margin: 0;
    line-height: 1.2;
    padding: 50px;
  }
  
  /* Buttons */
  .buttons-row {
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    justify-content: space-between;
    width: 100%;
    gap: 15px; 
    margin-bottom: 30px; /* Increased gap */
    padding: 0 2px;
  }
  .cta-btn {
    flex: 1;
    width: auto;
    max-width: none;
    padding: 15px 1px;
    font-size: 1.2rem;
    white-space: nowrap;
    border-radius: 12px;
    text-overflow: ellipsis; 
    overflow: hidden;
    font-weight: 800;
  }
  .btn-icon {
     display: none !important;
  }

  /* 2-Column Grid */
  .info-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 40px; /* Increased padding between blocks */
    width: 100%;
    flex-grow: 1;
    overflow-y: auto;
    font-size: 1.4rem; /* Adjusted text size */
    line-height: 1.2;
  }
  .info-card {
    padding: 30px 5px; 
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
  }
  .info-card h3 {
     font-size: 2.5rem; 
     margin-bottom: 25px; 
     min-height: auto; 
     line-height: 1;
     display: flex;
     align-items: center;
     justify-content: center;
     word-break: break-word;
  }
  .info-card li {
     font-size: 1.4rem; 
     margin-bottom: 25px; 
     word-break: break-word; 
     hyphens: auto;
  }
  
  .info-grid::-webkit-scrollbar { display: none; }
}
</style>
