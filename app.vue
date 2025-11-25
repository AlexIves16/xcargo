<!-- app.vue -->
<template>
  <div class="app-container">
    <!-- Фоновые изображения -->
    <div
      class="background-image"
      :style="{ backgroundImage: `url(${currentBackground})`, opacity: currentOpacity }"
    ></div>
    <div
      class="background-image"
      :style="{ backgroundImage: `url(${nextBackground})`, opacity: nextOpacity }"
    ></div>

    <!-- Условное отображение подложки -->
    <div v-if="showOverlay" class="overlay"></div>

    <!-- Контент приложения -->
    <div class="content">
      <div class="page-wrapper" :class="{ 'no-scroll': isHomePage }">
        <NuxtPage />
      </div>
      
      <!-- Footer на всех страницах -->
      <Footer />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

// Определяем, является ли текущая страница главной
const isHomePage = computed(() => route.path === '/');

// Определяем, показывать ли подложку
const showOverlay = computed(() => {
  return route.path !== '/';
});

const images = [
  '/b1.jpg',
  '/b2.jpg',
  '/b3.jpg',
  '/b4.jpg',
  '/b5.jpg',
  '/b6.jpg',
  '/b7.jpg',
  '/b8.jpg',
  '/b9.jpg',
  '/b10.jpg',
  '/b11.jpg',
  '/b12.jpg',
  '/b13.jpg',
];

const currentIndex = ref(0);
const nextIndex = ref(1);

const currentBackground = ref(images[currentIndex.value]);
const nextBackground = ref(images[nextIndex.value]);

const currentOpacity = ref(1);
const nextOpacity = ref(0);

let intervalId;

onMounted(() => {
  intervalId = setInterval(() => {
    // Запускаем плавный переход
    nextIndex.value = (currentIndex.value + 1) % images.length;
    nextBackground.value = images[nextIndex.value];
    nextOpacity.value = 1;

    // После завершения анимации обновляем текущее изображение
    setTimeout(() => {
      currentIndex.value = nextIndex.value;
      currentBackground.value = images[currentIndex.value];
      currentOpacity.value = 1;
      nextOpacity.value = 0;
    }, 1000); // Длительность анимации в миллисекундах (должна совпадать с transition)
  }, 5000); // Интервал между сменами изображений в миллисекундах
});

onBeforeUnmount(() => {
  clearInterval(intervalId);
});
</script>

<!-- Глобальные стили -->
<style>
/* Установка глобальных CSS-переменных */
:root {
  --tg-theme-text-color: #000; /* Черный цвет текста */
  --tg-theme-link-color: #2481cc; /* Синий цвет ссылок */
  --tg-theme-hint-color: #e0e0e0; /* Цвет оттенков */
  --tg-theme-bg-color: #f9f9f9; /* Цвет фона элементов */
  --tg-theme-button-color: #2481cc; /* Цвет кнопок */
  --tg-theme-button-text-color: #ffffff; /* Цвет текста на кнопках */
}

/* Применение глобальных стилей */
body, html, .app-container {
  font-family: Helvetica, Arial, sans-serif;
  box-sizing: border-box;
  margin: 0;
  padding: 0;
  color: var(--tg-theme-text-color, #000); /* Устанавливаем черный цвет текста по умолчанию */
}
</style>

<!-- Стили компонента слайдшоу и подложки -->
<style scoped>
.app-container {
  position: relative;
  height: 100vh;
  overflow: hidden; /* Отключаем скролл */
}

.background-image {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center center;
  transition: opacity 1s ease-in-out;
  z-index: -2;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.content {
  position: relative;
  z-index: 0;
  display: flex;
  flex-direction: column;
  height: 100vh;
  color: var(--tg-theme-text-color, #000);
}

.page-wrapper {
  position: absolute; /* Абсолютное позиционирование */
  top: 70px;          /* Отступ сверху (под шапку) */
  bottom: 90px;       /* Отступ снизу (под футер) */
  left: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center; /* Центрирование */
  overflow-y: auto;    /* Скролл только если контент не влезает */
}

.page-wrapper.no-scroll {
  overflow: hidden; /* Отключаем скролл на главной */
}
</style>