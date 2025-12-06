<template>
  <div ref="telegramContainer" class="flex justify-center">
    <!-- Telegram widget will be mounted here -->
    <div v-if="!botName" class="text-red-500 text-sm">
      Bot name not configured
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  botName?: string
}>();

const emit = defineEmits(['callback']);
const telegramContainer = ref<HTMLElement | null>(null);
const config = useRuntimeConfig();

// DEBUG: Log entire public config to see what's available
console.log('🔍 DEBUG: Full public runtimeConfig:', JSON.stringify(config.public, null, 2));
console.log('🔍 DEBUG: telegramBotName from config:', config.public.telegramBotName);
console.log('🔍 DEBUG: props.botName:', props.botName);

const botName = props.botName || (config.public.telegramBotName as string);
console.log('🔍 DEBUG: Final botName:', botName);

onMounted(() => {
  if (!botName) {
    console.error('Telegram Bot Name is missing! Check that TELEGRAM_BOT_NAME env var is set.');
    return;
  }
  console.log('✅ DEBUG: Telegram widget loading with bot:', botName);

  // Create global callback function
  (window as any).onTelegramAuth = (user: any) => {
    emit('callback', user);
  };

  // Inject script
  const script = document.createElement('script');
  script.async = true;
  script.src = 'https://telegram.org/js/telegram-widget.js?22';
  script.setAttribute('data-telegram-login', botName);
  script.setAttribute('data-size', 'large');
  script.setAttribute('data-radius', '10');
  script.setAttribute('data-onauth', 'onTelegramAuth(user)');
  script.setAttribute('data-request-access', 'write');
  
  if (telegramContainer.value) {
    telegramContainer.value.appendChild(script);
  }
});

onUnmounted(() => {
  // Cleanup
  delete (window as any).onTelegramAuth;
});
</script>
