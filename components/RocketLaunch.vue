<template>
  <div class="launch-screen" v-if="!isAnimationDone" @click="handleSkip">
    <div class="artboard">
      <div class="stars">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
      </div>
      <div class="stars2">
        <div class="shootingstar" v-for="n in 30" :key="n"></div>
      </div>

      <div class="fire"></div>
      <div class="takeoff"></div>

      <div class="smoke">
        <div class="smoke-bubble" v-for="n in 12" :key="n" :id="`sb${n}`"></div>
      </div>
      <img :src="'/Moon.webp'" class="moon-bg" alt="Moon" />

      <svg id="rocket" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.1 259.1" enable-background="new 0 0 154.1 259.1">
        <component is="style">
          .st0{fill:#4F46E5;} .st1{fill:#E8E6EF;} .st2{filter:url(#Adobe_OpacityMaskFilter);} .st3{filter:url(#Adobe_OpacityMaskFilter_1_);} .st4{mask:url(#SVGID_1_);fill:url(#SVGID_2_);} .st5{opacity:0.61;fill:#CFE0E2;} .st6{opacity:0.7;fill:#012226;} .st7{filter:url(#Adobe_OpacityMaskFilter_2_);} .st8{filter:url(#Adobe_OpacityMaskFilter_3_);} .st9{mask:url(#SVGID_3_);fill:url(#SVGID_4_);} .st10{fill:url(#SVGID_5_);} .st11{fill:#063A3A;} .st12{fill:#312E81;}
        </component>
        <path class="st0" d="M97.4 236.1c0 2.6-5.2 4.7-11.7 4.7H70.3c-6.4 0-11.7-2.1-11.7-4.7v-4.5c0-2.6 5.2-4.7 11.7-4.7h15.4c6.4 0 11.7 2.1 11.7 4.7v4.5zM37.1 137.4s-28 19.2-28 32v59.3l30-30-2-61.3zM117.5 137.4s28 19.2 28 32v59.3l-30-30 2-61.3z"/>
        <path class="st1" d="M29.6 140.5c.3 36.4 8.3 69.6 21.3 95.3 8.6-2.8 17.7-4.4 27.2-4.4 9.5-.1 18.6 1.3 27.3 4 12.5-25.9 19.9-59.3 19.6-95.6-.6-57.8-20.4-107.7-48.8-132-28.1 24.8-47.1 75-46.6 132.7z"/>
        <defs><filter id="Adobe_OpacityMaskFilter" filterUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171"><feFlood result="back" flood-color="#fff" flood-opacity="1"/><feBlend in="SourceGraphic" in2="back"/></filter></defs>
        <mask maskUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" id="SVGID_1_"><g class="st2"><defs><filter id="Adobe_OpacityMaskFilter_1_" filterUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171"><feFlood result="back" flood-color="#fff" flood-opacity="1"/><feBlend in="SourceGraphic" in2="back"/></filter></defs><linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="719.881" y1="-755.102" x2="616.624" y2="-640.129" gradientTransform="rotate(-41.77 1486.062 530.152)"><stop offset="0" stop-color="gray"/><stop offset=".145" stop-color="#7A7A7A"/><stop offset=".338" stop-color="#696969"/><stop offset=".556" stop-color="#4E4E4E"/><stop offset=".792" stop-color="#282828"/><stop offset="1"/></linearGradient><path class="st4" d="M60.2 233.7l12-1.9c-18.3-108.4-8.6-169-8.6-169l-11.4.4c-22 76.5 8 170.5 8 170.5z"/></g></mask>
        <path class="st5" d="M60.2 233.7l12-1.9c-18.3-108.4-8.6-169-8.6-169l-11.4.4c-22 76.5 8 170.5 8 170.5z"/>
        <path class="st6" d="M41.5 64l-2.1 6.7s40.7-5 75.7.1l-3.2-7.4c-.1 0-47.1-5.4-70.4.6z"/>
        <path class="st0" d="M41.5 64c11.4-.9 23.2-1.4 35.2-1.5 12-.1 23.7.2 35.2.9-8.6-23.7-21-43-35.6-55.6C61.7 20.6 49.7 40.2 41.5 64z"/>
        <defs><filter id="Adobe_OpacityMaskFilter_2_" filterUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3"><feFlood result="back" flood-color="#fff" flood-opacity="1"/><feBlend in="SourceGraphic" in2="back"/></filter></defs>
        <mask maskUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" id="SVGID_3_"><g class="st7"><defs><filter id="Adobe_OpacityMaskFilter_3_" filterUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3"><feFlood result="back" flood-color="#fff" flood-opacity="1"/><feBlend in="SourceGraphic" in2="back"/></filter></defs><linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="739.606" y1="-771.977" x2="769.629" y2="-799.072" gradientTransform="rotate(-41.77 1486.062 530.152)"><stop offset="0" stop-color="gray"/><stop offset=".145" stop-color="#7A7A7A"/><stop offset=".338" stop-color="#696969"/><stop offset=".556" stop-color="#4E4E4E"/><stop offset=".792" stop-color="#282828"/><stop offset="1"/></linearGradient><path class="st9" d="M63.6 62.7C65.7 35.3 76.2 7.8 76.2 7.8c-18.9 24.2-24 55.3-24 55.3l11.4-.4z"/></g></mask>
        <linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="739.606" y1="-771.977" x2="769.629" y2="-799.072" gradientTransform="rotate(-41.77 1486.062 530.152)"><stop offset="0" stop-color="#EAEFEE"/><stop offset=".45" stop-color="#F0F3F3"/><stop offset="1" stop-color="#FFF"/></linearGradient>
        <path class="st10" d="M63.6 62.7C65.7 35.3 76.2 7.8 76.2 7.8c-18.9 24.2-24 55.3-24 55.3l11.4-.4z"/>
        <path class="st11" d="M75.9 78.3c-14.8.1-26.7 12.2-26.6 27 .1 14.8 12.2 26.7 27 26.6 14.8-.1 26.7-12.2 26.5-27-.1-14.9-12.2-26.8-26.9-26.6z"/>
        <path class="st12" d="M75.9 86.4c-10.3.1-18.5 8.5-18.5 18.8.1 10.3 8.5 18.5 18.8 18.4 10.3-.1 18.5-8.5 18.4-18.8 0-10.2-8.4-18.5-18.7-18.4z"/>
        <path class="st0" d="M68.6 122.1c2.3 1 4.9 1.6 7.7 1.6 10.3-.1 18.5-8.5 18.4-18.8 0-3.6-1.1-7-3-9.9-.3.3-.7.5-1 .8-8.1 6.6-18.2 15.6-22.1 26.3z"/>
        <path class="st11" d="M79 139.9c-11.1.1-20 9.2-19.9 20.3.1 11.1 9.2 20 20.3 19.9 11.1-.1 20-9.2 19.9-20.3-.1-11-9.2-20-20.3-19.9z"/>
        <path class="st12" d="M79.1 146.1c-7.7.1-13.9 6.4-13.8 14.1.1 7.7 6.4 13.9 14.1 13.8 7.7-.1 13.9-6.4 13.8-14.1-.1-7.7-6.4-13.9-14.1-13.8z"/>
        <path class="st0" d="M73.5 172.8c1.8.8 3.7 1.2 5.8 1.2 7.7-.1 13.9-6.4 13.8-14.1 0-2.7-.8-5.3-2.2-7.4-.3.2-.5.4-.8.6-6 4.9-13.6 11.7-16.6 19.7z"/>
        <path class="st11" d="M81.5 187.9c-7.8.1-14.1 6.5-14 14.3.1 7.8 6.5 14.1 14.3 14.1 7.8-.1 14.1-6.5 14-14.3-.1-7.8-6.5-14.2-14.3-14.1z"/>
        <path class="st12" d="M81.5 192.2c-5.4 0-9.8 4.5-9.8 9.9s4.5 9.8 9.9 9.8 9.8-4.5 9.8-9.9-4.5-9.8-9.9-9.8z"/>
        <path class="st0" d="M77.6 211.1c1.2.5 2.6.9 4.1.8 5.4 0 9.8-4.5 9.8-9.9 0-1.9-.6-3.7-1.6-5.2-.2.1-.4.3-.5.4-4.3 3.5-9.7 8.3-11.8 13.9z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { gsap } from 'gsap'

const isAnimationDone = ref(false)
const emit = defineEmits(['loaded'])
const skipClicks = ref(0)
let tl = null

const handleSkip = () => {
  skipClicks.value++
  if (skipClicks.value >= 2 && tl) {
    tl.progress(1)
  }
}

onMounted(() => {
  const rocket = document.querySelector("#rocket");
  
  tl = gsap.timeline()
    
  // Replicating original TimelineMax logic precisely
  // .add(TweenMax.from(".takeoff", 0.5, {scaleY:0, y: -200, ease:Expo.easeInOut, delay:3}))
  tl.from(".takeoff", {
    duration: 0.5,
    scaleY: 0,
    y: -200, // Starts at -200 and animates TO CSS default (0)
    ease: "expo.inOut"
  }, "+=0.5") // Reduced start delay from 3s to 0.5s
  
  // .add(TweenMax.to("#rocket", 1 ,{className:"+=shake", delay:-1}))
  .to("#rocket", {
    duration: 1,
    onStart: () => rocket.classList.add('shake'),
  }, "-=1") // Overlaps previous by 1s (starts 0.5s before takeoff ends)
  
  // .add(TweenMax.to(".smoke", 2,{y: -50, delay: 1}))
  .to(".smoke", {
    duration: 2,
    y: -50
  }, "+=1")
  
  // .add(TweenMax.to("#rocket", 1 ,{className: "-=shake"}))
  .to("#rocket", {
    duration: 1,
    onStart: () => rocket.classList.remove('shake')
  })
  
  // .add(TweenMax.to("#rocket",1, {y: -300,  delay:-1}))
  .to("#rocket", {
    duration: 1,
    y: -300
  }, "-=1")
  
  // .add(TweenMax.to(".takeoff",1, {y: -300, delay:-1}))
  .to(".takeoff", {
    duration: 1,
    y: -300
  }, "-=1")
  
  // .add(TweenMax.to(".smoke", 5,{scale: 1, y: -20, delay: -1}))
  .to(".smoke", {
    duration: 5,
    scale: 1,
    y: -20
  }, "-=1")
  
  // .add(TweenMax.to("#rocket",1, {y: -10, rotate: 40, delay: -3}))
  .to("#rocket", {
    duration: 1,
    y: -10,
    rotation: 40,
    transformOrigin: "center center"
  }, "-=3")
  
  // .add(TweenMax.to(".takeoff",0.2, {opacity: 0, delay: -3}))
  .to(".takeoff", {
    duration: 0.2,
    opacity: 0
  }, "-=3")
  
  // .add(TweenMax.to(".stars",0.2, {opacity: 0, delay: -3}))
  .to(".stars", {
    duration: 0.2,
    opacity: 0
  }, "-=3")
  
  // .add(TweenMax.from(".stars2",0.2, {opacity: 0, delay: -3}))
  .fromTo(".stars2", { opacity: 0 }, {
    duration: 0.2,
    opacity: 1
  }, "-=3")
  
  // .add(TweenMax.to(".artboard",0.2, {rotation: 40, delay: -3}))
  .to(".artboard", {
    duration: 0.2,
    rotation: 40,
    transformOrigin: "center center"
  }, "-=3")
  
  // .add(TweenMax.to(".smoke", 2,{opacity: 0, delay: -2}))
  // REMOVED: keep smoke for the white-out transition
  
  // Moon Transition
  .to(".moon-bg", {
    duration: 1, 
    opacity: 1,
    ease: "power1.inOut"
  }, "-=3.5") 
  
  // Scale Moon (Artboard) to fill screen
  .to(".artboard", {
    duration: 1.5,  
    scale: 50,
    ease: "power2.in" 
  }, ">-0.5") 
  
  .to("#rocket", {
    duration: 0.2, 
    opacity: 0
  }, "<") 
  
  // Fade out entire container AS the white expands
  .to('.launch-screen', {
      opacity: 0,
      duration: 0.5,
      delay: 0.3, // Snappier reveal
      onComplete: () => {
        isAnimationDone.value = true
        emit('loaded')
      }
  }, "<")
})
</script>

<style scoped>
/* 
Converted from SCSS variables
$bg: #01191d;
$green: #18F4A3;
$bluegreen: #00ffea;
$bluewhite: #dafffe;
*/

.launch-screen {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: linear-gradient(135deg, hsl(240, 44%, 19%), hsl(221, 96%, 0%));
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  touch-action: manipulation; /* Prevents zoom on double-tap */
  -webkit-tap-highlight-color: transparent; /* Removes tap highlight */
  user-select: none; /* Prevents text selection */
}

.moon-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0;
  z-index: 5;
  border-radius: 50%;
}

