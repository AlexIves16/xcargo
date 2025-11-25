<template>
  <div class="search-page">
    <div class="search-content">
      <h1>Поиск по трек-номеру</h1>
      <input
        v-model="trackingNumber"
        placeholder="Введите трек-номер"
        class="search-input"
      />
      <button @click="searchByTrackingNumber" class="search-button">Искать</button>

      <div v-if="results && results.length" class="results-section">
        <h2>Результаты поиска:</h2>
        <ul>
          <li v-for="(result, index) in results" :key="index">
            {{ result.join(' | ') }}
          </li>
        </ul>
      </div>
      <p v-else-if="searched">Ничего не найдено</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const trackingNumber = ref('');
const results = ref([]);
const searched = ref(false);

async function searchByTrackingNumber() {
  searched.value = false;
  results.value = [];
  if (!trackingNumber.value) return;

  try {
    const response = await $fetch(`/api/get-sheet-data`);
    if (response.data) {
      results.value = response.data.filter((row) => {
        const searchTerm = trackingNumber.value.toLowerCase().trim();
        const cellValue = row[0].toLowerCase().trim();
        return cellValue === searchTerm;
      });
      searched.value = true;
    } else {
      console.error("Ошибка при получении данных:", response.error);
      searched.value = true;
    }
  } catch (error) {
    console.error("Ошибка запроса:", error);
    searched.value = true;
  }
}

// Force content visibility on mount
onMounted(() => {
  const searchPage = document.querySelector('.search-page');
  if (searchPage) {
    searchPage.setAttribute('style', 'opacity: 1 !important; visibility: visible !important;');
  }
  
  const searchContent = document.querySelector('.search-content');
  if (searchContent) {
    searchContent.setAttribute('style', 'opacity: 1 !important; visibility: visible !important;');
  }
});
</script>

<style scoped>
.search-page {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px - 50px); /* Высота экрана минус высота шапки и футера в ПК версии */
  opacity: 1 !important;
}

/* Для мобильной версии */
@media (max-width: 768px) {
  .search-page {
    min-height: calc(100vh - 50px - 50px); /* Высота экрана минус высота шапки и футера в мобильной версии */
    opacity: 1 !important;
  }
}

.search-content {
  max-width: 600px; /* Уменьшенная максимальная ширина */
  width: 100%;
  background-color: rgba(255, 255, 255, 0.8); /* Полупрозрачная подложка */
  padding: 30px 20px;
  border-radius: 8px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: auto; /* Автоматическая высота */
}

h1 {
  font-size: 24px;
  margin-bottom: 20px;
  text-align: center;
  color: var(--tg-theme-text-color, #000); /* Используем глобальный текстовый цвет */
}

.search-input {
  padding: 10px;
  width: 100%; /* 100% от родительского элемента (max-width: 600px) */
  max-width: 400px; /* Максимальная ширина для больших экранов */
  margin-bottom: 15px;
  border-radius: 8px;
  border: 1px solid #ccc;
  box-sizing: border-box;
  color: var(--tg-theme-text-color, #000); /* Убедитесь, что текст вводимых данных черный */
}

.search-button {
  padding: 10px 20px;
  margin-bottom: 20px;
  background: var(--tg-theme-button-color, #2481cc);
  color: var(--tg-theme-button-text-color, #ffffff);
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.search-button:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.results-section {
  width: 100%;
  margin-top: 20px;
  flex-grow: 1; /* Позволяет секции занимать доступное пространство */
  overflow-y: hidden; /* Отключаем скролл по умолчанию */
}

/* Включаем скролл только в мобильной версии */
@media (max-width: 768px) {
  .results-section {
    overflow-y: auto; /* Включаем скролл только в мобильной версии */
  }
}

.results-section h2 {
  font-size: 20px;
  margin-bottom: 10px;
  text-align: center;
  color: var(--tg-theme-text-color, #000); /* Используем глобальный текстовый цвет */
}

ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

li {
  background: var(--tg-theme-bg-color, #f9f9f9);
  color: var(--tg-theme-text-color, #000000);
  margin-bottom: 10px;
  padding: 10px;
  border-radius: 5px;
}

/* Убрали стили для кнопки "Назад" */
</style>