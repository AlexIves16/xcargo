
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


export const AboutContent: typeof import("../components/AboutContent.vue")['default']
export const AdminContent: typeof import("../components/AdminContent.vue")['default']
export const AuthFinishContent: typeof import("../components/AuthFinishContent.vue")['default']
export const BlobOverlay: typeof import("../components/BlobOverlay.vue")['default']
export const ContactsContent: typeof import("../components/ContactsContent.vue")['default']
export const DashboardContent: typeof import("../components/DashboardContent.vue")['default']
export const EmailAuthContent: typeof import("../components/EmailAuthContent.vue")['default']
export const GoogleRecaptcha: typeof import("../components/GoogleRecaptcha.vue")['default']
export const HomeContent: typeof import("../components/HomeContent.vue")['default']
export const LoginContent: typeof import("../components/LoginContent.vue")['default']
export const PrivacyContent: typeof import("../components/PrivacyContent.vue")['default']
export const PublicOfferContent: typeof import("../components/PublicOfferContent.vue")['default']
export const RocketLaunch: typeof import("../components/RocketLaunch.vue")['default']
export const RocketWidget: typeof import("../components/RocketWidget.vue")['default']
export const ServicesContent: typeof import("../components/ServicesContent.vue")['default']
export const TrackingContent: typeof import("../components/TrackingContent.vue")['default']
export const VerticalSidebar: typeof import("../components/VerticalSidebar.vue")['default']
export const WavesFooter: typeof import("../components/WavesFooter.vue")['default']
export const WavesHeader: typeof import("../components/WavesHeader.vue")['default']
export const PlexusGlobe: typeof import("../components/plexus-globe.vue")['default']
export const ScriptGoogleMaps: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMaps.vue")['default']
export const ScriptGoogleMapsAdvancedMarkerElement: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsAdvancedMarkerElement.vue")['default']
export const ScriptGoogleMapsCircle: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsCircle.vue")['default']
export const ScriptGoogleMapsGeoJson: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsGeoJson.vue")['default']
export const ScriptGoogleMapsHeatmapLayer: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsHeatmapLayer.vue")['default']
export const ScriptGoogleMapsInfoWindow: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsInfoWindow.vue")['default']
export const ScriptGoogleMapsMarker: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarker.vue")['default']
export const ScriptGoogleMapsMarkerClusterer: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarkerClusterer.vue")['default']
export const ScriptGoogleMapsOverlayView: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsOverlayView.vue")['default']
export const ScriptGoogleMapsPinElement: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPinElement.vue")['default']
export const ScriptGoogleMapsPolygon: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolygon.vue")['default']
export const ScriptGoogleMapsPolyline: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolyline.vue")['default']
export const ScriptGoogleMapsRectangle: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsRectangle.vue")['default']
export const ScriptGoogleMapsStaticMap: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsStaticMap.vue")['default']
export const BindGoogleMapsEvents: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/bindGoogleMapsEvents")['default']
export const InjectionKeys: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/injectionKeys")['default']
export const Types: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/types")['default']
export const UseGoogleMapsResource: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/useGoogleMapsResource")['default']
export const ScriptAriaLoadingIndicator: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptAriaLoadingIndicator.vue")['default']
export const ScriptBlueskyEmbed: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptBlueskyEmbed.vue")['default']
export const ScriptCalendlyInlineWidget: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptCalendlyInlineWidget.vue")['default']
export const ScriptCarbonAds: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptCarbonAds.vue")['default']
export const ScriptCrisp: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptCrisp.vue")['default']
export const ScriptGoogleAdsense: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptGoogleAdsense.vue")['default']
export const ScriptGravatar: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptGravatar.vue")['default']
export const ScriptInstagramEmbed: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptInstagramEmbed.vue")['default']
export const ScriptIntercom: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptIntercom.vue")['default']
export const ScriptLemonSqueezy: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptLemonSqueezy.vue")['default']
export const ScriptLoadingIndicator: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptLoadingIndicator.vue")['default']
export const ScriptPayPalButtons: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalButtons.vue")['default']
export const ScriptPayPalMessages: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalMessages.vue")['default']
export const ScriptStripePricingTable: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptStripePricingTable.vue")['default']
export const ScriptVimeoPlayer: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptVimeoPlayer.vue")['default']
export const ScriptXEmbed: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptXEmbed.vue")['default']
export const ScriptYouTubePlayer: typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptYouTubePlayer.vue")['default']
export const NuxtWelcome: typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']
export const NuxtLayout: typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']
export const NuxtErrorBoundary: typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']
export const ClientOnly: typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']
export const DevOnly: typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']
export const ServerPlaceholder: typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']
export const NuxtLink: typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']
export const NuxtLoadingIndicator: typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']
export const NuxtTime: typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']
export const NuxtRouteAnnouncer: typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']
export const NuxtImg: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']
export const NuxtPicture: typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']
export const NuxtTurnstile: typeof import("../node_modules/@nuxtjs/turnstile/dist/runtime/components/NuxtTurnstile.vue")['default']
export const NuxtPage: typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']
export const NoScript: typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']
export const Link: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']
export const Base: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']
export const Title: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']
export const Meta: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']
export const Style: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']
export const Head: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']
export const Html: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']
export const Body: typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']
export const NuxtIsland: typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']
export const LazyAboutContent: LazyComponent<typeof import("../components/AboutContent.vue")['default']>
export const LazyAdminContent: LazyComponent<typeof import("../components/AdminContent.vue")['default']>
export const LazyAuthFinishContent: LazyComponent<typeof import("../components/AuthFinishContent.vue")['default']>
export const LazyBlobOverlay: LazyComponent<typeof import("../components/BlobOverlay.vue")['default']>
export const LazyContactsContent: LazyComponent<typeof import("../components/ContactsContent.vue")['default']>
export const LazyDashboardContent: LazyComponent<typeof import("../components/DashboardContent.vue")['default']>
export const LazyEmailAuthContent: LazyComponent<typeof import("../components/EmailAuthContent.vue")['default']>
export const LazyGoogleRecaptcha: LazyComponent<typeof import("../components/GoogleRecaptcha.vue")['default']>
export const LazyHomeContent: LazyComponent<typeof import("../components/HomeContent.vue")['default']>
export const LazyLoginContent: LazyComponent<typeof import("../components/LoginContent.vue")['default']>
export const LazyPrivacyContent: LazyComponent<typeof import("../components/PrivacyContent.vue")['default']>
export const LazyPublicOfferContent: LazyComponent<typeof import("../components/PublicOfferContent.vue")['default']>
export const LazyRocketLaunch: LazyComponent<typeof import("../components/RocketLaunch.vue")['default']>
export const LazyRocketWidget: LazyComponent<typeof import("../components/RocketWidget.vue")['default']>
export const LazyServicesContent: LazyComponent<typeof import("../components/ServicesContent.vue")['default']>
export const LazyTrackingContent: LazyComponent<typeof import("../components/TrackingContent.vue")['default']>
export const LazyVerticalSidebar: LazyComponent<typeof import("../components/VerticalSidebar.vue")['default']>
export const LazyWavesFooter: LazyComponent<typeof import("../components/WavesFooter.vue")['default']>
export const LazyWavesHeader: LazyComponent<typeof import("../components/WavesHeader.vue")['default']>
export const LazyPlexusGlobe: LazyComponent<typeof import("../components/plexus-globe.vue")['default']>
export const LazyScriptGoogleMaps: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMaps.vue")['default']>
export const LazyScriptGoogleMapsAdvancedMarkerElement: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsAdvancedMarkerElement.vue")['default']>
export const LazyScriptGoogleMapsCircle: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsCircle.vue")['default']>
export const LazyScriptGoogleMapsGeoJson: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsGeoJson.vue")['default']>
export const LazyScriptGoogleMapsHeatmapLayer: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsHeatmapLayer.vue")['default']>
export const LazyScriptGoogleMapsInfoWindow: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsInfoWindow.vue")['default']>
export const LazyScriptGoogleMapsMarker: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarker.vue")['default']>
export const LazyScriptGoogleMapsMarkerClusterer: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsMarkerClusterer.vue")['default']>
export const LazyScriptGoogleMapsOverlayView: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsOverlayView.vue")['default']>
export const LazyScriptGoogleMapsPinElement: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPinElement.vue")['default']>
export const LazyScriptGoogleMapsPolygon: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolygon.vue")['default']>
export const LazyScriptGoogleMapsPolyline: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsPolyline.vue")['default']>
export const LazyScriptGoogleMapsRectangle: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsRectangle.vue")['default']>
export const LazyScriptGoogleMapsStaticMap: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/ScriptGoogleMapsStaticMap.vue")['default']>
export const LazyBindGoogleMapsEvents: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/bindGoogleMapsEvents")['default']>
export const LazyInjectionKeys: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/injectionKeys")['default']>
export const LazyTypes: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/types")['default']>
export const LazyUseGoogleMapsResource: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/GoogleMaps/useGoogleMapsResource")['default']>
export const LazyScriptAriaLoadingIndicator: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptAriaLoadingIndicator.vue")['default']>
export const LazyScriptBlueskyEmbed: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptBlueskyEmbed.vue")['default']>
export const LazyScriptCalendlyInlineWidget: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptCalendlyInlineWidget.vue")['default']>
export const LazyScriptCarbonAds: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptCarbonAds.vue")['default']>
export const LazyScriptCrisp: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptCrisp.vue")['default']>
export const LazyScriptGoogleAdsense: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptGoogleAdsense.vue")['default']>
export const LazyScriptGravatar: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptGravatar.vue")['default']>
export const LazyScriptInstagramEmbed: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptInstagramEmbed.vue")['default']>
export const LazyScriptIntercom: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptIntercom.vue")['default']>
export const LazyScriptLemonSqueezy: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptLemonSqueezy.vue")['default']>
export const LazyScriptLoadingIndicator: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptLoadingIndicator.vue")['default']>
export const LazyScriptPayPalButtons: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalButtons.vue")['default']>
export const LazyScriptPayPalMessages: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptPayPalMessages.vue")['default']>
export const LazyScriptStripePricingTable: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptStripePricingTable.vue")['default']>
export const LazyScriptVimeoPlayer: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptVimeoPlayer.vue")['default']>
export const LazyScriptXEmbed: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptXEmbed.vue")['default']>
export const LazyScriptYouTubePlayer: LazyComponent<typeof import("../node_modules/@nuxt/scripts/dist/runtime/components/ScriptYouTubePlayer.vue")['default']>
export const LazyNuxtWelcome: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/welcome.vue")['default']>
export const LazyNuxtLayout: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-layout")['default']>
export const LazyNuxtErrorBoundary: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-error-boundary.vue")['default']>
export const LazyClientOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/client-only")['default']>
export const LazyDevOnly: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/dev-only")['default']>
export const LazyServerPlaceholder: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/server-placeholder")['default']>
export const LazyNuxtLink: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-link")['default']>
export const LazyNuxtLoadingIndicator: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-loading-indicator")['default']>
export const LazyNuxtTime: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-time.vue")['default']>
export const LazyNuxtRouteAnnouncer: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-route-announcer")['default']>
export const LazyNuxtImg: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtImg']>
export const LazyNuxtPicture: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-stubs")['NuxtPicture']>
export const LazyNuxtTurnstile: LazyComponent<typeof import("../node_modules/@nuxtjs/turnstile/dist/runtime/components/NuxtTurnstile.vue")['default']>
export const LazyNuxtPage: LazyComponent<typeof import("../node_modules/nuxt/dist/pages/runtime/page-placeholder")['default']>
export const LazyNoScript: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['NoScript']>
export const LazyLink: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Link']>
export const LazyBase: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Base']>
export const LazyTitle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Title']>
export const LazyMeta: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Meta']>
export const LazyStyle: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Style']>
export const LazyHead: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Head']>
export const LazyHtml: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Html']>
export const LazyBody: LazyComponent<typeof import("../node_modules/nuxt/dist/head/runtime/components")['Body']>
export const LazyNuxtIsland: LazyComponent<typeof import("../node_modules/nuxt/dist/app/components/nuxt-island")['default']>

export const componentNames: string[]
