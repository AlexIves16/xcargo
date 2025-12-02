<template>
  <div class="search-page">
    <div class="search-content">
      <h1>Поиск по трек-номеру</h1>
      <input
        v-model="trackingNumber"
        placeholder="Введите трек-номер"
        class="search-input"
        @keyup.enter="searchByTrackingNumber"
      />
      <button @click="searchByTrackingNumber" class="search-button" :disabled="loading">
        {{ loading ? 'Поиск...' : 'Искать' }}
      </button>

      <div v-if="results && results.length" class="results-section">
        <h2>Результаты поиска:</h2>
        <ul>
          <li v-for="(track, index) in results" :key="index">
            <div class="track-info">
              <span class="track-number">{{ track.number }}</span>
              <span :class="getStatusClass(track.status)" class="track-status">
                {{ getStatusLabel(track.status) }}
              </span>
            </div>
            <div class="track-details">
              <p v-if="track.description">Описание: {{ track.description }}</p>
              <p v-if="track.sentAt">Отправлено: {{ track.sentAt }}</p>
              <p v-if="track.arrivedAt">Прибыло: {{ formatDate(track.arrivedAt) }}</p>
              <p v-if="track.batchNumber">Партия: {{ track.batchNumber }}</p>
            </div>
          </li>
        </ul>
      </div>
      <p v-else-if="searched" class="no-results">Ничего не найдено</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { collection, query, where, getDocs } from 'firebase/firestore';

const { $db } = useNuxtApp();

const trackingNumber = ref('');
const results = ref([]);
const searched = ref(false);
const loading = ref(false);

async function searchByTrackingNumber() {
  if (!trackingNumber.value.trim()) return;
  
  loading.value = true;
  searched.value = false;
  results.value = [];

  try {
    const q = query(
      collection($db, 'tracks'), 
      where('number', '==', trackingNumber.value.trim())
    );
    
    const querySnapshot = await getDocs(q);
    
    results.value = querySnapshot.docs.map(doc => doc.data());
    searched.value = true;
  } catch (error) {
    console.error("Ошибка при поиске:", error);
    searched.value = true;
  } finally {
    loading.value = false;
  }
}

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Ожидает',
    in_transit: 'В пути',
    arrived: 'На складе',
    delivered: 'Доставлено',
    lost: 'Утерян'
  };
  return labels[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'status-pending',
    in_transit: 'status-transit',
    arrived: 'status-arrived',
    delivered: 'status-delivered',
    lost: 'status-lost'
  };
  return classes[status] || '';
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  // Handle Firestore Timestamp
  if (timestamp.seconds) {
    return new Date(timestamp.seconds * 1000).toLocaleDateString('ru-RU');
  }
  return new Date(timestamp).toLocaleDateString('ru-RU');
};

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
  min-height: calc(100vh - 70px - 50px);
  opacity: 1 !important;
}

@media (max-width: 768px) {
  .search-page {
    min-height: calc(100vh - 50px - 50px);
    opacity: 1 !important;
  }
}

.search-content {
  max-width: 600px;
  width: 100%;
  background-color: rgba(255, 255, 255, 0.95);
  padding: 30px 20px;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
  height: auto;
}

h1 {
  font-size: 24px;
  margin-bottom: 24px;
  text-align: center;
  color: #1a1a1a;
  font-weight: 600;
}

.search-input {
  padding: 12px 16px;
  width: 100%;
  max-width: 400px;
  margin-bottom: 16px;
  border-radius: 8px;
  border: 1px solid #e0e0e0;
  box-sizing: border-box;
  color: #1a1a1a;
  font-size: 16px;
  transition: border-color 0.2s;
}

.search-input:focus {
  border-color: #2481cc;
  outline: none;
}

.search-button {
  padding: 12px 32px;
  margin-bottom: 24px;
  background: #2481cc;
  color: #ffffff;
  border: none;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 16px;
  font-weight: 500;
}

.search-button:hover:not(:disabled) {
  background: #1a6cb0;
  transform: translateY(-1px);
}

.search-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.results-section {
  width: 100%;
  margin-top: 10px;
}

.results-section h2 {
  font-size: 18px;
  margin-bottom: 16px;
  text-align: center;
  color: #4a4a4a;
}

ul {
  list-style-type: none;
  padding: 0;
  width: 100%;
}

li {
  background: #ffffff;
  border: 1px solid #e0e0e0;
  margin-bottom: 12px;
  padding: 16px;
  border-radius: 8px;
  transition: box-shadow 0.2s;
}

li:hover {
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
}

.track-info {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
  flex-wrap: wrap;
  gap: 8px;
}

.track-number {
  font-weight: 600;
  font-size: 18px;
  color: #1a1a1a;
}

.track-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 14px;
  font-weight: 500;
}

.status-pending { background: #fff7ed; color: #9a3412; }
.status-transit { background: #eff6ff; color: #1e40af; }
.status-arrived { background: #faf5ff; color: #6b21a8; }
.status-delivered { background: #f0fdf4; color: #166534; }
.status-lost { background: #fef2f2; color: #991b1b; }

.track-details p {
  margin: 4px 0;
  font-size: 14px;
  color: #666;
}

.no-results {
  color: #666;
  margin-top: 20px;
}
</style>