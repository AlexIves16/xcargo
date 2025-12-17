```
<template>
  <div>
    <div class="header">
      <!--Content before waves-->
      <div class="inner-header flex">
        <!-- Footer Content -->
        <div class="footer-content">
          <p class="footer-text">© 2025 CargoXpress. {{ t('footer.rights') }}</p>
          <a href="#" class="privacy-link" @click.prevent="$emit('privacy-click')">{{ t('footer.privacy') }}</a>
          <a href="#" class="privacy-link" @click.prevent="$emit('offer-click')">{{ t('footer.offer') }}</a>
          <p class="footer-initials">ROM</p>
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
    <!-- Controls Pannel (Temporary) -->
    <!-- Controls Pannel (Temporary) - REMOVED -->
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useI18n } from '@/composables/useI18n'

const emit = defineEmits(['privacy-click', 'offer-click'])
const { t } = useI18n()
const showControls = ref(false)

// Wave 1 (Back) - Solid
const wave1 = ref({ h: 295, s: 52, l: 47, a: 0.35 })
// Wave 2 - Solid
const wave2 = ref({ h: 272, s: 100, l: 38, a: 0.25 })
// Wave 3 - Solid
const wave3 = ref({ h: 277, s: 52, l: 47, a: 0.15 })
// Wave 4 (Front) - Gradient
const wave4 = ref({ h1: 229, h2: 0, s: 100, l: 38, a: 0.5 })

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
@import url(https://fonts.googleapis.com/css?family=Lato:300:400);

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

h1 {
  font-family: 'Lato', sans-serif;
  font-weight: 300;
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
}

.logo {
  width: 50px;
  fill: white;
  padding-right: 15px;
  display: inline-block;
  vertical-align: middle;
}

.inner-header {
  height: 15vh;
  width: 100%;
  margin: 0;
  padding: 0;
  background: transparent; /* Removed square background */
  position: relative;
  z-index: 2; /* Ensure text is on top */
}

.flex {
  /*Flexbox for containers*/
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

@media (min-width: 768px) {
  .flex {
    justify-content: flex-start;
    padding-left: 120px;
    text-align: left;
  }
}

.waves {
  position: absolute;
  bottom: 0; /* Align to bottom */
  left: 0;
  width: 100%;
  height: 100%;
  min-height: 70px; /* Reduced by 30% */
  max-height: 105px; /* Reduced by 30% */
  margin-top: 0;
  transform: rotate(0deg); /* Normal orientation */
  z-index: 1;
  pointer-events: none;
}

.footer-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
  position: relative;
}

@media (min-width: 768px) {
  .footer-content {
    align-items: flex-start;
  }
}

.footer-text {
  font-family: 'Lato', sans-serif;
  letter-spacing: 1px;
  font-size: 14px;
  color: white;
  margin: 0;
}

.privacy-link {
  font-family: 'Lato', sans-serif;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.6);
  text-decoration: none;
  margin: 5px 0;
  transition: color 0.3s;
  cursor: pointer;
  letter-spacing: 1px;
}
.privacy-link:hover {
  color: #fff;
}

.footer-initials {
  font-family: 'Lato', sans-serif;
  font-size: 10px;
  color: rgba(255, 255, 255, 0.4);
  margin-top: 5px;
  letter-spacing: 3px;
  font-weight: 300;
}


/* Animation */

.parallax > use {
  animation: move-forever 60s cubic-bezier(.55, .5, .45, .5) infinite; /* Slowed */
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
@media (max-width: 768px) {
  .header {
    display: none;
  }
}
</style>
