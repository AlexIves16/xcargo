<template>
  <footer class="footer-container">
    <div class="glass-footer">
      <div class="footer-content">
        <!-- Логотип и описание -->
        <div class="footer-section">
          <h3 class="footer-title">Xpress Cargo</h3>
          <p class="footer-description">
            Доставка грузов из Китая в Казахстан
          </p>
        </div>

        <!-- Навигация -->
        <div class="footer-section">
          <h4 class="footer-heading">Навигация</h4>
          <ul class="footer-links">
            <li><NuxtLink to="/services" class="footer-link">Услуги</NuxtLink></li>
            <li><NuxtLink to="/about" class="footer-link">О нас</NuxtLink></li>
            <li><NuxtLink to="/contact" class="footer-link">Контакты</NuxtLink></li>
            <li><NuxtLink to="/search" class="footer-link">Отслеживание</NuxtLink></li>
          </ul>
        </div>

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
          <p class="footer-text">Телефон: +7 (XXX) XXX-XX-XX</p>
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
  margin-top: auto;
  position: relative;
  z-index: 1;
}

.glass-footer {
  background: rgba(255, 255, 255, 0.15);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding: 3rem 2rem 1.5rem;
}

.footer-content {
  max-width: 1200px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 2rem;
  margin-bottom: 2rem;
}

.footer-section {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.footer-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1a1a1a;
  margin: 0;
}

.footer-description {
  font-size: 0.9rem;
  color: #4a4a4a;
  line-height: 1.5;
  margin: 0;
}

.footer-heading {
  font-size: 1rem;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0 0 0.5rem 0;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.footer-link {
  color: #4a4a4a;
  text-decoration: none;
  font-size: 0.9rem;
  transition: color 0.2s ease, transform 0.2s ease;
  display: inline-block;
}

.footer-link:hover {
  color: #000;
  transform: translateX(3px);
}

.footer-text {
  font-size: 0.9rem;
  color: #4a4a4a;
  margin: 0.25rem 0;
}

.footer-bottom {
  border-top: 1px solid rgba(255, 255, 255, 0.2);
  padding-top: 1.5rem;
  text-align: center;
}

.copyright {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

/* Адаптивность для мобильных устройств */
@media (max-width: 768px) {
  .glass-footer {
    padding: 2rem 1rem 1rem;
  }

  .footer-content {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }

  .footer-title {
    font-size: 1.25rem;
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
