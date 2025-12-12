<template>
  <div class="dashboard-content">
    
    <!-- Header Section -->
    <div class="header-section">
      <div class="user-profile">
        <div class="avatar-ring">
          <img 
            :src="userPhoto || '/logo.png'" 
            :alt="userName"
            class="user-avatar"
          />
        </div>
        <div class="user-info">
          <p class="welcome-text">{{ t('dashboard.welcome') }}</p>
          <h1 class="user-name" :data-text="userName">{{ userName }}</h1>
        </div>
      </div>

      <div class="header-actions">
        <!-- Add Track (Mobile Toggle) -->
        <button 
          @click="toggleAddForm" 
          class="icon-btn add-btn-mobile mobile-only"
          :title="t('dashboard.add_track')"
        >
          <span class="icon">{{ showAddForm ? '✕' : '➕' }}</span>
        </button>

        <!-- Notification Toggle -->
        <button 
          @click="enableNotifications" 
          class="icon-btn"
          :title="t('dashboard.enable_notifications')"
        >
          <span class="icon">🔔</span>
        </button>

        <!-- Admin Link -->
        <button 
          v-if="isAdmin" 
          @click="$emit('navigate', 'admin')" 
          class="icon-btn admin-btn"
          :title="t('dashboard.admin_panel')"
        >
          <span class="icon">⚡</span>
        </button>

        <!-- Logout -->
        <button @click="logout" class="icon-btn logout-btn" :title="t('nav.logout')">
          <span class="icon">🚪</span>
        </button>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-info">
          <span class="stat-value">{{ tracks.length }}</span>
          <span class="stat-label">Всего посылок</span>
        </div>
      </div>
      <div class="stat-card blue">
        <div class="stat-icon">🚚</div>
        <div class="stat-info">
          <span class="stat-value">{{ tracks.filter(t => t.status === 'in_transit').length }}</span>
          <span class="stat-label">В пути</span>
        </div>
      </div>
      <div class="stat-card green">
        <div class="stat-icon">✅</div>
        <div class="stat-info">
          <span class="stat-value">{{ tracks.filter(t => t.status === 'delivered').length }}</span>
          <span class="stat-label">Доставлено</span>
        </div>
      </div>
    </div>

    <!-- Main Content Area (Split View) -->
    <div class="dashboard-main">
      
      <!-- Add Track Section -->
      <div class="glass-panel add-track-panel" :class="{ 'hidden-mobile': !showAddForm }">
        <h2 class="panel-title">{{ t('dashboard.add_track') }}</h2>
        <div class="input-group">
          <input 
            v-model="newTrackNumber" 
            type="text" 
            :placeholder="t('dashboard.placeholder_track') + ' *'" 
            class="glass-input"
          />
          <input 
            v-model="newTrackDescription" 
            type="text" 
            :placeholder="t('dashboard.placeholder_desc')" 
            class="glass-input"
            @keyup.enter="addTrackNumber"
          />
          <button 
            @click="addTrackNumber" 
            :disabled="!newTrackNumber || loading"
            class="action-btn"
          >
            {{ loading ? t('dashboard.adding') : t('dashboard.add_btn') }}
          </button>
        </div>
        <p v-if="error" class="error-msg">{{ error }}</p>
      </div>

      <!-- Parcels List -->
      <div class="glass-panel list-panel">
        <h2 class="panel-title">{{ t('dashboard.my_parcels') }}</h2>
        
        <div v-if="loadingData" class="loading-state">
          <div class="spinner"></div>
          <p>{{ t('dashboard.loading') }}</p>
        </div>

        <div v-else-if="tracks.length === 0" class="empty-state">
          <span class="empty-icon">📭</span>
          <p>{{ t('dashboard.no_parcels') }}</p>
        </div>

        <div v-else class="tracks-list">
          <div v-for="track in tracks" :key="track.id" class="track-item">
            <div class="track-info">
              <div class="track-header">
                <span class="track-number">{{ track.number }}</span>
                <span v-if="track.description" class="track-desc-badge">{{ track.description }}</span>
              </div>
              <span class="track-date">{{ t('dashboard.added') }} {{ formatDate(track.createdAt) }}</span>
            </div>
            
            <div class="track-actions">
                <div class="status-group">
                   <!-- China Status -->
                   <div class="status-row" v-if="track.lastChinaStatus">
                       <span>CN:</span>
                       <span class="status-badge" :class="getStatusColor(track.lastChinaStatus)">
                           {{ track.lastChinaStatus }}
                       </span>
                   </div>
                   <!-- Secondary -->
                   <div class="status-row" v-if="track.lastSecondaryStatus">
                       <span>KZ:</span>
                       <span class="status-badge" :class="getStatusColor(track.lastSecondaryStatus)">
                           {{ track.lastSecondaryStatus }}
                       </span>
                   </div>
                   <!-- Fallback if neither -->
                   <div class="status-row" v-if="!track.lastChinaStatus && !track.lastSecondaryStatus">
                       <span class="status-badge gray">Ожидание</span>
                   </div>
                </div>

                <button class="delete-btn" @click.stop="deleteTrack(track.id)" title="Удалить">
                  <font-awesome-icon icon="trash" /> <!-- Assuming font-awesome or simple icon -->
                  <!-- Or just svg -->
                   🗑️
                </button>
            </div>

          </div>
        </div>
      </div>

    </div>

  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { collection, addDoc, query, where, onSnapshot, orderBy, serverTimestamp, deleteDoc, doc, updateDoc, setDoc, getDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'

// import { getToken } from 'firebase/messaging' // Dynamic import used instead to prevent SSR crash
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  triggerAnim: {
    type: Boolean,
    default: false
  }
})
const emit = defineEmits(['navigate'])

