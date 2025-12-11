<template>
  <div>
    <div class="header">
      <!--Content before waves-->
      <div class="inner-header flex">
        <!--Rocket Widget & Logo Link-->
        <a href="#" @click.prevent="onLogoClick" class="logo-link">
          <RocketWidget />
          <h1>CargoXpress</h1>
        </a>
        
        <div class="lang-switcher">
           <button class="lang-btn" @click="showLangMenu = !showLangMenu">
              <img :src="`https://flagcdn.com/w40/${flags[locale]}.png`" alt="flag" class="flag-icon-img" />
              <span class="arrow-down">▼</span>
           </button>
           <div v-if="showLangMenu" class="lang-dropdown">
              <div v-for="(country, lg) in flags" :key="lg" @click="changeLang(lg)" class="lang-option" :class="{ active: lg === locale }" :title="lg.toUpperCase()">
                 <img :src="`https://flagcdn.com/w40/${country}.png`" :alt="lg" class="flag-img" />
              </div>
           </div>
        </div>
      </div>

      <!--Waves Container-->
      <div>
        <svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto">
          <defs>
            <path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" />
            
            <linearGradient id="g-wave4" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" :stop-color="w4Start" />
                <stop offset="100%" :stop-color="w4End" />
            </linearGradient>
            
            <mask id="mask4">
                <use class="wave-anim-4" xlink:href="#gentle-wave" x="48" y="7" fill="#fff" />
            </mask>
          </defs>
          <g class="parallax">
            <use xlink:href="#gentle-wave" x="48" y="0" :fill="w1Color" />
            <use xlink:href="#gentle-wave" x="48" y="3" :fill="w2Color" />
            <use xlink:href="#gentle-wave" x="48" y="5" :fill="w3Color" />
            <!-- Wave 4 replaced by Masked Rect -->
            <rect x="0" y="0" width="100%" height="100%" fill="url(#g-wave4)" mask="url(#mask4)" />
          </g>
        </svg>
      </div>
      <!--Waves end-->

    </div>
    <!-- Controls Panel Removed -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import RocketWidget from './RocketWidget.vue'

import { useI18n } from '@/composables/useI18n'

const emit = defineEmits(['logo-click'])

const { locale, setLocale } = useI18n()
const showLangMenu = ref(false)
const flags = {
  ru: 'ru',
  en: 'gb',
  kk: 'kz',
  zh: 'cn'
}
const changeLang = (code) => {
  setLocale(code)
  showLangMenu.value = false
}

const onLogoClick = () => {
    emit('logo-click')
}

const showControls = ref(false)

// Wave 1 (Back) - Solid
const wave1 = ref({ h: 252, s: 52, l: 47, a: 0.35 })
// Wave 2 - Solid
const wave2 = ref({ h: 186, s: 100, l: 38, a: 0.25 })
// Wave 3 - Solid
const wave3 = ref({ h: 252, s: 52, l: 47, a: 0.15 })
// Wave 4 (Front) - Gradient
const wave4 = ref({ h1: 186, h2: 252, s: 100, l: 38, a: 0.5 })

const getHsla = (h, s, l, a) => `hsla(${h}, ${s}%, ${l}%, ${a})`

const w1Color = computed(() => getHsla(wave1.value.h, wave1.value.s, wave1.value.l, wave1.value.a))
const w2Color = computed(() => getHsla(wave2.value.h, wave2.value.s, wave2.value.l, wave2.value.a))
const w3Color = computed(() => getHsla(wave3.value.h, wave3.value.s, wave3.value.l, wave3.value.a))

const w4Start = computed(() => getHsla(wave4.value.h1, wave4.value.s, wave4.value.l, wave4.value.a))
const w4End = computed(() => getHsla(wave4.value.h2, wave4.value.s, wave4.value.l, wave4.value.a))

const toggleControls = () => {
    showControls.value = !showControls.value
}
</script>

<style scoped>
@import url(//fonts.googleapis.com/css?family=Lato:300,400,700,900);

.controls-panel {
    position: fixed;
    top: 100px;
    right: 20px;
    background: rgba(0, 0, 0, 0.8);
    padding: 15px;
    border-radius: 8px;
    color: white;
    z-index: 100;
    max-height: 80vh;
    overflow-y: auto;
    width: 250px;
    border: 1px solid rgba(255, 255, 255, 0.2);
}

.control-group {
    margin-bottom: 15px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    padding-bottom: 10px;
}

.control-group h3 {
    margin: 0 0 10px 0;
    font-size: 14px;
    color: #00acc1;
}

.input-row {
    display: flex;
    align-items: center;
    margin-bottom: 5px;
    font-size: 12px;
}

.input-row label {
    width: 20px;
}

.input-row input {
    flex: 1;
}

.toggle-btn {
    position: fixed;
    top: 100px;
    right: 20px;
    z-index: 101;
    background: #00acc1;
    border: none;
    color: white;
    padding: 5px 10px;
    border-radius: 4px;
    cursor: pointer;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: inherit;
  cursor: pointer;
}

h1 {
  font-family: 'Lato', sans-serif;
  font-weight: 700; /* Made bolder */
  letter-spacing: 2px;
  font-size: 48px;
}

p {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
  font-size: 14px;
  color: #333333;
}

.header {
  position: relative;
  text-align: center;
  background: transparent;
  color: white;
  z-index: 60; /* Ensure header container is above page content */
}

.lang-switcher {
  position: absolute;
  right: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 61; /* Higher than header base */
}
.lang-btn {
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.2);
  padding: 6px 10px;
  border-radius: 20px;
  color: white;
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  backdrop-filter: blur(5px);
  transition: background 0.2s;
  outline: none;
}
.lang-btn:hover { background: rgba(255,255,255,0.2); }
.flag-icon { font-size: 1.2rem; line-height: 1; }
.arrow-down { font-size: 0.7rem; opacity: 0.7; }