#rocket {
  position: absolute;
  width: 80px;
  left: 50%;
  margin-left: -40px;
  top: 100px;
  z-index: -2;
}

.artboard {
  position: relative;
  width: 300px;
  height: 300px;
  border-radius: 50%;
  border: solid #4F46E5 2px;
  overflow: hidden;
  /* -webkit-mask-image removed as it was just a 1x1 pixel */
  backface-visibility: hidden;
  background: radial-gradient(circle at bottom, rgba(79, 70, 229, 0.3) 0%, rgba(1, 34, 38, 0) 60%);
}

.star {
    position: absolute;
    width: 10px;
    height: 10px;
    top: 37%;
    left: 31%;
}

.star::before,
.star::after {
    content: '';
    position: absolute;
    width: 3px;
    height: 10px;
    background: #fff;
    border-radius: 50%;
    box-shadow: 0 0 6px 3px rgba(255, 255, 255, 0.15);
    animation: sparkle 1s ease-in-out infinite alternate;
}

.star::after {
    transform: translate(-50%, -50%) rotate(90deg);
}

.star::before {
    transform: translate(-50%, -50%);
}

.star:nth-child(2) {
    top: 20%;
    left: 23%;
    transform: scale(1.4);
}

.star:nth-child(3) {
    top: 28%;
    left: 64%;
    transform: scale(0.7);
}


