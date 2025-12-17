
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


export const AboutContent: typeof import("../components/AboutContent.vue").default
export const AdminContent: typeof import("../components/AdminContent.vue").default
export const AuthFinishContent: typeof import("../components/AuthFinishContent.vue").default
export const BlobOverlay: typeof import("../components/BlobOverlay.vue").default
export const ContactsContent: typeof import("../components/ContactsContent.vue").default
export const DashboardContent: typeof import("../components/DashboardContent.vue").default
export const EmailAuthContent: typeof import("../components/EmailAuthContent.vue").default
export const GoogleRecaptcha: typeof import("../components/GoogleRecaptcha.vue").default
export const HomeContent: typeof import("../components/HomeContent.vue").default
export const LoginContent: typeof import("../components/LoginContent.vue").default
export const PrivacyContent: typeof import("../components/PrivacyContent.vue").default
export const PublicOfferContent: typeof import("../components/PublicOfferContent.vue").default
export const RocketLaunch: typeof import("../components/RocketLaunch.vue").default
export const RocketWidget: typeof import("../components/RocketWidget.vue").default
export const ServicesContent: typeof import("../components/ServicesContent.vue").default
export const TrackingContent: typeof import("../components/TrackingContent.vue").default
export const VerticalSidebar: typeof import("../components/VerticalSidebar.vue").default
export const WavesFooter: typeof import("../components/WavesFooter.vue").default
export const WavesHeader: typeof import("../components/WavesHeader.vue").default
export const PlexusGlobe: typeof import("../components/plexus-globe.vue").default
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only").default
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only").default
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder").default
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components").Link
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components").Base
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components").Title
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components").Style
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components").Head
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components").Html
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components").Body
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default
export const LazyAboutContent: LazyComponent<typeof import("../components/AboutContent.vue").default>
export const LazyAdminContent: LazyComponent<typeof import("../components/AdminContent.vue").default>
export const LazyAuthFinishContent: LazyComponent<typeof import("../components/AuthFinishContent.vue").default>
export const LazyBlobOverlay: LazyComponent<typeof import("../components/BlobOverlay.vue").default>
export const LazyContactsContent: LazyComponent<typeof import("../components/ContactsContent.vue").default>
export const LazyDashboardContent: LazyComponent<typeof import("../components/DashboardContent.vue").default>
export const LazyEmailAuthContent: LazyComponent<typeof import("../components/EmailAuthContent.vue").default>
export const LazyGoogleRecaptcha: LazyComponent<typeof import("../components/GoogleRecaptcha.vue").default>
export const LazyHomeContent: LazyComponent<typeof import("../components/HomeContent.vue").default>
export const LazyLoginContent: LazyComponent<typeof import("../components/LoginContent.vue").default>
export const LazyPrivacyContent: LazyComponent<typeof import("../components/PrivacyContent.vue").default>
export const LazyPublicOfferContent: LazyComponent<typeof import("../components/PublicOfferContent.vue").default>
export const LazyRocketLaunch: LazyComponent<typeof import("../components/RocketLaunch.vue").default>
export const LazyRocketWidget: LazyComponent<typeof import("../components/RocketWidget.vue").default>
export const LazyServicesContent: LazyComponent<typeof import("../components/ServicesContent.vue").default>
export const LazyTrackingContent: LazyComponent<typeof import("../components/TrackingContent.vue").default>
export const LazyVerticalSidebar: LazyComponent<typeof import("../components/VerticalSidebar.vue").default>
export const LazyWavesFooter: LazyComponent<typeof import("../components/WavesFooter.vue").default>
export const LazyWavesHeader: LazyComponent<typeof import("../components/WavesHeader.vue").default>
export const LazyPlexusGlobe: LazyComponent<typeof import("../components/plexus-globe.vue").default>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue").default>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout").default>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue").default>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only").default>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only").default>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder").default>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link").default>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator").default>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue").default>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer").default>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtImg>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs").NuxtPicture>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder").default>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").NoScript>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Link>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Base>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Title>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Meta>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Style>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Head>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Html>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components").Body>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island").default>

export const componentNames: string[]
