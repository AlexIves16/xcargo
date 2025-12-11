<template>
  <div class="sidebar-container">
    <menu class="menu">
      <button 
        v-for="(item, index) in menuItems" 
        :key="index"
        class="menu__item" 
        :class="{ active: activeIndex === index }"
        :style="{ '--bgColorItem': item.color }"
        @click="clickItem(index)"
        ref="menuItemRefs"
      >
        <svg class="icon" viewBox="0 0 24 24" v-html="item.iconPath"></svg>
        
        <!-- Tooltip -->
        <div class="tooltip">
          {{ getLabel(item.key) }}
        </div>
      </button>

      <div class="menu__border" ref="menuBorderRef"></div>
    </menu>

    <div class="svg-container">
      <svg viewBox="0 0 202.9 45.5">
        <clipPath id="menu" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021978021978022)">
          <path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7 c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5 c9.2,3.6,17.6,4.2,23.3,4H6.7z"/>
        </clipPath>
      </svg>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, watch, computed } from 'vue'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { useI18n } from '@/composables/useI18n'

const props = defineProps({
  activeKey: {
    type: String,
    default: ''
  }
})

const activeIndex = ref(-1)
const menuItemRefs = ref([])
const menuBorderRef = ref(null)

const { t } = useI18n()

const getLabel = (key) => {
   const map = {
      services: 'nav.services',
      about: 'nav.about',
      contacts: 'nav.contact',
      tracking: 'features.tracking',
      login: 'nav.login',
      dashboard: 'nav.profile'
   }
   return map[key] ? t(map[key]) : key
}

const isLoggedIn = ref(false)

const menuItems = computed(() => [
  { 
    key: 'services',
    color: '#312E81', 
    iconPath: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>' 
  },
  { 
    key: 'about',
    color: '#4F46E5', 
    iconPath: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>' 
  },
  { 
    key: 'contacts',
    color: '#6366F1', 
    iconPath: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>' 
  },
  { 
    key: 'tracking',
    color: '#818CF8', 
    iconPath: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' 
  },
  { 
    key: isLoggedIn.value ? 'dashboard' : 'login',
    color: isLoggedIn.value ? '#10B981' : '#38BDF8', 
    iconPath: isLoggedIn.value 
      ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>'
      : '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>' 
  }
])

const emit = defineEmits(['select'])

const clickItem = (index) => {
  activeIndex.value = index
  updateBorderPosition()
  // Emit full item
  const item = menuItems.value[index]
  emit('select', item)
}

const updateBorderPosition = () => {
  const border = menuBorderRef.value
  if (!border) return

  if (activeIndex.value === -1 || !menuItemRefs.value[activeIndex.value]) {
    border.style.opacity = '0'
    return
  }
  
  border.style.opacity = '1'

  const activeItem = menuItemRefs.value[activeIndex.value]
  const menuEl = activeItem.parentElement
  const itemRect = activeItem.getBoundingClientRect()
  const menuRect = menuEl.getBoundingClientRect()

  if (window.innerWidth <= 1024) {
      // Horizontal Logic (Mobile)
      const left = Math.floor((itemRect.left - menuRect.left) + (itemRect.width / 2) - (border.offsetWidth / 2))
      
      // Reset top in transform, rely on bounds or CSS
      // If CSS top is -1.75em, that places it. 
      // We assume rotation 0deg points UP (or matches the shape).
      // If it still looks "flipped", we can try 180 again or flip Y scale.
      
      border.style.transform = `translate3d(${left}px, 0, 0) rotate(0deg)` 
  } else {
      // Vertical Logic (Desktop)
      const top = Math.floor((itemRect.top - menuRect.top) + (itemRect.height / 2) - (border.offsetWidth / 2))
      const leftOffset = 0 
      border.style.transform = `translate3d(${leftOffset}em, ${top}px, 0) rotate(90deg)`
  }
}

watch(() => props.activeKey, (newKey) => {
  const index = menuItems.value.findIndex(i => i.key === newKey)
  activeIndex.value = index
  nextTick(updateBorderPosition)
})

onMounted(() => {
  nextTick(() => {
    const index = menuItems.value.findIndex(i => i.key === props.activeKey)
    activeIndex.value = index
    updateBorderPosition()
    window.addEventListener('resize', updateBorderPosition)
  })

  // Auth logic handled by plugin check
  const { $auth } = useNuxtApp()
  if ($auth) {
    onAuthStateChanged($auth, (user) => {
      isLoggedIn.value = !!user
    })
  }
})
</script>

<style scoped>
.sidebar-container {
  display: flex;
  align-items: center;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 50; /* Above header/footer waves but below splash if needed */
  padding-left: 0; /* Flush to edge */
}

