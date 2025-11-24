<template>
  <div class="admin-container min-h-screen bg-gray-100 p-6">
    <div class="max-w-6xl mx-auto">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Панель Администратора</h1>
        <div class="flex gap-4">
          <NuxtLink to="/dashboard" class="text-blue-600 hover:underline">Личный кабинет</NuxtLink>
          <button @click="logout" class="text-red-600 hover:text-red-800">Выйти</button>
        </div>
      </div>

      <div v-if="!isAdmin" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Ошибка доступа!</strong>
        <span class="block sm:inline"> У вас нет прав администратора.</span>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        <h2 class="text-lg font-semibold mb-4">Все посылки</h2>

        <div v-if="loading" class="text-center py-8 text-gray-500">
          Загрузка данных...
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Трек-номер</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="track in tracks" :key="track.id">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ track.number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500" :title="track.userId">{{ truncate(track.userId, 8) }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ formatDate(track.createdAt) }}</td>
              <td class="px-6 py-4 whitespace-nowrap">
                <select 
                  v-model="track.status" 
                  @change="updateStatus(track.id, track.status)"
                  class="text-sm border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                  :class="getStatusClass(track.status)"
                >
                  <option value="pending">Ожидает</option>
                  <option value="in_transit">В пути</option>
                  <option value="delivered">Доставлено</option>
                </select>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button @click="deleteTrack(track.id)" class="text-red-600 hover:text-red-900">Удалить</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

definePageMeta({
  middleware: 'auth'
});

const { $db, $auth } = useNuxtApp();
const router = useRouter();

const tracks = ref([]);
const loading = ref(true);
const isAdmin = ref(false);

// Replace with your actual admin email or logic
const ADMIN_EMAIL = 'akairfakomylife@gmail.com'; 

onMounted(() => {
  if (!$auth.currentUser) return;

  // Simple client-side check (real security is in Firestore Rules)
  if ($auth.currentUser.email === ADMIN_EMAIL) {
    isAdmin.value = true;
    loadAllTracks();
  } else {
    // Redirect or show error
    // router.push('/dashboard'); 
  }
});

const loadAllTracks = () => {
  const q = query(
    collection($db, 'tracks'),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    tracks.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loading.value = false;
  }, (err) => {
    console.error("Error fetching all tracks:", err);
    loading.value = false;
  });

  onUnmounted(() => unsubscribe());
};

const updateStatus = async (id, newStatus) => {
  try {
    await updateDoc(doc($db, 'tracks', id), {
      status: newStatus
    });
  } catch (e) {
    console.error("Error updating status:", e);
    alert('Ошибка обновления статуса.');
  }
};

const deleteTrack = async (id) => {
  if (!confirm('Вы уверены? Это действие нельзя отменить.')) return;
  try {
    await deleteDoc(doc($db, 'tracks', id));
  } catch (e) {
    console.error("Error deleting track:", e);
    alert('Ошибка удаления.');
  }
};

const logout = async () => {
  await signOut($auth);
  router.push('/');
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp.seconds * 1000).toLocaleString('ru-RU');
};

const truncate = (str, n) => {
  return (str.length > n) ? str.substr(0, n-1) + '...' : str;
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600 bg-yellow-50',
    in_transit: 'text-blue-600 bg-blue-50',
    delivered: 'text-green-600 bg-green-50'
  };
  return classes[status] || '';
};
</script>
