<template>
  <div class="relative w-full h-screen lg:h-screen h-[100dvh] flex flex-col overflow-hidden">
    <!-- Splash Screen -->
    <RocketLaunch v-if="showSplash" @loaded="showSplash = false" />
    
    <!-- Background (Absolute, behind everything) -->
    <div class="absolute inset-0 w-full h-full" 
         :style="{
           background: `linear-gradient(135deg, hsl(${backgroundHue1}, ${backgroundSaturation1}%, ${backgroundLightness1}%), hsl(${backgroundHue2}, ${backgroundSaturation2}%, ${backgroundLightness2}%))`
         }">
    </div>
    
    <!-- Plexus Globe (Background) -->
    <!-- Plexus Globe (Background) -->
    <ClientOnly>
      <PlexusGlobe
        class="absolute inset-0 w-full h-full"
        :scale="BASE_SETTINGS.scale"
        :position-x="globePositionX"
        :position-y="BASE_SETTINGS.positionY"
        :rotation-speed="BASE_SETTINGS.rotationSpeed"
        :flicker-intensity="BASE_SETTINGS.flickerIntensity"
        :gradient-intensity="BASE_SETTINGS.gradientIntensity"
        :connection-switching="BASE_SETTINGS.connectionSwitching"
        :connection-quantity="BASE_SETTINGS.connectionQuantity"
        :white-intensity="BASE_SETTINGS.whiteIntensity"
        :cyan-intensity="BASE_SETTINGS.cyanIntensity"
        :blue-intensity="BASE_SETTINGS.blueIntensity"
        :purple-intensity="BASE_SETTINGS.purpleIntensity"
        :purple-hue="BASE_SETTINGS.purpleHue"
        :blue-hue="BASE_SETTINGS.blueHue"
        :cyan-hue="BASE_SETTINGS.cyanHue"
      />
    </ClientOnly>

    <!-- Sidebar Menu -->
    <!-- Sidebar Menu -->
    <VerticalSidebar :active-key="currentView" @select="onMenuSelect" />
    
    <!-- Main Content Area -->
    <!-- Header (Static) -->
    <div class="relative z-50 pointer-events-auto">
      <WavesHeader @logo-click="goHome" />
    </div>

    <!-- Main Content Area (Scrollable Internal) -->
    <!-- Main Content Area (Scrollable Internal) -->
    <main class="flex-1 relative w-full overflow-y-auto z-10 scroll-container">
        <HomeContent v-if="currentView === 'home'" :trigger-anim="!showSplash" @navigate="navigateTo" />
        <ServicesContent v-if="currentView === 'services'" :trigger-anim="!showSplash" />
        <AboutContent v-if="currentView === 'about'" :trigger-anim="!showSplash" />
        <ContactsContent v-if="currentView === 'contacts'" :trigger-anim="!showSplash" />
        <TrackingContent v-if="currentView === 'tracking'" :trigger-anim="!showSplash" />
        <PrivacyContent v-if="currentView === 'privacy'" :trigger-anim="!showSplash" @close="goHome" />
        <PublicOfferContent v-if="currentView === 'public-offer'" :trigger-anim="!showSplash" @close="goHome" />
        <LoginContent v-if="currentView === 'login'" :trigger-anim="!showSplash" @navigate="navigateTo" />
        <EmailAuthContent v-if="currentView === 'email-auth'" :trigger-anim="!showSplash" @navigate="navigateTo" />
        <AuthFinishContent v-if="currentView === 'auth-finish'" @navigate="navigateTo" />
        <ClientOnly>
          <DashboardContent v-if="currentView === 'dashboard'" :trigger-anim="!showSplash" @navigate="navigateTo" />
        </ClientOnly>
        <ClientOnly>
          <AdminContent v-if="currentView === 'admin'" :trigger-anim="!showSplash" @navigate="navigateTo" />
        </ClientOnly>
    </main>

    <!-- Footer (Static Bottom) - lifted on mobile for menu -->
    <div class="relative z-40 pointer-events-auto mt-auto pb-[60px] lg:pb-0 bg-transparent">
      <WavesFooter @privacy-click="goToPrivacy" @offer-click="goToPublicOffer" />
    </div>

  </div>
</template>

