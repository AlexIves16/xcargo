<template>
    <div class="contact-page">
      <!-- Карта -->
      <div class="map-container">
        <div style="position:relative;overflow:hidden;">
          <a href="https://yandex.kz/maps/ru/org/time_express_cargo/231901814988/?lang=ru&utm_medium=mapframe&utm_source=maps" style="color:#eee;font-size:12px;position:absolute;top:0px;">
            Time Express Cargo
          </a>
          <a href="https://yandex.kz/maps/ru/162/almaty/category/logistics_company/184108185/?lang=ru&utm_medium=mapframe&utm_source=maps" style="color:#eee;font-size:12px;position:absolute;top:14px;">
            Логистическая компания в Алматы
          </a>
          <iframe 
            src="https://yandex.kz/map-widget/v1/?ll=76.872220%2C43.220404&mode=search&oid=231901814988&ol=biz&z=18.8" 
            width="100%" 
            height="400" 
            frameborder="1" 
            allowfullscreen="true" 
            style="position:relative;">
          </iframe>
        </div>
      </div>
  
      <!-- Информационный блок -->
      <div class="info-block">
        <h2>Контактная информация</h2>
        <p>Наш офис находится по адресу: ул. Алтынсарина, 26, Алматы, Казахстан.</p>
        <p>Телефон: +7 708 764 8100</p>
        <p>График работы: Пн-Пт с 9:00 до 18:00</p>
      </div>
  
      <!-- Кнопка Назад -->
      <button @click="goBack" class="back-button">← Назад</button>
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
  .contact-page {
    font-family: Helvetica, Arial, sans-serif;
    max-width: 800px;
    margin: 0 auto;
    padding: 20px;
  }
  
  /* Контейнер для карты */
  .map-container {
    margin-bottom: 20px;
    text-align: center;
  }
  
  /* Информационный блок */
  .info-block {
    text-align: left;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    margin-bottom: 20px;
  }
  
  .info-block h2 {
    font-size: 24px;
    margin-bottom: 10px;
  }
  
  .info-block p {
    font-size: 18px;
    margin-bottom: 8px;
  }
  
  /* Стили для кнопки "Назад" */
  .back-button {
    display: block;
    margin: 20px auto;
    padding: 10px 20px;
    font-size: 18px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    text-align: center;
  }
  
  .back-button:hover {
    background-color: #0056b3;
  }
  </style>
  