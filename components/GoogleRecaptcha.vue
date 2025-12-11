<template>
  <div class="g-recaptcha" :data-sitekey="siteKey"></div>
</template>

<script setup>
import { onMounted } from 'vue'

const props = defineProps({
  siteKey: {
    type: String,
    required: true
  }
})

const emit = defineEmits(['verify', 'expire'])

onMounted(() => {
  // Poll for grecaptcha to be ready (since script is in head async)
  const checkGrecaptcha = setInterval(() => {
    if (window.grecaptcha && window.grecaptcha.render) {
      clearInterval(checkGrecaptcha)
      renderWidget()
    }
  }, 100)
});

const renderWidget = () => {
    try {
        window.grecaptcha.render(document.querySelector('.g-recaptcha'), {
            sitekey: props.siteKey,
            callback: (token) => {
                emit('verify', token)
            },
            'expired-callback': () => {
                emit('expire')
            },
            theme: 'dark' // Matches the site theme
        })
    } catch (e) {
        // Widget might already be rendered
        console.warn('Recaptcha render error (might be already rendered):', e)
    }
}
</script>

<style scoped>
/* Ensure it fits nicely */
.g-recaptcha {
    display: flex;
    justify-content: center;
    margin: 10px 0;
}
</style>
