<template>
  <div class="contacts-content">
    
    <!-- Title Section -->
    <div class="title-container" :class="{ visible: showContent }">
      <h1 class="main-title" :data-text="t('contacts_page.title')">
        <span class="title-shadow">{{ t('contacts_page.title') }}</span>
        <span class="title-front">{{ t('contacts_page.title') }}</span>
      </h1>
      <p class="subtitle">{{ t('contacts_page.subtitle') }}</p>
    </div>

    <!-- Fade-in Grid Wrapper -->
    <div class="content-body" :class="{ visible: showContent }">
      
      <!-- Layout: Map Left, Info Right (Desktop) | Stacked (Mobile) -->
      <div class="contacts-wrapper">
        
        <!-- Info Panel -->
        <div class="info-panel">
          <div class="info-item">
            <div class="icon-box">📍</div>
            <div class="details">
              <h3>{{ t('contacts_page.address_title') }}</h3>
              <p>{{ t('contacts_page.address') }}</p>
            </div>
          </div>

          <div class="info-item">
             <div class="icon-box">📞</div>
             <div class="details">
              <h3>{{ t('contacts_page.phone_title') }}</h3>
              <p><a href="tel:+77087648100">+7 708 764 8100</a></p>
              <p class="small-text">{{ t('contacts_page.phone_sub') }}</p>
             </div>
          </div>

          <div class="info-item">
            <div class="icon-box">⏰</div>
            <div class="details">
              <h3>{{ t('contacts_page.schedule_title') }}</h3>
              <p>{{ t('contacts_page.schedule_days') }}</p>
              <p class="small-text">{{ t('contacts_page.schedule_off') }}</p>
            </div>
          </div>

          <!-- Social Buttons -->
          <div class="social-row">
            <a href="https://wa.me/77087648100" target="_blank" class="btn whatsapp">{{ t('contacts_page.whatsapp_btn') }}</a>
            <a href="https://instagram.com" target="_blank" class="btn instagram">{{ t('contacts_page.instagram_btn') }}</a>
          </div>
        </div>

        <!-- Map Container -->
        <div class="map-box">
             <!-- Yandex Map Widget -->
             <div style="position:relative;overflow:hidden; height: 100%; border-radius: 16px;">
                <iframe 
                    src="https://yandex.kz/map-widget/v1/?ll=76.872220%2C43.220404&mode=search&oid=231901814988&ol=biz&z=16" 
                    width="100%" 
                    height="100%" 
                    frameborder="0" 
                    allowfullscreen="true" 
                    style="position:absolute; top:0; left:0; border: none; filter: invert(90%) hue-rotate(180deg) contrast(90%);"
                >
                </iframe>
            </div>
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
.contacts-content {
  position: absolute;
  top: 0;
  left: 100px; 
  z-index: 20; 
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

.contacts-content * {
  pointer-events: auto;
}

/* Title Styles */
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
  transition: opacity 1s ease 0.2s, transform 1s ease 0.2s;
  height: 100%;
  width: 100%;
}

.content-body.visible {
  opacity: 1;
  transform: translateY(0);
}

.contacts-wrapper {
  display: flex;
  height: 60vh; /* Fixed height area */
  gap: 30px;
}

.info-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 15px; /* Reduced gap */
  justify-content: center;
}

.info-item {
  display: flex;
  align-items: center; 
  gap: 12px;
  background: rgba(255,255,255,0.05);
  padding: 10px 15px; /* Compact padding */
  border-radius: 12px;
  border: 1px solid rgba(255,255,255,0.1);
  transition: transform 0.2s;
}
.info-item:hover {
  transform: translateX(5px);
  background: rgba(255,255,255,0.08);
}

.icon-box {
  font-size: 1.2rem;
  background: rgba(255,255,255,0.1);
  width: 40px; 
  height: 40px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.details h3 {
  margin: 0 0 5px 0;
  color: #818CF8;
  font-size: 1rem;
}

.details p {
  margin: 0;
  color: white;
  font-size: 1rem;
}
.details a {
  color: white;
  text-decoration: none;
}
.details .small-text {
  font-size: 0.85rem;
  color: #a5b4fc;
  margin-top: 3px;
}

.social-row {
  display: flex;
  gap: 15px;
  margin-top: 10px;
}

.btn {
  border: none;
  padding: 12px 20px;
  border-radius: 30px;
  color: white;
  font-weight: bold;
  cursor: pointer;
  font-family: inherit;
  flex: 1;
  transition: transform 0.2s;
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem;
}
.btn:hover {
  transform: scale(1.05);
}

.whatsapp {
  background: #25D366;
}
.instagram {
  background: linear-gradient(45deg, #f09433 0%,#e6683c 25%,#dc2743 50%,#cc2366 75%,#bc1888 100%); 
}

/* Map */
.map-box {
  flex: 1.5;
  background: rgba(0,0,0,0.3);
  border-radius: 16px;
  overflow: hidden;
  border: 1px solid rgba(255,255,255,0.1);
}


@media (max-width: 1024px) {
  .contacts-content {
    left: 0;
    width: 100%;
    overflow-y: scroll; /* Enable full page scroll */
    -webkit-overflow-scrolling: touch;
    height: 100vh;
    padding-top: 95px;
    padding-bottom: 300px; /* Ample bottom space */
    display: flex;
    flex-direction: column;
    align-items: center;
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
    padding-top: 15px; /* Reduced since sticky header isn't here */
    margin-top: 80px;
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
    overflow-y: visible; /* No nested scroll */
    padding-right: 0;
  }
  .content-body::-webkit-scrollbar { display: none; }

  .contacts-wrapper {
    flex-direction: column;
    height: auto;
    width: 100%;
    gap: 30px;
  }

  .info-panel {
    width: 100%;
    gap: 20px;
  }

  .info-item {
    padding: 20px;
    display: flex;
    flex-direction: row; /* Side-by-side */
    align-items: center;
    justify-content: space-between;
    text-align: left; /* Align text left */
    gap: 15px;
  }

  .icon-box {
    width: 60px;
    height: 60px;
    font-size: 2rem;
    order: 2; /* Icon to right */
    flex-shrink: 0;
  }
  
  .details {
    order: 1; /* Text to left */
    flex: 1;
  }

  .details h3 {
    font-size: 1.8rem;
    margin-bottom: 10px;
  }

  .details p {
    font-size: 1.6rem;
  }
  
  .details .small-text {
    font-size: 1.4rem;
  }

  .btn {
    padding: 15px;
    font-size: 1.4rem;
    border-radius: 12px;
  }

  .map-box {
    height: 550px; /* Increased by ~1/3 */
    width: 100%;
    border-radius: 16px;
    flex: none;
    margin-bottom: 20px;
    order: -1; /* Map on top */
  }
}
</style>
