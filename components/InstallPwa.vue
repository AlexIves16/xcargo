<template>
  <div v-if="canInstall || forceShowButton" class="install-pwa-container mt-4 p-3 bg-blue-50 rounded-lg border border-blue-200">
    <button 
      @click="installPwa"
      class="install-btn w-full bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
    >
      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
      </svg>
      <span>Установить приложение</span>
    </button>
    <p class="text-xs text-blue-800 mt-2 text-center">Установите приложение для лучшего опыта</p>
  </div>
</template>

<script setup>
const canInstall = ref(false);
let deferredPrompt = null;

// Force show the button after a delay for better UX
const forceShowButton = ref(false);

// Функция для проверки, может ли браузер установить PWA
const checkPwaInstallability = () => {
  // Проверяем, установлено ли приложение уже
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('ℹ️ PWA уже установлено');
    canInstall.value = false;
    forceShowButton.value = false;
    return;
  }
  
  // В некоторых браузерах событие beforeinstallprompt может не сработать сразу
  // Попробуем проверить через небольшую задержку
  setTimeout(() => {
    if (!deferredPrompt && 'serviceWorker' in navigator) {
      // Если Service Worker зарегистрирован, вероятно PWA может быть установлено
      navigator.serviceWorker.getRegistrations().then(registrations => {
        if (registrations.length > 0) {
          console.log('ℹ️ Service Worker зарегистрирован, PWA может быть установлено');
          // В некоторых случаях мы можем показать кнопку установки даже без события
          // Это поможет в браузерах, которые не поддерживают beforeinstallprompt должным образом
          if (!deferredPrompt && !forceShowButton.value) {
            forceShowButton.value = true;
            console.log('  Force showing install button based on service worker availability');
          }
        }
      });
    }
  }, 1000);
};

onMounted(() => {
  // Проверяем, установлено ли приложение уже
  if (window.matchMedia('(display-mode: standalone)').matches) {
    console.log('ℹ️ PWA уже установлено');
    canInstall.value = false;
    forceShowButton.value = false;
    return;
  }
  
  // Добавляем отладочную информацию о событиях
  console.log('🔍 PWA Component mounted');
  
  // Check if beforeinstallprompt is supported
  let beforeinstallpromptSupported = false;
  
  window.addEventListener('beforeinstallprompt', (e) => {
    beforeinstallpromptSupported = true;
    console.log('🔔 beforeinstallprompt event fired');
    // Не вызываем preventDefault(), чтобы позволить браузеру показать нативный баннер
    // Но сохраняем событие для ручной установки через кнопку
    deferredPrompt = e;
    canInstall.value = true;
    console.log('🔥 PWA Install Prompt captured!');
    console.log('  Event type:', e.type);
    console.log('  Platforms available:', e.platforms || 'not specified');
    
    // Не вызываем preventDefault(), чтобы позволить браузеру показать нативный баннер
    // Пользователь сможет установить приложение через нативный баннер или кнопку
  });

  window.addEventListener('appinstalled', () => {
    canInstall.value = false;
    deferredPrompt = null;
    forceShowButton.value = false;
    console.log('✅ PWA Installed');
  });
  
  // Отладочная информация
  console.log('🔍 PWA Debug Info:');
  console.log('  Display mode:', window.matchMedia('(display-mode: standalone)').matches ? 'standalone' : 'browser');
  
  // Проверяем Service Worker
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      console.log('  Service Workers registered:', registrations.length > 0);
      if (registrations.length > 0) {
        console.log('  SW scope:', registrations[0].scope);
        console.log('  SW state:', registrations[0].active ? 'Active' : 'Installing/Waiting');
        // Show button if service worker is registered
        if (!deferredPrompt) {
          setTimeout(() => {
            forceShowButton.value = true;
            console.log('  Force showing install button after delay');
          }, 2000);
        }
      }
    });
  }
  
  // Проверяем манифест
  const manifestLink = document.querySelector('link[rel="manifest"]');
  console.log('  Manifest present:', !!manifestLink);
  if (manifestLink) {
    console.log('  Manifest href:', manifestLink.href);
  }
  
  // Проверяем возможность установки
  checkPwaInstallability();
  
  // Force show button after a longer delay as fallback
  // But only if beforeinstallprompt is not supported (fallback for older browsers)
  setTimeout(() => {
    if (!beforeinstallpromptSupported && !deferredPrompt && !forceShowButton.value) {
      forceShowButton.value = true;
      console.log('  Force showing install button as fallback for older browsers');
    }
  }, 5000);
});

const installPwa = async () => {
  console.log('📥 installPwa() called');
  
  if (!deferredPrompt) {
    console.warn('⚠️ No deferred prompt available');
    // В некоторых браузерах можно попробовать вызвать установку через браузер
    if ('serviceWorker' in navigator) {
      console.log('ℹ️ Попробуйте установить через меню браузера');
      // Показываем пользователю инструкцию
      alert('Пожалуйста, используйте меню браузера для установки приложения:\n\n1. Нажмите на иконку меню (три точки) в браузере\n2. Выберите "Установить приложение" или "Добавить на главный экран"');
      
      // Try to trigger installation through browser APIs if available
      if (navigator.getInstalledRelatedApps) {
        try {
          await navigator.getInstalledRelatedApps();
          // This might trigger the install prompt in some browsers
        } catch (err) {
          console.error('Error triggering install:', err);
        }
      }
    }
    return;
  }
  
  console.log('📤 Showing install prompt');
  // Показываем диалог установки
  deferredPrompt.prompt();
  const { outcome } = await deferredPrompt.userChoice;
  console.log(`User response to the install prompt: ${outcome}`);
  
  deferredPrompt = null;
  canInstall.value = false;
  forceShowButton.value = false;
};
</script>
