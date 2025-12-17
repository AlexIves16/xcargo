<template>
  <div class="services-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('services_page.title')">
        <span class="title-shadow">{{ t('services_page.title') }}</span>
        <span class="title-front">{{ t('services_page.title') }}</span>
      </h1>
      <p class="service-subtitle">{{ t('services_page.subtitle') }}</p>
    </div>

    <!-- Fade-in Grid Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      
      <!-- Services Grid -->
      <div class="services-grid">
        
        <div class="card" v-for="(item, i) in t('services_page.cards')" :key="i">
          <div class="icon">{{ item.icon }}</div>
          <div class="text">
            <h3>{{ item.title }}</h3>
            <p v-html="item.desc"></p>
          </div>
        </div>

      </div>

      <!-- Bottom CTA -->
      <div class="bottom-cta">
        <div class="cta-text">
          <h2>{{ t('services_page.cta.title') }}</h2>
          <p>{{ t('services_page.cta.text') }}</p>
        </div>
        <div class="cta-buttons">
          <a href="https://wa.me/77087648100" target="_blank" class="btn whatsapp">{{ t('services_page.cta.whatsapp') }}</a>
          <a href="/login" class="btn login">{{ t('services_page.cta.login') }}</a>
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

const showContent = ref(false)
const { t } = useI18n()

watch(() => props.triggerAnim, (val) => {
  if (val) {
    setTimeout(() => {
      showContent.value = true
    }, 300)
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
.services-content {
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
}

.services-content * {
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
  font-size: clamp(1.5em, 3.5vw, 4.5em); /* Consistent with Home */
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

.service-subtitle {
  font-size: 1.2rem;
  color: #c7d2fe;
  margin-top: 10px;
  font-weight: 300;
}

/* Content Body */
.content-body {
  opacity: 0;
  transform: translateY(30px);
  transition: opacity 1s ease 0.3s, transform 1s ease 0.3s;
  display: flex;
  flex-direction: column;
  gap: 30px;
  max-width: 1000px;
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Grid */
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.card {
  background: rgba(255, 255, 255, 0.05);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 16px;
  padding: 15px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  transition: transform 0.3s, background 0.3s;
}

.card:hover {
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.1);
}

.card .icon {
  font-size: 2rem;
  margin-bottom: 10px;
}

.card h3 {
  font-size: 1rem;
  color: #818CF8;
  margin: 0 0 5px 0;
  font-weight: 600;
}

.card p {
  font-size: 0.85rem;
  color: rgba(255,255,255,0.8);
  margin: 0;
  line-height: 1.4;
}

/* Bottom CTA */
.bottom-cta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: rgba(79, 70, 229, 0.1);
  border: 1px solid rgba(79, 70, 229, 0.3);
  border-radius: 20px;
  padding: 20px 30px;
  backdrop-filter: blur(5px);
}

.cta-text {
  max-width: 60%;
}

.cta-text h2 {
  font-size: 1.2rem;
  margin: 0 0 5px 0;
  color: white;
}

.cta-text p {
  font-size: 0.9rem;
  margin: 0;
  color: #c7d2fe;
}

.cta-buttons {
  display: flex;
  gap: 15px;
  flex-shrink: 0;
  white-space: nowrap;
}

.btn {
  border: none;
  padding: 10px 20px;
  border-radius: 30px;
  font-weight: bold;
  cursor: pointer;
  transition: transform 0.2s;
  font-family: inherit;
  font-size: 0.9rem;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.btn:hover {
  transform: scale(1.05);
}

.btn.whatsapp {
  background: #25D366;
  color: white;
  box-shadow: 0 4px 15px rgba(37, 211, 102, 0.3);
}

.btn.login {
  background: rgba(255,255,255,0.1);
  color: white;
  border: 1px solid rgba(255,255,255,0.2);
}
.btn.login:hover {
  background: rgba(255,255,255,0.2);
}

@media (max-width: 1024px) {
  .services-content {
    padding: 20px 15px;
    height: auto;
    align-items: center;
    text-align: center;
  }

  .title-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 20px;
    padding-top: 15px;
    /* margin-top: 80px; */
  }

  /* Grid */
  .services-grid {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px; 
    width: 100%;
    max-height: none;
    overflow-y: visible;
    flex-grow: 0;
    padding-bottom: 20px;
    height: auto;
  }

  .main-title {
    font-size: 4.3rem; /* Reduced 0.2 */
    line-height: 1;
  }

  .service-subtitle {
    font-size: 1.2rem; /* Reduced 0.2 */
    padding: 24px; /* Changed from 50px */
    margin: 0;
    line-height: 1.2;
  }



  .card {
    padding: 30px 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    background: rgba(255, 255, 255, 0.03);
    backdrop-filter: blur(5px);
  }

  .card .icon {
    font-size: 2.8rem; /* Reduced 0.2 */
    margin-bottom: 20px;
  }

  .card h3 {
    font-size: 2.3rem; /* Reduced 0.2 */
    margin-bottom: 15px; /* Also reduced margin slightly to fit tighter layout */
    line-height: 1;
    text-align: center;
  }

  .card p {
    font-size: 1.2rem; /* Reduced 0.2 */
    line-height: 1.4;
    text-align: center;
    word-break: break-word;
    hyphens: auto;
  }

  /* CTA */
  .bottom-cta {
    flex-direction: column;
    text-align: center;
    gap: 20px; /* Reduced gap */
    padding: 20px; /* Reduced padding */
    width: 100%;
  }

  .cta-text h2 {
    font-size: 2.3rem; /* Reduced 0.2 */
  }

  .cta-text p {
    font-size: 1.2rem; /* Reduced 0.2 */
  }

  .cta-text {
    max-width: 100%;
  }

  .cta-buttons {
    width: 100%;
    flex-direction: row;
    gap: 15px;
    justify-content: center;
  }
  
  .btn {
    flex: 1;
    padding: 15px 1px;
    font-size: 1.0rem; /* Reduced 0.2 */
    border-radius: 12px;
  }
}
</style>

<style>
/* Kazakh Specific Override */
:lang(kk) .services-content {
  padding: 5vh 20px 20px 20px !important;
}
:lang(kk) .service-subtitle {
  font-size: 1.2rem !important;
  padding: 6px !important;
}
</style>
