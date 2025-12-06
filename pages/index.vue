<template>
  <div class="home">
    <!-- Hero Section with Banner -->
    <section class="hero-section">
      <div class="hero-overlay"></div>
      <div class="hero-content">
        <h1 class="hero-title">Xpress Cargo</h1>
        <p class="hero-subtitle">Быстрая и надёжная доставка грузов из Китая в Казахстан</p>
        <p class="hero-description">Консолидация, хранение на складе и доставка до двери по всему Казахстану</p>
      </div>
    </section>

    <!-- Services Section -->
    <section class="services-section">
      <div class="container">
        <h2 class="section-title">Наши услуги</h2>
        <div class="services-grid">
          <div class="service-card">
            <div class="service-icon">📦</div>
            <h3>Карго доставка</h3>
            <p>Доставка товаров любого объёма из Китая в Казахстан по выгодным тарифам</p>
          </div>
          <div class="service-card">
            <div class="service-icon">🚚</div>
            <h3>Отслеживание</h3>
            <p>Удобное отслеживание ваших посылок в личном кабинете в реальном времени</p>
          </div>
          <div class="service-card">
            <div class="service-icon">💰</div>
            <h3>Прозрачные цены</h3>
            <p>Фиксированные тарифы без скрытых комиссий и дополнительных платежей</p>
          </div>
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section class="about-section">
      <div class="container">
        <h2 class="section-title">О компании</h2>
        <p class="about-text">
          Xpress Cargo — ваш надёжный партнёр в сфере международной логистики. 
          Мы специализируемся на доставке грузов из Китая в Казахстан и предоставляем 
          полный комплекс услуг: от консолидации товаров до доставки до двери.
        </p>
        <div class="stats-grid">
          <div class="stat-item">
            <div class="stat-value">5+</div>
            <div class="stat-label">Лет опыта</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">10K+</div>
            <div class="stat-label">Довольных клиентов</div>
          </div>
          <div class="stat-item">
            <div class="stat-value">50K+</div>
            <div class="stat-label">Доставленных посылок</div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section">
      <div class="container">
        <h2>Свяжитесь с нами</h2>
        <p>Работаем ежедневно с 9:00 до 20:00</p>
        <div class="contact-info">
          <span>📞 +7 708 764 8100</span>
          <span>📧 info@xprc.kz</span>
        </div>
      </div>
    </section>

    <!-- Install PWA -->
    <InstallPwa />
  </div>
</template>

<script setup lang="ts">
import { onAuthStateChanged } from 'firebase/auth';
import InstallPwa from '~/components/InstallPwa.vue';

const { $auth } = useNuxtApp();
const router = useRouter();

// Проверяем авторизацию и перенаправляем
onMounted(() => {
  if ($auth) {
    const unsubscribe = onAuthStateChanged($auth, (user) => {
      if (user) {
        const isAdmin = user.email === 'kairfakomylife@gmail.com';
        router.push(isAdmin ? '/admin' : '/dashboard');
      }
    });
    
    if ($auth.currentUser) {
      const isAdmin = $auth.currentUser.email === 'kairfakomylife@gmail.com';
      router.push(isAdmin ? '/admin' : '/dashboard');
    }
    
    onUnmounted(() => unsubscribe());
  }
});
</script>

<style scoped>
.home {
  min-height: 100vh;
}

/* Hero Section */
.hero-section {
  position: relative;
  height: 70vh;
  min-height: 500px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  text-align: center;
  overflow: hidden;
}

.hero-overlay {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('/b1.jpg') center/cover no-repeat;
  opacity: 0.2;
}

.hero-content {
  position: relative;
  z-index: 1;
  padding: 2rem;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
}

.hero-subtitle {
  font-size: 1.25rem;
  margin-bottom: 1rem;
  opacity: 0.9;
}

.hero-description {
  font-size: 1rem;
  opacity: 0.8;
  max-width: 500px;
  margin: 0 auto;
}

.contact-info {
  display: flex;
  gap: 2rem;
  justify-content: center;
  flex-wrap: wrap;
  margin-top: 1rem;
}

.contact-info span {
  font-size: 1.1rem;
}

/* Container */
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1.5rem;
}

/* Section Titles */
.section-title {
  font-size: 2rem;
  font-weight: 700;
  text-align: center;
  margin-bottom: 2.5rem;
  color: #1f2937;
}

/* Services Section */
.services-section {
  padding: 5rem 0;
  background: #f9fafb;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 2rem;
}

.service-card {
  background: white;
  padding: 2rem;
  border-radius: 1rem;
  text-align: center;
  box-shadow: 0 4px 6px rgba(0,0,0,0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.service-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 8px 15px rgba(0,0,0,0.1);
}

.service-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.service-card h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 0.75rem;
  color: #1f2937;
}

.service-card p {
  color: #6b7280;
  line-height: 1.6;
}

/* About Section */
.about-section {
  padding: 5rem 0;
  background: white;
}

.about-text {
  max-width: 800px;
  margin: 0 auto 3rem;
  text-align: center;
  font-size: 1.1rem;
  line-height: 1.8;
  color: #4b5563;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 2rem;
  max-width: 600px;
  margin: 0 auto;
}

.stat-item {
  text-align: center;
}

.stat-value {
  font-size: 2.5rem;
  font-weight: 700;
  color: #3b82f6;
}

.stat-label {
  color: #6b7280;
  margin-top: 0.5rem;
}

/* CTA Section */
.cta-section {
  padding: 5rem 0;
  background: linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%);
  color: white;
  text-align: center;
}

.cta-section h2 {
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 1rem;
}

.cta-section p {
  margin-bottom: 2rem;
  opacity: 0.9;
}

.cta-button {
  display: inline-block;
  background: white;
  color: #1e3a8a;
  padding: 1rem 2.5rem;
  border-radius: 50px;
  font-weight: 600;
  text-decoration: none;
  transition: all 0.3s ease;
}

.cta-button:hover {
  transform: translateY(-3px);
  box-shadow: 0 6px 20px rgba(0,0,0,0.2);
}

/* Mobile Responsive */
@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
  
  .hero-subtitle {
    font-size: 1rem;
  }
  
  .stats-grid {
    grid-template-columns: 1fr;
    gap: 1.5rem;
  }
  
  .stat-value {
    font-size: 2rem;
  }
}
</style>