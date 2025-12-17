<template>
  <div class="about-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('about_page.title')">
        <span class="title-shadow">{{ t('about_page.title') }}</span>
        <span class="title-front">{{ t('about_page.title') }}</span>
      </h1>
      <p class="about-subtitle">{{ t('about_page.subtitle') }}</p>
    </div>

    <!-- Fade-in Content Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      
      <!-- Intro -->
      <div class="intro-section">
        <p class="description">{{ t('about_page.description') }}</p>
      </div>

      <!-- Principles Grid -->
      <div class="principles-grid">
        <div class="card" v-for="(item, i) in t('about_page.principles')" :key="i">
          <h3>{{ item.title }}</h3>
          <p>{{ item.desc }}</p>
        </div>
      </div>

      <!-- Why Us (Bottom) -->
      <div class="why-us-row">
        <div class="check-item" v-for="(item, i) in t('about_page.why_bottom')" :key="i">{{ item }}</div>
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

const showContent = ref(false)
const { t } = useI18n()

watch(() => props.triggerAnim, (val) => {
  if (val) {
    setTimeout(() => {
      showContent.value = true
    }, 100)
  }
})

onMounted(() => {
  if (props.triggerAnim) {
    setTimeout(() => {
      showContent.value = true
    }, 100)
  }
})
</script>

<style scoped>
.about-content {
  position: relative;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  padding: 40px 20px;
  color: white;
  font-family: 'Poppins', sans-serif;
  height: auto;
}

.about-content * {
  pointer-events: auto;
}

/* Title Styles (Consistent) */
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

.about-subtitle {
  font-size: 1.1rem;
  color: #c7d2fe;
  margin-top: 10px;
  font-weight: 300;
}

/* Content Body */
.content-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
  display: flex;
  flex-direction: column;
  gap: 20px;
  max-width: 900px;
  padding-right: 0;
}

.content-body::-webkit-scrollbar {
  width: 4px;
}
.content-body::-webkit-scrollbar-thumb {
  background: rgba(255,255,255,0.2);
  border-radius: 4px;
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

.intro-section {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 20px;
  border: 1px solid rgba(255,255,255,0.1);
}

.description {
  margin: 0 0 15px 0;
  line-height: 1.5;
  color: #e0e7ff;
}

.stats-row {
  display: flex;
  gap: 30px;
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 10px;
}

.stat-item {
  font-size: 0.9rem;
  color: #a5b4fc;
}
.stat-item strong {
  color: #fff;
  font-size: 1.1rem;
  margin-right: 5px;
}

/* Grid */
.principles-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;
}

.card {
  background: rgba(255, 255, 255, 0.03);
  backdrop-filter: blur(5px);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 12px;
  padding: 15px;
  transition: background 0.3s;
}
.card:hover {
  background: rgba(255, 255, 255, 0.08);
}

.card h3 {
  margin: 0 0 8px 0;
  font-size: 1rem;
  color: #818CF8;
}

.card p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  line-height: 1.4;
}

/* Why Us */
.why-us-row {
  display: flex;
  justify-content: space-between;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 16px;
  padding: 15px 25px;
}

.check-item {
  font-weight: 600;
  color: #fff;
  font-size: 0.95rem;
}

@media (max-width: 1024px) {
  .about-content {
    padding: 20px 15px;
    align-items: center;
    text-align: center;
    gap: 15px;
    height: auto;
  }

  .title-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 20px;
    /* padding-top: 90px; */
  }

  .main-title {
    font-size: 4.3rem;
    line-height: 1;
  }

  .about-subtitle {
    font-size: 1.6rem; /* Increased from 1.4 */
    padding: 24px;
    margin: 0;
    line-height: 1.2;
  }

  .content-body {
    width: 100%;
    height: auto;
    overflow-y: visible;
    padding-right: 0;
    gap: 20px;
  }
  .content-body::-webkit-scrollbar { display: none; }

  /* Intro Section */
  .intro-section {
    padding: 20px;
    text-align: center;
  }

  .description {
    font-size: 1.6rem; /* Increased from 1.4 */
    line-height: 1.4;
  }

  .stats-row {
    flex-direction: column;
    gap: 15px;
  }

  .stat-item {
    font-size: 1.6rem; /* Increased from 1.4 */
  }
  .stat-item strong {
    font-size: 2.0rem; /* Increased from 1.8 */
  }

  /* Grid */
  .principles-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    width: 100%;
  }

  .card {
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .card h3 {
    font-size: 2.3rem;
    margin-bottom: 15px;
    line-height: 1;
  }

  .card p {
    font-size: 1.6rem; /* Increased from 1.4 */
    line-height: 1.4;
    word-break: break-word;
    hyphens: auto;
  }

  /* Why Us */
  .why-us-row {
    flex-direction: column;
    gap: 20px;
    padding: 20px;
    text-align: center;
    width: 100%;
  }

  .check-item {
    font-size: 1.6rem; /* Increased from 1.4 */
  }
}
</style>
