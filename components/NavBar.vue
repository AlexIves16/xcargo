<template>
  <nav class="w-full fixed top-0 left-0 z-[100]">
    <div class="glass-nav w-full px-4 py-4 md:px-8 md:py-4 flex justify-between items-center">
      <div class="nav-links flex gap-2 md:gap-8">
        <NuxtLink to="/services" class="nav-link text-xs md:text-base whitespace-nowrap">Услуги</NuxtLink>
        <NuxtLink to="/about" class="nav-link text-xs md:text-base whitespace-nowrap">О Нас</NuxtLink>
        <NuxtLink to="/contact" class="nav-link text-xs md:text-base whitespace-nowrap">Контакты</NuxtLink>
        <NuxtLink to="/search" class="nav-link text-xs md:text-base whitespace-nowrap">Отслеживание</NuxtLink>
      </div>
      <NuxtLink to="/" class="login-button text-xs md:text-base whitespace-nowrap">Войти</NuxtLink>
    </div>
  </nav>
</template>

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
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem; /* Уменьшенный шрифт для мобильной версии */
  transition: all 0.3s ease;
  position: relative;
  padding: 8px 4px;
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
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.75rem; /* Уменьшенный шрифт для мобильной версии */
  transition: all 0.3s ease;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  padding: 4px 10px; /* Уменьшенные отступы */
  border-radius: 6px; /* Меньший радиус скругления */
  position: relative;
  overflow: hidden;
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

@media (prefers-color-scheme: dark) {
  .nav-link { color: #e5e5e5; }
  .nav-link:hover { color: #fff; }
  .login-button { color: #e5e5e5; }
  .login-button:hover { color: #fff; }
}
</style>