.lang-dropdown {
  position: absolute;
  top: 120%;
  right: 0;
  background: rgba(20, 20, 30, 0.95);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 12px;
  padding: 5px;
  width: 60px;
  backdrop-filter: blur(10px);
  box-shadow: 0 4px 20px rgba(0,0,0,0.5);
  display: flex;
  flex-direction: column;
  gap: 2px;
  z-index: 100; /* Extremely high to float over everything */
}
.lang-option {
  padding: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  color: #ccc;
  cursor: pointer;
  border-radius: 8px;
  font-size: 1.5rem; /* Larger flags */
  transition: 0.2s;
  font-family: sans-serif;
  text-align: center;
}
.lang-option:hover { background: rgba(255,255,255,0.1); color: white; }
.lang-option.active { color: #818CF8; background: rgba(129, 140, 248, 0.1); }

/* Merged into bottom media query */

.logo {
  width: 50px;
  fill: white;
  padding-right: 15px;
  display: inline-block;
  vertical-align: middle;
}

.inner-header {
  height: 10vh; /* Reduced by ~30% */
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent;
  position: relative;
  z-index: 60;
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

@media (min-width: 1024px) {
  .flex {
    justify-content: flex-start;
    padding-left: 120px; /* Aligned with Home Content */
    text-align: left;
  }
}

.waves {
  position: absolute; /* Float behind/around the header content */
  top: 0;
  left: 0;
  width: 100%;
  height: 100%; /* Fill the header area */
  min-height: 70px; /* Reduced by 30% */
  max-height: 105px; /* Reduced by 30% */
  margin-top: 0;
  transform: rotate(180deg);
  z-index: 1;
  pointer-events: none;
}


/* Animation */

.parallax > use {
  animation: move-forever 60s cubic-bezier(.55, .5, .45, .5) infinite; /* Slowed significantly */
}
.wave-anim-4 {
  animation: move-forever 45s cubic-bezier(.55, .5, .45, .5) infinite; /* Slowed */
  animation-delay: -5s;
}

.parallax > use:nth-child(1) {
  animation-delay: -2s;
  animation-duration: 18s; /* Slowed */
}

.parallax > use:nth-child(2) {
  animation-delay: -3s;
  animation-duration: 25s; /* Slowed */
}

.parallax > use:nth-child(3) {
  animation-delay: -4s;
  animation-duration: 13s;
}

/* wave 4 is now separate via mask, so removing nth-child(4) rule or letting it be invalid is fine, but cleaner to remove */

@keyframes move-forever {
  0% {
    transform: translate3d(-90px, 0, 0);
  }

  100% {
    transform: translate3d(85px, 0, 0);
  }
}

/*Shrinking for mobile*/
@media (max-width: 1024px) {
    .lang-switcher { right: 10px; }
    
    /* Override flex centering */
    .inner-header.flex {
        justify-content: flex-start;
        padding-left: 20px; /* Align left */
        align-items: flex-start; /* optional */
        padding-top: 40px; /* Move down */
    }

    /* Huge Title on Mobile */
    .logo-link h1 { 
        display: block; 
        font-size: 1.7rem; /* Reduced from 5rem */ 
        margin-left: 10px;
        line-height: 1;
        text-align: left;
    } 
    
    /* Scale Logo 2x -> smaller */
    :deep(.rocket-widget) {
        transform: scale(0.8); /* Reduced from 2 */
        transform-origin: left center; 
        margin-right: 15px !important; 
        margin-block: 5px; 
    }
    
    .inner-header {
        height: auto;
        padding-bottom: 5px;
    }

    .waves {
        height: 120px;
        min-height: 120px;
    }

    .content {
        height: 30vh;
    }
    
    /* Compact Lang Switcher */
    .lang-switcher {
        right: 15px;
    }
    .lang-btn {
        padding: 6px 10px; /* Reduced from 15px 25px */
        border-radius: 20px; /* Reduced from 40px */
    }
    .flag-icon-img {
        width: 24px; /* Reduced from 70px */
        height: 18px; /* Reduced from 50px */
        border-radius: 2px;
    }
    .arrow-down {
        font-size: 0.8rem; /* Reduced from 2rem */
        margin-left: 5px;
    }
    /* Dropdown scaling */
    .lang-dropdown {
        width: 50px; /* Reduced from 120px */
        gap: 2px;
        top: 110%;
    }
    .lang-option {
         padding: 6px; /* Reduced from 15px */
    }
    .flag-img {
        width: 32px; /* Reduced from 80px */
        height: 24px; /* Reduced from 60px */
        border-radius: 3px;
    }
}

.flag-icon-img {
  width: 24px;
  height: 18px;
  object-fit: cover;
  border-radius: 2px;
}

.flag-img {
  width: 32px;
  height: 24px;
  object-fit: cover;
  border-radius: 3px;
  display: block;
}
</style>
