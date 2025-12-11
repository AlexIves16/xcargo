
import type { DefineComponent, SlotsType } from 'vue'
type IslandComponent<T> = DefineComponent<{}, {refresh: () => Promise<void>}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, SlotsType<{ fallback: { error: unknown } }>> & T

type HydrationStrategies = {
  hydrateOnVisible?: IntersectionObserverInit | true
  hydrateOnIdle?: number | true
  hydrateOnInteraction?: keyof HTMLElementEventMap | Array<keyof HTMLElementEventMap> | true
  hydrateOnMediaQuery?: string
  hydrateAfter?: number
  hydrateWhen?: boolean
  hydrateNever?: true
}
type LazyComponent<T> = DefineComponent<HydrationStrategies, {}, {}, {}, {}, {}, {}, { hydrated: () => void }> & T

interface _GlobalComponents {
  'AboutContent': typeof import("../../components/AboutContent.vue").default
  'AdminContent': typeof import("../../components/AdminContent.vue").default
  'AuthFinishContent': typeof import("../../components/AuthFinishContent.vue").default
  'BlobOverlay': typeof import("../../components/BlobOverlay.vue").default
  'ContactsContent': typeof import("../../components/ContactsContent.vue").default
  'DashboardContent': typeof import("../../components/DashboardContent.vue").default
  'EmailAuthContent': typeof import("../../components/EmailAuthContent.vue").default
  'HomeContent': typeof import("../../components/HomeContent.vue").default
  'LoginContent': typeof import("../../components/LoginContent.vue").default
  'PrivacyContent': typeof import("../../components/PrivacyContent.vue").default
  'RocketLaunch': typeof import("../../components/RocketLaunch.vue").default
  'RocketWidget': typeof import("../../components/RocketWidget.vue").default
  'ServicesContent': typeof import("../../components/ServicesContent.vue").default
  'TrackingContent': typeof import("../../components/TrackingContent.vue").default
  'VerticalSidebar': typeof import("../../components/VerticalSidebar.vue").default
  'WavesFooter': typeof import("../../components/WavesFooter.vue").default
  'WavesHeader': typeof import("../../components/WavesHeader.vue").default
  'PlexusGlobe': typeof import("../../components/plexus-globe.vue").default
  'NuxtWelcome': typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default
  'NuxtLayout': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default
  'NuxtErrorBoundary': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
  'ClientOnly': typeof import("../../node_modules/nuxt/dist/app/components/client-only").default
  'DevOnly': typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default
  'ServerPlaceholder': typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default
  'NuxtLink': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default
  'NuxtLoadingIndicator': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
  'NuxtTime': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
  'NuxtRouteAnnouncer': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
  'NuxtImg': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
  'NuxtPicture': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
  'NuxtPage': typeof import("../../node_modules/nuxt/dist/pages/runtime/page-placeholder").default
  'NoScript': typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript
  'Link': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link
  'Base': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base
  'Title': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title
  'Meta': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta
  'Style': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style
  'Head': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head
  'Html': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html
  'Body': typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body
  'NuxtIsland': typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default
  'LazyAboutContent': LazyComponent<typeof import("../../components/AboutContent.vue").default>
  'LazyAdminContent': LazyComponent<typeof import("../../components/AdminContent.vue").default>
  'LazyAuthFinishContent': LazyComponent<typeof import("../../components/AuthFinishContent.vue").default>
  'LazyBlobOverlay': LazyComponent<typeof import("../../components/BlobOverlay.vue").default>
  'LazyContactsContent': LazyComponent<typeof import("../../components/ContactsContent.vue").default>
  'LazyDashboardContent': LazyComponent<typeof import("../../components/DashboardContent.vue").default>
  'LazyEmailAuthContent': LazyComponent<typeof import("../../components/EmailAuthContent.vue").default>
  'LazyHomeContent': LazyComponent<typeof import("../../components/HomeContent.vue").default>
  'LazyLoginContent': LazyComponent<typeof import("../../components/LoginContent.vue").default>
  'LazyPrivacyContent': LazyComponent<typeof import("../../components/PrivacyContent.vue").default>
  'LazyRocketLaunch': LazyComponent<typeof import("../../components/RocketLaunch.vue").default>
  'LazyRocketWidget': LazyComponent<typeof import("../../components/RocketWidget.vue").default>
  'LazyServicesContent': LazyComponent<typeof import("../../components/ServicesContent.vue").default>
  'LazyTrackingContent': LazyComponent<typeof import("../../components/TrackingContent.vue").default>
  'LazyVerticalSidebar': LazyComponent<typeof import("../../components/VerticalSidebar.vue").default>
  'LazyWavesFooter': LazyComponent<typeof import("../../components/WavesFooter.vue").default>
  'LazyWavesHeader': LazyComponent<typeof import("../../components/WavesHeader.vue").default>
  'LazyPlexusGlobe': LazyComponent<typeof import("../../components/plexus-globe.vue").default>
  'LazyNuxtWelcome': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/welcome.vue").default>
  'LazyNuxtLayout': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-layout").default>
  'LazyNuxtErrorBoundary': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
  'LazyClientOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/client-only").default>
  'LazyDevOnly': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/dev-only").default>
  'LazyServerPlaceholder': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/server-placeholder").default>
  'LazyNuxtLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-link").default>
  'LazyNuxtLoadingIndicator': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
  'LazyNuxtTime': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
  'LazyNuxtRouteAnnouncer': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
  'LazyNuxtImg': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
  'LazyNuxtPicture': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
  'LazyNuxtPage': LazyComponent<typeof import("../../node_modules/nuxt/dist/pages/runtime/page-placeholder").default>
  'LazyNoScript': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").NoScript>
  'LazyLink': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Link>
  'LazyBase': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Base>
  'LazyTitle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Title>
  'LazyMeta': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Meta>
  'LazyStyle': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Style>
  'LazyHead': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Head>
  'LazyHtml': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Html>
  'LazyBody': LazyComponent<typeof import("../../node_modules/nuxt/dist/head/runtime/components").Body>
  'LazyNuxtIsland': LazyComponent<typeof import("../../node_modules/nuxt/dist/app/components/nuxt-island").default>
}

declare module 'vue' {
  export interface GlobalComponents extends _GlobalComponents { }
}

export {}
