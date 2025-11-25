<template>
  <footer class="footer-container">
    <div class="glass-footer">
      <div class="footer-content">
        <!-- Юридическая информация -->
        <div class="footer-section">
          <h4 class="footer-heading">Информация</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/privacy" class="footer-link">Политика конфиденциальности</NuxtLink></li>
          </ul>
        </div>

        <!-- Контактная информация -->
        <div class="footer-section">
          <h4 class="footer-heading">Контакты</h4>
          <p class="footer-text">Email: info@xprc.kz</p>
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
  position: relative;
  z-index: 1;
  flex-shrink: 0; /* Не сжимается */
}

.glass-footer {
  background: rgba(255, 255, 255, 0.95); /* Белый фон */
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(0, 0, 0, 0.1); /* Темная граница сверху */
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05); /* Тень сверху */
  padding: 1rem 1.5rem 0.75rem; /* Уменьшены отступы */
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(2, 1fr); /* Только 2 колонки */
  gap: 2rem;
  margin-bottom: 0.5rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem; /* Уменьшен gap */
}

.footer-title {
  font-size: 1.1rem; /* Уменьшен размер */
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.footer-description {
  font-size: 0.8rem; /* Уменьшен размер */
  color: #4a4a4a;
  line-height: 1.4;
  margin: 0;
}

.footer-heading {
  font-size: 0.85rem; /* Уменьшен размер */
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.3rem 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.3rem; /* Уменьшен gap */
}

.footer-link {
  color: #4a4a4a;
  text-decoration: none;
  font-size: 0.8rem; /* Уменьшен размер */
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #000;
  transform: translateX(3px);
}

.footer-text {
  font-size: 0.8rem; /* Уменьшен размер */
  color: #4a4a4a;
  margin: 0.15rem 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 0.75rem; /* Уменьшен отступ */
  text-align: center;
}

.copyright {
  font-size: 0.75rem; /* Уменьшен размер */
  color: #666;
  margin: 0;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .glass-footer {
    padding: 0.75rem 1rem 0.5rem; /* Еще меньше для мобильных */
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .footer-title {
    font-size: 1rem;
  }

  .footer-section {
    text-align: center;
  }

  .footer-links {
    align-items: center;
  }
}

/* Dark mode support */
@media (prefers-color-scheme: dark) {
  .glass-footer {
    background: rgba(0, 0, 0, 0.3);
    border-top: 1px solid rgba(255, 255, 255, 0.1);
  }

  .footer-title,
  .footer-heading {
    color: #e5e5e5;
  }

  .footer-description,
  .footer-text,
  .footer-link {
    color: #b0b0b0;
  }

  .footer-link:hover {
    color: #fff;
  }

  .copyright {
    color: #999;
  }
}
</style>