<script setup>
import { ref, watch, onMounted, onUnmounted, computed } from 'vue'
import { onAuthStateChanged } from 'firebase/auth'
import { useI18n } from '@/composables/useI18n'
import PlexusGlobe from '../components/plexus-globe.vue'
import WavesHeader from '../components/WavesHeader.vue'
import WavesFooter from '../components/WavesFooter.vue'
import VerticalSidebar from '../components/VerticalSidebar.vue'
import HomeContent from '../components/HomeContent.vue'
import ServicesContent from '../components/ServicesContent.vue'
import AboutContent from '../components/AboutContent.vue'
import ContactsContent from '../components/ContactsContent.vue'
import TrackingContent from '../components/TrackingContent.vue'
import PrivacyContent from '../components/PrivacyContent.vue'
import PublicOfferContent from '../components/PublicOfferContent.vue'
import LoginContent from '../components/LoginContent.vue'
import EmailAuthContent from '../components/EmailAuthContent.vue'
import AuthFinishContent from '../components/AuthFinishContent.vue'
import DashboardContent from '../components/DashboardContent.vue'
import AdminContent from '../components/AdminContent.vue'

const showSplash = ref(true)

// Skip splash on auth link
if (typeof window !== 'undefined' && window.location.pathname === '/auth/finish') {
  showSplash.value = false
}
const globePositionX = ref(190)
const currentView = ref('home')

// Initialize I18n
useI18n()

const onMenuSelect = (item) => {
  if (item.key === 'services') {
    currentView.value = 'services'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'services' }, '', '/services')
  } else if (item.key === 'about') {
    currentView.value = 'about'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'about' }, '', '/about')
  } else if (item.key === 'contacts') {
    currentView.value = 'contacts'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'contacts' }, '', '/contacts')
  } else if (item.key === 'tracking') {
    currentView.value = 'tracking'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'tracking' }, '', '/tracking')
  } else if (item.key === 'login') {
    currentView.value = 'login'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'login' }, '', '/login')
  } else if (item.key === 'dashboard') {
    currentView.value = 'dashboard'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'dashboard' }, '', '/dashboard')
  } else {
    currentView.value = 'home'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'home' }, '', '/')
  }
}

const goHome = () => {
  currentView.value = 'home'
  if (typeof window !== 'undefined') window.history.pushState({ view: 'home' }, '', '/')
}

const goToPrivacy = () => {
  currentView.value = 'privacy'
  if (typeof window !== 'undefined') window.history.pushState({ view: 'privacy' }, '', '/privacy')
}

const goToPublicOffer = () => {
    currentView.value = 'public-offer'
    if (typeof window !== 'undefined') window.history.pushState({ view: 'public-offer' }, '', '/public-offer')
}

const goToLogin = () => {
  currentView.value = 'login'
  if (typeof window !== 'undefined') window.history.pushState({ view: 'login' }, '', '/login')
}

const navigateTo = (key) => {
  currentView.value = key
  let path = `/${key}`
  if (key === 'home') path = '/'
  else if (key === 'email-auth') path = '/auth/email'
  else if (key === 'auth-finish') path = '/auth/finish'
  else if (key === 'dashboard') path = '/dashboard'
  else if (key === 'admin') path = '/admin'
  
  if (typeof window !== 'undefined') window.history.pushState({ view: key }, '', path)
}

const handlePopState = () => {
  if (typeof window !== 'undefined') {
    if (window.location.pathname === '/services') {
      currentView.value = 'services'
    } else if (window.location.pathname === '/about') {
      currentView.value = 'about'
    } else if (window.location.pathname === '/contacts') {
      currentView.value = 'contacts'
    } else if (window.location.pathname === '/tracking') {
      currentView.value = 'tracking'
    } else if (window.location.pathname === '/privacy') {
      currentView.value = 'privacy'
    } else if (window.location.pathname === '/public-offer') {
      currentView.value = 'public-offer'
    } else if (window.location.pathname === '/login') {
      currentView.value = 'login'
    } else if (window.location.pathname === '/auth/email') {
      currentView.value = 'email-auth'
    } else if (window.location.pathname === '/auth/finish') {
      currentView.value = 'auth-finish'
    } else if (window.location.pathname === '/dashboard') {
      currentView.value = 'dashboard'
    } else if (window.location.pathname === '/admin') {
      currentView.value = 'admin'
    } else {
      currentView.value = 'home'
    }
  }
}

