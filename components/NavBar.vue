<template>
  <nav class="w-full flex justify-center py-6 fixed top-0 left-0 z-50 bg-white shadow-sm">
    <div class="glass-nav px-3 py-3 md:px-8 md:py-4 rounded-full flex flex-nowrap justify-center gap-2 md:gap-8 items-center w-auto max-w-[98vw]">
      <NuxtLink to="/services" class="nav-link text-[10px] xs:text-xs md:text-base whitespace-nowrap">Услуги</NuxtLink>
      <NuxtLink to="/about" class="nav-link text-[10px] xs:text-xs md:text-base whitespace-nowrap">О Нас</NuxtLink>
      <NuxtLink to="/contact" class="nav-link text-[10px] xs:text-xs md:text-base whitespace-nowrap">Контакты</NuxtLink>
      <NuxtLink to="/search" class="nav-link text-[10px] xs:text-xs md:text-base whitespace-nowrap">Отслеживание</NuxtLink>
    </div>
  </nav>
</template>

<style scoped>
.glass-nav {
  background: rgba(255, 255, 255, 0.95); /* Белый фон как у footer */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05);
}

.nav-link {
  color: #333;
  text-decoration: none;
  font-weight: 500;
  font-size: 0.95rem;
  transition: color 0.2s ease;
}

.nav-link:hover {
  color: #000;
}

/* Dark mode support if needed */
@media (prefers-color-scheme: dark) {
  .nav-link {
    color: #e5e5e5;
  }
  .nav-link:hover {
    color: #fff;
  }
}
</style>
