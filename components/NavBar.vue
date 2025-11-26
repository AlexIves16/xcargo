<template>
  <nav class="w-full fixed top-0 left-0 z-[100]">
    <div class="glass-nav w-full px-4 py-4 md:px-8 md:py-4 flex justify-between items-center">
      <div class="nav-links flex gap-2 md:gap-8">
        <NuxtLink to="/services" class="nav-link text-xs md:text-base whitespace-nowrap">Услуги</NuxtLink>
        <NuxtLink to="/about" class="nav-link text-xs md:text-base whitespace-nowrap">О Нас</NuxtLink>
        <NuxtLink to="/contact" class="nav-link text-xs md:text-base whitespace-nowrap">Контакты</NuxtLink>
        <NuxtLink to="/search" class="nav-link text-xs md:text-base whitespace-nowrap">Отслеживание</NuxtLink>
      </div>
      <div class="nav-actions flex items-center gap-2">
        <NuxtLink v-if="isAuthenticated" to="/dashboard" class="login-button text-xs md:text-base whitespace-nowrap">Кабинет</NuxtLink>
        <NuxtLink v-else-if="!props.isHomePage" to="/" class="login-button text-xs md:text-base whitespace-nowrap">Войти</NuxtLink>
      </div>
    </div>
  </nav>
</template>

<script setup>
import { useNuxtApp } from '#app';
import { onMounted, ref, onUnmounted } from 'vue';

const props = defineProps({
  isHomePage: {
    type: Boolean,
    default: false
  }
});

const isAuthenticated = ref(false);
let unsubscribe = null;

onMounted(async () => {
  try {
    const { $auth } = useNuxtApp();
    if ($auth) {
      // Проверяем текущее состояние аутентификации
      isAuthenticated.value = !!$auth.currentUser;
      console.log('Initial auth state:', $auth.currentUser ? 'authenticated' : 'not authenticated');
      
      // Слушаем изменения состояния аутентификации
      unsubscribe = $auth.onAuthStateChanged(user => {
        isAuthenticated.value = !!user;
        console.log('Auth state changed:', user ? 'authenticated' : 'not authenticated');
        
        // Если пользователь вышел из системы и мы находимся не на главной странице,
        // возможно стоит перенаправить его на главную
        if (!user && !props.isHomePage) {
          console.log('User logged out, consider redirecting to home page');
        }
      });
      
      // Дополнительная проверка через небольшую задержку
      setTimeout(() => {
        isAuthenticated.value = !!$auth.currentUser;
        console.log('Delayed auth check:', $auth.currentUser ? 'authenticated' : 'not authenticated');
      }, 500);
      
      // Ещё одна проверка через большую задержку для надежности
      setTimeout(() => {
        isAuthenticated.value = !!$auth.currentUser;
        console.log('Second delayed auth check:', $auth.currentUser ? 'authenticated' : 'not authenticated');
      }, 1500);
    }
  } catch (error) {
    console.log('Error checking auth state:', error);
  }
});

// Очищаем слушатель при размонтировании компонента
onUnmounted(() => {
  if (unsubscribe) {
    unsubscribe();
  }
});
</script>

<style scoped>
.glass-nav {
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
  height: 50px; /* Фиксированная высота для мобильной версии */
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 1rem;
  padding-right: 1rem;
}

.nav-links {
  display: flex;
  align-items: center;
}

.nav-link {
  color: #2481cc; /* Фиксированный голубой цвет для лучшей читаемости */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem; /* Уменьшенный шрифт для мобильной версии */
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 4px;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1); /* Легкая тень для лучшей читаемости на фоне изображений */
}

.nav-link:hover {
  color: #000;
  transform: translateY(-2px);
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 0;
  height: 2px;
  background-color: var(--tg-theme-button-color, #2481cc);
  transition: width 0.3s ease;
}

.nav-link:hover::after {
  width: 100%;
}

.login-button {
  color: #ffffff; /* Фиксированный белый цвет текста для контраста */
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem; /* Уменьшенный шрифт для мобильной версии */
  transition: all 0.3s ease;
  background: #2481cc; /* Фиксированный голубой цвет фона */
  padding: 4px 10px; /* Уменьшенные отступы */
  border-radius: 6px; /* Меньший радиус скругления */
  position: relative;
  overflow: hidden;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.2); /* Легкая тень для лучшей читаемости на фоне изображений */
}

.login-button:hover {
  color: #fff;
  background: #1a5e99;
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

/* Адаптация для десктопа */
@media (min-width: 769px) {
  .glass-nav {
    height: 70px; /* Большая высота для десктопа */
    padding-left: 2rem;
    padding-right: 2rem;
  }
  
  .nav-link {
    font-size: 1.1rem;
    padding: 8px;
  }
  
  .login-button {
    font-size: 1.1rem;
    padding: 5px 15px; /* Восстановленные отступы для десктопа */
    border-radius: 8px; /* Восстановленный радиус скругления для десктопа */
  }
}

/* Удалены стили для темной темы - используем фиксированные цвета */
</style>