const { $db, $auth } = useNuxtApp()
const { t } = useI18n()

const newTrackNumber = ref('')
const newTrackDescription = ref('')
const tracks = ref([])
const loading = ref(false)
const loadingData = ref(true)
const error = ref('')
const showAddForm = ref(false)

const toggleAddForm = () => {
    showAddForm.value = !showAddForm.value
}

const currentUser = useState('firebaseUser')
// Fallback if not ready yet (avoid hydration mismatch if possible, but safe here)

const isAdmin = computed(() => {
  if (!currentUser.value) return false
  return currentUser.value.email === 'kairfakomylife@gmail.com'
})

const userName = computed(() => {
  if (!currentUser.value) return 'Пользователь'
  return currentUser.value.displayName || currentUser.value.email?.split('@')[0] || 'Пользователь'
})

const userPhoto = computed(() => {
  return currentUser.value?.photoURL || null
})

const fetchData = () => {
    if (!currentUser.value) return 
    
    // Avoid double fetch if already loading or already have data (optional, but good)
    // But here we want to ensure we get data
    
    const q = query(
      collection($db, 'tracks'),
      where('userId', '==', currentUser.value.uid),
      orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      tracks.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      loadingData.value = false
    }, (err) => {
      console.error("Error fetching tracks:", err)
      error.value = "Ошибка загрузки данных."
      loadingData.value = false
    })
    
    return unsubscribe
}

let unsub = null

onMounted(() => {
  if (currentUser.value) {
     unsub = fetchData()
  }
})

const syncUserProfile = async () => {
    if (!currentUser.value) return;
    try {
        const userRef = doc($db, 'users', currentUser.value.uid);
        await setDoc(userRef, {
            email: currentUser.value.email,
            displayName: currentUser.value.displayName || '',
            photoURL: currentUser.value.photoURL || '',
            lastLogin: serverTimestamp()
        }, { merge: true });
        console.log('👤 User profile synced');
    } catch (e) {
        console.error('Error syncing profile:', e);
    }
}

watch(currentUser, async (newVal) => {
    if (newVal) {
        // 1. Fetch tracks
        if (!unsub) unsub = fetchData();
        
        // 2. Ensure User Doc Exists
        await syncUserProfile();

        // 3. If notifications already granted, sync token silently
        if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
            enableNotifications(true); // Silent mode
        }

    } else if (!newVal && unsub) {
        // User logged out
        unsub()
        unsub = null
        tracks.value = []
    }
}, { immediate: true })

onUnmounted(() => {
    if (unsub) unsub()
})