const updateLayout = () => {
  if (typeof window !== 'undefined') {
    if (window.innerWidth > 768) {
      globePositionX.value = 400 // Adjusted to 400 as requested
    } else {
      globePositionX.value = 0 // Center on mobile
    }
  }
}

const BASE_SETTINGS = {
  scale: 1.4, // Reduced by ~5%
  positionX: 190,
  positionY: 30,
  rotationSpeed: 1, // Зафиксированное значение
  flickerIntensity: 0.33, // Зафиксированное значение
  gradientIntensity: 1.0,
  connectionSwitching: 0.01, // Зафиксированное значение
  connectionQuantity: 0.01, // Зафиксированное значение
  whiteIntensity: 0.1,
  cyanIntensity: 0.63,
  blueIntensity: 0.3,
  purpleIntensity: 0.56,
  purpleHue: 254, // Зафиксированное значение
  blueHue: 271, // Зафиксированное значение
  cyanHue: 276, // Зафиксированное значение
}

// Зафиксированные значения градиента фона
const backgroundHue1 = ref(240) // Зафиксированное значение
const backgroundSaturation1 = ref(44) // Зафиксированное значение
const backgroundLightness1 = ref(19) // Зафиксированное значение
const backgroundHue2 = ref(221) // Зафиксированное значение
const backgroundSaturation2 = ref(96) // Зафиксированное значение
const backgroundLightness2 = ref(0) // Зафиксированное значение

onMounted(() => {
  updateLayout()
  window.addEventListener('resize', updateLayout)
  window.addEventListener('popstate', handlePopState)
  
  // Check path for direct access
  if (window.location.pathname === '/services') {
    currentView.value = 'services'
  } else if (window.location.pathname === '/about') {
    currentView.value = 'about'
  } else if (window.location.pathname === '/contacts') {
    currentView.value = 'contacts'
  } else if (window.location.pathname === '/tracking') {
    currentView.value = 'tracking'
  } else if (window.location.pathname === '/privacy') {
    currentView.value = 'privacy'
  } else if (window.location.pathname === '/public-offer') {
    currentView.value = 'public-offer'
  } else if (window.location.pathname === '/login') {
    currentView.value = 'login'
  } else if (window.location.pathname === '/auth/email') {
    currentView.value = 'email-auth'
  } else if (window.location.pathname === '/auth/finish') {
    currentView.value = 'auth-finish'
  } else if (window.location.pathname === '/dashboard') {
    currentView.value = 'dashboard'
  } else if (window.location.pathname === '/admin') {
    currentView.value = 'admin'
  }

  // Auth Middleware Logic
  const { $auth } = useNuxtApp()
  if ($auth) {
      onAuthStateChanged($auth, (user) => {
        const path = window.location.pathname
        const isAdmin = user?.email === 'kairfakomylife@gmail.com'

        if (user && (path === '/' || path === '/login')) {
            const target = isAdmin ? 'admin' : 'dashboard'
            console.log('Auth Redirect: Home/Login -> ' + target)
            navigateTo(target)
        } else if (!user && (path === '/dashboard' || path === '/admin')) {
            console.log('Auth Redirect: Protected -> Login')
            navigateTo('login')
        }
      })
  }
})

onUnmounted(() => {
  window.removeEventListener('resize', updateLayout)
  window.removeEventListener('popstate', handlePopState)
})

// Dynamic Font for KZ
const { locale } = useI18n()
useHead({
  link: [
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
    { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap' }
  ],
  htmlAttrs: {
    lang: computed(() => locale.value)
  }
})
</script>

<style>
/* Global KZ Font Override */
:lang(kk) * {
  font-family: 'Montserrat', sans-serif !important;
}

/* Ripple Effect */
span.ripple {
  position: absolute;
  border-radius: 50%;
  transform: scale(0);
  animation: ripple 600ms linear;
  background-color: rgba(255, 255, 255, 0.7);
  pointer-events: none;
}
@keyframes ripple {
  to {
    transform: scale(4);
    opacity: 0;
  }
}
/* Ensure ripple container has these properties */
.auth-btn, .action-btn, .login-button, .search-button, .nav-link {
    position: relative;
    overflow: hidden;
}
</style>

<style scoped>
@media (max-width: 1024px) {
  .footer-wrapper {
    display: none !important;
  }
}
</style>
