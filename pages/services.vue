<template>
  <!-- Убрали NavBar, так как он теперь глобальный -->

  <div class="services-content">
    <h1>Наши Услуги 📦🚛</h1>
    <p>
      В Xpress Cargo мы предлагаем комплексные услуги по доставке товаров из Китая в
      Казахстан, учитывая все потребности клиентов:
    </p>

    <ul>
      <li>
        <strong>Доставка из Китая</strong><br />
        Быстрая и надёжная транспортировка грузов из Китая. Мы обеспечиваем доставку до
        вашего склада или точки выдачи, с учётом всех таможенных процедур и логистики.
      </li>
      <li>
        <strong>Отслеживание груза</strong><br />
        Удобная система отслеживания, которая позволяет вам всегда знать, где находится ваш
        товар. Просто введите трек‑номер, и получите актуальную информацию о статусе
        груза.
      </li>
      <li>
        <strong>Консультации по логистике</strong><br />
        Наша команда экспертов поможет подобрать оптимальные маршруты и способы доставки,
        исходя из особенностей вашего товара и бюджета.
      </li>
      <li>
        <strong>Таможенное оформление</strong><br />
        Полное сопровождение груза при прохождении таможни. Мы берём на себя оформление всех
        документов, чтобы процесс был максимально удобен и прозрачен для вас.
      </li>
      <li>
        <strong>Гибкие тарифы и калькулятор стоимости</strong><br />
        Вы можете заранее рассчитать стоимость доставки вашего груза с помощью нашего
        калькулятора на сайте, чтобы точно понимать бюджет.
      </li>
    </ul>

    <p>
      С нами ваша доставка становится простой и удобной! Мы стремимся сделать всё
      возможное, чтобы ваш груз прибыл быстро, безопасно и по доступной цене.
    </p>
  </div>
</template>

<script setup lang="ts">
// Убрали импорт NavBar, так как он теперь глобальный
</script>

<style scoped>
.services-content {
  max-width: 600px;
  width: 100%;
  margin: 0 auto;
  background-color: rgba(255, 255, 255, 0.8);
  padding: 20px;
  padding-top: 0; /* Убираем отступ, так как он компенсируется через page-wrapper */
  border-radius: 8px;
  box-sizing: border-box;
  min-height: calc(100vh - 70px - 50px); /* Высота экрана минус высота шапки и футера в ПК версии */
  display: flex;
  flex-direction: column;
  justify-content: center;
}

/* Для мобильной версии */
@media (max-width: 768px) {
  .services-content {
    min-height: calc(100vh - 50px - 50px); /* Высота экрана минус высота шапки и футера в мобильной версии */
  }
}

/* Typography */
h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: var(--tg-theme-text-color, #000);
}
p,
li,
strong {
  color: var(--tg-theme-text-color, #000);
}
p {
  font-size: 16px;
  line-height: 1.5;
  margin-bottom: 20px;
}
ul {
  list-style: none;
  padding: 0;
  margin-bottom: 20px;
  width: 100%;
}
li {
  margin-bottom: 15px;
}
strong {
  font-size: 18px;
}

/* Removed back-button styles since button was removed */
</style>