const enableNotifications = async (silent = false) => {
  try {
    // Check if notifications are supported
    if (!('Notification' in window)) {
      if (!silent) alert('Ваш браузер не поддерживает уведомления')
      return
    }

    // Check permission
    let permission = Notification.permission
    if (permission === 'default') {
        permission = await Notification.requestPermission()
    }
    
    if (permission === 'denied') {
      if (!silent) alert('🚫 Уведомления заблокированы.\n\nКак исправить:\n1. Нажмите на иконку замка 🔒 в адресной строке браузера (слева от URL).\n2. Нажмите "Настройки сайта" или "Разрешения".\n3. Найдите "Уведомления" и выберите "Разрешить".\n4. Обновите страницу.')
      return
    }
    
    if (permission === 'granted') {
      // Get messaging instance
      const { $messaging, $auth, $db } = useNuxtApp()
      const messaging = $messaging()
      
      if (!messaging) {
        if (!silent) alert('Ошибка инициализации сервиса уведомлений (Messaging not ready). Попробуйте обновить страницу.')
        return
      }

      const config = useRuntimeConfig()
      
      let vapidKey = config.public.firebaseVapidKey;
      if (vapidKey) vapidKey = vapidKey.trim();

      // Dynamic import to prevent SSR issues
      const { getToken } = await import('firebase/messaging')

      // Get Token
      const currentToken = await getToken(messaging, { 
        vapidKey: vapidKey 
      })

      if (currentToken) {
        console.log('✅ FCM Token received:', currentToken)
        
        if (currentUser.value) {
           const userRef = doc($db, 'users', currentUser.value.uid)
           
           // Always merge update
           await setDoc(userRef, {
                 email: currentUser.value.email,
                 fcmToken: currentToken,
                 updatedAt: serverTimestamp() 
           }, { merge: true })
           
           if (!silent) alert('✅ Уведомления успешно включены! Теперь вы будете получать оповещения о статусе посылок.')
        } else {
           if (!silent) alert('Ошибка: Пользователь не авторизован.')
        }

      } else {
        console.log('No registration token available.')
        if (!silent) alert('Не удалось получить токен устройства.')
      }
    }
  } catch (e) {
    console.error('Notification error:', e)
    if (!silent) alert('Ошибка: ' + (e.message || 'Не удалось включить уведомления'))
  }
}



const addTrackNumber = async () => {
  if (!newTrackNumber.value.trim()) return
  
  loading.value = true
  error.value = ''

  try {
    const res = await $fetch('/api/user/add-track', {
        method: 'POST',
        body: {
            number: newTrackNumber.value.trim(),
            description: newTrackDescription.value.trim(),
            userId: currentUser.value.uid,
            userEmail: currentUser.value.email,
            userName: currentUser.value.displayName || 'Пользователь'
        }
    })

    if (res.success) {
        newTrackNumber.value = ''
        newTrackDescription.value = ''
        // Mobile: hide form after add
        if (typeof window !== 'undefined' && window.innerWidth <= 1024) {
            showAddForm.value = false
        }
    } else {
        error.value = res.error || 'Ошибка добавления';
    }

  } catch (e) {
    console.error("Error adding track:", e)
    error.value = 'Не удалось добавить трек-номер. Проверьте сеть.'
  } finally {
    loading.value = false
  }
}

const deleteTrack = async (id) => {
  if (!confirm(t('dashboard.confirm_delete'))) return
  try {
    await deleteDoc(doc($db, 'tracks', id))
  } catch (e) {
    console.error("Error deleting track:", e)
    alert(t('dashboard.error_delete') || 'Error')
  }
}

const logout = async () => {
  await signOut($auth)
  emit('navigate', 'home') 
  if (typeof window !== 'undefined') window.location.reload() 
}

const formatDate = (timestamp) => {
  if (!timestamp) return ''
  return new Date(timestamp.seconds * 1000).toLocaleDateString('ru-RU')
}

const getStatusLabel = (status) => {
  return t('status.' + status)
}

const getStatusColor = (status) => {
    if (!status) return 'gray';
    const s = status.toLowerCase();
    if (s.includes('прибыл') || s.includes('arrived') || s.includes('склад')) return 'green';
    if (s.includes('пути') || s.includes('transit') || s.includes('отправлен')) return 'blue';
    if (s.includes('выдан') || s.includes('delivered')) return 'purple';
    return 'gray';
}
</script>

<style scoped>
.dashboard-content {
  position: absolute;
  top: 0;
  left: 100px;
  width: calc(100vw - 120px - 20vw);
  height: 100vh;
  padding: 15vh 40px 40px 40px;
  overflow: hidden; /* No scroll on main container */
  color: white;
  font-family: 'Poppins', sans-serif;
  pointer-events: auto;
  display: flex;
  flex-direction: column;
}

/* Header */
.header-section {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  flex-shrink: 0; /* Don't shrink header */
}

.user-profile {
  display: flex;
  align-items: center;
  gap: 20px;
}

