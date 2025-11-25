<template>
  <button 
    v-if="canInstall" 
    @click="installPwa"
    class="install-btn bg-blue-600 text-white px-3 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
  >
    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
    </svg>
    <span>Установить</span>
  </button>
</template>

<script setup>
const canInstall = ref(false);
let deferredPrompt = null;

onMounted(() => {
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    canInstall.value = true;
    console.log('🔥 PWA Install Prompt captured!');
  });

  window.addEventListener('appinstalled', () => {
    canInstall.value = false;
    deferredPrompt = null;
    console.log('✅ PWA Installed');
  });
});

const installPwa = async () => {
  if (!deferredPrompt) return;
  
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  
  deferredPrompt = null;
  canInstall.value = false;
};
</script>