.menu {
  display: flex;
  flex-direction: column; /* Vertical */
  width: 5em; /* Adjusted roughly for vertical width */
  height: 32.05em; /* Use height instead of width for length */
  font-size: 0.75em; /* Scalling down 2x */
  padding: 2.85em 0; /* Padding vertical */
  position: relative;
  align-items: center;
  justify-content: center;
  background-color: #1d1d27; /* Dark background */
  border-top-right-radius: 1.5em;
  border-bottom-right-radius: 1.5em;
  border-top-left-radius: 0;
  border-bottom-left-radius: 0;
  box-shadow: 0 10px 30px rgba(0,0,0,0.5);
}

.menu__item {
  all: unset;
  flex-grow: 1;
  z-index: 100;
  display: flex;
  cursor: pointer;
  position: relative;
  border-radius: 50%;
  align-items: center;
  will-change: transform;
  justify-content: center;
  width: 100%;
  padding: 0;
  transition: transform 0.7s;
}

.menu__item::before {
  content: "";
  z-index: -1;
  width: 4.2em;
  height: 4.2em;
  border-radius: 50%;
  position: absolute;
  transform: scale(0);
  transition: background-color 0.7s, transform 0.7s;
}

.menu__item.active {
  transform: translate3d(0.8em, 0, 0); /* Move right instead of up */
}

.menu__item.active::before {
  transform: scale(1);
  background-color: var(--bgColorItem);
}

.icon {
  width: 2.6em;
  height: 2.6em;
  stroke: white;
  fill: transparent;
  stroke-width: 1pt;
  stroke-miterlimit: 10;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-dasharray: 400;
}

.menu__item.active .icon {
  animation: strok 1.5s reverse;
}

@keyframes strok {
  100% {
    stroke-dashoffset: 400;
  }
}

.menu__border {
  left: 7em; /* User manual fix 3 */
  top: 0;
  width: 10.9em; /* Keep original width concept */
  height: 2.4em; /* Keep original height concept */
  position: absolute;
  clip-path: url(#menu);
  will-change: transform;
  background-color: #1d1d27;
  transition: transform 0.7s, opacity 0.6s;
}

/* 
The clip-path SVG path is designed for a horizontal bump. 
For vertical, we either need a new path or rotate the container div 90deg.
*/
.menu__border {
  transform-origin: 0 0; /* Pivot top-left */
  /* We need to rotate the "shape" so the bump points Left (into the menu) or Right (out?) */
  /* Horizontal original: bump points Up (bottom: 99%). */
  /* Vertical target: bump points Left (right: 99%). */
  /* Actually, let's rotate the border div -90deg so bottom becomes right. */
  /* We handle translation manually via JS, so just static rotation here? No, JS sets transform translate. */
  /* We must apply rotation AND translation in JS or combine here. */
}

.svg-container {
  width: 0;
  height: 0;
  position: absolute;
}

/* Tooltip Styles */
.tooltip {
  position: absolute;
  left: 110%; /* To the right */
  top: 50%;
  transform: translateY(-50%) scale(0.8);
  opacity: 0;
  pointer-events: none;
  background-color: var(--bgColorItem); /* Use button color */
  border-radius: 12px;
  padding: 8px 16px;
  color: white;
  font-family: sans-serif;
  font-size: 14px;
  letter-spacing: 0.5px;
  font-weight: 500;
  white-space: nowrap;
  box-shadow: 0 4px 15px rgba(0,0,0,0.3);
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275); /* Bouncy pop */
  transition-delay: 0s; /* Fast fade out */
  z-index: 200;
}

/* Arrow pointer */
.tooltip::before {
  content: '';
  position: absolute;
  left: -6px;
  top: 50%;
  transform: translateY(-50%);
  width: 0; 
  height: 0; 
  border-top: 6px solid transparent;
  border-bottom: 6px solid transparent;
  border-right: 6px solid var(--bgColorItem);
}

.menu__item:hover .tooltip {
  opacity: 1;
  transform: translateY(-50%) scale(1);
  transition-delay: 0.6s; /* Long hover delay */
  pointer-events: auto;
}

/* Mobile responsiveness */
@media screen and (max-width: 1024px) {
  .sidebar-container {
    top: auto;
    bottom: 0px; /* Attach to bottom */
    width: 100%;
    height: auto;
    justify-content: center;
    padding: 0;
    pointer-events: none; /* Let clicks pass through empty areas */
  }
  
  .menu {
    flex-direction: row;
    width: 100%;
    height: 120px; /* Increased height for larger icons */
    padding: 0;
    border-radius: 30px 30px 0 0; /* Slightly more rounded */
    font-size: 1.8em; /* 2x size increase (0.9 -> 1.8) */
    pointer-events: auto;
  }
  
  .menu__item {
    height: 100%;
  }
  
  .menu__item.active {
    transform: translate3d(0, -0.5em, 0); /* Bump UP on mobile */
  }
  
  .menu__border {
    left: 0;
    top: -1.75em; /* Position above the menu */
    width: 10.9em;
    height: 2.4em;
  }

  .tooltip { display: none; }
}
</style>
