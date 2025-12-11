<template>
  <div id="app">
    <Home />
  </div>
</template>

<script>
import Home from './app/page.vue'
export default {
  components: {
    Home
  }
}
</script>

<style>
html, body, #app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
}
</style>