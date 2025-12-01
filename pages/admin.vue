<template>
  <div class="admin-container h-screen bg-gray-100 overflow-hidden">
    <div class="max-w-6xl mx-auto p-6 pt-24 h-full overflow-y-auto pb-32">
      <div class="flex justify-between items-center mb-8">
        <h1 class="text-2xl font-bold text-gray-800">Панель Администратора</h1>
        <div class="flex gap-4">
          <NuxtLink to="/dashboard" class="text-blue-600 hover:underline">Личный кабинет</NuxtLink>
          <button @click="logout" class="text-red-600 hover:text-red-800">Выйти</button>
        </div>
      </div>

      <!-- Upload Buttons -->
      <div class="bg-white rounded-xl shadow-sm p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Загрузка таблиц</h2>
        <div class="flex flex-wrap gap-4">
          <button 
            @click="triggerUpload('china')"
            class="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition flex items-center gap-2"
            :disabled="uploading"
          >
            <span v-if="uploading">Загрузка...</span>
            <span v-else>📤 Загрузить отправленные (Китай)</span>
          </button>
          <button 
            @click="triggerUpload('received')"
            class="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition flex items-center gap-2"
            :disabled="uploading"
          >
            <span v-if="uploading">Загрузка...</span>
            <span v-else>📥 Загрузить полученные (Склад)</span>
          </button>
        </div>
        <p class="text-sm text-gray-500 mt-2">
          Формат: Excel (.xlsx), первая колонка должна содержать трек-номера.
        </p>
        
        <!-- Hidden Inputs -->
        <input type="file" ref="chinaInput" class="hidden" @change="e => handleUpload(e, 'in_transit')" accept=".xlsx, .xls" />
        <input type="file" ref="receivedInput" class="hidden" @change="e => handleUpload(e, 'arrived')" accept=".xlsx, .xls" />
      </div>

      <div v-if="!isAdmin" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Ошибка доступа!</strong>
        <span class="block sm:inline"> У вас нет прав администратора.</span>
      </div>

      <div v-else class="bg-white rounded-xl shadow-sm p-6 overflow-x-auto">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold">Все посылки</h2>
          <button 
            @click="archiveOldTracks" 
            class="text-sm text-gray-500 hover:text-gray-700 underline"
            :disabled="archiving"
          >
            {{ archiving ? 'Архивация...' : 'Архивировать старые (30+ дней)' }}
          </button>
        </div>

        <div v-if="loading" class="text-center py-8 text-gray-500">
          Загрузка данных...
        </div>

        <table v-else class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Трек-номер</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Описание</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Имя</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Дата</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Статус</th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Действия</th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="track in tracks" :key="track.id">
              <td class="px-6 py-4 whitespace-nowrap font-medium text-gray-900">{{ track.number }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ track.description || '-' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ track.userEmail || 'Не указан' }}</td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{{ track.userName || 'Не указано' }}</td>
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
                  <option value="arrived">На складе</option>
                  <option value="delivered">Доставлено</option>
                  <option value="lost">Утерян</option>
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
import { collection, query, onSnapshot, orderBy, doc, updateDoc, deleteDoc, addDoc, serverTimestamp, where, getDocs } from 'firebase/firestore';
import { signOut } from 'firebase/auth';
import * as XLSX from 'xlsx';

definePageMeta({
  middleware: 'auth'
});

const { $db, $auth } = useNuxtApp();
const router = useRouter();

const tracks = ref([]);
const loading = ref(true);
const isAdmin = ref(false);
const uploading = ref(false);
const archiving = ref(false);
const chinaInput = ref(null);
const receivedInput = ref(null);

// Admin email
const ADMIN_EMAIL = 'kairfakomylife@gmail.com'; 

