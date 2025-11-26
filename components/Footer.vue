<template>
  <footer class="footer-container">
    <div class="glass-footer">
      <div class="footer-content">
        <!-- Legal Information Section (without heading) -->
        <div class="footer-section">
          <ul class="footer-links">
            <li><NuxtLink to="/privacy" class="footer-link">Политика конфиденциальности</NuxtLink></li>
          </ul>
        </div>

        <!-- Contact Information Section (without heading and email) -->
        <div class="footer-section">
          <p class="footer-text">Телефон: +7 708 764 8100</p>
        </div>
      </div>

      <!-- Copyright -->
      <div class="footer-bottom">
        <p class="copyright">
          © {{ currentYear }} Xpress Cargo. Все права защищены.
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
const currentYear = new Date().getFullYear();
</script>

<style scoped>
.footer-container {
  width: 100%;
  /* Removed position: static since it's now handled by the parent */
  left: 0;
  z-index: 50;
}

.glass-footer {
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0, 0, 0, 0.1);
  box-shadow: 0 -1px 5px rgba(0, 0, 0, 0.05);
  padding: 0.2rem 0.5rem 0.2rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.15rem;
}

.footer-link {
  color: #2481cc; /* Фиксированный голубой цвет для лучшей читаемости */
  text-decoration: none;
  font-size: 0.65rem;
  transition: color 0.2s ease;
  display: inline-block;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3); /* Легкая тень для лучшей читаемости на фоне изображений */
}

.footer-link:hover {
  color: #000;
}

.footer-text {
  font-size: 0.65rem;
  color: #2481cc; /* Фиксированный голубой цвет для лучшей читаемости */
  margin: 0;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3); /* Легкая тень для лучшей читаемости на фоне изображений */
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 0.3rem;
  text-align: center;
}

.copyright {
  font-size: 0.6rem;
  color: #2481cc; /* Фиксированный голубой цвет для лучшей читаемости */
  margin: 0;
  text-shadow: 0 1px 2px rgba(255, 255, 255, 0.3); /* Легкая тень для лучшей читаемости на фоне изображений */
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .glass-footer {
    padding: 0.3rem 0.5rem 0.2rem;
  }

  .footer-content {
    gap: 0.3rem;
  }

  .footer-heading {
    font-size: 0.75rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-links {
    align-items: center;
  }
}

/* Удалены стили для темной темы - используем фиксированные цвета */
</style>