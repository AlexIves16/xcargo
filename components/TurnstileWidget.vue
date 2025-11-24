<template>
  <div id="turnstile-widget" class="my-4"></div>
</template>

<script setup lang="ts">
const emit = defineEmits(['verify', 'expire', 'error']);
const config = useRuntimeConfig();

// Use test key if no key is provided
const siteKey = config.public.turnstileSiteKey || '1x00000000000000000000AA'; 

onMounted(() => {
  if (process.client) {
    if (!document.getElementById('turnstile-script')) {
      const script = document.createElement('script');
      script.id = 'turnstile-script';
      script.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?onload=onloadTurnstileCallback';
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    } else if (window.turnstile) {
        // If script is already loaded, render immediately
        window.turnstile.render('#turnstile-widget', {
            sitekey: siteKey,
            callback: (token: string) => emit('verify', token),
            'expired-callback': () => emit('expire'),
            'error-callback': () => emit('error'),
        });
    }

    window.onloadTurnstileCallback = () => {
      window.turnstile.render('#turnstile-widget', {
        sitekey: siteKey,
        callback: (token: string) => emit('verify', token),
        'expired-callback': () => emit('expire'),
        'error-callback': () => emit('error'),
      });
    };
  }
});
</script>