onMounted(() => {
  if (!$auth?.currentUser) return;

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

const triggerUpload = (type) => {
  if (type === 'china') chinaInput.value?.click();
  else receivedInput.value?.click();
};

const handleUpload = async (event, targetStatus) => {
  const file = event.target.files[0];
  if (!file) return;

  uploading.value = true;
  try {
    const data = await file.arrayBuffer();
    const workbook = XLSX.read(data);
    const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(firstSheet, { header: 1 });

    let updatedCount = 0;
    let createdCount = 0;
    let errorCount = 0;

    // Get all current tracks to minimize reads
    const trackMap = new Map(tracks.value.map(t => [t.number, t]));

    // Check for headers to skip
    const firstRow = jsonData[0] || [];
    const firstCell = firstRow[0]?.toString() || '';
    
    const isChinaHeader = firstCell.includes('条码');
    const isReceivedHeader = firstCell.includes('Трек код');
    
    const startIndex = (isChinaHeader || isReceivedHeader) ? 1 : 0;

    for (let i = startIndex; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (!row || row.length === 0) continue;

      let trackNumber, batchNumber, dateStr;

      if (targetStatus === 'in_transit') {
        // China format: Col 0 = Track, Col 10 = Batch/Internal, Col 12 = Date
        trackNumber = row[0]?.toString().trim();
        batchNumber = row[10]?.toString().trim();
        dateStr = row[12]?.toString().trim();
      } else {
        // Received format: Col 0 = Track
        trackNumber = row[0]?.toString().trim();
      }

      if (!trackNumber) continue;

      const updateData = { status: targetStatus };
      
      if (targetStatus === 'in_transit') {
        if (batchNumber) updateData.batchNumber = batchNumber;
        if (dateStr) updateData.sentAt = dateStr;
      } else if (targetStatus === 'arrived') {
        updateData.arrivedAt = serverTimestamp();
      }

      try {
        if (trackMap.has(trackNumber)) {
          const track = trackMap.get(trackNumber);
          // Update if status is different OR if we have new info
          await updateDoc(doc($db, 'tracks', track.id), updateData);
          updatedCount++;
        } else {
          // Create new track
          await addDoc(collection($db, 'tracks'), {
            number: trackNumber,
            createdAt: serverTimestamp(),
            userEmail: null,
            userName: null,
            ...updateData
          });
          createdCount++;
        }
      } catch (err) {
        console.error(`Error processing track ${trackNumber}:`, err);
        errorCount++;
      }
    }

    alert(`Загрузка завершена!\nОбновлено: ${updatedCount}\nСоздано: ${createdCount}\nОшибок: ${errorCount}`);
    
  } catch (e) {
    console.error("Upload error:", e);
    alert('Ошибка при обработке файла.');
  } finally {
    uploading.value = false;
    // Reset inputs
    if (event.target) event.target.value = '';
  }
};

const archiveOldTracks = async () => {
  if (!confirm('Архивировать доставленные и утерянные посылки старше 30 дней?')) return;
  
  archiving.value = true;
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    // We can't easily query by multiple fields without a composite index, 
    // so we'll filter client-side since we have all tracks loaded anyway.
    const tracksToArchive = tracks.value.filter(t => {
      const isDone = ['delivered', 'lost'].includes(t.status);
      // Use updatedAt if available, else createdAt
      const date = t.updatedAt ? t.updatedAt.toDate() : (t.createdAt ? t.createdAt.toDate() : null);
      if (!date) return false;
      return isDone && date < thirtyDaysAgo;
    });

    if (tracksToArchive.length === 0) {
      alert('Нет подходящих посылок для архивации.');
      return;
    }

    let count = 0;
    for (const track of tracksToArchive) {
      // Add to archive collection
      await addDoc(collection($db, 'tracks_archive'), track);
      // Delete from main collection
      await deleteDoc(doc($db, 'tracks', track.id));
      count++;
    }
    
    alert(`Архивировано ${count} посылок.`);
  } catch (e) {
    console.error("Archive error:", e);
    alert('Ошибка архивации.');
  } finally {
    archiving.value = false;
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

const getStatusClass = (status) => {
  const classes = {
    pending: 'text-yellow-600 bg-yellow-50',
    in_transit: 'text-blue-600 bg-blue-50',
    arrived: 'text-purple-600 bg-purple-50',
    delivered: 'text-green-600 bg-green-50',
    lost: 'text-red-600 bg-red-50'
  };
  return classes[status] || '';
};
</script>
