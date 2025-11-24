<template>
  <div class="min-h-screen bg-gray-50 p-8">
    <div class="max-w-3xl mx-auto bg-white p-8 rounded-2xl shadow-sm">
      <h1 class="text-3xl font-bold mb-6 text-gray-800">Политика конфиденциальности</h1>
      
      <div class="prose text-gray-600">
        <p class="mb-4">Последнее обновление: {{ new Date().toLocaleDateString() }}</p>

        <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">1. Введение</h2>
        <p class="mb-4">
          Мы уважаем вашу конфиденциальность и стремимся защитить ваши личные данные. 
          Эта политика конфиденциальности объясняет, как мы собираем и используем информацию при использовании приложения Xcargo.
        </p>

        <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">2. Какие данные мы собираем</h2>
        <p class="mb-4">
          Мы используем сервис Google Authentication для входа в систему. 
          Мы получаем доступ только к вашему адресу электронной почты и публичному имени профиля для идентификации пользователя в нашей системе.
        </p>

        <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">3. Использование данных</h2>
        <p class="mb-4">
          Ваши данные используются исключительно для:
        </p>
        <ul class="list-disc pl-5 mb-4">
          <li>Предоставления доступа к личному кабинету.</li>
          <li>Отслеживания ваших грузов.</li>
          <li>Связи с вами по вопросам доставки.</li>
        </ul>

        <h2 class="text-xl font-semibold text-gray-800 mt-6 mb-3">4. Безопасность</h2>
        <p class="mb-4">
          Мы принимаем разумные меры для защиты вашей информации. 
          Пароли и токены доступа обрабатываются безопасно через сервисы Google Firebase.
        </p>

        <div class="mt-8 pt-6 border-t border-gray-100">
          <NuxtLink to="/" class="text-blue-600 hover:text-blue-800 font-medium">
            &larr; Вернуться на главную
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>