@keyframes sparkle {
    from {
        height: 10px;
    }
    to {
        height: 3px;
    }
}

.smoke {
  position: absolute;
  width: 400%;
  height: 400%;
  bottom: -250%;
  left: 50%;
  background-color: #e8e6ef;
  transform: translateX(-50%) scale(0.25);
}

.smoke-bubble {
  position: absolute;
  background-color: #e8e6ef;
  border-radius: 50%;
  animation: smoke infinite 7s alternate ease-in-out;
}

#sb1 { left: 1%; top: -22%; width: 20%; height: 20%; animation-duration: 5s; }
#sb2 { right: 1%; top: -22%; width: 20%; height: 20%; animation-duration: 5s; }
#sb3 { left: -6%; top: -28%; width: 15%; height: 15%; animation-duration: 3s; }
#sb4 { right: -6%; top: -28%; width: 15%; height: 15%; animation-duration: 3s; }
#sb5 { left: 12%; top: -11%; width: 20%; height: 20%; animation-duration: 6s; }
#sb6 { right: 12%; top: -11%; width: 20%; height: 20%; animation-duration: 6s; }
#sb7 { left: 28%; top: -7%; width: 14%; height: 14%; animation-duration: 3s; }
#sb8 { right: 28%; top: -7%; width: 14%; height: 14%; animation-duration: 3s; }
#sb9 { left: 35%; top: -6%; width: 19%; height: 19%; animation-duration: 5s; }
#sb10 { right: 35%; top: -6%; width: 19%; height: 19%; animation-duration: 5s; }
#sb11 { left: -9%; top: -19%; width: 30%; height: 30%; animation: none; }
#sb12 { right: -9%; top: -19%; width: 30%; height: 30%; animation: none; }


