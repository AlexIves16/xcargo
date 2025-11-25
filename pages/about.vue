<template>
  <div class="about-page">
    <div class="about-content">
      <h1>О компании Xpress Cargo 🚚</h1>
      
      <div class="section">
        <h2>Наша миссия</h2>
        <p>
          Xpress Cargo - это надежный партнер в сфере международной логистики, специализирующийся на 
          доставке товаров из Китая в Казахстан. Мы стремимся сделать международную торговлю доступной, 
          прозрачной и удобной для каждого клиента.
        </p>
      </div>
      
      <div class="section">
        <h2>Почему выбирают нас</h2>
        <ul class="benefits-list">
          <li>
            <strong>Прозрачность</strong>
            <p>Полный контроль на всех этапах доставки с помощью нашей системы отслеживания</p>
          </li>
          <li>
            <strong>Надежность</strong>
            <p>Гарантируем сохранность груза и соблюдение сроков доставки</p>
          </li>
          <li>
            <strong>Профессионализм</strong>
            <p>Опытная команда логистиков, знающая все тонкости международных перевозок</p>
          </li>
          <li>
            <strong>Выгодные тарифы</strong>
            <p>Конкурентные цены и гибкая система скидок для постоянных клиентов</p>
          </li>
        </ul>
      </div>
      
      <div class="section">
        <h2>Наша история</h2>
        <p>
          Основанная в 2020 году, компания Xpress Cargo начала свой путь как небольшая логистическая 
          компания, специализирующаяся на доставке товаров из Китая. За эти годы мы выросли в надежного 
          партнера для сотен казахстанских предпринимателей и частных лиц.
        </p>
        <p>
          Сегодня мы предлагаем полный спектр услуг по международной логистике, включая доставку, 
          таможенное оформление, страхование грузов и консультации по всем вопросам международной торговли.
        </p>
      </div>
      
      <div class="section">
        <h2>Наши ценности</h2>
        <div class="values-grid">
          <div class="value-item">
            <h3>Клиентоориентированность</h3>
            <p>Клиент всегда в центре нашего внимания</p>
          </div>
          <div class="value-item">
            <h3>Инновации</h3>
            <p>Постоянное улучшение сервиса через технологии</p>
          </div>
          <div class="value-item">
            <h3>Честность</h3>
            <p>Прозрачные условия и честные отношения</p>
          </div>
          <div class="value-item">
            <h3>Ответственность</h3>
            <p>Полная ответственность за каждый этап доставки</p>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>Свяжитесь с нами</h2>
        <p>
          Готовы начать сотрудничество? Свяжитесь с нами по телефону <strong>+7 708 764 8100</strong> 
          или посетите наш офис в Алматы. Мы всегда рады помочь вам с доставкой ваших грузов!
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
// Force content visibility on mount
onMounted(() => {
  const aboutPage = document.querySelector('.about-page');
  if (aboutPage) {
    aboutPage.setAttribute('style', 'opacity: 1 !important; visibility: visible !important;');
  }
  
  const aboutContent = document.querySelector('.about-content');
  if (aboutContent) {
    aboutContent.setAttribute('style', 'opacity: 1 !important; visibility: visible !important;');
  }
});
</script>

<style scoped>
.about-page {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: calc(100vh - 70px - 50px); /* Высота экрана минус высота шапки и футера в ПК версии */
  opacity: 1 !important;
}

.about-content {
  max-width: 800px; /* Увеличенная ширина для лучшего отображения контента */
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачная подложка */
  padding: 30px;
  padding-top: 0; /* Убираем отступ, так как он компенсируется через page-wrapper */
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  position: relative;
}

/* Для мобильной версии */
@media (max-width: 768px) {
  .about-page {
    min-height: calc(100vh - 50px - 50px); /* Высота экрана минус высота шапки и футера в мобильной версии */
    opacity: 1 !important;
  }
  
  .about-content {
    padding: 20px;
    max-width: 100%;
  }
}

h1 {
  font-size: 28px;
  margin-bottom: 25px;
  text-align: center;
  color: var(--tg-theme-text-color, #000);
}

h2 {
  font-size: 22px;
  margin: 25px 0 15px 0;
  color: var(--tg-theme-text-color, #000);
  border-bottom: 2px solid var(--tg-theme-button-color, #2481cc);
  padding-bottom: 5px;
}

h3 {
  font-size: 18px;
  margin: 0 0 10px 0;
  color: var(--tg-theme-text-color, #000);
}

p {
  font-size: 16px;
  line-height: 1.6;
  margin-bottom: 15px;
  color: var(--tg-theme-text-color, #000);
}

.section {
  margin-bottom: 30px;
}

.benefits-list {
  list-style-type: none;
  padding: 0;
  margin: 0;
}

.benefits-list li {
  margin-bottom: 20px;
  padding: 15px;
  background-color: rgba(36, 129, 204, 0.05);
  border-radius: 8px;
  border-left: 4px solid var(--tg-theme-button-color, #2481cc);
}

.benefits-list strong {
  font-size: 18px;
  color: var(--tg-theme-text-color, #000);
  display: block;
  margin-bottom: 5px;
}

.benefits-list p {
  margin: 0;
  font-size: 15px;
}

.values-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  margin-top: 15px;
}

.value-item {
  background-color: rgba(255, 255, 255, 0.7);
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.05);
}

.value-item h3 {
  margin-top: 0;
  color: var(--tg-theme-button-color, #2481cc);
}

/* Адаптация для мобильных устройств */
@media (max-width: 768px) {
  h1 {
    font-size: 24px;
  }
  
  h2 {
    font-size: 20px;
  }
  
  h3 {
    font-size: 16px;
  }
  
  .values-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }
  
  .value-item {
    padding: 15px;
  }
  
  .benefits-list li {
    padding: 12px;
  }
}
</style>