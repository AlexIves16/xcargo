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
const botName = props.botName || (config.public.telegramBotName as string);

onMounted(() => {
  if (!botName) {
    console.error('Telegram Bot Name is missing!');
    return;
  }

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
