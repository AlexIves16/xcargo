<template>
  <div class="blob-container" :style="{ '--blobColor': color }">
    <div class="blob-wrapper" :class="{ 'enter-anim': show }">
      <svg class="blob" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 310 310" preserveAspectRatio="none">
        <path d="M155 20 C245 20 290 65 290 155 C290 245 245 290 155 290 C65 290 20 245 20 155 C20 65 65 20 155 20Z"/>
      </svg>
    </div>
  </div>
</template>

<script setup>
defineProps({
  color: {
    type: String,
    default: '#4F46E5'
  },
  show: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
.blob-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  pointer-events: none; /* Let clicks pass through */
  z-index: 5; /* Above waves (z=1) but below text (header z=2/10, sidebar z=50) */
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.blob-wrapper {
  position: absolute;
  width: 80vw;
  height: 80vw;
  display: flex;
  align-items: center;
  justify-content: center;
  /* Start hidden/offscreen */
  transform: translateX(-150%) scale(0.5);
  opacity: 0;
  transition: all 1.5s cubic-bezier(0.19, 1, 0.22, 1);
}

@media (min-width: 768px) {
  .blob-wrapper {
    width: 65vw; /* Slightly narrower */
    height: 80vh; /* Much taller -> more square implementation */
  }
}

.blob-wrapper.enter-anim {
  transform: translateX(0) scale(1); /* Move to center */
  opacity: 0.6; /* Slight transparency as requested */
}

.blob {
  width: 100%;
  height: 100%;
  fill: var(--blobColor);
  /* Inner floating animation */
  animation: float-blob 10s ease-in-out infinite;
  transform-origin: center center;
  transition: fill 1s ease;
}

@keyframes float-blob {
  0%   { transform: scale(1)   rotate(0deg) translate(0, 0); }
  33%  { transform: scale(1.01, 0.99) rotate(1deg) translate(5px, -5px); }
  66%  { transform: scale(0.99, 1.01) rotate(-1deg) translate(-5px, 5px); }
  100% { transform: scale(1)   rotate(0deg) translate(0, 0); }
}
</style>
