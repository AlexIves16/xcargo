<template>
  <div class="dashboard-container min-h-screen bg-gray-50 relative">
    <NavBar />
    <div class="max-w-4xl mx-auto p-6 pt-24">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Личный кабинет</h1>
        <div class="flex gap-4 items-center">
          <NuxtLink v-if="isAdmin" to="/admin" class="text-sm font-medium text-blue-600 hover:text-blue-800 bg-blue-50 px-3 py-1.5 rounded-lg transition-colors">
            Админ-панель
          </NuxtLink>
          <button @click="logout" class="text-sm text-red-600 hover:text-red-800">Выйти</button>
        </div>
      </div>

      <!-- Add Track Number Form -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-8">
        <h2 class="text-lg font-semibold mb-4">Добавить трек-номер</h2>
        <div class="flex gap-4">
          <input 
            id="track-number"
            name="track-number"
            v-model="newTrackNumber" 
            type="text" 
            placeholder="Введите трек-номер" 
            class="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            @keyup.enter="addTrackNumber"
          />
          <button 
            @click="addTrackNumber" 
            :disabled="!newTrackNumber || loading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {{ loading ? 'Добавление...' : 'Добавить' }}
          </button>
        </div>
        <p v-if="error" class="text-red-500 text-sm mt-2">{{ error }}</p>
      </div>

      <!-- Track Numbers List -->
      <div class="bg-white rounded-xl shadow-sm p-6">
        <h2 class="text-lg font-semibold mb-4">Мои посылки</h2>
        
        <div v-if="loadingData" class="text-center py-8 text-gray-500">
          Загрузка...
        </div>

        <div v-else-if="tracks.length === 0" class="text-center py-8 text-gray-500">
          У вас пока нет добавленных трек-номеров.
        </div>

        <div v-else class="space-y-4">
          <div v-for="track in tracks" :key="track.id" class="border border-gray-100 rounded-lg p-4 hover:bg-gray-50 transition-colors flex justify-between items-center">
            <div>
              <div class="font-medium text-gray-800">{{ track.number }}</div>
              <div class="text-sm text-gray-500">Добавлено: {{ formatDate(track.createdAt) }}</div>
            </div>
            <div class="flex items-center gap-3">
              <span :class="getStatusClass(track.status)" class="px-3 py-1 rounded-full text-xs font-medium">
                {{ getStatusLabel(track.status) }}
              </span>
              <button @click="deleteTrack(track.id)" class="text-gray-400 hover:text-red-500 transition-colors" title="Удалить">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, deleteDoc, doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth';

definePageMeta({
  middleware: 'auth'
});

const { $db, $auth } = useNuxtApp();
const router = useRouter();

const newTrackNumber = ref('');
const tracks = ref([]);
const loading = ref(false);
const loadingData = ref(true);
const error = ref('');

const isAdmin = computed(() => $auth?.currentUser?.email === 'akairfakomylife@gmail.com');

// Load tracks
onMounted(() => {
  if (!$auth?.currentUser) return;

  const q = query(
    collection($db, 'tracks'),
    where('userId', '==', $auth.currentUser.uid),
    orderBy('createdAt', 'desc')
  );

  const unsubscribe = onSnapshot(q, (snapshot) => {
    tracks.value = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    loadingData.value = false;
  }, (err) => {
    console.error("Error fetching tracks:", err);
    error.value = "Ошибка загрузки данных.";
    loadingData.value = false;
  });

  onUnmounted(() => unsubscribe());
});

const addTrackNumber = async () => {
  if (!newTrackNumber.value.trim()) return;
  
  loading.value = true;
  error.value = '';

  try {
    await addDoc(collection($db, 'tracks'), {
      number: newTrackNumber.value.trim(),
      userId: $auth.currentUser.uid,
      createdAt: serverTimestamp(),
      status: 'pending' // pending, in_transit, delivered
    });
    newTrackNumber.value = '';
  } catch (e) {
    console.error("Error adding track:", e);
    error.value = 'Не удалось добавить трек-номер. Проверьте права доступа.';
  } finally {
    loading.value = false;
  }
};

const deleteTrack = async (id) => {
  if (!confirm('Вы уверены, что хотите удалить этот трек-номер?')) return;
  try {
    await deleteDoc(doc($db, 'tracks', id));
  } catch (e) {
    console.error("Error deleting track:", e);
    alert('Ошибка при удалении.');
  }
};

const logout = async () => {
  await signOut($auth);
  router.push('/');
};

const formatDate = (timestamp) => {
  if (!timestamp) return '';
  return new Date(timestamp.seconds * 1000).toLocaleDateString('ru-RU');
};

const getStatusLabel = (status) => {
  const labels = {
    pending: 'Ожидает',
    in_transit: 'В пути',
    delivered: 'Доставлено'
  };
  return labels[status] || status;
};

const getStatusClass = (status) => {
  const classes = {
    pending: 'bg-yellow-100 text-yellow-800',
    in_transit: 'bg-blue-100 text-blue-800',
    delivered: 'bg-green-100 text-green-800'
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
</script>