.avatar-ring {
  width: 70px;
  height: 70px;
  border-radius: 50%;
  padding: 3px;
  background: linear-gradient(135deg, #4F46E5, #06B6D4);
  box-shadow: 0 0 15px rgba(6, 182, 212, 0.4);
}

.user-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid #000;
}

.user-info {
  display: flex;
  flex-direction: column;
}

.welcome-text {
  font-size: 0.9rem;
  color: #94a3b8;
  margin-bottom: 4px;
}

.user-name {
  font-family: helvetica, arial, sans-serif;
  font-weight: 800;
  font-size: 2rem;
  background: linear-gradient(90deg, #fff, #c7d2fe);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.header-actions {
  display: flex;
  gap: 15px;
}

.icon-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.1);
  width: 45px;
  height: 45px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
}

.icon-btn:hover {
  background: rgba(255, 255, 255, 0.2);
  transform: translateY(-2px);
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.2);
  border-color: rgba(239, 68, 68, 0.4);
}

.admin-btn:hover {
  background: rgba(234, 179, 8, 0.2);
  border-color: rgba(234, 179, 8, 0.4);
}

.icon {
  font-size: 1.2rem;
}

/* Stats */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
  flex-shrink: 0; /* Don't shrink stats */
}

.stat-card {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 20px;
  backdrop-filter: blur(5px);
}

.stat-card.blue {
  background: rgba(59, 130, 246, 0.1);
  border-color: rgba(59, 130, 246, 0.2);
}

.stat-card.green {
  background: rgba(16, 185, 129, 0.1);
  border-color: rgba(16, 185, 129, 0.2);
}

.stat-icon {
  font-size: 2rem;
}

.stat-info {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 800;
  color: white;
}

.stat-label {
  font-size: 0.9rem;
  color: #94a3b8;
}

/* Dashboard Main */
.dashboard-main {
  display: grid;
  grid-template-columns: 350px 1fr;
  gap: 30px;
  flex: 1;
  min-height: 0; /* Critical for nested scroll */
  overflow: hidden;
}

/* Panels */
.glass-panel {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 24px;
  padding: 30px;
  backdrop-filter: blur(10px);
}

.panel-title {
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 25px;
  color: #e2e8f0;
}

/* Add Track Form */
.input-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.glass-input {
  background: rgba(0, 0, 0, 0.3);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 14px 16px;
  color: white;
  font-size: 1rem;
  outline: none;
  transition: border-color 0.2s;
}

.glass-input:focus {
  border-color: #818CF8;
}

.action-btn {
  background: linear-gradient(135deg, #4F46E5, #2563EB);
  color: white;
  border: none;
  border-radius: 12px;
  padding: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.action-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(37, 99, 235, 0.4);
}

.action-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.error-msg {
  color: #ef4444;
  margin-top: 10px;
  font-size: 0.9rem;
}

/* List */
.list-panel {
  display: flex;
  flex-direction: column;
  min-height: 0; /* Important for flex scroll */
  overflow: hidden;
}

.tracks-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
  flex: 1;
  overflow-y: auto;
  padding-right: 10px;
}

/* Custom Scrollbar for tracks list */
.tracks-list::-webkit-scrollbar {
  width: 6px;
}

.tracks-list::-webkit-scrollbar-track {
  background: rgba(255, 255, 255, 0.05);
  border-radius: 3px;
}

.tracks-list::-webkit-scrollbar-thumb {
  background: rgba(129, 140, 248, 0.4);
  border-radius: 3px;
}

.tracks-list::-webkit-scrollbar-thumb:hover {
  background: rgba(129, 140, 248, 0.6);
}

/* Firefox */
.tracks-list {
  scrollbar-width: thin;
  scrollbar-color: rgba(129, 140, 248, 0.4) rgba(255, 255, 255, 0.05);
}

.track-item {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: 16px;
  padding: 15px 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: background 0.2s;
}

.track-item:hover {
  background: rgba(255, 255, 255, 0.07);
}

.track-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.track-header {
  display: flex;
  align-items: center;
  gap: 10px;
}

.track-number {
  font-weight: 600;
  color: white;
  font-size: 1.1rem;
}

.track-desc-badge {
  background: rgba(255, 255, 255, 0.1);
  padding: 2px 8px;
  border-radius: 6px;
  font-size: 0.8rem;
  color: #cbd5e1;
}

.track-date {
  font-size: 0.85rem;
  color: #64748b;
}

