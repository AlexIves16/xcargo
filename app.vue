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

    <!-- Шапка на всех страницах -->
    <NavBar />

    <!-- Контент приложения -->
    <div class="content">
      <div class="page-wrapper" :class="{ 'no-scroll': isHomePage }">
        <NuxtPage />
      </div>
    </div>
    
    <!-- Footer на всех страницах - теперь зафиксирован снизу -->
    <Footer class="fixed-footer" />
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, computed } from 'vue';
import { useRoute } from 'vue-router';
import NavBar from '@/components/NavBar.vue'; // Добавляем импорт NavBar
import Footer from '@/components/Footer.vue'; // Добавляем импорт Footer

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
  height: 100vh;
  color: var(--tg-theme-text-color, #000);
  padding-bottom: 50px; /* space for fixed footer */
  box-sizing: border-box;
  overflow-y: hidden; /* Отключаем скролл по умолчанию */
}

/* Включаем скролл только в мобильной версии */
@media (max-width: 768px) {
  .content {
    overflow-y: auto; /* Включаем скролл только в мобильной версии */
  }
}

.page-wrapper {
  position: relative;
  margin-top: 0; /* Убираем отступ, так как NavBar фиксирован */
  display: flex;
  justify-content: center; /* horizontal centering */
  align-items: flex-start; /* align to top */
  min-height: calc(100vh - 50px); /* Убираем высоту NavBar из расчета */
  padding-bottom: 20px; /* Add some bottom padding */
  box-sizing: border-box;
  padding-top: 50px; /* Точная высота NavBar в мобильной версии */
}

/* Адаптация для десктопа */
@media (min-width: 769px) {
  .page-wrapper {
    padding-top: 70px; /* Высота NavBar в десктоп версии */
  }
}

.page-wrapper.no-scroll {
  overflow: hidden; /* Отключаем скролл на главной */
}

/* Fixed footer positioning */
.fixed-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 50;
}
</style>