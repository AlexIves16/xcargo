<template>
  <div class="privacy-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('public_offer_page.title')">
        <span class="title-shadow">{{ t('public_offer_page.title') }}</span>
        <span class="title-front">{{ t('public_offer_page.title') }}</span>
      </h1>
      <p class="subtitle">{{ t('public_offer_page.subtitle').replace('{date}', new Date().toLocaleDateString()) }}</p>
    </div>

    <!-- Fade-in Content Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      <div class="glass-panel">
        
        <div v-for="(section, index) in t('public_offer_page.sections')" :key="index">
          <h2 class="section-title">{{ section.title }}</h2>
          <p class="text">{{ section.text }}</p>
          <ul v-if="section.list" class="list">
             <li v-for="(li, l) in section.list" :key="l" v-html="li"></li>
          </ul>
        </div>

        <div class="footer-link">
          <a href="#" @click.prevent="$emit('close')" class="back-link">
             {{ t('public_offer_page.back') }}
          </a>
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

const emit = defineEmits(['close'])
const showContent = ref(false)
const { t } = useI18n()

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
</script>

<style scoped>
.privacy-content {
  position: relative;
  width: 100%;
  max-width: 1000px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px 20px;
  color: white;
  font-family: 'Poppins', sans-serif;
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
  font-size: clamp(1.5em, 2.5vw, 3.5em); /* Slightly smaller than main to fit */
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
  max-width: 900px;
  height: 70vh; /* Scrollable area */
  padding-bottom: 50px;
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 30px;
  border-radius: 16px;
  backdrop-filter: blur(10px);
  height: 100%;
  overflow-y: auto;
}

/* Custom Scrollbar */
.glass-panel::-webkit-scrollbar {
  width: 6px;
}
.glass-panel::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.2);
  border-radius: 3px;
}

.section-title {
  color: #818CF8;
  font-size: 1.2rem;
  margin-top: 25px;
  margin-bottom: 10px;
  border-bottom: 1px solid rgba(255,255,255,0.1);
  padding-bottom: 5px;
}
.section-title:first-child {
  margin-top: 0;
}

.text {
  line-height: 1.6;
  color: rgba(255,255,255,0.9);
  margin-bottom: 15px;
}

.list {
  padding-left: 20px;
  margin-bottom: 15px;
  color: rgba(255,255,255,0.9);
}
.list li {
  margin-bottom: 5px;
}

.footer-link {
  margin-top: 30px;
  padding-top: 20px;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.back-link {
  color: #06B6D4;
  text-decoration: none;
  font-weight: bold;
  transition: color 0.2s;
}
.back-link:hover {
  color: #22d3ee;
}

@media (max-width: 1024px) {
  .privacy-content {
    left: 20px;
    width: 90%;
    padding-top: 12vh;
  }
}
</style>