@keyframes smoke {
    0% { transform: scale(1.2); }
    50% { transform: scale(0.8); }
    100% { transform: scale(1.2); }
}

.fire {
  top: 67%;
  z-index: -4;
  position: absolute;
  left: 50%;
  margin-left: -10px;
  width: 20px;
  height: 20px;
  border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
  background-color: #818CF8;
  transform: rotate(135deg);
  margin-top: 20px;
  animation: flicker infinite 1s alternate ease-in-out;
}

.fire:after {
  content: "";
  top: 5px;
  position: absolute;
  width: 15px;
  height: 15px;
  border-radius: 80% 0 55% 50% / 55% 0 80% 50%;
  background-color: #dafffe;
}

@keyframes flicker {
  0% { transform: rotate(135deg) scale(0.8); box-shadow: 0 0 17px 10px rgba(165, 238, 224, 0.5); }
  25% { box-shadow: 0 0 17px 5px rgba(165, 238, 224, 0.5); }
  50% { box-shadow: 0 0 17px 7px rgba(165, 238, 224, 0.5); }
  75% { box-shadow: 0 0 17px 5px rgba(165, 238, 224, 0.5); }
  100% { box-shadow: 0 0 17px 10px rgba(165, 238, 224, 0.5); }
}

.takeoff {
  z-index: -4;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  width: 7%;
  height: 100%;
  top: 67%;
  background-image: linear-gradient(to right, #4F46E5 0%, #dafffe 25%, #818CF8 50%, #dafffe 75%, #4F46E5 100%);
}

.shake {
  animation: shake 0.2s infinite cubic-bezier(.36,.07,.19,.97) alternate;
  transform: translate3d(0, 0, 0);
  backface-visibility: hidden;
  perspective: 1000px;
}

@keyframes shake {
  10%, 90% { transform: translate3d(-1px, 0, 0); }
  20%, 80% { transform: translate3d(-1px, 0, 0); }
  30%, 50%, 70% { transform: translate3d(-2px, 0, 0); }
  40%, 60% { transform: translate3d(2px, 0, 0); }
}

.shootingstar {
  position: absolute;
  width: 3px;
  height: 20px;
  border-radius: 50%;
  box-shadow: 0 0 6px 3px rgba(255, 255, 255, 0.15);
  background-color: #fff;
  z-index: -2;
  animation: shooting 10s infinite ease; 
}

/* Generating random positions for shooting stars in SCSS loop equivalent */
.shootingstar:nth-child(1) { left: 50px; top: 100px; animation-delay: -10s; }
.shootingstar:nth-child(2) { left: 200px; top: 20px; animation-delay: -5s; }
/* Adding a few manual ones for brevity, real random requires pre-processor or JS style adjustment. 
   For Vue scoped CSS we can't iterate easily without SASS. 
   Assuming standard layout for simplified demo. */
</style>