.track-actions {
  display: flex;
  align-items: center;
  gap: 15px;
}

.status-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  display: inline-block;
  margin-top: 2px;
}

.status-badge.gray { background: rgba(255, 255, 255, 0.1); color: #cbd5e1; }
.status-badge.green { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.status-badge.blue { background: rgba(59, 130, 246, 0.2); color: #60a5fa; }
.status-badge.purple { background: rgba(168, 85, 247, 0.2); color: #c084fc; }

.status-group {
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    gap: 4px;
}
.status-row {
    display: flex;
    align-items: center;
    gap: 6px;
    font-size: 0.75rem;
    color: #94a3b8;
}

.delete-btn {
  background: none;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  transition: color 0.2s;
}


.delete-btn:hover {
  color: #ef4444;
}

.loading-state, .empty-state {
  text-align: center;
  padding: 40px;
  color: #94a3b8;
}

.spinner {
  margin: 0 auto 15px;
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,0.1);
  border-top-color: #4F46E5;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty-icon {
  font-size: 3rem;
  display: block;
  margin-bottom: 10px;
}

@media (max-width: 1024px) {
  .dashboard-main {
    grid-template-columns: 1fr;
    /* Allow main to scroll if needed, though parent handles it mostly */
    overflow: visible; 
  }
  
  /* Stats Grid Single Row on Mobile */
  .stats-grid {
      grid-template-columns: repeat(3, 1fr); /* Force 3 columns in one row */
      gap: 10px; /* Smaller gap */
  }
  
  .stat-card {
      padding: 10px; /* Reduced padding */
      flex-direction: column; /* Stack icon and info vertically to save width */
      text-align: center;
      gap: 5px;
  }
  
  .stat-icon {
      font-size: 1.5rem; /* Smaller icon */
  }
  
  .stat-value {
      font-size: 1.2rem;
  }
  
  .stat-label {
      font-size: 0.7rem;
      white-space: nowrap; /* Prevent wrapping if possible */
  }

  .dashboard-content {
     left: 0; 
     width: 100%;
     padding-top: 100px; /* Reduced top padding */
     padding-bottom: 20px;
     padding-left: 15px;
     padding-right: 15px;
     height: 100vh;
     overflow: hidden;
     display: flex;
     flex-direction: column;
  }

  /* Compact Header */
  .header-section {
      margin-bottom: 15px;
      padding: 0;
      gap: 10px;
      background: transparent;
      backdrop-filter: none;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      height: 50px; /* Force small height */
  }

  /* Profile Compact */
  .user-profile {
      gap: 10px;
  }
  .avatar-ring {
      width: 40px;
      height: 40px;
      border: none;
      background: none;
      box-shadow: none;
      padding: 0;
  }
  .user-avatar {
      border: 1px solid rgba(255,255,255,0.3);
  }
  .welcome-text { display: none; }
  .user-name {
      font-size: 1.1rem;
      text-align: left;
  }

  /* Actions Compact */
  .header-actions {
      gap: 8px;
  }
  .icon-btn {
      width: 35px;
      height: 35px;
      background: rgba(0,0,0,0.2) !important; /* Transparent dark */
      border: 1px solid rgba(255,255,255,0.1);
  }
  .icon { font-size: 1rem; }
  
  .mobile-only { display: flex !important; }

  /* Main Area */
  .dashboard-main {
      display: flex;
      flex-direction: column;
      flex: 1;
      overflow: hidden; /* Prevent body scroll */
      gap: 15px;
  }

  /* Form Visibility */
  .add-track-panel {
      order: -1; /* Ensure on top if shown */
      padding: 15px;
      margin-bottom: 0;
  }
  .add-track-panel.hidden-mobile {
      display: none;
  }

  /* List Scroll - Critical Fix */
  .list-panel {
      flex: 1;
      height: auto;
      min-height: 0;
      display: flex;
      flex-direction: column;
      margin-bottom: 0; /* No margin bottom to avoid push */
      padding: 15px;
      padding-bottom: 80px; /* Space for footer/nav stuff if any, or just safe area */
  }
  
  .tracks-list {
      flex: 1;
      overflow-y: auto;
      padding-right: 5px;
      -webkit-overflow-scrolling: touch;
      padding-bottom: 50px; /* Extra inner cushion */
  }
  
  .empty-state {
      padding: 20px;
  }
}
.mobile-only { display: none; }


</style>
