<template>
  <div class="services-page">
    <div class="services-content">
      <h1>Наши Услуги 📦🚛</h1>
      <p>В Xpress Cargo мы предлагаем комплексные услуги по доставке товаров из Китая в Казахстан, учитывая все потребности клиентов:</p>
      
      <ul>
        <li>
          <strong>Доставка из Китая</strong><br>
          Быстрая и надёжная транспортировка грузов из Китая. Мы обеспечиваем доставку до вашего склада или точки выдачи, с учетом всех таможенных процедур и логистики.
        </li>
        <li>
          <strong>Отслеживание груза</strong><br>
          Удобная система отслеживания, которая позволяет вам всегда знать, где находится ваш товар. Просто введите трек-номер, и получите актуальную информацию о статусе груза.
        </li>
        <li>
          <strong>Консультации по логистике</strong><br>
          Наша команда экспертов поможет подобрать оптимальные маршруты и способы доставки, исходя из особенностей вашего товара и бюджета.
        </li>
        <li>
          <strong>Таможенное оформление</strong><br>
          Полное сопровождение груза при прохождении таможни. Мы берём на себя оформление всех документов, чтобы процесс был максимально удобен и прозрачен для вас.
        </li>
        <li>
          <strong>Гибкие тарифы и калькулятор стоимости</strong><br>
          Вы можете заранее рассчитать стоимость доставки вашего груза с помощью нашего калькулятора на сайте, чтобы точно понимать бюджет.
        </li>
      </ul>
  
      <p>С нами ваша доставка становится простой и удобной! Мы стремимся сделать все возможное, чтобы ваш груз прибыл быстро, безопасно и по доступной цене.</p>
  
      <!-- Кнопка Назад -->
      <button @click="goBack" class="back-button">← Назад</button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

function goBack() {
  router.back();
}
</script>

<style scoped>
.services-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
}

.services-content {
  max-width: 600px; /* Согласуйте с другими компонентами */
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачная подложка */
  padding: 20px;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: var(--tg-theme-text-color, #000); /* Используем глобальный текстовый цвет */
}

p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
  color: var(--tg-theme-text-color, #000); /* Используем глобальный текстовый цвет */
}

ul {
  list-style-type: none;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
}

li {
  margin-bottom: 15px;
  color: var(--tg-theme-text-color, #000); /* Используем глобальный текстовый цвет */
}

strong {
  font-size: 18px;
  color: var(--tg-theme-text-color, #000); /* Используем глобальный текстовый цвет */
}

.back-button {
  width: 100%;
  max-width: 200px;
  margin-top: auto; /* Размещает кнопку внизу контейнера */
  align-self: center; /* Центрирует кнопку горизонтально */
  padding: 10px 20px;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
}
</style>