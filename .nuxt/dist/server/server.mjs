import { shallowReactive, reactive, effectScope, getCurrentScope, hasInjectionContext, getCurrentInstance, inject, toRef, computed, defineComponent, h, isReadonly, isRef, isShallow, isReactive, toRaw, ref, mergeProps, createVNode, resolveDynamicComponent, withCtx, createTextVNode, useSSRContext, createElementBlock, shallowRef, provide, cloneVNode, watch, unref, nextTick, resolveComponent, defineAsyncComponent, onErrorCaptured, onServerPrefetch, createApp } from "vue";
import { $fetch } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/ofetch/dist/node.mjs";
import { baseURL } from "#internal/nuxt/paths";
import { createHooks } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/hookable/dist/index.mjs";
import { getContext } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/unctx/dist/index.mjs";
import { sanitizeStatusCode, createError as createError$1 } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/h3/dist/index.mjs";
import { hasProtocol, joinURL, withQuery, isScriptProtocol, isEqual, stringifyParsedURL, stringifyQuery, parseQuery } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/ufo/dist/index.mjs";
import { toRouteMatcher, createRouter } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/radix3/dist/index.mjs";
import { defu } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/defu/dist/defu.mjs";
import { ssrRenderAttrs, ssrRenderList, ssrRenderAttr, ssrRenderVNode, ssrRenderComponent, ssrRenderClass, ssrInterpolate, ssrRenderStyle, ssrIncludeBooleanAttr, ssrLooseContain, ssrLooseEqual, ssrRenderSuspense } from "vue/server-renderer";
import "firebase/auth";
import "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/klona/dist/index.mjs";
import "firebase/firestore";
import "firebase/storage";
import "firebase/messaging";
import { useHead as useHead$1, headSymbol } from "C:/Users/ormix/Desktop/CodeProjects/Xcargo/NI/node_modules/@unhead/vue/dist/index.mjs";
if (!globalThis.$fetch) {
  globalThis.$fetch = $fetch.create({
    baseURL: baseURL()
  });
}
if (!("global" in globalThis)) {
  globalThis.global = globalThis;
}
const nuxtLinkDefaults = { "componentName": "NuxtLink" };
const nuxtDefaultErrorValue = null;
const appId = "nuxt-app";
function getNuxtAppCtx(id = appId) {
  return getContext(id, {
    asyncContext: false
  });
}
const NuxtPluginIndicator = "__nuxt_plugin";
function createNuxtApp(options) {
  let hydratingCount = 0;
  const nuxtApp = {
    _id: options.id || appId || "nuxt-app",
    _scope: effectScope(),
    provide: void 0,
    globalName: "nuxt",
    versions: {
      get nuxt() {
        return "3.20.2";
      },
      get vue() {
        return nuxtApp.vueApp.version;
      }
    },
    payload: shallowReactive({
      ...options.ssrContext?.payload || {},
      data: shallowReactive({}),
      state: reactive({}),
      once: /* @__PURE__ */ new Set(),
      _errors: shallowReactive({})
    }),
    static: {
      data: {}
    },
    runWithContext(fn) {
      if (nuxtApp._scope.active && !getCurrentScope()) {
        return nuxtApp._scope.run(() => callWithNuxt(nuxtApp, fn));
      }
      return callWithNuxt(nuxtApp, fn);
    },
    isHydrating: false,
    deferHydration() {
      if (!nuxtApp.isHydrating) {
        return () => {
        };
      }
      hydratingCount++;
      let called = false;
      return () => {
        if (called) {
          return;
        }
        called = true;
        hydratingCount--;
        if (hydratingCount === 0) {
          nuxtApp.isHydrating = false;
          return nuxtApp.callHook("app:suspense:resolve");
        }
      };
    },
    _asyncDataPromises: {},
    _asyncData: shallowReactive({}),
    _payloadRevivers: {},
    ...options
  };
  {
    nuxtApp.payload.serverRendered = true;
  }
  if (nuxtApp.ssrContext) {
    nuxtApp.payload.path = nuxtApp.ssrContext.url;
    nuxtApp.ssrContext.nuxt = nuxtApp;
    nuxtApp.ssrContext.payload = nuxtApp.payload;
    nuxtApp.ssrContext.config = {
      public: nuxtApp.ssrContext.runtimeConfig.public,
      app: nuxtApp.ssrContext.runtimeConfig.app
    };
  }
  nuxtApp.hooks = createHooks();
  nuxtApp.hook = nuxtApp.hooks.hook;
  {
    const contextCaller = async function(hooks, args) {
      for (const hook of hooks) {
        await nuxtApp.runWithContext(() => hook(...args));
      }
    };
    nuxtApp.hooks.callHook = (name, ...args) => nuxtApp.hooks.callHookWith(contextCaller, name, ...args);
  }
  nuxtApp.callHook = nuxtApp.hooks.callHook;
  nuxtApp.provide = (name, value) => {
    const $name = "$" + name;
    defineGetter(nuxtApp, $name, value);
    defineGetter(nuxtApp.vueApp.config.globalProperties, $name, value);
  };
  defineGetter(nuxtApp.vueApp, "$nuxt", nuxtApp);
  defineGetter(nuxtApp.vueApp.config.globalProperties, "$nuxt", nuxtApp);
  const runtimeConfig = options.ssrContext.runtimeConfig;
  nuxtApp.provide("config", runtimeConfig);
  return nuxtApp;
}
function registerPluginHooks(nuxtApp, plugin) {
  if (plugin.hooks) {
    nuxtApp.hooks.addHooks(plugin.hooks);
  }
}
async function applyPlugin(nuxtApp, plugin) {
  if (typeof plugin === "function") {
    const { provide: provide2 } = await nuxtApp.runWithContext(() => plugin(nuxtApp)) || {};
    if (provide2 && typeof provide2 === "object") {
      for (const key in provide2) {
        nuxtApp.provide(key, provide2[key]);
      }
    }
  }
}
async function applyPlugins(nuxtApp, plugins2) {
  const resolvedPlugins = /* @__PURE__ */ new Set();
  const unresolvedPlugins = [];
  const parallels = [];
  let error = void 0;
  let promiseDepth = 0;
  async function executePlugin(plugin) {
    const unresolvedPluginsForThisPlugin = plugin.dependsOn?.filter((name) => plugins2.some((p) => p._name === name) && !resolvedPlugins.has(name)) ?? [];
    if (unresolvedPluginsForThisPlugin.length > 0) {
      unresolvedPlugins.push([new Set(unresolvedPluginsForThisPlugin), plugin]);
    } else {
      const promise = applyPlugin(nuxtApp, plugin).then(async () => {
        if (plugin._name) {
          resolvedPlugins.add(plugin._name);
          await Promise.all(unresolvedPlugins.map(async ([dependsOn, unexecutedPlugin]) => {
            if (dependsOn.has(plugin._name)) {
              dependsOn.delete(plugin._name);
              if (dependsOn.size === 0) {
                promiseDepth++;
                await executePlugin(unexecutedPlugin);
              }
            }
          }));
        }
      }).catch((e) => {
        if (!plugin.parallel && !nuxtApp.payload.error) {
          throw e;
        }
        error ||= e;
      });
      if (plugin.parallel) {
        parallels.push(promise);
      } else {
        await promise;
      }
    }
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    registerPluginHooks(nuxtApp, plugin);
  }
  for (const plugin of plugins2) {
    if (nuxtApp.ssrContext?.islandContext && plugin.env?.islands === false) {
      continue;
    }
    await executePlugin(plugin);
  }
  await Promise.all(parallels);
  if (promiseDepth) {
    for (let i = 0; i < promiseDepth; i++) {
      await Promise.all(parallels);
    }
  }
  if (error) {
    throw nuxtApp.payload.error || error;
  }
}
// @__NO_SIDE_EFFECTS__
function defineNuxtPlugin(plugin) {
  if (typeof plugin === "function") {
    return plugin;
  }
  const _name = plugin._name || plugin.name;
  delete plugin.name;
  return Object.assign(plugin.setup || (() => {
  }), plugin, { [NuxtPluginIndicator]: true, _name });
}
function callWithNuxt(nuxt, setup, args) {
  const fn = () => setup();
  const nuxtAppCtx = getNuxtAppCtx(nuxt._id);
  {
    return nuxt.vueApp.runWithContext(() => nuxtAppCtx.callAsync(nuxt, fn));
  }
}
function tryUseNuxtApp(id) {
  let nuxtAppInstance;
  if (hasInjectionContext()) {
    nuxtAppInstance = getCurrentInstance()?.appContext.app.$nuxt;
  }
  nuxtAppInstance ||= getNuxtAppCtx(id).tryUse();
  return nuxtAppInstance || null;
}
function useNuxtApp(id) {
  const nuxtAppInstance = tryUseNuxtApp(id);
  if (!nuxtAppInstance) {
    {
      throw new Error("[nuxt] instance unavailable");
    }
  }
  return nuxtAppInstance;
}
// @__NO_SIDE_EFFECTS__
function useRuntimeConfig(_event) {
  return useNuxtApp().$config;
}
function defineGetter(obj, key, val) {
  Object.defineProperty(obj, key, { get: () => val });
}
const PageRouteSymbol = Symbol("route");
import.meta.url.replace(/\/app\/.*$/, "/");
const useRouter = () => {
  return useNuxtApp()?.$router;
};
const useRoute = () => {
  if (hasInjectionContext()) {
    return inject(PageRouteSymbol, useNuxtApp()._route);
  }
  return useNuxtApp()._route;
};
// @__NO_SIDE_EFFECTS__
function defineNuxtRouteMiddleware(middleware) {
  return middleware;
}
const isProcessingMiddleware = () => {
  try {
    if (useNuxtApp()._processingMiddleware) {
      return true;
    }
  } catch {
    return false;
  }
  return false;
};
const URL_QUOTE_RE = /"/g;
const navigateTo = (to, options) => {
  to ||= "/";
  const toPath = typeof to === "string" ? to : "path" in to ? resolveRouteObject(to) : useRouter().resolve(to).href;
  const isExternalHost = hasProtocol(toPath, { acceptRelative: true });
  const isExternal = options?.external || isExternalHost;
  if (isExternal) {
    if (!options?.external) {
      throw new Error("Navigating to an external URL is not allowed by default. Use `navigateTo(url, { external: true })`.");
    }
    const { protocol } = new URL(toPath, "http://localhost");
    if (protocol && isScriptProtocol(protocol)) {
      throw new Error(`Cannot navigate to a URL with '${protocol}' protocol.`);
    }
  }
  const inMiddleware = isProcessingMiddleware();
  const router = useRouter();
  const nuxtApp = useNuxtApp();
  {
    if (nuxtApp.ssrContext) {
      const fullPath = typeof to === "string" || isExternal ? toPath : router.resolve(to).fullPath || "/";
      const location2 = isExternal ? toPath : joinURL((/* @__PURE__ */ useRuntimeConfig()).app.baseURL, fullPath);
      const redirect = async function(response) {
        await nuxtApp.callHook("app:redirected");
        const encodedLoc = location2.replace(URL_QUOTE_RE, "%22");
        const encodedHeader = encodeURL(location2, isExternalHost);
        nuxtApp.ssrContext._renderResponse = {
          statusCode: sanitizeStatusCode(options?.redirectCode || 302, 302),
          body: `<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0; url=${encodedLoc}"></head></html>`,
          headers: { location: encodedHeader }
        };
        return response;
      };
      if (!isExternal && inMiddleware) {
        router.afterEach((final) => final.fullPath === fullPath ? redirect(false) : void 0);
        return to;
      }
      return redirect(!inMiddleware ? void 0 : (
        /* abort route navigation */
        false
      ));
    }
  }
  if (isExternal) {
    nuxtApp._scope.stop();
    if (options?.replace) {
      (void 0).replace(toPath);
    } else {
      (void 0).href = toPath;
    }
    if (inMiddleware) {
      if (!nuxtApp.isHydrating) {
        return false;
      }
      return new Promise(() => {
      });
    }
    return Promise.resolve();
  }
  return options?.replace ? router.replace(to) : router.push(to);
};
function resolveRouteObject(to) {
  return withQuery(to.path || "", to.query || {}) + (to.hash || "");
}
function encodeURL(location2, isExternalHost = false) {
  const url = new URL(location2, "http://localhost");
  if (!isExternalHost) {
    return url.pathname + url.search + url.hash;
  }
  if (location2.startsWith("//")) {
    return url.toString().replace(url.protocol, "");
  }
  return url.toString();
}
const NUXT_ERROR_SIGNATURE = "__nuxt_error";
const useError = /* @__NO_SIDE_EFFECTS__ */ () => toRef(useNuxtApp().payload, "error");
const showError = (error) => {
  const nuxtError = createError(error);
  try {
    const error2 = /* @__PURE__ */ useError();
    if (false) ;
    error2.value ||= nuxtError;
  } catch {
    throw nuxtError;
  }
  return nuxtError;
};
const clearError = async (options = {}) => {
  const nuxtApp = useNuxtApp();
  const error = /* @__PURE__ */ useError();
  nuxtApp.callHook("app:error:cleared", options);
  if (options.redirect) {
    await useRouter().replace(options.redirect);
  }
  error.value = nuxtDefaultErrorValue;
};
const isNuxtError = (error) => !!error && typeof error === "object" && NUXT_ERROR_SIGNATURE in error;
const createError = (error) => {
  const nuxtError = createError$1(error);
  Object.defineProperty(nuxtError, NUXT_ERROR_SIGNATURE, {
    value: true,
    configurable: false,
    writable: false
  });
  return nuxtError;
};
const unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:head",
  enforce: "pre",
  setup(nuxtApp) {
    const head = nuxtApp.ssrContext.head;
    nuxtApp.vueApp.use(head);
  }
});
async function getRouteRules(arg) {
  const path = typeof arg === "string" ? arg : arg.path;
  {
    useNuxtApp().ssrContext._preloadManifest = true;
    const _routeRulesMatcher = toRouteMatcher(
      createRouter({ routes: (/* @__PURE__ */ useRuntimeConfig()).nitro.routeRules })
    );
    return defu({}, ..._routeRulesMatcher.matchAll(path).reverse());
  }
}
const manifest_45route_45rule = /* @__PURE__ */ defineNuxtRouteMiddleware(async (to) => {
  {
    return;
  }
});
const globalMiddleware = [
  manifest_45route_45rule
];
function getRouteFromPath(fullPath) {
  const route = fullPath && typeof fullPath === "object" ? fullPath : {};
  if (typeof fullPath === "object") {
    fullPath = stringifyParsedURL({
      pathname: fullPath.path || "",
      search: stringifyQuery(fullPath.query || {}),
      hash: fullPath.hash || ""
    });
  }
  const url = new URL(fullPath.toString(), "http://localhost");
  return {
    path: url.pathname,
    fullPath,
    query: parseQuery(url.search),
    hash: url.hash,
    // stub properties for compat with vue-router
    params: route.params || {},
    name: void 0,
    matched: route.matched || [],
    redirectedFrom: void 0,
    meta: route.meta || {},
    href: fullPath
  };
}
const router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:router",
  enforce: "pre",
  setup(nuxtApp) {
    const initialURL = nuxtApp.ssrContext.url;
    const routes = [];
    const hooks = {
      "navigate:before": [],
      "resolve:before": [],
      "navigate:after": [],
      "error": []
    };
    const registerHook = (hook, guard) => {
      hooks[hook].push(guard);
      return () => hooks[hook].splice(hooks[hook].indexOf(guard), 1);
    };
    const baseURL2 = (/* @__PURE__ */ useRuntimeConfig()).app.baseURL;
    const route = reactive(getRouteFromPath(initialURL));
    async function handleNavigation(url, replace) {
      try {
        const to = getRouteFromPath(url);
        for (const middleware of hooks["navigate:before"]) {
          const result = await middleware(to, route);
          if (result === false || result instanceof Error) {
            return;
          }
          if (typeof result === "string" && result.length) {
            return handleNavigation(result, true);
          }
        }
        for (const handler of hooks["resolve:before"]) {
          await handler(to, route);
        }
        Object.assign(route, to);
        if (false) ;
        for (const middleware of hooks["navigate:after"]) {
          await middleware(to, route);
        }
      } catch (err) {
        for (const handler of hooks.error) {
          await handler(err);
        }
      }
    }
    const currentRoute = computed(() => route);
    const router = {
      currentRoute,
      isReady: () => Promise.resolve(),
      // These options provide a similar API to vue-router but have no effect
      options: {},
      install: () => Promise.resolve(),
      // Navigation
      push: (url) => handleNavigation(url, false),
      replace: (url) => handleNavigation(url, true),
      back: () => (void 0).history.go(-1),
      go: (delta) => (void 0).history.go(delta),
      forward: () => (void 0).history.go(1),
      // Guards
      beforeResolve: (guard) => registerHook("resolve:before", guard),
      beforeEach: (guard) => registerHook("navigate:before", guard),
      afterEach: (guard) => registerHook("navigate:after", guard),
      onError: (handler) => registerHook("error", handler),
      // Routes
      resolve: getRouteFromPath,
      addRoute: (parentName, route2) => {
        routes.push(route2);
      },
      getRoutes: () => routes,
      hasRoute: (name) => routes.some((route2) => route2.name === name),
      removeRoute: (name) => {
        const index = routes.findIndex((route2) => route2.name === name);
        if (index !== -1) {
          routes.splice(index, 1);
        }
      }
    };
    nuxtApp.vueApp.component("RouterLink", defineComponent({
      functional: true,
      props: {
        to: {
          type: String,
          required: true
        },
        custom: Boolean,
        replace: Boolean,
        // Not implemented
        activeClass: String,
        exactActiveClass: String,
        ariaCurrentValue: String
      },
      setup: (props, { slots }) => {
        const navigate = () => handleNavigation(props.to, props.replace);
        return () => {
          const route2 = router.resolve(props.to);
          return props.custom ? slots.default?.({ href: props.to, navigate, route: route2 }) : h("a", { href: props.to, onClick: (e) => {
            e.preventDefault();
            return navigate();
          } }, slots);
        };
      }
    }));
    nuxtApp._route = route;
    nuxtApp._middleware ||= {
      global: [],
      named: {}
    };
    const initialLayout = nuxtApp.payload.state._layout;
    nuxtApp.hooks.hookOnce("app:created", async () => {
      router.beforeEach(async (to, from) => {
        to.meta = reactive(to.meta || {});
        if (nuxtApp.isHydrating && initialLayout && !isReadonly(to.meta.layout)) {
          to.meta.layout = initialLayout;
        }
        nuxtApp._processingMiddleware = true;
        if (!nuxtApp.ssrContext?.islandContext) {
          const middlewareEntries = /* @__PURE__ */ new Set([...globalMiddleware, ...nuxtApp._middleware.global]);
          {
            const routeRules = await nuxtApp.runWithContext(() => getRouteRules({ path: to.path }));
            if (routeRules.appMiddleware) {
              for (const key in routeRules.appMiddleware) {
                const guard = nuxtApp._middleware.named[key];
                if (!guard) {
                  return;
                }
                if (routeRules.appMiddleware[key]) {
                  middlewareEntries.add(guard);
                } else {
                  middlewareEntries.delete(guard);
                }
              }
            }
          }
          for (const middleware of middlewareEntries) {
            const result = await nuxtApp.runWithContext(() => middleware(to, from));
            {
              if (result === false || result instanceof Error) {
                const error = result || createError$1({
                  statusCode: 404,
                  statusMessage: `Page Not Found: ${initialURL}`,
                  data: {
                    path: initialURL
                  }
                });
                delete nuxtApp._processingMiddleware;
                return nuxtApp.runWithContext(() => showError(error));
              }
            }
            if (result === true) {
              continue;
            }
            if (result || result === false) {
              return result;
            }
          }
        }
      });
      router.afterEach(() => {
        delete nuxtApp._processingMiddleware;
      });
      await router.replace(initialURL);
      if (!isEqual(route.fullPath, initialURL)) {
        await nuxtApp.runWithContext(() => navigateTo(route.fullPath));
      }
    });
    return {
      provide: {
        route,
        router
      }
    };
  }
});
function injectHead(nuxtApp) {
  const nuxt = nuxtApp || tryUseNuxtApp();
  return nuxt?.ssrContext?.head || nuxt?.runWithContext(() => {
    if (hasInjectionContext()) {
      return inject(headSymbol);
    }
  });
}
function useHead(input, options = {}) {
  const head = injectHead(options.nuxt);
  if (head) {
    return useHead$1(input, { head, ...options });
  }
}
function definePayloadReducer(name, reduce) {
  {
    useNuxtApp().ssrContext._payloadReducers[name] = reduce;
  }
}
const reducers = [
  ["NuxtError", (data) => isNuxtError(data) && data.toJSON()],
  ["EmptyShallowRef", (data) => isRef(data) && isShallow(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["EmptyRef", (data) => isRef(data) && !data.value && (typeof data.value === "bigint" ? "0n" : JSON.stringify(data.value) || "_")],
  ["ShallowRef", (data) => isRef(data) && isShallow(data) && data.value],
  ["ShallowReactive", (data) => isReactive(data) && isShallow(data) && toRaw(data)],
  ["Ref", (data) => isRef(data) && data.value],
  ["Reactive", (data) => isReactive(data) && toRaw(data)]
];
const revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:revive-payload:server",
  setup() {
    for (const [reducer, fn] of reducers) {
      definePayloadReducer(reducer, fn);
    }
  }
});
const components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4 = /* @__PURE__ */ defineNuxtPlugin({
  name: "nuxt:global-components"
});
const plugins = [
  unhead_k2P3m_ZDyjlr2mMYnoDPwavjsDN8hBlk9cFai0bbopU,
  router_DclsWNDeVV7SyG4lslgLnjbQUK1ws8wgf2FHaAbo7Cw,
  revive_payload_server_MVtmlZaQpj6ApFmshWfUWl5PehCebzaBf2NuRMiIbms,
  components_plugin_z4hgvsiddfKkfXTP6M8M4zG5Cb7sGnDhcryKVM45Di4
];
const _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$k = {
  __name: "RocketLaunch",
  __ssrInlineRender: true,
  emits: ["loaded"],
  setup(__props, { emit: __emit }) {
    const isAnimationDone = ref(false);
    ref(0);
    return (_ctx, _push, _parent, _attrs) => {
      if (!isAnimationDone.value) {
        _push(`<div${ssrRenderAttrs(mergeProps({ class: "launch-screen" }, _attrs))} data-v-86a44f2b><div class="artboard" data-v-86a44f2b><div class="stars" data-v-86a44f2b><div class="star" data-v-86a44f2b></div><div class="star" data-v-86a44f2b></div><div class="star" data-v-86a44f2b></div></div><div class="stars2" data-v-86a44f2b><!--[-->`);
        ssrRenderList(30, (n) => {
          _push(`<div class="shootingstar" data-v-86a44f2b></div>`);
        });
        _push(`<!--]--></div><div class="fire" data-v-86a44f2b></div><div class="takeoff" data-v-86a44f2b></div><div class="smoke" data-v-86a44f2b><!--[-->`);
        ssrRenderList(12, (n) => {
          _push(`<div class="smoke-bubble"${ssrRenderAttr("id", `sb${n}`)} data-v-86a44f2b></div>`);
        });
        _push(`<!--]--></div><img${ssrRenderAttr("src", "/Moon.webp")} class="moon-bg" alt="Moon" data-v-86a44f2b><svg id="rocket" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.1 259.1" enable-background="new 0 0 154.1 259.1" data-v-86a44f2b>`);
        ssrRenderVNode(_push, createVNode(resolveDynamicComponent("style"), null, {
          default: withCtx((_, _push2, _parent2, _scopeId) => {
            if (_push2) {
              _push2(` .st0{fill:#4F46E5;} .st1{fill:#E8E6EF;} .st2{filter:url(#Adobe_OpacityMaskFilter);} .st3{filter:url(#Adobe_OpacityMaskFilter_1_);} .st4{mask:url(#SVGID_1_);fill:url(#SVGID_2_);} .st5{opacity:0.61;fill:#CFE0E2;} .st6{opacity:0.7;fill:#012226;} .st7{filter:url(#Adobe_OpacityMaskFilter_2_);} .st8{filter:url(#Adobe_OpacityMaskFilter_3_);} .st9{mask:url(#SVGID_3_);fill:url(#SVGID_4_);} .st10{fill:url(#SVGID_5_);} .st11{fill:#063A3A;} .st12{fill:#312E81;} `);
            } else {
              return [
                createTextVNode(" .st0{fill:#4F46E5;} .st1{fill:#E8E6EF;} .st2{filter:url(#Adobe_OpacityMaskFilter);} .st3{filter:url(#Adobe_OpacityMaskFilter_1_);} .st4{mask:url(#SVGID_1_);fill:url(#SVGID_2_);} .st5{opacity:0.61;fill:#CFE0E2;} .st6{opacity:0.7;fill:#012226;} .st7{filter:url(#Adobe_OpacityMaskFilter_2_);} .st8{filter:url(#Adobe_OpacityMaskFilter_3_);} .st9{mask:url(#SVGID_3_);fill:url(#SVGID_4_);} .st10{fill:url(#SVGID_5_);} .st11{fill:#063A3A;} .st12{fill:#312E81;} ")
              ];
            }
          }),
          _: 1
        }), _parent);
        _push(`<path class="st0" d="M97.4 236.1c0 2.6-5.2 4.7-11.7 4.7H70.3c-6.4 0-11.7-2.1-11.7-4.7v-4.5c0-2.6 5.2-4.7 11.7-4.7h15.4c6.4 0 11.7 2.1 11.7 4.7v4.5zM37.1 137.4s-28 19.2-28 32v59.3l30-30-2-61.3zM117.5 137.4s28 19.2 28 32v59.3l-30-30 2-61.3z" data-v-86a44f2b></path><path class="st1" d="M29.6 140.5c.3 36.4 8.3 69.6 21.3 95.3 8.6-2.8 17.7-4.4 27.2-4.4 9.5-.1 18.6 1.3 27.3 4 12.5-25.9 19.9-59.3 19.6-95.6-.6-57.8-20.4-107.7-48.8-132-28.1 24.8-47.1 75-46.6 132.7z" data-v-86a44f2b></path><defs data-v-86a44f2b><filter id="Adobe_OpacityMaskFilter" filterUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" data-v-86a44f2b><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-86a44f2b></feFlood><feBlend in="SourceGraphic" in2="back" data-v-86a44f2b></feBlend></filter></defs><mask maskUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" id="SVGID_1_" data-v-86a44f2b><g class="st2" data-v-86a44f2b><defs data-v-86a44f2b><filter id="Adobe_OpacityMaskFilter_1_" filterUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" data-v-86a44f2b><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-86a44f2b></feFlood><feBlend in="SourceGraphic" in2="back" data-v-86a44f2b></feBlend></filter></defs><linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="719.881" y1="-755.102" x2="616.624" y2="-640.129" gradientTransform="rotate(-41.77 1486.062 530.152)" data-v-86a44f2b><stop offset="0" stop-color="gray" data-v-86a44f2b></stop><stop offset=".145" stop-color="#7A7A7A" data-v-86a44f2b></stop><stop offset=".338" stop-color="#696969" data-v-86a44f2b></stop><stop offset=".556" stop-color="#4E4E4E" data-v-86a44f2b></stop><stop offset=".792" stop-color="#282828" data-v-86a44f2b></stop><stop offset="1" data-v-86a44f2b></stop></linearGradient><path class="st4" d="M60.2 233.7l12-1.9c-18.3-108.4-8.6-169-8.6-169l-11.4.4c-22 76.5 8 170.5 8 170.5z" data-v-86a44f2b></path></g></mask><path class="st5" d="M60.2 233.7l12-1.9c-18.3-108.4-8.6-169-8.6-169l-11.4.4c-22 76.5 8 170.5 8 170.5z" data-v-86a44f2b></path><path class="st6" d="M41.5 64l-2.1 6.7s40.7-5 75.7.1l-3.2-7.4c-.1 0-47.1-5.4-70.4.6z" data-v-86a44f2b></path><path class="st0" d="M41.5 64c11.4-.9 23.2-1.4 35.2-1.5 12-.1 23.7.2 35.2.9-8.6-23.7-21-43-35.6-55.6C61.7 20.6 49.7 40.2 41.5 64z" data-v-86a44f2b></path><defs data-v-86a44f2b><filter id="Adobe_OpacityMaskFilter_2_" filterUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" data-v-86a44f2b><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-86a44f2b></feFlood><feBlend in="SourceGraphic" in2="back" data-v-86a44f2b></feBlend></filter></defs><mask maskUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" id="SVGID_3_" data-v-86a44f2b><g class="st7" data-v-86a44f2b><defs data-v-86a44f2b><filter id="Adobe_OpacityMaskFilter_3_" filterUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" data-v-86a44f2b><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-86a44f2b></feFlood><feBlend in="SourceGraphic" in2="back" data-v-86a44f2b></feBlend></filter></defs><linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="739.606" y1="-771.977" x2="769.629" y2="-799.072" gradientTransform="rotate(-41.77 1486.062 530.152)" data-v-86a44f2b><stop offset="0" stop-color="gray" data-v-86a44f2b></stop><stop offset=".145" stop-color="#7A7A7A" data-v-86a44f2b></stop><stop offset=".338" stop-color="#696969" data-v-86a44f2b></stop><stop offset=".556" stop-color="#4E4E4E" data-v-86a44f2b></stop><stop offset=".792" stop-color="#282828" data-v-86a44f2b></stop><stop offset="1" data-v-86a44f2b></stop></linearGradient><path class="st9" d="M63.6 62.7C65.7 35.3 76.2 7.8 76.2 7.8c-18.9 24.2-24 55.3-24 55.3l11.4-.4z" data-v-86a44f2b></path></g></mask><linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="739.606" y1="-771.977" x2="769.629" y2="-799.072" gradientTransform="rotate(-41.77 1486.062 530.152)" data-v-86a44f2b><stop offset="0" stop-color="#EAEFEE" data-v-86a44f2b></stop><stop offset=".45" stop-color="#F0F3F3" data-v-86a44f2b></stop><stop offset="1" stop-color="#FFF" data-v-86a44f2b></stop></linearGradient><path class="st10" d="M63.6 62.7C65.7 35.3 76.2 7.8 76.2 7.8c-18.9 24.2-24 55.3-24 55.3l11.4-.4z" data-v-86a44f2b></path><path class="st11" d="M75.9 78.3c-14.8.1-26.7 12.2-26.6 27 .1 14.8 12.2 26.7 27 26.6 14.8-.1 26.7-12.2 26.5-27-.1-14.9-12.2-26.8-26.9-26.6z" data-v-86a44f2b></path><path class="st12" d="M75.9 86.4c-10.3.1-18.5 8.5-18.5 18.8.1 10.3 8.5 18.5 18.8 18.4 10.3-.1 18.5-8.5 18.4-18.8 0-10.2-8.4-18.5-18.7-18.4z" data-v-86a44f2b></path><path class="st0" d="M68.6 122.1c2.3 1 4.9 1.6 7.7 1.6 10.3-.1 18.5-8.5 18.4-18.8 0-3.6-1.1-7-3-9.9-.3.3-.7.5-1 .8-8.1 6.6-18.2 15.6-22.1 26.3z" data-v-86a44f2b></path><path class="st11" d="M79 139.9c-11.1.1-20 9.2-19.9 20.3.1 11.1 9.2 20 20.3 19.9 11.1-.1 20-9.2 19.9-20.3-.1-11-9.2-20-20.3-19.9z" data-v-86a44f2b></path><path class="st12" d="M79.1 146.1c-7.7.1-13.9 6.4-13.8 14.1.1 7.7 6.4 13.9 14.1 13.8 7.7-.1 13.9-6.4 13.8-14.1-.1-7.7-6.4-13.9-14.1-13.8z" data-v-86a44f2b></path><path class="st0" d="M73.5 172.8c1.8.8 3.7 1.2 5.8 1.2 7.7-.1 13.9-6.4 13.8-14.1 0-2.7-.8-5.3-2.2-7.4-.3.2-.5.4-.8.6-6 4.9-13.6 11.7-16.6 19.7z" data-v-86a44f2b></path><path class="st11" d="M81.5 187.9c-7.8.1-14.1 6.5-14 14.3.1 7.8 6.5 14.1 14.3 14.1 7.8-.1 14.1-6.5 14-14.3-.1-7.8-6.5-14.2-14.3-14.1z" data-v-86a44f2b></path><path class="st12" d="M81.5 192.2c-5.4 0-9.8 4.5-9.8 9.9s4.5 9.8 9.9 9.8 9.8-4.5 9.8-9.9-4.5-9.8-9.9-9.8z" data-v-86a44f2b></path><path class="st0" d="M77.6 211.1c1.2.5 2.6.9 4.1.8 5.4 0 9.8-4.5 9.8-9.9 0-1.9-.6-3.7-1.6-5.2-.2.1-.4.3-.5.4-4.3 3.5-9.7 8.3-11.8 13.9z" data-v-86a44f2b></path></svg></div></div>`);
      } else {
        _push(`<!---->`);
      }
    };
  }
};
const _sfc_setup$k = _sfc_main$k.setup;
_sfc_main$k.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RocketLaunch.vue");
  return _sfc_setup$k ? _sfc_setup$k(props, ctx) : void 0;
};
const __nuxt_component_0 = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["__scopeId", "data-v-86a44f2b"]]);
defineComponent({
  name: "ServerPlaceholder",
  render() {
    return createElementBlock("div");
  }
});
const clientOnlySymbol = Symbol.for("nuxt:client-only");
defineComponent({
  name: "ClientOnly",
  inheritAttrs: false,
  props: ["fallback", "placeholder", "placeholderTag", "fallbackTag"],
  ...false,
  setup(props, { slots, attrs }) {
    const mounted = shallowRef(false);
    const vm = getCurrentInstance();
    if (vm) {
      vm._nuxtClientOnly = true;
    }
    provide(clientOnlySymbol, true);
    return () => {
      if (mounted.value) {
        const vnodes = slots.default?.();
        if (vnodes && vnodes.length === 1) {
          return [cloneVNode(vnodes[0], attrs)];
        }
        return vnodes;
      }
      const slot = slots.fallback || slots.placeholder;
      if (slot) {
        return h(slot);
      }
      const fallbackStr = props.fallback || props.placeholder || "";
      const fallbackTag = props.fallbackTag || props.placeholderTag || "span";
      return createElementBlock(fallbackTag, attrs, fallbackStr);
    };
  }
});
const useStateKeyPrefix = "$s";
function useState(...args) {
  const autoKey = typeof args[args.length - 1] === "string" ? args.pop() : void 0;
  if (typeof args[0] !== "string") {
    args.unshift(autoKey);
  }
  const [_key, init] = args;
  if (!_key || typeof _key !== "string") {
    throw new TypeError("[nuxt] [useState] key must be a string: " + _key);
  }
  if (init !== void 0 && typeof init !== "function") {
    throw new Error("[nuxt] [useState] init must be a function: " + init);
  }
  const key = useStateKeyPrefix + _key;
  const nuxtApp = useNuxtApp();
  const state = toRef(nuxtApp.payload.state, key);
  if (state.value === void 0 && init) {
    const initialValue = init();
    if (isRef(initialValue)) {
      nuxtApp.payload.state[key] = initialValue;
      return initialValue;
    }
    state.value = initialValue;
  }
  return state;
}
const ru = {
  nav: {
    home: "Главная",
    services: "Услуги",
    about: "О нас",
    contact: "Контакты",
    admin: "Админ",
    login: "Войти",
    logout: "Выйти",
    profile: "Личный кабинет"
  },
  hero: {
    title: "ДОСТАВКА ГРУЗОВ",
    subtitle: "Из Китая в Казахстан: Быстро. Надежно. Для всех.",
    desc: "Полный комплекс логистических услуг — от одной посылки до контейнера. Работаем с физическими и юридическими лицами.",
    track_placeholder: "Введите трек-номер",
    track_btn: "Отследить",
    or: "Или",
    whatsapp: "Написать в WhatsApp",
    calc_btn: "Рассчитать стоимость",
    track_btn_hero: "🔍 Отследить",
    whatsapp_btn: "📱 WhatsApp",
    install_btn: "Установить"
  },
  home: {
    b2c: {
      title: "👤 Для частных лиц (B2C)",
      items: [
        "Покупайте товары в Китае без границ.",
        "Доставка с Taobao, 1688, Alibaba.",
        "Перевозка мебели, техники.",
        "Консолидация посылок."
      ]
    },
    b2b: {
      title: "🏢 Для бизнеса (B2B)",
      items: [
        "Поиск поставщиков.",
        "Карго доставка и официальный ввоз.",
        "Полный пакет документов.",
        "Доставка сборных грузов (LCL/FCL)."
      ]
    },
    why: {
      title: "Почему мы?",
      items: [
        "Сроки: Автодоставка 10–15 дней.",
        "100% Сохранность: Страхование включено.",
        "Склады: Гуанчжоу/Иу/Алматы.",
        "Прозрачные тарифы: Без скрытых доплат."
      ]
    },
    steps: {
      title: "Как это работает?",
      items: [
        "Заявка / Адрес склада.",
        "Отправка и проверка.",
        "Доставка и таможня.",
        "Получение (Склад/Дверь)."
      ]
    }
  },
  features: {
    fast_delivery: "Быстрая доставка",
    fast_delivery_desc: "Оптимальные маршруты для сокращения времени в пути.",
    tracking: "Отслеживание",
    tracking_desc: "Всегда знайте, где находится ваш груз.",
    guarantee: "Гарантия сохранности",
    guarantee_desc: "Полное страхование и ответственность за груз.",
    support: "Поддержка",
    support_desc: "На связи с вами на каждом этапе."
  },
  services_page: {
    title: "НАШИ УСЛУГИ",
    subtitle: "📦 Решаем любые задачи с Китаем: от выкупа с Taobao до официального импорта контейнеров.",
    cards: [
      {
        icon: "🚛",
        title: 'Доставка "Под ключ"',
        desc: "Перевозка любых грузов: авто, ж/д и авиа. Работаем со сборными грузами (от 1 кг) и целыми контейнерами."
      },
      {
        icon: "🛍️",
        title: "Выкуп и Поиск товара",
        desc: "<strong>Для себя:</strong> выкупим с Taobao, 1688.<br><strong>Для бизнеса:</strong> найдем поставщиков и проведем оплату."
      },
      {
        icon: "📦",
        title: "Консолидация и Хранение",
        desc: "Бесплатно примем посылки, проверим, упакуем и объединим в один груз для экономии на доставке."
      },
      {
        icon: "📋",
        title: "Таможенное оформление",
        desc: '<strong>Для бизнеса:</strong> полный пакет документов, сертификация и "белая" растаможка. Никаких рисков.'
      },
      {
        icon: "🔍",
        title: "Проверка качества",
        desc: "Проверим товар на брак и соответствие заявленному. Предоставим фото/видео отчет перед отправкой."
      },
      {
        icon: "🤝",
        title: "Финансовая логистика",
        desc: "Поможем безопасно оплатить товар поставщику в юанях или долларах. Работаем по договору."
      }
    ],
    cta: {
      title: "Хотите рассчитать стоимость доставки?",
      text: "Мы на связи 24/7. Отправьте нам параметры груза или ссылку на товар — ответим в течение 15 минут.",
      whatsapp: "📱 WhatsApp",
      login: "👤 Войти"
    }
  },
  about_page: {
    title: "О КОМПАНИИ",
    subtitle: "Делаем Китай ближе. Для бизнеса и для жизни. 🚚",
    description: "Мы — логистический оператор, который уже более 5 лет стирает границы между Китаем и Казахстаном. Надежный партнер для сотен предпринимателей и тысяч частных клиентов.",
    stats: {
      years: "Лет",
      parcels: "Посылок",
      resp: "Ответственность"
    },
    principles: [
      { title: "💎 Прозрачность", desc: "Никаких скрытых доплат. Точная стоимость за кг/куб до отправки. Вес не округляем." },
      { title: "🤝 Забота (B2B + B2C)", desc: "Личный кабинет, отслеживание и поддержка для каждого клиента, от чехла до контейнера." },
      { title: "🛡️ Безопасность", desc: "Тщательная проверка упаковки на складе и страхование грузов. Ваши деньги под защитой." },
      { title: "🚀 Технологии", desc: "Удобная IT-платформа. Управление заказами онлайн и статусы в реальном времени." }
    ],
    why_bottom: [
      "✅ Собственные склады",
      "✅ Скорость (Авто/ЖД)",
      "✅ Помощь с выкупом"
    ]
  },
  contacts_page: {
    title: "КОНТАКТЫ",
    subtitle: "Свяжитесь с нами любым удобным способом",
    address_title: "Наш Адрес",
    address: "г. Алматы, ул. Алтынсарина, 26",
    phone_title: "Телефоны",
    phone_sub: "(Whatsapp / Telegram)",
    schedule_title: "График работы",
    schedule_days: "Пн-Сб: 09:00 - 18:00",
    schedule_off: "Воскресенье - Выходной",
    whatsapp_btn: "Написать в WhatsApp",
    instagram_btn: "Instagram"
  },
  cta: {
    questions: "Остались вопросы?",
    desc: "Мы всегда рады помочь! Посетите наш офис или напишите нам."
  },
  search: {
    title: "Поиск по трек-номеру",
    placeholder: "Введите трек-номер",
    button: "Искать",
    loading: "Поиск...",
    results: "Результаты поиска:",
    no_results: "Ничего не найдено",
    desc: "Описание",
    sent: "Отправлено",
    arrived: "Прибыло",
    batch: "Партия"
  },
  status: {
    pending: "Ожидает",
    in_transit: "В пути",
    arrived: "На складе",
    delivered: "Доставлено",
    lost: "Утерян"
  },
  dashboard: {
    welcome: "Добро пожаловать,",
    admin_panel: "Админ-панель",
    add_track: "Добавить трек-номер",
    placeholder_track: "Введите трек-номер",
    placeholder_desc: "Описание (например: плюшевый медведь) - необязательно",
    add_btn: "Добавить",
    adding: "Добавление...",
    my_parcels: "Мои посылки",
    telegram_app: "Войти через Telegram",
    telegram_wait: "Ожидание подтверждения...",
    admin: "Войти в админ",
    error_cancel: "Вход отменен пользователем",
    error_generic: "Ошибка при входе. Проверьте подключение.",
    error_telegram: "Ошибка автоматического входа через Telegram",
    error_timeout: "Время ожидания истекло. Попробуйте снова.",
    error_open: "Ошибка при открытии Telegram. Попробуйте снова.",
    email: "Войти через Email",
    loading: "Загрузка...",
    no_parcels: "У вас пока нет трек-номеров.",
    added: "Добавлено:",
    confirm_delete: "Вы уверены? Это действие нельзя отменить.",
    enable_notifications: "Включить уведомления",
    notifications_enabled: "Уведомления включены",
    notifications_error: "Ошибка включения уведомлений",
    upload_complete: "Загрузка завершена!\nОбновлено: {updated}\nСоздано: {created}\nОшибки: {errors}",
    error_upload: "Ошибка обработки файла.",
    sync_btn: "Синхр. Google Sheets",
    syncing: "Синхронизация..."
  },
  footer: {
    rights: "Все права защищены.",
    links: "Ссылки",
    contacts: "Контакты",
    privacy: "Политика конфиденциальности",
    phone: "Телефон"
  },
  admin: {
    title: "Панель администратора",
    upload_title: "Загрузка данных",
    uploading: "Загрузка...",
    upload_china: "Приход Китай (XLSX)",
    upload_received: "Приход (XLSX)",
    format_info: 'Формат: XLSX с колонкой "Track Number"',
    all_parcels: "Все посылки",
    error_access: "Ошибка доступа:",
    error_access_desc: "У вас нет прав администратора",
    bulk_selected: "Выбрано",
    bulk_of: "из",
    bulk_status_placeholder: "Изменить статус для выбранных...",
    bulk_apply: "Применить",
    bulk_clear: "Снять выделение",
    loading_data: "Загрузка данных...",
    confirm_bulk: 'Вы уверены, что хотите изменить статус для {n} треков на "{status}"?',
    confirm_archive: "Архивировать все ВЫДАННЫЕ посылки?",
    confirm_delete: "Удалить трек?",
    archiving: "Архивация...",
    archive_btn: "🗄️ В архив выданные",
    sync_btn: "Синхронизировать Google таблицу",
    syncing: "Синхронизация...",
    search_placeholder: "Поиск по трек-номеру",
    rows_per_page: "Строк на странице:",
    prev: "Назад",
    next: "Вперед",
    table: {
      track: "Трек-номер",
      desc: "Описание",
      email: "Email",
      name: "Имя",
      status: "Статус",
      date: "Дата",
      user: "Польз.",
      actions: "Действия"
    },
    delete: "Удалить"
  },
  login: {
    title: "Вход в систему",
    google: "Войти через Google",
    google_loading: "Вход...",
    or_telegram: "Или через Telegram",
    telegram_app: "Войти через Telegram",
    telegram_wait: "Ожидание подтверждения...",
    admin: "Вход для админа",
    error_cancel: "Вход отменен пользователем",
    error_generic: "Ошибка при входе. Проверьте подключение.",
    error_telegram: "Ошибка автоматического входа через Telegram",
    error_timeout: "Время ожидания истекло. Попробуйте снова.",
    error_open: "Ошибка при открытии Telegram. Попробуйте снова.",
    email: "Войти через Email"
  },
  auth: {
    email_title: "Вход через Email",
    name_label: "Ваше Имя",
    name_placeholder: "Иван Иванов",
    email_label: "Email",
    avatar_label: "Фото профиля (по желанию)",
    choose_photo: "Выбрать",
    send_link: "Получить ссылку для входа",
    back_to_login: "Назад",
    verifying: "Проверка ссылки...",
    sent_title: "Проверьте почту",
    sent_desc: "Мы отправили магическую ссылку на",
    confirm_email_title: "Подтвердите Email",
    confirm_email_desc: "В целях безопасности, пожалуйста, введите ваш email для завершения входа.",
    error_email_mismatch: "Email не совпадает. Попробуйте еще раз.",
    open_mail_app: "Открыть почту",
    try_different_email: "Ввести другой email"
  },
  privacy_page: {
    title: "ПОЛИТИКА КОНФИДЕНЦИАЛЬНОСТИ",
    subtitle: "Последнее обновление: {date}",
    sections: [
      { title: "1. Введение", text: "Мы уважаем вашу конфиденциальность и стремимся защитить ваши личные данные. Эта Политика конфиденциальности объясняет, как мы собираем, используем и защищаем информацию при использовании мобильного приложения Xcargo. Использование приложения означает ваше согласие с условиями данной политики." },
      {
        title: "2. Какие данные мы собираем",
        text: "Для функционирования приложения и предоставления услуг мы собираем следующие типы данных:",
        list: [
          "<strong>Идентификационные данные:</strong> При входе через сервисы Google Authentication или Telegram мы получаем доступ к вашему адресу электронной почты, номеру телефона (при использовании Telegram) и публичному имени профиля/фотографии.",
          "<strong>Данные о грузах:</strong> Информация о ваших отправлениях, трек-номерах и адресах доставки."
        ]
      },
      {
        title: "3. Цели использования данных",
        text: "Ваши данные используются для:",
        list: [
          "Регистрации и предоставления доступа к личному кабинету.",
          "Обработки заказов и отслеживания статуса ваших грузов.",
          "Обеспечения связи с вами по вопросам доставки (через уведомления, звонки или мессенджеры).",
          "Улучшения качества работы сервиса и исправления технических ошибок."
        ]
      },
      { title: "4. Передача данных третьим лицам", text: "Мы не продаем ваши данные. Однако для выполнения услуг доставки мы можем передавать необходимый минимум информации (например, имя и номер телефона) нашим логистическим партнерам, курьерам или складам исключительно для целей доставки вашего груза." },
      { title: "5. Безопасность", text: "Мы принимаем разумные технические и организационные меры для защиты вашей информации от несанкционированного доступа. Пароли и токены доступа обрабатываются и хранятся безопасно с использованием сертифицированных сервисов Google Firebase." },
      { title: "6. Хранение и удаление данных", text: 'Мы храним ваши данные до тех пор, пока ваш аккаунт активен или пока это необходимо для предоставления услуг. Вы имеете право в любой момент запросить удаление вашего аккаунта и всех связанных с ним персональных данных. Для этого воспользуйтесь функцией "Удалить аккаунт" в настройках приложения или напишите нам запрос.' },
      { title: "7. Изменения в политике конфиденциальности", text: "Мы можем время от времени обновлять нашу Политику конфиденциальности. Мы уведомим вас о любых изменениях, опубликовав новую Политику в этом разделе приложения." },
      { title: "8. Контакты", text: "Если у вас есть вопросы или предложения относительно нашей Политики конфиденциальности, пожалуйста, свяжитесь с нами." }
    ],
    whatsapp: "📱 Написать в WhatsApp",
    back: "← Вернуться на главную"
  },
  auth_pages: {
    login: {
      title: "ВХОД",
      subtitle: "Выберите способ авторизации",
      google: "Войти через Google",
      telegram: "Войти через Telegram",
      telegram_confirm: "Подтвердите в Telegram...",
      email_btn: "Войти по Email",
      loading: "Загрузка...",
      error_user_cancel: "Вход отменен пользователем",
      error_generic: "Ошибка входа. Попробуйте снова.",
      error_timeout: "Время ожидания истекло",
      error_tg_open: "Ошибка при открытии Telegram. Попробуйте снова."
    },
    email: {
      title: "EMAIL ВХОД",
      subtitle: "Введите почту для получения ссылки",
      sent_title: "Ссылка отправлена!",
      sent_text_1: "Мы отправили ссылку для входа на",
      sent_text_2: "Пожалуйста, проверьте почту.",
      open_mail: "Открыть почту",
      use_other_mail: "Использовать другую почту",
      name_label: "Ваше Имя",
      name_placeholder: "Иван Иванов",
      email_label: "Email",
      email_placeholder: "name@example.com",
      avatar_label: "Фото профиля",
      upload_btn: "Выбрать фото",
      hint: "JPG, PNG или GIF (макс. 5MB)",
      submit: "Отправить ссылку",
      submit_loading: "Отправка...",
      back: "← Вернуться ко входу",
      error_file_size: "Файл слишком большой (>5MB)"
    },
    finish: {
      processing_title: "Проверка входа...",
      processing_desc: "Завершаем авторизацию",
      confirm_title: "Подтвердите Email",
      confirm_desc: "Пожалуйста, введите ваш email для завершения входа.",
      confirm_btn: "Подтвердить",
      error_title: "Ошибка",
      retry: "Попробовать снова",
      error_invalid_link: "Неверная ссылка для входа.",
      error_invalid_email: "Неверный email. Попробуйте еще раз."
    }
  }
};
const en = {
  nav: {
    home: "Home",
    services: "Services",
    about: "About",
    contact: "Contact",
    admin: "Admin",
    login: "Login",
    logout: "Logout",
    profile: "Profile"
  },
  hero: {
    title: "CARGO DELIVERY",
    subtitle: "From China to Kazakhstan: Fast. Reliable. For everyone.",
    desc: "Full range of logistics services — from a single parcel to a container. Working with individuals and businesses.",
    track_placeholder: "Enter tracking number",
    track_btn: "Track",
    or: "Or",
    whatsapp: "Chat on WhatsApp",
    calc_btn: "Calculate Cost",
    track_btn_hero: "🔍 Track",
    whatsapp_btn: "📱 WhatsApp",
    install_btn: "Install App"
  },
  home: {
    b2c: {
      title: "👤 For Individuals (B2C)",
      items: [
        "Shop in China without borders.",
        "Delivery from Taobao, 1688, Alibaba.",
        "Furniture and electronics shipping.",
        "Parcel consolidation."
      ]
    },
    b2b: {
      title: "🏢 For Business (B2B)",
      items: [
        "Supplier sourcing.",
        "Cargo delivery and official import.",
        "Full documentation package.",
        "LCL/FCL consolidated cargo."
      ]
    },
    why: {
      title: "Why Us?",
      items: [
        "Timing: Auto-delivery 10–15 days.",
        "100% Safety: Insurance included.",
        "Warehouses: Guangzhou/Yiwu/Almaty.",
        "Transparent rates: No hidden fees."
      ]
    },
    steps: {
      title: "How it Works?",
      items: [
        "Application / Warehouse Address.",
        "Shipping and Inspection.",
        "Delivery and Customs.",
        "Receipt (Warehouse/Door)."
      ]
    }
  },
  features: {
    fast_delivery: "Fast Delivery",
    fast_delivery_desc: "Optimal routes to reduce transit time.",
    tracking: "Tracking",
    tracking_desc: "Always know where your cargo is.",
    guarantee: "Safety Guarantee",
    guarantee_desc: "Full insurance and responsibility for cargo.",
    support: "Support",
    support_desc: "In touch with you at every stage."
  },
  services_page: {
    title: "OUR SERVICES",
    subtitle: "📦 Solving any tasks with China: from Taobao purchasing to official container import.",
    cards: [
      {
        icon: "🚛",
        title: "Turnkey Delivery",
        desc: "Transporting any cargo: auto, rail, air. Working with consolidated cargo (from 1kg) and full containers."
      },
      {
        icon: "🛍️",
        title: "Purchasing & Sourcing",
        desc: "<strong>For you:</strong> purchasing from Taobao, 1688.<br><strong>For business:</strong> finding suppliers and handling payments."
      },
      {
        icon: "📦",
        title: "Consolidation & Storage",
        desc: "Free receipt, inspection, packing, and consolidation of parcels to save on shipping."
      },
      {
        icon: "📋",
        title: "Customs Clearance",
        desc: '<strong>For business:</strong> full documents, certification, and "white" clearance. No risks.'
      },
      {
        icon: "🔍",
        title: "Quality Check",
        desc: "Checking goods for defects and compliance. Photo/video report before shipping."
      },
      {
        icon: "🤝",
        title: "Financial Logistics",
        desc: "Safe payment to suppliers in Yuan or Dollars. Working under contract."
      }
    ],
    cta: {
      title: "Want to calculate delivery cost?",
      text: "We are online 24/7. Send us cargo parameters or product link — we answer in 15 minutes.",
      whatsapp: "📱 WhatsApp",
      login: "👤 Login"
    }
  },
  about_page: {
    title: "ABOUT COMPANY",
    subtitle: "Making China closer. For business and life. 🚚",
    description: "We are a logistics operator erasing borders between China and Kazakhstan for over 5 years. Trusted partner for hundreds of entrepreneurs and thousands of private clients.",
    stats: {
      years: "Years",
      parcels: "Parcels",
      resp: "Responsibility"
    },
    principles: [
      { title: "💎 Transparency", desc: "No hidden fees. Exact cost per kg/cbm before shipping. No rounding up weights." },
      { title: "🤝 Care (B2B + B2C)", desc: "Personal account, tracking, and support for every client, from a case to a container." },
      { title: "🛡️ Security", desc: "Thorough packing check at warehouse and cargo insurance. Your money is protected." },
      { title: "🚀 Technology", desc: "Convenient IT platform. Order management online and real-time statuses." }
    ],
    why_bottom: [
      "✅ Own warehouses",
      "✅ Speed (Auto/Rail)",
      "✅ Sourcing assistance"
    ]
  },
  contacts_page: {
    title: "CONTACTS",
    subtitle: "Contact us in any convenient way",
    address_title: "Our Address",
    address: "26 Altynsarin St, Almaty, Kazakhstan",
    phone_title: "Phones",
    phone_sub: "(Whatsapp / Telegram)",
    schedule_title: "Working Hours",
    schedule_days: "Mon-Sat: 09:00 - 18:00",
    schedule_off: "Sunday - Closed",
    whatsapp_btn: "Chat on WhatsApp",
    instagram_btn: "Instagram"
  },
  cta: {
    questions: "Any questions?",
    desc: "We are always happy to help! Visit our office or write to us."
  },
  search: {
    title: "Track by Number",
    placeholder: "Enter tracking number",
    button: "Search",
    loading: "Searching...",
    results: "Search results:",
    no_results: "Nothing found",
    desc: "Description",
    sent: "Sent",
    arrived: "Arrived",
    batch: "Batch"
  },
  status: {
    pending: "Pending",
    in_transit: "In Transit",
    arrived: "At Warehouse",
    delivered: "Delivered",
    lost: "Lost"
  },
  dashboard: {
    welcome: "Welcome,",
    admin_panel: "Admin Panel",
    add_track: "Add Tracking Number",
    placeholder_track: "Enter tracking number",
    placeholder_desc: "Description (e.g., teddy bear) - optional",
    add_btn: "Add",
    adding: "Adding...",
    my_parcels: "My Parcels",
    loading: "Loading...",
    no_parcels: "You have no tracking numbers added yet.",
    added: "Added:",
    confirm_bulk: 'Change status to "{status}" for {n} parcels?',
    confirm_delete: "Are you sure? This action cannot be undone.",
    upload_complete: "Upload complete!\nUpdated: {updated}\nCreated: {created}\nErrors: {errors}",
    error_upload: "File processing error.",
    sync_btn: "Sync Google Sheet",
    syncing: "Syncing...",
    enable_notifications: "Enable Notifications",
    notifications_enabled: "Notifications Enabled",
    notifications_error: "Error enabling notifications",
    telegram_app: "Sign in via Telegram",
    telegram_wait: "Waiting for confirmation...",
    admin: "Admin Login",
    error_cancel: "Login cancelled by user",
    error_generic: "Login error. Check connection.",
    error_telegram: "Telegram auto-login error",
    error_timeout: "Timeout. Try again.",
    error_open: "Error opening Telegram. Try again.",
    email: "Sign in with Email"
  },
  login: {
    title: "Login to System",
    google: "Sign in with Google",
    google_loading: "Signing in...",
    or_telegram: "Or via Telegram",
    telegram_app: "Sign in via Telegram",
    telegram_wait: "Waiting for confirmation...",
    admin: "Admin Login",
    error_cancel: "Login cancelled by user",
    error_generic: "Login error. Check connection.",
    error_telegram: "Telegram auto-login error",
    error_timeout: "Timeout. Try again.",
    error_open: "Error opening Telegram. Try again.",
    email: "Sign in with Email"
  },
  footer: {
    rights: "All rights reserved.",
    links: "Links",
    contacts: "Contacts",
    privacy: "Privacy Policy",
    phone: "Phone"
  },
  admin: {
    title: "Admin Panel",
    upload_title: "Upload Tables",
    upload_china: "📤 Upload Sent (China)",
    upload_received: "📥 Upload Received (Warehouse)",
    uploading: "Uploading...",
    format_info: "Format: Excel (.xlsx), first column must contain tracking numbers.",
    error_access: "Access Error!",
    error_access_desc: "You do not have admin rights.",
    all_parcels: "All Parcels",
    archive_btn: "Archive Old (30+ days)",
    archiving: "Archiving...",
    bulk_selected: "Selected:",
    bulk_of: "of",
    bulk_status_placeholder: "-- Select Status --",
    bulk_apply: "Apply",
    bulk_applying: "Applying...",
    bulk_clear: "Clear Selection",
    loading_data: "Loading data...",
    confirm_bulk: 'Change status to "{status}" for {n} parcels?',
    confirm_delete: "Are you sure? This action cannot be undone.",
    confirm_archive: "Archive delivered parcels?",
    upload_complete: "Upload complete!\nUpdated: {updated}\nCreated: {created}\nErrors: {errors}",
    error_upload: "File processing error.",
    search_placeholder: "Search by Track Number",
    rows_per_page: "Rows per page:",
    prev: "Prev",
    next: "Next",
    sync_btn: "Sync Google Sheet",
    syncing: "Syncing...",
    table: {
      track: "Tracking #",
      desc: "Description",
      email: "Email",
      name: "Name",
      date: "Date",
      status: "Status",
      actions: "Actions",
      user: "User"
    },
    delete: "Delete"
  },
  auth: {
    email_title: "Sign in with Email",
    name_label: "Your Name",
    name_placeholder: "John Doe",
    email_label: "Email",
    avatar_label: "Profile Photo (Optional)",
    choose_photo: "Choose",
    send_link: "Get Sign-in Link",
    back_to_login: "Back",
    verifying: "Verifying link...",
    sent_title: "Check your email",
    sent_desc: "We sent a magic link to",
    confirm_email_title: "Confirm Email",
    confirm_email_desc: "For security reasons, please enter your email to complete sign-in.",
    error_email_mismatch: "Email does not match. Please try again.",
    open_mail_app: "Open Email App",
    try_different_email: "Try different email"
  },
  privacy_page: {
    title: "PRIVACY POLICY",
    subtitle: "Last updated: {date}",
    sections: [
      { title: "1. Introduction", text: "We respect your privacy and are committed to protecting your personal data. This Privacy Policy explains how we collect, use, and protect information when using the Xcargo mobile application. Using the application signifies your agreement to the terms of this policy." },
      {
        title: "2. Data We Collect",
        text: "To operate the application and provide services, we collect the following types of data:",
        list: [
          "<strong>Identity Data:</strong> When logging in via Google Authentication or Telegram, we access your email address, phone number (if using Telegram), and public profile name/photo.",
          "<strong>Cargo Data:</strong> Information about your shipments, tracking numbers, and delivery addresses."
        ]
      },
      {
        title: "3. Purpose of Data Use",
        text: "Your data is used for:",
        list: [
          "Registration and providing access to your personal account.",
          "Processing orders and tracking the status of your shipments.",
          "Communicating with you regarding delivery (via notifications, calls, or messengers).",
          "Improving service quality and fixing technical errors."
        ]
      },
      { title: "4. Data Sharing", text: "We do not sell your data. However, to fulfill delivery services, we may transfer the necessary minimum information (e.g., name and phone number) to our logistics partners, couriers, or warehouses solely for the purpose of delivering your cargo." },
      { title: "5. Security", text: "We take reasonable technical and organizational measures to protect your information from unauthorized access. Passwords and access tokens are processed and stored securely using certified Google Firebase services." },
      { title: "6. Data Retention and Deletion", text: 'We retain your data as long as your account is active or as needed to provide services. You have the right to request the deletion of your account and all associated personal data at any time. To do this, use the "Delete Account" function in the app settings or send us a request.' },
      { title: "7. Changes to Privacy Policy", text: "We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Policy in this section of the app." },
      { title: "8. Contact Us", text: "If you have questions or suggestions regarding our Privacy Policy, please contact us." }
    ],
    whatsapp: "📱 Write on WhatsApp",
    back: "← Back to Home"
  },
  auth_pages: {
    login: {
      title: "LOGIN",
      subtitle: "Choose authorization method",
      google: "Sign in with Google",
      telegram: "Sign in with Telegram",
      telegram_confirm: "Confirm in Telegram...",
      email_btn: "Sign in with Email",
      loading: "Loading...",
      error_user_cancel: "Login cancelled by user",
      error_generic: "Login error. Please try again.",
      error_timeout: "Timeout expired",
      error_tg_open: "Error opening Telegram. Please try again."
    },
    email: {
      title: "EMAIL LOGIN",
      subtitle: "Enter email to receive link",
      sent_title: "Link sent!",
      sent_text_1: "We sent a login link to",
      sent_text_2: "Please check your email.",
      open_mail: "Open Email",
      use_other_mail: "Use different email",
      name_label: "Your Name",
      name_placeholder: "John Doe",
      email_label: "Email",
      email_placeholder: "name@example.com",
      avatar_label: "Profile Photo",
      upload_btn: "Choose photo",
      hint: "JPG, PNG or GIF (max 5MB)",
      submit: "Send Link",
      submit_loading: "Sending...",
      back: "← Back to Login",
      error_file_size: "File too large (>5MB)"
    },
    finish: {
      processing_title: "Verifying login...",
      processing_desc: "Completing authorization",
      confirm_title: "Confirm Email",
      confirm_desc: "Please enter your email to complete login.",
      confirm_btn: "Confirm",
      error_title: "Error",
      retry: "Try Again",
      error_invalid_link: "Invalid login link.",
      error_invalid_email: "Invalid email. Please try again."
    }
  }
};
const kk = {
  nav: {
    home: "Басты бет",
    services: "Қызметтер",
    about: "Біз туралы",
    contact: "Байланыс",
    admin: "Әкімші",
    login: "Кіру",
    logout: "Шығу",
    profile: "Жеке кабинет"
  },
  hero: {
    title: "ЖҮКТЕРДІ ЖЕТКІЗУ",
    subtitle: "Қытайдан Қазақстанға: Жылдам. Сенімді. Баршаға.",
    desc: "Логистикалық қызметтердің толық кешені — бір сәлемдемеден бастап контейнерге дейін. Жеке және заңды тұлғалармен жұмыс істейміз.",
    track_placeholder: "Трек-нөмірді енгізіңіз",
    track_btn: "Қадағалау",
    or: "Немесе",
    whatsapp: "WhatsApp-қа жазу",
    calc_btn: "Құнын есептеу",
    track_btn_hero: "🔍 Қадағалау",
    whatsapp_btn: "📱 WhatsApp",
    install_btn: "Орнату"
  },
  home: {
    b2c: {
      title: "👤 Жеке тұлғаларға (B2C)",
      items: [
        "Қытайдан тауарларды шекарасыз сатып алыңыз.",
        "Taobao, 1688, Alibaba сайттарынан жеткізу.",
        "Жиһаз бен техниканы тасымалдау.",
        "Сәлемдемелерді біріктіру."
      ]
    },
    b2b: {
      title: "🏢 Бизнеске (B2B)",
      items: [
        "Жеткізушілерді іздеу.",
        "Карго жеткізу және ресми импорт.",
        "Құжаттардың толық пакеті.",
        "Жиынтық жүктерді жеткізу (LCL/FCL)."
      ]
    },
    why: {
      title: "Неліктен біз?",
      items: [
        "Мерзімі: Автожеткізу 10–15 күн.",
        "100% Сақталу: Сақтандыру қосылған.",
        "Қоймалар: Гуанчжоу/Иу/Алматы.",
        "Ашық тарифтер: Жасырын төлемсіз."
      ]
    },
    steps: {
      title: "Бұл қалай жұмыс істейді?",
      items: [
        "Өтінім / Қойма мекенжайы.",
        "Жіберу және тексеру.",
        "Жеткізу және кеден.",
        "Алу (Қойма/Есікке дейін)."
      ]
    }
  },
  features: {
    fast_delivery: "Жылдам жеткізу",
    fast_delivery_desc: "Жол уақытын қысқарту үшін оңтайлы маршруттар.",
    tracking: "Қадағалау",
    tracking_desc: "Жүгіңіздің қайда екенін үнемі біліп отырыңыз.",
    guarantee: "Сақталу кепілдігі",
    guarantee_desc: "Толық сақтандыру және жүкке жауапкершілік.",
    support: "Қолдау",
    support_desc: "Әр кезеңде сізбен байланыстамыз."
  },
  services_page: {
    title: "БІЗДІҢ ҚЫЗМЕТТЕР",
    subtitle: "📦 Қытаймен кез келген мәселені шешеміз: Taobao-дан сатып алудан контейнерлерді ресми импорттауға дейін.",
    cards: [
      {
        icon: "🚛",
        title: "Кілтімен жеткізу",
        desc: "Кез келген жүктерді тасымалдау: авто, ж/д және авиа. Жиынтық жүктермен (1 кг-нан бастап) және тұтас контейнерлермен жұмыс істейміз."
      },
      {
        icon: "🛍️",
        title: "Тауарды іздеу және сатып алу",
        desc: "<strong>Өзіңіз үшін:</strong> Taobao, 1688 сайттарынан сатып аламыз.<br><strong>Бизнес үшін:</strong> жеткізушілерді тауып, төлем жүргіземіз."
      },
      {
        icon: "📦",
        title: "Біріктіру және сақтау",
        desc: "Сәлемдемелерді тегін қабылдап, тексеріп, қаптап, жеткізу құнын үнемдеу үшін бір жүкке біріктіреміз."
      },
      {
        icon: "📋",
        title: "Кедендік рәсімдеу",
        desc: '<strong>Бизнес үшін:</strong> құжаттардың толық пакеті, сертификаттау және "ақ" кедендік тазарту. Ешқандай тәуекел жоқ.'
      },
      {
        icon: "🔍",
        title: "Сапаны тексеру",
        desc: "Тауарды ақауларға және мәлімделген сипаттамаларға сәйкестігін тексереміз. Жөнелту алдында фото/видео есеп береміз."
      },
      {
        icon: "🤝",
        title: "Қаржылық логистика",
        desc: "Жеткізушіге юань немесе доллармен қауіпсіз төлем жасауға көмектесеміз. Келісімшарт бойынша жұмыс істейміз."
      }
    ],
    cta: {
      title: "Жеткізу құнын есептегіңіз келе ме?",
      text: "Біз 24/7 байланыстамыз. Жүк параметрлерін немесе тауарға сілтемені жіберіңіз — 15 минут ішінде жауап береміз.",
      whatsapp: "📱 WhatsApp",
      login: "👤 Кіру"
    }
  },
  about_page: {
    title: "КОМПАНИЯ ТУРАЛЫ",
    subtitle: "Қытайды жақындатамыз. Бизнес және өмір үшін. 🚚",
    description: "Біз — Қытай мен Қазақстан арасындағы шекараларды 5 жылдан астам уақыт бойы жойып келе жатқан логистикалық оператормыз. Жүздеген кәсіпкерлер мен мыңдаған жеке клиенттер үшін сенімді серіктеспіз.",
    stats: {
      years: "Жыл",
      parcels: "Сәлемдеме",
      resp: "Жауапкершілік"
    },
    principles: [
      { title: "💎 Ашықтық", desc: "Жасырын төлемдерсіз. Жөнелтуге дейін кг/куб үшін нақты құн. Салмақты дөңгелемейміз." },
      { title: "🤝 Қамқорлық (B2B + B2C)", desc: "Жеке кабинет, қадағалау және әр клиентке қолдау көрсету, қаптан бастап контейнерге дейін." },
      { title: "🛡️ Қауіпсіздік", desc: "Қоймада қаптаманы мұқият тексеру және жүктерді сақтандыру. Сіздің ақшаңыз қорғау астында." },
      { title: "🚀 Технологиялар", desc: "Ыңғайлы IT-платформа. Тапсырыстарды онлайн басқару және нақты уақыт режиміндегі статустар." }
    ],
    why_bottom: [
      "✅ Меншікті қоймалар",
      "✅ Жылдамдық (Авто/ЖД)",
      "✅ Сатып алуға көмек"
    ]
  },
  contacts_page: {
    title: "БАЙЛАНЫС",
    subtitle: "Өзіңізге ыңғайлы кез келген әдіспен хабарласыңыз",
    address_title: "Біздің мекенжай",
    address: "Алматы қ., Алтынсарин к-сі, 26",
    phone_title: "Телефондар",
    phone_sub: "(Whatsapp / Telegram)",
    schedule_title: "Жұмыс кестесі",
    schedule_days: "Дс-Сб: 09:00 - 18:00",
    schedule_off: "Жексенбі - Демалыс",
    whatsapp_btn: "WhatsApp-қа жазу",
    instagram_btn: "Instagram"
  },
  cta: {
    questions: "Сұрақтарыңыз қалды ма?",
    desc: "Біз әрқашан көмектесуге қуаныштымыз! Біздің кеңсеге келіңіз немесе бізге жазыңыз."
  },
  search: {
    title: "Трек-нөмір бойынша іздеу",
    placeholder: "Трек-нөмірді енгізіңіз",
    button: "Іздеу",
    loading: "Іздеу...",
    results: "Іздеу нәтижелері:",
    no_results: "Ештеңе табылмады",
    desc: "Сипаттама",
    sent: "Жіберілді",
    arrived: "Келді",
    batch: "Партия"
  },
  status: {
    pending: "Күтуде",
    in_transit: "Жолда",
    arrived: "Қоймада",
    delivered: "Жеткізілді",
    lost: "Жоғалды"
  },
  dashboard: {
    welcome: "Қош келдіңіз,",
    admin_panel: "Әкімші тақтасы",
    add_track: "Трек-нөмір қосу",
    placeholder_track: "Трек-нөмірді енгізіңіз",
    placeholder_desc: "Сипаттама (мысалы: ойыншық аю) - міндетті емес",
    add_btn: "Қосу",
    adding: "Қосылуда...",
    my_parcels: "Менің сәлемдемелерім",
    loading: "Жүктелуде...",
    no_parcels: "Сізде әлі қосылған трек-нөмірлер жоқ.",
    added: "Қосылды:",
    delete_confirm: "Бұл трек-нөмірді жойғыңыз келетініне сенімдісіз бе?",
    error_add: "Трек-нөмірді қосу мүмкін болмады. Құқықтарыңызды тексеріңіз.",
    error_load: "Деректерді жүктеу қатесі.",
    error_delete: "Жою кезіндегі қате.",
    enable_notifications: "Хабарламаларды қосу",
    notifications_enabled: "Хабарламалар қосылды",
    notifications_error: "Хабарламаларды қосу қатесі",
    sync_btn: "Google Sheets синхр.",
    syncing: "Синхроньдалуда..."
  },
  admin: {
    title: "Әкімші тақтасы",
    upload_title: "Деректерді жүктеу",
    upload_china: "Келу Қытай (XLSX)",
    upload_received: "Келу Қойма (XLSX)",
    uploading: "Жүктелуде...",
    format_info: 'Формат: XLSX, "Track Number" бағанымен',
    error_access: "Кіру қатесі!",
    error_access_desc: "Сізде әкімші құқықтары жоқ.",
    all_parcels: "Барлық сәлемдемелер",
    archive_btn: "🗄️ Ескілерді мұрағаттау",
    archiving: "Мұрағатталуда...",
    bulk_selected: "Таңдалды:",
    bulk_of: "/",
    bulk_status_placeholder: "-- Статусты өзгерту --",
    bulk_apply: "Қолдану",
    bulk_clear: "Таңдауды алып тастау",
    loading_data: "Деректер жүктелуде...",
    search_placeholder: "Трек-нөмір бойынша іздеу",
    rows_per_page: "Беттегі жолдар:",
    prev: "Артқа",
    next: "Алға",
    sync_btn: "Google кестемен синхрондау",
    syncing: "Синхрондалуда...",
    table: {
      track: "Трек-нөмір",
      desc: "Сипаттама",
      email: "Email",
      name: "Аты",
      date: "Күні",
      status: "Мәртебесі",
      user: "Пайдаланушы",
      actions: "Әрекеттер"
    },
    delete: "Жою",
    confirm_archive: "30 күннен асқан жеткізілген және жоғалған сәлемдемелерді мұрағаттау керек пе?",
    no_archive: "Мұрағаттауға арналған сәлемдемелер жоқ.",
    archived_count: "{n} сәлемдеме мұрағатталды.",
    confirm_bulk: '{n} сәлемдеме үшін статусты "{status}" деп өзгерту керек пе?',
    confirm_delete: "Сенімдісіз бе? Бұл әрекетті қайтару мүмкін емес.",
    upload_complete: "Жүктеу аяқталды!\nЖаңартылды: {updated}\nҚұрылды: {created}\nҚателер: {errors}",
    error_upload: "Файлды өңдеу қатесі."
  },
  footer: {
    rights: "Барлық құқықтар қорғалған.",
    links: "Сілтемелер",
    contacts: "Байланыстар",
    privacy: "Құпиялылық саясаты",
    phone: "Телефон"
  },
  auth_pages: {
    login: {
      title: "КІРУ",
      subtitle: "Авторизация әдісін таңдаңыз",
      google: "Google арқылы кіру",
      telegram: "Telegram арқылы кіру",
      telegram_confirm: "Telegram-да растаңыз...",
      email_btn: "Email арқылы кіру",
      loading: "Жүктелуде...",
      error_user_cancel: "Кіруден бас тартылды",
      error_generic: "Кіру қатесі. Қайталап көріңіз.",
      error_timeout: "Уақыт бітті",
      error_tg_open: "Telegram ашу қатесі. Қайталап көріңіз."
    },
    email: {
      title: "EMAIL АРҚЫЛЫ КІРУ",
      subtitle: "Сілтеме алу үшін email енгізіңіз",
      sent_title: "Сілтеме жіберілді!",
      sent_text_1: "Біз кіру сілтемесін мына мекенжайға жібердік:",
      sent_text_2: "Поштаңызды тексеріңіз.",
      open_mail: "Поштаны ашу",
      use_other_mail: "Басқа email қолдану",
      name_label: "Сіздің атыңыз",
      name_placeholder: "Иван Иванов",
      email_label: "Email",
      email_placeholder: "name@example.com",
      avatar_label: "Профиль суреті",
      upload_btn: "Суретті таңдау",
      hint: "JPG, PNG немесе GIF (макс. 5MB)",
      submit: "Сілтемені жіберу",
      submit_loading: "Жіберілуде...",
      back: "← Кіруге оралу",
      error_file_size: "Файл тым үлкен (>5MB)"
    },
    finish: {
      processing_title: "Кіру тексерілуде...",
      processing_desc: "Авторизация аяқталуда",
      confirm_title: "Email растаңыз",
      confirm_desc: "Кіруді аяқтау үшін email енгізіңіз.",
      confirm_btn: "Растау",
      error_title: "Қате",
      retry: "Қайталап көру",
      error_invalid_link: "Жарамсыз кіру сілтемесі.",
      error_invalid_email: "Жарамсыз email. Қайталап көріңіз."
    }
  },
  privacy_page: {
    title: "ҚҰПИЯЛЫЛЫҚ САЯСАТЫ",
    subtitle: "Соңғы жаңарту: {date}",
    sections: [
      {
        title: "1. Кіріспе",
        text: "Біз сіздің құпиялылығыңызды құрметтейміз және жеке деректеріңізді қорғауға тырысамыз. Бұл Құпиялылық саясаты Xcargo мобильді қосымшасын пайдалану кезінде ақпаратты қалай жинайтынымызды, қолданатынымызды және қорғайтынымызды түсіндіреді."
      },
      {
        title: "2. Біз қандай деректерді жинаймыз",
        text: "Қосымшаның жұмыс істеуі және қызметтерді ұсыну үшін біз келесі деректер түрлерін жинаймыз:",
        list: [
          "<strong>Идентификациялық деректер:</strong> Google Authentication немесе Telegram арқылы кірген кезде біз сіздің email мекенжайыңызға, телефон нөміріңізге (Telegram қолданғанда) және жалпы профиль атыңызға/суретіңіз қол жеткіземіз.",
          "<strong>Жүктер туралы деректер:</strong> Сіздің жөнелтілімдеріğiniz, трек-нөмірлеріңіз бен жеткізу мекенжайларыңыз туралы ақпарат."
        ]
      },
      {
        title: "3. Деректерді пайдалану мақсаттары",
        text: "Сіздің деректеріңіз келесі мақсаттарда пайдаланылады:",
        list: [
          "Тіркелу және жеке кабинетке кіруді қамтамасыз ету.",
          "Тапсырыстарды өңдеу және жүктердің статусын қадағалау.",
          "Жеткізу мәселелері бойынша сізбен байланысу (хабарламалар, қоңыраулар).",
          "Сервис сапасын жақсарту және техникалық қателерді түзету."
        ]
      },
      {
        title: "4. Үшінші тұлғаларға деректерді беру",
        text: "Біз сіздің деректеріңізді сатпаймыз. Алайда, жеткізу қызметтерін орындау үшін біз ақпараттың қажетті минимумын (мысалы, атыңыз бен телефон нөміріңізді) логистикалық серіктестерімізге, курьерлерге немесе қоймаларға тек жүкті жеткізу мақсатында бере аламыз."
      },
      {
        title: "5. Қауіпсіздік",
        text: "Біз ақпаратыңызды рұқсатсыз кіруден қорғау үшін қажетті техникалық шараларды қабылдаймыз. Парольдер мен кіру токендері Google Firebase сертификатталған қызметтері арқылы қауіпсіз өңделеді."
      },
      {
        title: "6. Сақтау және жою",
        text: "Аккаунтыңыз белсенді болғанша біз деректеріңізді сақтаймыз. Сіз кез келген уақытта аккаунтыңызды және барлық жеке деректеріңізді жоюды сұрай аласыз."
      },
      {
        title: "7. Байланыс",
        text: "Егер сізде сұрақтар болса, бізбен байланысыңыз."
      }
    ],
    whatsapp: "📱 WhatsApp-қа жазу",
    back: "← Басты бетке оралу"
  }
};
const zh = {
  nav: {
    home: "首页",
    services: "服务",
    about: "关于我们",
    contact: "联系方式",
    admin: "管理",
    login: "登录",
    logout: "退出",
    profile: "个人中心"
  },
  hero: {
    title: "货运代理",
    subtitle: "从中国到哈萨克斯坦：快速。可靠。面向所有人。",
    desc: "全方位的物流服务 —— 从一个小包裹到一个集装箱。我们与个人和法人实体合作。",
    track_placeholder: "输入运单号",
    track_btn: "追踪",
    or: "或",
    whatsapp: "联系 WhatsApp",
    calc_btn: "计算成本",
    track_btn_hero: "🔍 追踪",
    whatsapp_btn: "📱 WhatsApp",
    install_btn: "安装"
  },
  home: {
    b2c: {
      title: "👤 个人客户 (B2C)",
      items: [
        "无国界购买中国商品。",
        "从淘宝, 1688, 阿里巴巴代购运输。",
        "家具、电器运输。",
        "包裹集运。"
      ]
    },
    b2b: {
      title: "🏢 商业客户 (B2B)",
      items: [
        "寻找供应商。",
        "货物运输及正规进口。",
        "全套文件。",
        "拼箱运输 (LCL/FCL)。"
      ]
    },
    why: {
      title: "为什么选择我们？",
      items: [
        "时效：汽运 10–15 天。",
        "100% 安全：含保险。",
        "仓库：广州/义乌/阿拉木图。",
        "透明费率：无隐藏费用。"
      ]
    },
    steps: {
      title: "工作流程",
      items: [
        "申请 / 仓库地址。",
        "发货并检查。",
        "运输与清关。",
        "收货（仓库/送货上门）。"
      ]
    }
  },
  features: {
    fast_delivery: "快速配送",
    fast_delivery_desc: "优化路线以缩短运输时间。",
    tracking: "追踪",
    tracking_desc: "随时了解您的货物位置。",
    guarantee: "安全保证",
    guarantee_desc: "全额保险和货物责任。",
    support: "支持",
    support_desc: "在每个阶段与您保持联系。"
  },
  services_page: {
    title: "我们的服务",
    subtitle: "📦 解决与中国有关的任何问题：从淘宝代购到集装箱正规进口。",
    cards: [
      {
        icon: "🚛",
        title: "一站式运输",
        desc: "任何货物的运输：汽运、铁路和航空。我们要么处理拼箱货物（1公斤起），要么处理整柜。"
      },
      {
        icon: "🛍️",
        title: "采购与搜索",
        desc: "<strong>个人：</strong> 代购淘宝, 1688。<br><strong>企业：</strong> 寻找供应商并付款。"
      },
      {
        icon: "📦",
        title: "集运仓储",
        desc: "免费接收包裹，检查，包装并合并为一个货物，以节省运费。"
      },
      {
        icon: "📋",
        title: "清关服务",
        desc: "<strong>企业：</strong> 全套文件，认证和“白色”清关。零风险。"
      },
      {
        icon: "🔍",
        title: "质量检查",
        desc: "检查货物是否有缺陷并符合声明。发货前提供照片/视频报告。"
      },
      {
        icon: "🤝",
        title: "金融物流",
        desc: "帮助向供应商安全支付人民币或美元。合同保障。"
      }
    ],
    cta: {
      title: "想计算运费吗？",
      text: "我们 24/7 在线。发送货物参数或链接给我们 —— 15分钟内回复。",
      whatsapp: "📱 WhatsApp",
      login: "👤 登录"
    }
  },
  about_page: {
    title: "关于公司",
    subtitle: "让中国更近。为了生意和生活。 🚚",
    description: "我们是一家物流运营商，5年多来一直致力于消除中国与哈萨克斯坦之间的界限。是数百名企业家和数千名个人客户的可靠合作伙伴。",
    stats: {
      years: "年",
      parcels: "包裹",
      resp: "责任"
    },
    principles: [
      { title: "💎 透明", desc: "无隐藏费用。发货前确定每公斤/立方米的确切成本。不四舍五入重量。" },
      { title: "🤝 关怀 (B2B + B2C)", desc: "个人中心，追踪和支持每一位客户，从一个小包裹到一个集装箱。" },
      { title: "🛡️ 安全", desc: "仓库包装的仔细检查和货物保险。您的资金受到保护。" },
      { title: "🚀 技术", desc: "便捷的 IT 平台。在线订单管理和实时状态。" }
    ],
    why_bottom: [
      "✅ 自有仓库",
      "✅ 速度 (汽运/铁路)",
      "✅ 代购帮助"
    ]
  },
  contacts_page: {
    title: "联系方式",
    subtitle: "通过任何方便的方式联系我们",
    address_title: "我们的地址",
    address: "阿拉木图市, Altynsarin 街 26 号",
    phone_title: "电话",
    phone_sub: "(Whatsapp / Telegram)",
    schedule_title: "工作时间",
    schedule_days: "周一至周六: 09:00 - 18:00",
    schedule_off: "周日 - 休息",
    whatsapp_btn: "联系 WhatsApp",
    instagram_btn: "Instagram"
  },
  cta: {
    questions: "还有问题吗？",
    desc: "我们随时乐意为您提供帮助！请访问我们的办公室或给我们写信。"
  },
  search: {
    title: "运单号查询",
    placeholder: "输入运单号",
    button: "搜索",
    loading: "搜索中...",
    results: "搜索结果：",
    no_results: "未找到",
    desc: "描述",
    sent: "已发送",
    arrived: "已到达",
    batch: "批次"
  },
  status: {
    pending: "等待中",
    in_transit: "运输中",
    arrived: "在仓库",
    delivered: "已送达",
    lost: "已丢失"
  },
  dashboard: {
    welcome: "欢迎，",
    admin_panel: "管理面板",
    add_track: "添加运单号",
    placeholder_track: "输入运单号",
    placeholder_desc: "描述（例如：泰迪熊）- 可选",
    add_btn: "添加",
    adding: "添加中...",
    my_parcels: "我的包裹",
    loading: "加载中...",
    no_parcels: "您尚未添加任何运单号。",
    added: "已添加：",
    delete_confirm: "确定要删除此运单号吗？",
    error_add: "添加运单号失败。请检查权限。",
    error_load: "加载数据错误。",
    error_delete: "删除错误。",
    enable_notifications: "启用通知",
    notifications_enabled: "通知已启用",
    notifications_error: "启用通知错误",
    sync_btn: "同步 Google 表格",
    syncing: "同步中..."
  },
  admin: {
    title: "管理面板",
    upload_title: "数据上传",
    upload_china: "入库 中国 (XLSX)",
    upload_received: "入库以此 (XLSX)",
    uploading: "上传中...",
    format_info: '格式：XLSX，包含 "Track Number" 列',
    error_access: "访问错误！",
    error_access_desc: "您没有管理员权限。",
    all_parcels: "所有包裹",
    archive_btn: "🗄️ 归档已发货",
    archiving: "归档中...",
    bulk_selected: "已选",
    bulk_of: "/",
    bulk_status_placeholder: "-- 更改状态 --",
    bulk_apply: "应用",
    bulk_clear: "取消选择",
    loading_data: "加载数据中...",
    search_placeholder: "按运单号搜索",
    rows_per_page: "每页行数:",
    prev: "上一页",
    next: "下一页",
    sync_btn: "同步 Google 表格",
    syncing: "同步中...",
    table: {
      track: "运单号",
      desc: "描述",
      email: "邮箱",
      name: "姓名",
      date: "日期",
      status: "状态",
      user: "用户",
      actions: "操作"
    },
    delete: "删除",
    confirm_archive: "归档所有已发货的包裹？",
    no_archive: "没有可归档的包裹。",
    archived_count: "已归档 {n} 个包裹。",
    confirm_bulk: '确定将 {n} 个包裹的状态更改为 "{status}"？',
    confirm_delete: "确定吗？此操作无法撤消。",
    upload_complete: "上传完成！\n更新：{updated}\n创建：{created}\n错误：{errors}",
    error_upload: "文件处理错误。"
  },
  footer: {
    rights: "保留所有权利。",
    links: "链接",
    contacts: "联系方式",
    privacy: "隐私政策",
    phone: "电话"
  },
  auth_pages: {
    login: {
      title: "登录",
      subtitle: "选择一种授权方式",
      google: "通过 Google 登录",
      telegram: "通过 Telegram 登录",
      telegram_confirm: "在 Telegram 中确认...",
      email_btn: "通过 Email 登录",
      loading: "加载中...",
      error_user_cancel: "用户取消登录",
      error_generic: "登录错误。请重试。",
      error_timeout: "超时",
      error_tg_open: "打开 Telegram 错误。请重试。"
    },
    email: {
      title: "EMAIL 登录",
      subtitle: "输入邮箱以获取链接",
      sent_title: "链接已发送！",
      sent_text_1: "我们已将登录链接发送至",
      sent_text_2: "请检查您的邮箱。",
      open_mail: "打开邮箱",
      use_other_mail: "使用其他邮箱",
      name_label: "您的姓名",
      name_placeholder: "张三",
      email_label: "Email",
      email_placeholder: "name@example.com",
      avatar_label: "个人头像",
      upload_btn: "选择照片",
      hint: "JPG, PNG 或 GIF (最大 5MB)",
      submit: "发送链接",
      submit_loading: "发送中...",
      back: "← 返回登录",
      error_file_size: "文件太大 (>5MB)"
    },
    finish: {
      processing_title: "正在验证登录...",
      processing_desc: "完成授权",
      confirm_title: "确认 Email",
      confirm_desc: "请输入您的邮箱以完成登录。",
      confirm_btn: "确认",
      error_title: "错误",
      retry: "重试",
      error_invalid_link: "无效的登录链接。",
      error_invalid_email: "邮箱无效。请重试。"
    }
  },
  privacy_page: {
    title: "隐私政策",
    subtitle: "最后更新: {date}",
    sections: [
      {
        title: "1. 简介",
        text: "我们尊重您的隐私，并致力于保护您的个人数据。本隐私政策解释了我们在您使用 Xcargo 移动应用程序时如何收集、使用和保护信息。"
      },
      {
        title: "2. 我们收集什么数据",
        text: "为了应用程序的运行和提供服务，我们收集以下类型的数据：",
        list: [
          "<strong>身份数据：</strong> 当通过 Google Authentication 或 Telegram 登录时，我们会访问您的电子邮件地址、电话号码（如果通过 Telegram）和公开的个人资料名称/照片。",
          "<strong>货物数据：</strong> 有关您的发货、运单号和收货地址的信息。"
        ]
      },
      {
        title: "3. 数据用途",
        text: "您的数据用于：",
        list: [
          "注册和提供对个人中心的使用权限。",
          "处理订单并追踪您的货物状态。",
          "就交付事宜与您联系（通过通知、电话或信使）。",
          "提高服务质量并修复技术错误。"
        ]
      },
      {
        title: "4. 向第三方传输数据",
        text: "我们不出售您的数据。但是，为了执行交付服务，我们可能会将必要的最少信息（例如姓名和电话号码）传输给我们的物流合作伙伴、快递员或仓库，仅用于交付您的货物。"
      },
      {
        title: "5. 安全",
        text: "我们采取合理的技术和组织措施，防止未经授权访问您的信息。密码和访问令牌通过经过认证的 Google Firebase 服务安全处理。"
      },
      {
        title: "6. 存储和删除",
        text: "只要您的帐户处于活动状态，我们就会存储您的数据。您有权随时要求删除您的帐户和所有相关的个人数据。"
      },
      {
        title: "7. 联系方式",
        text: "如果您有任何疑问，请联系我们。"
      }
    ],
    whatsapp: "📱 联系 WhatsApp",
    back: "← 返回首页"
  }
};
const messages = { ru, en, kk, zh };
const useI18n = () => {
  const locale = useState("app-locale", () => "ru");
  const t = (path) => {
    if (!path) return "";
    const keys = path.split(".");
    let loc = locale.value;
    let current = messages[loc];
    if (!current) {
      console.warn(`[I18n] Locale ${loc} not found.`);
      current = messages["ru"];
    }
    if (current && current.default) current = current.default;
    let fallback = messages["ru"];
    if (fallback && fallback.default) fallback = fallback.default;
    let res = current;
    let fb = fallback;
    for (const key of keys) {
      res = res && res[key] !== void 0 ? res[key] : void 0;
      fb = fb && fb[key] !== void 0 ? fb[key] : void 0;
    }
    return res || fb || path;
  };
  const setLocale = (newLocale) => {
    if (messages[newLocale]) {
      console.log(`[I18n] Switching to ${newLocale}`);
      locale.value = newLocale;
    }
  };
  return {
    t,
    locale,
    setLocale
  };
};
const _sfc_main$j = {
  __name: "plexus-globe",
  __ssrInlineRender: true,
  props: {
    scale: { type: Number, default: 1.5 },
    positionX: { type: Number, default: 190 },
    positionY: { type: Number, default: 30 },
    rotationSpeed: { type: Number, default: 1 },
    // Зафиксированное значение
    flickerIntensity: { type: Number, default: 0.33 },
    // Зафиксированное значение
    gradientIntensity: { type: Number, default: 1 },
    connectionSwitching: { type: Number, default: 0.01 },
    // Зафиксированное значение
    connectionQuantity: { type: Number, default: 0.01 },
    // Зафиксированное значение
    whiteIntensity: { type: Number, default: 0.1 },
    cyanIntensity: { type: Number, default: 0.63 },
    blueIntensity: { type: Number, default: 0.3 },
    purpleIntensity: { type: Number, default: 0.56 },
    purpleHue: { type: Number, default: 254 },
    // Зафиксированное значение
    blueHue: { type: Number, default: 271 },
    // Зафиксированное значение
    cyanHue: { type: Number, default: 276 }
    // Зафиксированное значение
  },
  setup(__props) {
    const props = __props;
    const containerRef = ref(null);
    const canvasRef = ref(null);
    watch(() => props, (newProps) => {
      if (canvasRef.value) {
        canvasRef.value.updateSettings(newProps);
      }
    }, { deep: true });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({
        ref_key: "containerRef",
        ref: containerRef,
        id: "globe-container",
        class: "globe-background",
        style: {
          transformOrigin: "center center",
          transition: "transform 0.1s ease-out",
          transform: `scale(${__props.scale}) translateX(${__props.positionX}px) translateY(${__props.positionY}px)`,
          backgroundColor: "transparent"
        }
      }, _attrs))} data-v-5e3e03d7></div>`);
    };
  }
};
const _sfc_setup$j = _sfc_main$j.setup;
_sfc_main$j.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/plexus-globe.vue");
  return _sfc_setup$j ? _sfc_setup$j(props, ctx) : void 0;
};
const PlexusGlobe = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["__scopeId", "data-v-5e3e03d7"]]);
const _sfc_main$i = {};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs) {
  _push(`<div${ssrRenderAttrs(mergeProps({ class: "rocket-widget" }, _attrs))} data-v-1292e08f><div class="mini-artboard" data-v-1292e08f><div class="stars-bg" data-v-1292e08f><!--[-->`);
  ssrRenderList(5, (n) => {
    _push(`<div class="shooting-star-mini" data-v-1292e08f></div>`);
  });
  _push(`<!--]--></div><div class="rocket-group" data-v-1292e08f><div class="fire" data-v-1292e08f></div><svg id="rocket-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 154.1 259.1" enable-background="new 0 0 154.1 259.1" data-v-1292e08f>`);
  ssrRenderVNode(_push, createVNode(resolveDynamicComponent("style"), null, {
    default: withCtx((_, _push2, _parent2, _scopeId) => {
      if (_push2) {
        _push2(` .st0{fill:#4F46E5;} .st1{fill:#E8E6EF;} .st2{filter:url(#Adobe_OpacityMaskFilter);} .st3{filter:url(#Adobe_OpacityMaskFilter_1_);} .st4{mask:url(#SVGID_1_);fill:url(#SVGID_2_);} .st5{opacity:0.61;fill:#CFE0E2;} .st6{opacity:0.7;fill:#012226;} .st7{filter:url(#Adobe_OpacityMaskFilter_2_);} .st8{filter:url(#Adobe_OpacityMaskFilter_3_);} .st9{mask:url(#SVGID_3_);fill:url(#SVGID_4_);} .st10{fill:url(#SVGID_5_);} .st11{fill:#063A3A;} .st12{fill:#312E81;} `);
      } else {
        return [
          createTextVNode(" .st0{fill:#4F46E5;} .st1{fill:#E8E6EF;} .st2{filter:url(#Adobe_OpacityMaskFilter);} .st3{filter:url(#Adobe_OpacityMaskFilter_1_);} .st4{mask:url(#SVGID_1_);fill:url(#SVGID_2_);} .st5{opacity:0.61;fill:#CFE0E2;} .st6{opacity:0.7;fill:#012226;} .st7{filter:url(#Adobe_OpacityMaskFilter_2_);} .st8{filter:url(#Adobe_OpacityMaskFilter_3_);} .st9{mask:url(#SVGID_3_);fill:url(#SVGID_4_);} .st10{fill:url(#SVGID_5_);} .st11{fill:#063A3A;} .st12{fill:#312E81;} ")
        ];
      }
    }),
    _: 1
  }), _parent);
  _push(`<path class="st0" d="M97.4 236.1c0 2.6-5.2 4.7-11.7 4.7H70.3c-6.4 0-11.7-2.1-11.7-4.7v-4.5c0-2.6 5.2-4.7 11.7-4.7h15.4c6.4 0 11.7 2.1 11.7 4.7v4.5zM37.1 137.4s-28 19.2-28 32v59.3l30-30-2-61.3zM117.5 137.4s28 19.2 28 32v59.3l-30-30 2-61.3z" data-v-1292e08f></path><path class="st1" d="M29.6 140.5c.3 36.4 8.3 69.6 21.3 95.3 8.6-2.8 17.7-4.4 27.2-4.4 9.5-.1 18.6 1.3 27.3 4 12.5-25.9 19.9-59.3 19.6-95.6-.6-57.8-20.4-107.7-48.8-132-28.1 24.8-47.1 75-46.6 132.7z" data-v-1292e08f></path><defs data-v-1292e08f><filter id="Adobe_OpacityMaskFilter" filterUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" data-v-1292e08f><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-1292e08f></feFlood><feBlend in="SourceGraphic" in2="back" data-v-1292e08f></feBlend></filter></defs><mask maskUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" id="SVGID_1_" data-v-1292e08f><g class="st2" data-v-1292e08f><defs data-v-1292e08f><filter id="Adobe_OpacityMaskFilter_1_" filterUnits="userSpaceOnUse" x="44.2" y="62.7" width="28.1" height="171" data-v-1292e08f><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-1292e08f></feFlood><feBlend in="SourceGraphic" in2="back" data-v-1292e08f></feBlend></filter></defs><linearGradient id="SVGID_2_" gradientUnits="userSpaceOnUse" x1="719.881" y1="-755.102" x2="616.624" y2="-640.129" gradientTransform="rotate(-41.77 1486.062 530.152)" data-v-1292e08f><stop offset="0" stop-color="gray" data-v-1292e08f></stop><stop offset=".145" stop-color="#7A7A7A" data-v-1292e08f></stop><stop offset=".338" stop-color="#696969" data-v-1292e08f></stop><stop offset=".556" stop-color="#4E4E4E" data-v-1292e08f></stop><stop offset=".792" stop-color="#282828" data-v-1292e08f></stop><stop offset="1" data-v-1292e08f></stop></linearGradient><path class="st4" d="M60.2 233.7l12-1.9c-18.3-108.4-8.6-169-8.6-169l-11.4.4c-22 76.5 8 170.5 8 170.5z" data-v-1292e08f></path></g></mask><path class="st5" d="M60.2 233.7l12-1.9c-18.3-108.4-8.6-169-8.6-169l-11.4.4c-22 76.5 8 170.5 8 170.5z" data-v-1292e08f></path><path class="st6" d="M41.5 64l-2.1 6.7s40.7-5 75.7.1l-3.2-7.4c-.1 0-47.1-5.4-70.4.6z" data-v-1292e08f></path><path class="st0" d="M41.5 64c11.4-.9 23.2-1.4 35.2-1.5 12-.1 23.7.2 35.2.9-8.6-23.7-21-43-35.6-55.6C61.7 20.6 49.7 40.2 41.5 64z" data-v-1292e08f></path><defs data-v-1292e08f><filter id="Adobe_OpacityMaskFilter_2_" filterUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" data-v-1292e08f><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-1292e08f></feFlood><feBlend in="SourceGraphic" in2="back" data-v-1292e08f></feBlend></filter></defs><mask maskUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" id="SVGID_3_" data-v-1292e08f><g class="st7" data-v-1292e08f><defs data-v-1292e08f><filter id="Adobe_OpacityMaskFilter_3_" filterUnits="userSpaceOnUse" x="52.2" y="7.8" width="24" height="55.3" data-v-1292e08f><feFlood result="back" flood-color="#fff" flood-opacity="1" data-v-1292e08f></feFlood><feBlend in="SourceGraphic" in2="back" data-v-1292e08f></feBlend></filter></defs><linearGradient id="SVGID_4_" gradientUnits="userSpaceOnUse" x1="739.606" y1="-771.977" x2="769.629" y2="-799.072" gradientTransform="rotate(-41.77 1486.062 530.152)" data-v-1292e08f><stop offset="0" stop-color="gray" data-v-1292e08f></stop><stop offset=".145" stop-color="#7A7A7A" data-v-1292e08f></stop><stop offset=".338" stop-color="#696969" data-v-1292e08f></stop><stop offset=".556" stop-color="#4E4E4E" data-v-1292e08f></stop><stop offset=".792" stop-color="#282828" data-v-1292e08f></stop><stop offset="1" data-v-1292e08f></stop></linearGradient><path class="st9" d="M63.6 62.7C65.7 35.3 76.2 7.8 76.2 7.8c-18.9 24.2-24 55.3-24 55.3l11.4-.4z" data-v-1292e08f></path></g></mask><linearGradient id="SVGID_5_" gradientUnits="userSpaceOnUse" x1="739.606" y1="-771.977" x2="769.629" y2="-799.072" gradientTransform="rotate(-41.77 1486.062 530.152)" data-v-1292e08f><stop offset="0" stop-color="#EAEFEE" data-v-1292e08f></stop><stop offset=".45" stop-color="#F0F3F3" data-v-1292e08f></stop><stop offset="1" stop-color="#FFF" data-v-1292e08f></stop></linearGradient><path class="st10" d="M63.6 62.7C65.7 35.3 76.2 7.8 76.2 7.8c-18.9 24.2-24 55.3-24 55.3l11.4-.4z" data-v-1292e08f></path><path class="st11" d="M75.9 78.3c-14.8.1-26.7 12.2-26.6 27 .1 14.8 12.2 26.7 27 26.6 14.8-.1 26.7-12.2 26.5-27-.1-14.9-12.2-26.8-26.9-26.6z" data-v-1292e08f></path><path class="st12" d="M75.9 86.4c-10.3.1-18.5 8.5-18.5 18.8.1 10.3 8.5 18.5 18.8 18.4 10.3-.1 18.5-8.5 18.4-18.8 0-10.2-8.4-18.5-18.7-18.4z" data-v-1292e08f></path><path class="st0" d="M68.6 122.1c2.3 1 4.9 1.6 7.7 1.6 10.3-.1 18.5-8.5 18.4-18.8 0-3.6-1.1-7-3-9.9-.3.3-.7.5-1 .8-8.1 6.6-18.2 15.6-22.1 26.3z" data-v-1292e08f></path><path class="st11" d="M79 139.9c-11.1.1-20 9.2-19.9 20.3.1 11.1 9.2 20 20.3 19.9 11.1-.1 20-9.2 19.9-20.3-.1-11-9.2-20-20.3-19.9z" data-v-1292e08f></path><path class="st12" d="M79.1 146.1c-7.7.1-13.9 6.4-13.8 14.1.1 7.7 6.4 13.9 14.1 13.8 7.7-.1 13.9-6.4 13.8-14.1-.1-7.7-6.4-13.9-14.1-13.8z" data-v-1292e08f></path><path class="st0" d="M73.5 172.8c1.8.8 3.7 1.2 5.8 1.2 7.7-.1 13.9-6.4 13.8-14.1 0-2.7-.8-5.3-2.2-7.4-.3.2-.5.4-.8.6-6 4.9-13.6 11.7-16.6 19.7z" data-v-1292e08f></path><path class="st11" d="M81.5 187.9c-7.8.1-14.1 6.5-14 14.3.1 7.8 6.5 14.1 14.3 14.1 7.8-.1 14.1-6.5 14-14.3-.1-7.8-6.5-14.2-14.3-14.1z" data-v-1292e08f></path><path class="st12" d="M81.5 192.2c-5.4 0-9.8 4.5-9.8 9.9s4.5 9.8 9.9 9.8 9.8-4.5 9.8-9.9-4.5-9.8-9.9-9.8z" data-v-1292e08f></path><path class="st0" d="M77.6 211.1c1.2.5 2.6.9 4.1.8 5.4 0 9.8-4.5 9.8-9.9 0-1.9-.6-3.7-1.6-5.2-.2.1-.4.3-.5.4-4.3 3.5-9.7 8.3-11.8 13.9z" data-v-1292e08f></path></svg></div></div></div>`);
}
const _sfc_setup$i = _sfc_main$i.setup;
_sfc_main$i.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/RocketWidget.vue");
  return _sfc_setup$i ? _sfc_setup$i(props, ctx) : void 0;
};
const RocketWidget = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["ssrRender", _sfc_ssrRender$1], ["__scopeId", "data-v-1292e08f"]]);
const _sfc_main$h = {
  __name: "WavesHeader",
  __ssrInlineRender: true,
  emits: ["logo-click"],
  setup(__props, { emit: __emit }) {
    const { locale } = useI18n();
    const showLangMenu = ref(false);
    const flags = {
      ru: "ru",
      en: "gb",
      kk: "kz",
      zh: "cn"
    };
    ref(false);
    const wave1 = ref({ h: 252, s: 52, l: 47, a: 0.35 });
    const wave2 = ref({ h: 186, s: 100, l: 38, a: 0.25 });
    const wave3 = ref({ h: 252, s: 52, l: 47, a: 0.15 });
    const wave4 = ref({ h1: 186, h2: 252, s: 100, l: 38, a: 0.5 });
    const getHsla = (h2, s, l, a) => `hsla(${h2}, ${s}%, ${l}%, ${a})`;
    const w1Color = computed(() => getHsla(wave1.value.h, wave1.value.s, wave1.value.l, wave1.value.a));
    const w2Color = computed(() => getHsla(wave2.value.h, wave2.value.s, wave2.value.l, wave2.value.a));
    const w3Color = computed(() => getHsla(wave3.value.h, wave3.value.s, wave3.value.l, wave3.value.a));
    const w4Start = computed(() => getHsla(wave4.value.h1, wave4.value.s, wave4.value.l, wave4.value.a));
    const w4End = computed(() => getHsla(wave4.value.h2, wave4.value.s, wave4.value.l, wave4.value.a));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-26820ece><div class="header" data-v-26820ece><div class="inner-header flex" data-v-26820ece><a href="#" class="logo-link" data-v-26820ece>`);
      _push(ssrRenderComponent(RocketWidget, null, null, _parent));
      _push(`<h1 data-v-26820ece>CargoXpress</h1></a><div class="lang-switcher" data-v-26820ece><button class="lang-btn" data-v-26820ece><img${ssrRenderAttr("src", `https://flagcdn.com/w40/${flags[unref(locale)]}.png`)} alt="flag" class="flag-icon-img" data-v-26820ece><span class="arrow-down" data-v-26820ece>▼</span></button>`);
      if (showLangMenu.value) {
        _push(`<div class="lang-dropdown" data-v-26820ece><!--[-->`);
        ssrRenderList(flags, (country, lg) => {
          _push(`<div class="${ssrRenderClass([{ active: lg === unref(locale) }, "lang-option"])}"${ssrRenderAttr("title", lg.toUpperCase())} data-v-26820ece><img${ssrRenderAttr("src", `https://flagcdn.com/w40/${country}.png`)}${ssrRenderAttr("alt", lg)} class="flag-img" data-v-26820ece></div>`);
        });
        _push(`<!--]--></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div><div data-v-26820ece><svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto" data-v-26820ece><defs data-v-26820ece><path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" data-v-26820ece></path><linearGradient id="g-wave4" x1="0%" y1="0%" x2="100%" y2="0%" data-v-26820ece><stop offset="0%"${ssrRenderAttr("stop-color", w4Start.value)} data-v-26820ece></stop><stop offset="100%"${ssrRenderAttr("stop-color", w4End.value)} data-v-26820ece></stop></linearGradient><mask id="mask4" data-v-26820ece><use class="wave-anim-4" xlink:href="#gentle-wave" x="48" y="7" fill="#fff" data-v-26820ece></use></mask></defs><g class="parallax" data-v-26820ece><use xlink:href="#gentle-wave" x="48" y="0"${ssrRenderAttr("fill", w1Color.value)} data-v-26820ece></use><use xlink:href="#gentle-wave" x="48" y="3"${ssrRenderAttr("fill", w2Color.value)} data-v-26820ece></use><use xlink:href="#gentle-wave" x="48" y="5"${ssrRenderAttr("fill", w3Color.value)} data-v-26820ece></use><rect x="0" y="0" width="100%" height="100%" fill="url(#g-wave4)" mask="url(#mask4)" data-v-26820ece></rect></g></svg></div></div></div>`);
    };
  }
};
const _sfc_setup$h = _sfc_main$h.setup;
_sfc_main$h.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WavesHeader.vue");
  return _sfc_setup$h ? _sfc_setup$h(props, ctx) : void 0;
};
const WavesHeader = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["__scopeId", "data-v-26820ece"]]);
const _sfc_main$g = {
  __name: "WavesFooter",
  __ssrInlineRender: true,
  emits: ["privacy-click"],
  setup(__props, { emit: __emit }) {
    const { t } = useI18n();
    ref(false);
    const wave1 = ref({ h: 295, s: 52, l: 47, a: 0.35 });
    const wave2 = ref({ h: 272, s: 100, l: 38, a: 0.25 });
    const wave3 = ref({ h: 277, s: 52, l: 47, a: 0.15 });
    const wave4 = ref({ h1: 229, h2: 0, s: 100, l: 38, a: 0.5 });
    const getHsla = (h2, s, l, a) => `hsla(${h2}, ${s}%, ${l}%, ${a})`;
    const w1Color = computed(() => getHsla(wave1.value.h, wave1.value.s, wave1.value.l, wave1.value.a));
    const w2Color = computed(() => getHsla(wave2.value.h, wave2.value.s, wave2.value.l, wave2.value.a));
    const w3Color = computed(() => getHsla(wave3.value.h, wave3.value.s, wave3.value.l, wave3.value.a));
    const w4Start = computed(() => getHsla(wave4.value.h1, wave4.value.s, wave4.value.l, wave4.value.a));
    const w4End = computed(() => getHsla(wave4.value.h2, wave4.value.s, wave4.value.l, wave4.value.a));
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(_attrs)} data-v-d29837be><div class="header" data-v-d29837be><div class="inner-header flex" data-v-d29837be><div class="footer-content" data-v-d29837be><p class="footer-text" data-v-d29837be>© 2025 CargoXpress. ${ssrInterpolate(unref(t)("footer.rights"))}</p><a href="#" class="privacy-link" data-v-d29837be>${ssrInterpolate(unref(t)("footer.privacy"))}</a><p class="footer-initials" data-v-d29837be>ROM</p></div></div><div data-v-d29837be><svg class="waves" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 24 150 28" preserveAspectRatio="none" shape-rendering="auto" data-v-d29837be><defs data-v-d29837be><path id="gentle-wave" d="M-160 44c30 0 58-18 88-18s 58 18 88 18 58-18 88-18 58 18 88 18 v44h-352z" data-v-d29837be></path><linearGradient id="g-wave4" x1="0%" y1="0%" x2="100%" y2="0%" data-v-d29837be><stop offset="0%"${ssrRenderAttr("stop-color", w4Start.value)} data-v-d29837be></stop><stop offset="100%"${ssrRenderAttr("stop-color", w4End.value)} data-v-d29837be></stop></linearGradient><mask id="mask4" data-v-d29837be><use class="wave-anim-4" xlink:href="#gentle-wave" x="48" y="7" fill="#fff" data-v-d29837be></use></mask></defs><g class="parallax" data-v-d29837be><use xlink:href="#gentle-wave" x="48" y="0"${ssrRenderAttr("fill", w1Color.value)} data-v-d29837be></use><use xlink:href="#gentle-wave" x="48" y="3"${ssrRenderAttr("fill", w2Color.value)} data-v-d29837be></use><use xlink:href="#gentle-wave" x="48" y="5"${ssrRenderAttr("fill", w3Color.value)} data-v-d29837be></use><rect x="0" y="0" width="100%" height="100%" fill="url(#g-wave4)" mask="url(#mask4)" data-v-d29837be></rect></g></svg></div></div></div>`);
    };
  }
};
const _sfc_setup$g = _sfc_main$g.setup;
_sfc_main$g.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/WavesFooter.vue");
  return _sfc_setup$g ? _sfc_setup$g(props, ctx) : void 0;
};
const WavesFooter = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["__scopeId", "data-v-d29837be"]]);
const _sfc_main$f = {
  __name: "VerticalSidebar",
  __ssrInlineRender: true,
  props: {
    activeKey: {
      type: String,
      default: ""
    }
  },
  emits: ["select"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const activeIndex = ref(-1);
    const menuItemRefs = ref([]);
    const menuBorderRef = ref(null);
    const { t } = useI18n();
    const getLabel = (key) => {
      const map = {
        services: "nav.services",
        about: "nav.about",
        contacts: "nav.contact",
        tracking: "features.tracking",
        login: "nav.login",
        dashboard: "nav.profile"
      };
      return map[key] ? t(map[key]) : key;
    };
    const isLoggedIn = ref(false);
    const menuItems = computed(() => [
      {
        key: "services",
        color: "#312E81",
        iconPath: '<rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/>'
      },
      {
        key: "about",
        color: "#4F46E5",
        iconPath: '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>'
      },
      {
        key: "contacts",
        color: "#6366F1",
        iconPath: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>'
      },
      {
        key: "tracking",
        color: "#818CF8",
        iconPath: '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'
      },
      {
        key: isLoggedIn.value ? "dashboard" : "login",
        color: isLoggedIn.value ? "#10B981" : "#38BDF8",
        iconPath: isLoggedIn.value ? '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>' : '<path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4"/><polyline points="10 17 15 12 10 7"/><line x1="15" y1="12" x2="3" y2="12"/>'
      }
    ]);
    const updateBorderPosition = () => {
      const border = menuBorderRef.value;
      if (!border) return;
      if (activeIndex.value === -1 || !menuItemRefs.value[activeIndex.value]) {
        border.style.opacity = "0";
        return;
      }
      border.style.opacity = "1";
      const activeItem = menuItemRefs.value[activeIndex.value];
      const menuEl = activeItem.parentElement;
      const itemRect = activeItem.getBoundingClientRect();
      const menuRect = menuEl.getBoundingClientRect();
      if ((void 0).innerWidth <= 1024) {
        const left = Math.floor(itemRect.left - menuRect.left + itemRect.width / 2 - border.offsetWidth / 2);
        border.style.transform = `translate3d(${left}px, 0, 0) rotate(0deg)`;
      } else {
        const top = Math.floor(itemRect.top - menuRect.top + itemRect.height / 2 - border.offsetWidth / 2);
        const leftOffset = 0;
        border.style.transform = `translate3d(${leftOffset}em, ${top}px, 0) rotate(90deg)`;
      }
    };
    watch(() => props.activeKey, (newKey) => {
      const index = menuItems.value.findIndex((i) => i.key === newKey);
      activeIndex.value = index;
      nextTick(updateBorderPosition);
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "sidebar-container" }, _attrs))} data-v-999d6a9d><menu class="menu" data-v-999d6a9d><!--[-->`);
      ssrRenderList(menuItems.value, (item, index) => {
        _push(`<button class="${ssrRenderClass([{ active: activeIndex.value === index }, "menu__item"])}" style="${ssrRenderStyle({ "--bgColorItem": item.color })}" data-v-999d6a9d><svg class="icon" viewBox="0 0 24 24" data-v-999d6a9d>${item.iconPath ?? ""}</svg><div class="tooltip" data-v-999d6a9d>${ssrInterpolate(getLabel(item.key))}</div></button>`);
      });
      _push(`<!--]--><div class="menu__border" data-v-999d6a9d></div></menu><div class="svg-container" data-v-999d6a9d><svg viewBox="0 0 202.9 45.5" data-v-999d6a9d><clipPath id="menu" clipPathUnits="objectBoundingBox" transform="scale(0.0049285362247413 0.021978021978022)" data-v-999d6a9d><path d="M6.7,45.5c5.7,0.1,14.1-0.4,23.3-4c5.7-2.3,9.9-5,18.1-10.5c10.7-7.1,11.8-9.2,20.6-14.3c5-2.9,9.2-5.2,15.2-7 c7.1-2.1,13.3-2.3,17.6-2.1c4.2-0.2,10.5,0.1,17.6,2.1c6.1,1.8,10.2,4.1,15.2,7c8.8,5,9.9,7.1,20.6,14.3c8.3,5.5,12.4,8.2,18.1,10.5 c9.2,3.6,17.6,4.2,23.3,4H6.7z" data-v-999d6a9d></path></clipPath></svg></div></div>`);
    };
  }
};
const _sfc_setup$f = _sfc_main$f.setup;
_sfc_main$f.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/VerticalSidebar.vue");
  return _sfc_setup$f ? _sfc_setup$f(props, ctx) : void 0;
};
const VerticalSidebar = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["__scopeId", "data-v-999d6a9d"]]);
const _sfc_main$e = {
  __name: "HomeContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showContent = ref(false);
    const { t } = useI18n();
    const boldify = (text) => {
      if (text && text.includes(":")) {
        const parts = text.split(":");
        return `<strong>${parts[0]}:</strong>${parts.slice(1).join(":")}`;
      }
      return text;
    };
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 500);
      }
    });
    ref(null);
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "home-content" }, _attrs))} data-v-a28132c9><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-a28132c9><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("hero.title"))} data-v-a28132c9><span class="title-shadow" data-v-a28132c9>${ssrInterpolate(unref(t)("hero.title"))}</span><span class="title-front" data-v-a28132c9>${ssrInterpolate(unref(t)("hero.title"))}</span></h1></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-a28132c9><div class="intro-block" data-v-a28132c9><h2 data-v-a28132c9>${ssrInterpolate(unref(t)("hero.subtitle"))}</h2><p class="subtitle" data-v-a28132c9>${ssrInterpolate(unref(t)("hero.desc"))}</p><div class="buttons-row" data-v-a28132c9><button class="cta-btn primary" data-v-a28132c9><svg class="btn-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="${ssrRenderStyle({ "margin-right": "8px" })}" data-v-a28132c9><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" data-v-a28132c9></path><polyline points="7 10 12 15 17 10" data-v-a28132c9></polyline><line x1="12" y1="15" x2="12" y2="3" data-v-a28132c9></line></svg> ${ssrInterpolate(unref(t)("hero.install_btn"))}</button><button class="cta-btn secondary" data-v-a28132c9>${ssrInterpolate(unref(t)("hero.track_btn_hero"))}</button><a href="https://wa.me/77087648100" target="_blank" class="cta-btn whatsapp" data-v-a28132c9>${ssrInterpolate(unref(t)("hero.whatsapp_btn"))}</a></div></div><div class="info-grid" data-v-a28132c9><div class="info-card b2c" data-v-a28132c9><h3 data-v-a28132c9>${ssrInterpolate(unref(t)("home.b2c.title"))}</h3><ul data-v-a28132c9><!--[-->`);
      ssrRenderList(unref(t)("home.b2c.items"), (item, i) => {
        _push(`<li data-v-a28132c9>${ssrInterpolate(item)}</li>`);
      });
      _push(`<!--]--></ul></div><div class="info-card b2b" data-v-a28132c9><h3 data-v-a28132c9>${ssrInterpolate(unref(t)("home.b2b.title"))}</h3><ul data-v-a28132c9><!--[-->`);
      ssrRenderList(unref(t)("home.b2b.items"), (item, i) => {
        _push(`<li data-v-a28132c9>${ssrInterpolate(item)}</li>`);
      });
      _push(`<!--]--></ul></div><div class="info-card why" data-v-a28132c9><h3 data-v-a28132c9>${ssrInterpolate(unref(t)("home.why.title"))}</h3><ul data-v-a28132c9><!--[-->`);
      ssrRenderList(unref(t)("home.why.items"), (item, i) => {
        _push(`<li data-v-a28132c9>${boldify(item) ?? ""}</li>`);
      });
      _push(`<!--]--></ul></div><div class="info-card steps" data-v-a28132c9><h3 data-v-a28132c9>${ssrInterpolate(unref(t)("home.steps.title"))}</h3><ol data-v-a28132c9><!--[-->`);
      ssrRenderList(unref(t)("home.steps.items"), (item, i) => {
        _push(`<li data-v-a28132c9>${ssrInterpolate(item)}</li>`);
      });
      _push(`<!--]--></ol></div></div></div></div>`);
    };
  }
};
const _sfc_setup$e = _sfc_main$e.setup;
_sfc_main$e.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/HomeContent.vue");
  return _sfc_setup$e ? _sfc_setup$e(props, ctx) : void 0;
};
const HomeContent = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["__scopeId", "data-v-a28132c9"]]);
const _sfc_main$d = {
  __name: "ServicesContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const showContent = ref(false);
    const { t } = useI18n();
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 300);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "services-content" }, _attrs))} data-v-6d3d3c12><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-6d3d3c12><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("services_page.title"))} data-v-6d3d3c12><span class="title-shadow" data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.title"))}</span><span class="title-front" data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.title"))}</span></h1><p class="service-subtitle" data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.subtitle"))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-6d3d3c12><div class="services-grid" data-v-6d3d3c12><!--[-->`);
      ssrRenderList(unref(t)("services_page.cards"), (item, i) => {
        _push(`<div class="card" data-v-6d3d3c12><div class="icon" data-v-6d3d3c12>${ssrInterpolate(item.icon)}</div><div class="text" data-v-6d3d3c12><h3 data-v-6d3d3c12>${ssrInterpolate(item.title)}</h3><p data-v-6d3d3c12>${item.desc ?? ""}</p></div></div>`);
      });
      _push(`<!--]--></div><div class="bottom-cta" data-v-6d3d3c12><div class="cta-text" data-v-6d3d3c12><h2 data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.cta.title"))}</h2><p data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.cta.text"))}</p></div><div class="cta-buttons" data-v-6d3d3c12><a href="https://wa.me/77087648100" target="_blank" class="btn whatsapp" data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.cta.whatsapp"))}</a><button class="btn login" data-v-6d3d3c12>${ssrInterpolate(unref(t)("services_page.cta.login"))}</button></div></div></div></div>`);
    };
  }
};
const _sfc_setup$d = _sfc_main$d.setup;
_sfc_main$d.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ServicesContent.vue");
  return _sfc_setup$d ? _sfc_setup$d(props, ctx) : void 0;
};
const ServicesContent = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["__scopeId", "data-v-6d3d3c12"]]);
const _sfc_main$c = {
  __name: "AboutContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const showContent = ref(false);
    const { t } = useI18n();
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 100);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "about-content" }, _attrs))} data-v-5647c35a><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-5647c35a><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("about_page.title"))} data-v-5647c35a><span class="title-shadow" data-v-5647c35a>${ssrInterpolate(unref(t)("about_page.title"))}</span><span class="title-front" data-v-5647c35a>${ssrInterpolate(unref(t)("about_page.title"))}</span></h1><p class="about-subtitle" data-v-5647c35a>${ssrInterpolate(unref(t)("about_page.subtitle"))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-5647c35a><div class="intro-section" data-v-5647c35a><p class="description" data-v-5647c35a>${ssrInterpolate(unref(t)("about_page.description"))}</p><div class="stats-row" data-v-5647c35a><div class="stat-item" data-v-5647c35a><strong data-v-5647c35a>5+</strong> ${ssrInterpolate(unref(t)("about_page.stats.years"))}</div><div class="stat-item" data-v-5647c35a><strong data-v-5647c35a>100k+</strong> ${ssrInterpolate(unref(t)("about_page.stats.parcels"))}</div><div class="stat-item" data-v-5647c35a><strong data-v-5647c35a>100%</strong> ${ssrInterpolate(unref(t)("about_page.stats.resp"))}</div></div></div><div class="principles-grid" data-v-5647c35a><!--[-->`);
      ssrRenderList(unref(t)("about_page.principles"), (item, i) => {
        _push(`<div class="card" data-v-5647c35a><h3 data-v-5647c35a>${ssrInterpolate(item.title)}</h3><p data-v-5647c35a>${ssrInterpolate(item.desc)}</p></div>`);
      });
      _push(`<!--]--></div><div class="why-us-row" data-v-5647c35a><!--[-->`);
      ssrRenderList(unref(t)("about_page.why_bottom"), (item, i) => {
        _push(`<div class="check-item" data-v-5647c35a>${ssrInterpolate(item)}</div>`);
      });
      _push(`<!--]--></div></div></div>`);
    };
  }
};
const _sfc_setup$c = _sfc_main$c.setup;
_sfc_main$c.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AboutContent.vue");
  return _sfc_setup$c ? _sfc_setup$c(props, ctx) : void 0;
};
const AboutContent = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["__scopeId", "data-v-5647c35a"]]);
const _sfc_main$b = {
  __name: "ContactsContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const showContent = ref(false);
    const { t } = useI18n();
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 100);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "contacts-content" }, _attrs))} data-v-256bf29e><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-256bf29e><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("contacts_page.title"))} data-v-256bf29e><span class="title-shadow" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.title"))}</span><span class="title-front" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.title"))}</span></h1><p class="subtitle" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.subtitle"))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-256bf29e><div class="contacts-wrapper" data-v-256bf29e><div class="info-panel" data-v-256bf29e><div class="info-item" data-v-256bf29e><div class="icon-box" data-v-256bf29e>📍</div><div class="details" data-v-256bf29e><h3 data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.address_title"))}</h3><p data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.address"))}</p></div></div><div class="info-item" data-v-256bf29e><div class="icon-box" data-v-256bf29e>📞</div><div class="details" data-v-256bf29e><h3 data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.phone_title"))}</h3><p data-v-256bf29e><a href="tel:+77087648100" data-v-256bf29e>+7 708 764 8100</a></p><p class="small-text" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.phone_sub"))}</p></div></div><div class="info-item" data-v-256bf29e><div class="icon-box" data-v-256bf29e>⏰</div><div class="details" data-v-256bf29e><h3 data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.schedule_title"))}</h3><p data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.schedule_days"))}</p><p class="small-text" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.schedule_off"))}</p></div></div><div class="social-row" data-v-256bf29e><a href="https://wa.me/77087648100" target="_blank" class="btn whatsapp" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.whatsapp_btn"))}</a><a href="https://instagram.com" target="_blank" class="btn instagram" data-v-256bf29e>${ssrInterpolate(unref(t)("contacts_page.instagram_btn"))}</a></div></div><div class="map-box" data-v-256bf29e><div style="${ssrRenderStyle({ "position": "relative", "overflow": "hidden", "height": "100%", "border-radius": "16px" })}" data-v-256bf29e><iframe src="https://yandex.kz/map-widget/v1/?ll=76.872220%2C43.220404&amp;mode=search&amp;oid=231901814988&amp;ol=biz&amp;z=16" width="100%" height="100%" frameborder="0" allowfullscreen="true" style="${ssrRenderStyle({ "position": "absolute", "top": "0", "left": "0", "border": "none", "filter": "invert(90%) hue-rotate(180deg) contrast(90%)" })}" data-v-256bf29e></iframe></div></div></div></div></div>`);
    };
  }
};
const _sfc_setup$b = _sfc_main$b.setup;
_sfc_main$b.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/ContactsContent.vue");
  return _sfc_setup$b ? _sfc_setup$b(props, ctx) : void 0;
};
const ContactsContent = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["__scopeId", "data-v-256bf29e"]]);
const _sfc_main$a = {
  __name: "TrackingContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  setup(__props) {
    const props = __props;
    const showContent = ref(false);
    const trackingNumber = ref("");
    const results = ref([]);
    const searched = ref(false);
    const loading = ref(false);
    const { t } = useI18n();
    const { $db } = useNuxtApp();
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 100);
      }
    });
    const getStatusClass = (status) => {
      const map = {
        pending: "pending",
        in_transit: "transit",
        arrived: "arrived",
        delivered: "delivered",
        lost: "lost"
      };
      return map[status] || "";
    };
    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      if (timestamp.seconds) {
        return new Date(timestamp.seconds * 1e3).toLocaleDateString("ru-RU");
      }
      return new Date(timestamp).toLocaleDateString("ru-RU");
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "tracking-content" }, _attrs))} data-v-087cc2e5><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-087cc2e5><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("features.tracking"))} data-v-087cc2e5><span class="title-shadow" data-v-087cc2e5>${ssrInterpolate(unref(t)("features.tracking"))}</span><span class="title-front" data-v-087cc2e5>${ssrInterpolate(unref(t)("features.tracking"))}</span></h1><p class="subtitle" data-v-087cc2e5>${ssrInterpolate(unref(t)("search.placeholder"))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-087cc2e5><div class="search-box" data-v-087cc2e5><div class="input-wrapper" data-v-087cc2e5><input${ssrRenderAttr("value", trackingNumber.value)}${ssrRenderAttr("placeholder", unref(t)("search.placeholder"))} class="glow-input" data-v-087cc2e5><button class="btn search-btn"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} data-v-087cc2e5>${ssrInterpolate(loading.value ? unref(t)("search.loading") : unref(t)("search.button"))}</button></div></div>`);
      if (results.value && results.value.length) {
        _push(`<div class="results-grid" data-v-087cc2e5><!--[-->`);
        ssrRenderList(results.value, (track, index) => {
          _push(`<div class="result-card" data-v-087cc2e5><div class="card-header" data-v-087cc2e5><span class="track-num" data-v-087cc2e5>${ssrInterpolate(track.number)}</span><span class="${ssrRenderClass(["status-badge", getStatusClass(track.status)])}" data-v-087cc2e5>${ssrInterpolate(unref(t)("status." + track.status))}</span></div><div class="card-body" data-v-087cc2e5>`);
          if (track.description) {
            _push(`<div class="detail-row" data-v-087cc2e5><span class="label" data-v-087cc2e5>${ssrInterpolate(unref(t)("search.desc"))}:</span><span class="value" data-v-087cc2e5>${ssrInterpolate(track.description)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (track.sentAt) {
            _push(`<div class="detail-row" data-v-087cc2e5><span class="label" data-v-087cc2e5>${ssrInterpolate(unref(t)("search.sent"))}:</span><span class="value" data-v-087cc2e5>${ssrInterpolate(track.sentAt)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (track.arrivedAt) {
            _push(`<div class="detail-row" data-v-087cc2e5><span class="label" data-v-087cc2e5>${ssrInterpolate(unref(t)("search.arrived"))}:</span><span class="value" data-v-087cc2e5>${ssrInterpolate(formatDate(track.arrivedAt))}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          if (track.batchNumber) {
            _push(`<div class="detail-row" data-v-087cc2e5><span class="label" data-v-087cc2e5>${ssrInterpolate(unref(t)("search.batch"))}:</span><span class="value" data-v-087cc2e5>${ssrInterpolate(track.batchNumber)}</span></div>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div></div>`);
        });
        _push(`<!--]--></div>`);
      } else if (searched.value) {
        _push(`<div class="status-msg" data-v-087cc2e5><p data-v-087cc2e5>${ssrInterpolate(unref(t)("search.no_results"))} &quot;${ssrInterpolate(trackingNumber.value)}&quot;</p></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$a = _sfc_main$a.setup;
_sfc_main$a.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/TrackingContent.vue");
  return _sfc_setup$a ? _sfc_setup$a(props, ctx) : void 0;
};
const TrackingContent = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["__scopeId", "data-v-087cc2e5"]]);
const _sfc_main$9 = {
  __name: "PrivacyContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  emits: ["close"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showContent = ref(false);
    const { t } = useI18n();
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 100);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "privacy-content" }, _attrs))} data-v-0bf0deea><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-0bf0deea><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("privacy_page.title"))} data-v-0bf0deea><span class="title-shadow" data-v-0bf0deea>${ssrInterpolate(unref(t)("privacy_page.title"))}</span><span class="title-front" data-v-0bf0deea>${ssrInterpolate(unref(t)("privacy_page.title"))}</span></h1><p class="subtitle" data-v-0bf0deea>${ssrInterpolate(unref(t)("privacy_page.subtitle").replace("{date}", (/* @__PURE__ */ new Date()).toLocaleDateString()))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-0bf0deea><div class="glass-panel" data-v-0bf0deea><!--[-->`);
      ssrRenderList(unref(t)("privacy_page.sections"), (section, index) => {
        _push(`<div data-v-0bf0deea><h2 class="section-title" data-v-0bf0deea>${ssrInterpolate(section.title)}</h2><p class="text" data-v-0bf0deea>${ssrInterpolate(section.text)}</p>`);
        if (section.list) {
          _push(`<ul class="list" data-v-0bf0deea><!--[-->`);
          ssrRenderList(section.list, (li, l) => {
            _push(`<li data-v-0bf0deea>${li ?? ""}</li>`);
          });
          _push(`<!--]--></ul>`);
        } else {
          _push(`<!---->`);
        }
        _push(`</div>`);
      });
      _push(`<!--]--><a href="https://wa.me/77087648100" target="_blank" class="whatsapp-btn" data-v-0bf0deea>${ssrInterpolate(unref(t)("privacy_page.whatsapp"))}</a><div class="footer-link" data-v-0bf0deea><a href="#" class="back-link" data-v-0bf0deea>${ssrInterpolate(unref(t)("privacy_page.back"))}</a></div></div></div></div>`);
    };
  }
};
const _sfc_setup$9 = _sfc_main$9.setup;
_sfc_main$9.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/PrivacyContent.vue");
  return _sfc_setup$9 ? _sfc_setup$9(props, ctx) : void 0;
};
const PrivacyContent = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["__scopeId", "data-v-0bf0deea"]]);
const _sfc_main$8 = {
  __name: "LoginContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showContent = ref(false);
    const loading = ref(false);
    const error = ref("");
    const telegramPolling = ref(false);
    const { t } = useI18n();
    const { $auth } = useNuxtApp();
    useRouter();
    watch(() => props.triggerAnim, (val) => {
      if (val) {
        setTimeout(() => {
          showContent.value = true;
        }, 100);
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "login-content" }, _attrs))} data-v-a2a04f69><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-a2a04f69><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("auth_pages.login.title"))} data-v-a2a04f69><span class="title-shadow" data-v-a2a04f69>${ssrInterpolate(unref(t)("auth_pages.login.title"))}</span><span class="title-front" data-v-a2a04f69>${ssrInterpolate(unref(t)("auth_pages.login.title"))}</span></h1><p class="subtitle" data-v-a2a04f69>${ssrInterpolate(unref(t)("auth_pages.login.subtitle"))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-a2a04f69><div class="login-card" data-v-a2a04f69><button${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="auth-btn google" data-v-a2a04f69><img src="https://www.svgrepo.com/show/475656/google-color.svg" class="icon" alt="Google" data-v-a2a04f69><span data-v-a2a04f69>${ssrInterpolate(loading.value ? unref(t)("auth_pages.login.loading") : unref(t)("auth_pages.login.google"))}</span></button><button${ssrIncludeBooleanAttr(loading.value || telegramPolling.value) ? " disabled" : ""} class="auth-btn telegram" data-v-a2a04f69><svg class="icon tg-icon" viewBox="0 0 24 24" fill="currentColor" data-v-a2a04f69><path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" data-v-a2a04f69></path></svg>`);
      if (telegramPolling.value) {
        _push(`<span data-v-a2a04f69>${ssrInterpolate(unref(t)("auth_pages.login.telegram_confirm"))}</span>`);
      } else {
        _push(`<span data-v-a2a04f69>${ssrInterpolate(unref(t)("auth_pages.login.telegram"))}</span>`);
      }
      _push(`</button><button class="auth-btn email" data-v-a2a04f69><svg class="icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-a2a04f69><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-v-a2a04f69></path></svg><span data-v-a2a04f69>${ssrInterpolate(unref(t)("auth_pages.login.email_btn"))}</span></button>`);
      if (error.value) {
        _push(`<p class="error-msg" data-v-a2a04f69>${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$8 = _sfc_main$8.setup;
_sfc_main$8.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/LoginContent.vue");
  return _sfc_setup$8 ? _sfc_setup$8(props, ctx) : void 0;
};
const LoginContent = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["__scopeId", "data-v-a2a04f69"]]);
const _sfc_main$7 = {
  __name: "EmailAuthContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const props = __props;
    const showContent = ref(false);
    const { $auth } = useNuxtApp();
    const { t } = useI18n();
    const name = ref("");
    const email = ref("");
    const avatarPreview = ref(null);
    const loading = ref(false);
    const sent = ref(false);
    watch(() => props.triggerAnim, (val) => {
      if (val) setTimeout(() => {
        showContent.value = true;
      }, 100);
    });
    const mailProviderLink = computed(() => {
      if (!email.value) return null;
      const domain = email.value.split("@")[1]?.toLowerCase();
      if (!domain) return null;
      const providers = {
        "gmail.com": "https://mail.google.com/",
        "mail.ru": "https://e.mail.ru/inbox/",
        "bk.ru": "https://e.mail.ru/inbox/",
        "list.ru": "https://e.mail.ru/inbox/",
        "inbox.ru": "https://e.mail.ru/inbox/",
        "yandex.ru": "https://mail.yandex.ru/",
        "ya.ru": "https://mail.yandex.ru/",
        "icloud.com": "https://www.icloud.com/mail",
        "me.com": "https://www.icloud.com/mail",
        "yahoo.com": "https://mail.yahoo.com/",
        "outlook.com": "https://outlook.live.com/mail/",
        "hotmail.com": "https://outlook.live.com/mail/",
        "proton.me": "https://mail.proton.me/",
        "protonmail.com": "https://mail.proton.me/",
        "ukr.net": "https://mail.ukr.net/"
      };
      return providers[domain] || `http://${domain}`;
    });
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "email-content" }, _attrs))} data-v-d68515a3><div class="${ssrRenderClass([{ visible: showContent.value }, "title-container"])}" data-v-d68515a3><h1 class="main-title"${ssrRenderAttr("data-text", unref(t)("auth_pages.email.title"))} data-v-d68515a3><span class="title-shadow" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.title"))}</span><span class="title-front" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.title"))}</span></h1><p class="subtitle" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.subtitle"))}</p></div><div class="${ssrRenderClass([{ visible: showContent.value }, "content-body"])}" data-v-d68515a3><div class="glass-card" data-v-d68515a3>`);
      if (sent.value) {
        _push(`<div class="success-state" data-v-d68515a3><div class="icon-circle" data-v-d68515a3><svg class="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d68515a3><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" data-v-d68515a3></path></svg></div><h3 class="success-title" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.sent_title"))}</h3><p class="text-gray-300 mb-6" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.sent_text_1"))} <strong data-v-d68515a3>${ssrInterpolate(email.value)}</strong>.<br data-v-d68515a3> ${ssrInterpolate(unref(t)("auth_pages.email.sent_text_2"))}</p>`);
        if (mailProviderLink.value) {
          _push(`<a${ssrRenderAttr("href", mailProviderLink.value)} target="_blank" class="action-btn primary mb-4" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.open_mail"))}</a>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button class="text-blue-400 hover:text-blue-300 underline" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.use_other_mail"))}</button></div>`);
      } else {
        _push(`<form class="auth-form" data-v-d68515a3><div class="form-group" data-v-d68515a3><label data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.name_label"))}</label><input${ssrRenderAttr("value", name.value)} type="text" required class="input-field"${ssrRenderAttr("placeholder", unref(t)("auth_pages.email.name_placeholder"))} data-v-d68515a3></div><div class="form-group" data-v-d68515a3><label data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.email_label"))}</label><input${ssrRenderAttr("value", email.value)} type="email" required class="input-field"${ssrRenderAttr("placeholder", unref(t)("auth_pages.email.email_placeholder"))} data-v-d68515a3></div><div class="form-group" data-v-d68515a3><label data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.avatar_label"))}</label><div class="avatar-upload" data-v-d68515a3><div class="avatar-preview" data-v-d68515a3>`);
        if (avatarPreview.value) {
          _push(`<img${ssrRenderAttr("src", avatarPreview.value)} data-v-d68515a3>`);
        } else {
          _push(`<div class="placeholder-icon" data-v-d68515a3><svg fill="none" stroke="currentColor" viewBox="0 0 24 24" data-v-d68515a3><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" data-v-d68515a3></path></svg></div>`);
        }
        _push(`</div><label class="upload-btn" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.upload_btn"))} <input type="file" class="hidden" accept="image/*" data-v-d68515a3></label></div><p class="hint" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.hint"))}</p></div><button type="submit"${ssrIncludeBooleanAttr(loading.value) ? " disabled" : ""} class="action-btn primary submit-btn" data-v-d68515a3>`);
        if (loading.value) {
          _push(`<span data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.submit_loading"))}</span>`);
        } else {
          _push(`<span data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.submit"))}</span>`);
        }
        _push(`</button><div class="back-link-container" data-v-d68515a3><a href="#" class="text-blue-400 hover:text-blue-300" data-v-d68515a3>${ssrInterpolate(unref(t)("auth_pages.email.back"))}</a></div></form>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$7 = _sfc_main$7.setup;
_sfc_main$7.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/EmailAuthContent.vue");
  return _sfc_setup$7 ? _sfc_setup$7(props, ctx) : void 0;
};
const EmailAuthContent = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["__scopeId", "data-v-d68515a3"]]);
const _sfc_main$6 = {
  __name: "AuthFinishContent",
  __ssrInlineRender: true,
  setup(__props) {
    const { $auth } = useNuxtApp();
    useRouter();
    const { t } = useI18n();
    const processing = ref(true);
    const waitingForEmail = ref(false);
    const emailInput = ref("");
    const error = ref("");
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "auth-finish-content" }, _attrs))} data-v-38fa1f07><div class="glass-card" data-v-38fa1f07>`);
      if (processing.value) {
        _push(`<div class="state-container" data-v-38fa1f07><div class="spinner" data-v-38fa1f07></div><h2 class="state-title" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.processing_title"))}</h2><p class="state-desc" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.processing_desc"))}</p></div>`);
      } else if (waitingForEmail.value) {
        _push(`<div class="state-container left-align" data-v-38fa1f07><h2 class="state-title" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.confirm_title"))}</h2><p class="state-desc" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.confirm_desc"))}</p><form class="auth-form" data-v-38fa1f07><input${ssrRenderAttr("value", emailInput.value)} type="email" required class="input-field" placeholder="name@example.com" data-v-38fa1f07>`);
        if (error.value) {
          _push(`<p class="error-text" data-v-38fa1f07>${ssrInterpolate(error.value)}</p>`);
        } else {
          _push(`<!---->`);
        }
        _push(`<button type="submit" class="action-btn primary" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.confirm_btn"))}</button></form></div>`);
      } else if (error.value) {
        _push(`<div class="state-container" data-v-38fa1f07><h3 class="error-title" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.error_title"))}</h3><p class="error-text" data-v-38fa1f07>${ssrInterpolate(error.value)}</p><button class="text-blue-400 hover:underline mt-4" data-v-38fa1f07>${ssrInterpolate(unref(t)("auth_pages.finish.retry"))}</button></div>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$6 = _sfc_main$6.setup;
_sfc_main$6.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AuthFinishContent.vue");
  return _sfc_setup$6 ? _sfc_setup$6(props, ctx) : void 0;
};
const AuthFinishContent = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["__scopeId", "data-v-38fa1f07"]]);
const _sfc_main$5 = {
  __name: "DashboardContent",
  __ssrInlineRender: true,
  props: {
    triggerAnim: {
      type: Boolean,
      default: false
    }
  },
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const { $db, $auth } = useNuxtApp();
    const { t } = useI18n();
    const newTrackNumber = ref("");
    const newTrackDescription = ref("");
    const tracks = ref([]);
    const loading = ref(false);
    const loadingData = ref(true);
    const error = ref("");
    const isAdmin = computed(() => {
      const currentUser = $auth?.currentUser;
      if (!currentUser) return false;
      return currentUser.email === "kairfakomylife@gmail.com";
    });
    const userName = computed(() => {
      const currentUser = $auth?.currentUser;
      if (!currentUser) return "Пользователь";
      return currentUser.displayName || currentUser.email?.split("@")[0] || "Пользователь";
    });
    const userPhoto = computed(() => {
      const currentUser = $auth?.currentUser;
      return currentUser?.photoURL || null;
    });
    const formatDate = (timestamp) => {
      if (!timestamp) return "";
      return new Date(timestamp.seconds * 1e3).toLocaleDateString("ru-RU");
    };
    const getStatusLabel = (status) => {
      return t("status." + status);
    };
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "dashboard-content" }, _attrs))} data-v-f77eac96><div class="header-section" data-v-f77eac96><div class="user-profile" data-v-f77eac96><div class="avatar-ring" data-v-f77eac96><img${ssrRenderAttr("src", userPhoto.value || "/logo.png")}${ssrRenderAttr("alt", userName.value)} class="user-avatar" data-v-f77eac96></div><div class="user-info" data-v-f77eac96><p class="welcome-text" data-v-f77eac96>${ssrInterpolate(unref(t)("dashboard.welcome"))}</p><h1 class="user-name"${ssrRenderAttr("data-text", userName.value)} data-v-f77eac96>${ssrInterpolate(userName.value)}</h1></div></div><div class="header-actions" data-v-f77eac96><button class="icon-btn"${ssrRenderAttr("title", unref(t)("dashboard.enable_notifications"))} data-v-f77eac96><span class="icon" data-v-f77eac96>🔔</span></button>`);
      if (isAdmin.value) {
        _push(`<button class="icon-btn admin-btn"${ssrRenderAttr("title", unref(t)("dashboard.admin_panel"))} data-v-f77eac96><span class="icon" data-v-f77eac96>⚡</span></button>`);
      } else {
        _push(`<!---->`);
      }
      _push(`<button class="icon-btn logout-btn"${ssrRenderAttr("title", unref(t)("nav.logout"))} data-v-f77eac96><span class="icon" data-v-f77eac96>🚪</span></button></div></div><div class="stats-grid" data-v-f77eac96><div class="stat-card" data-v-f77eac96><div class="stat-icon" data-v-f77eac96>📦</div><div class="stat-info" data-v-f77eac96><span class="stat-value" data-v-f77eac96>${ssrInterpolate(tracks.value.length)}</span><span class="stat-label" data-v-f77eac96>Всего посылок</span></div></div><div class="stat-card blue" data-v-f77eac96><div class="stat-icon" data-v-f77eac96>🚚</div><div class="stat-info" data-v-f77eac96><span class="stat-value" data-v-f77eac96>${ssrInterpolate(tracks.value.filter((t2) => t2.status === "in_transit").length)}</span><span class="stat-label" data-v-f77eac96>В пути</span></div></div><div class="stat-card green" data-v-f77eac96><div class="stat-icon" data-v-f77eac96>✅</div><div class="stat-info" data-v-f77eac96><span class="stat-value" data-v-f77eac96>${ssrInterpolate(tracks.value.filter((t2) => t2.status === "delivered").length)}</span><span class="stat-label" data-v-f77eac96>Доставлено</span></div></div></div><div class="dashboard-main" data-v-f77eac96><div class="glass-panel add-track-panel" data-v-f77eac96><h2 class="panel-title" data-v-f77eac96>${ssrInterpolate(unref(t)("dashboard.add_track"))}</h2><div class="input-group" data-v-f77eac96><input${ssrRenderAttr("value", newTrackNumber.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("dashboard.placeholder_track") + " *")} class="glass-input" data-v-f77eac96><input${ssrRenderAttr("value", newTrackDescription.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("dashboard.placeholder_desc"))} class="glass-input" data-v-f77eac96><button${ssrIncludeBooleanAttr(!newTrackNumber.value || loading.value) ? " disabled" : ""} class="action-btn" data-v-f77eac96>${ssrInterpolate(loading.value ? unref(t)("dashboard.adding") : unref(t)("dashboard.add_btn"))}</button></div>`);
      if (error.value) {
        _push(`<p class="error-msg" data-v-f77eac96>${ssrInterpolate(error.value)}</p>`);
      } else {
        _push(`<!---->`);
      }
      _push(`</div><div class="glass-panel list-panel" data-v-f77eac96><h2 class="panel-title" data-v-f77eac96>${ssrInterpolate(unref(t)("dashboard.my_parcels"))}</h2>`);
      if (loadingData.value) {
        _push(`<div class="loading-state" data-v-f77eac96><div class="spinner" data-v-f77eac96></div><p data-v-f77eac96>${ssrInterpolate(unref(t)("dashboard.loading"))}</p></div>`);
      } else if (tracks.value.length === 0) {
        _push(`<div class="empty-state" data-v-f77eac96><span class="empty-icon" data-v-f77eac96>📭</span><p data-v-f77eac96>${ssrInterpolate(unref(t)("dashboard.no_parcels"))}</p></div>`);
      } else {
        _push(`<div class="tracks-list" data-v-f77eac96><!--[-->`);
        ssrRenderList(tracks.value, (track) => {
          _push(`<div class="track-item" data-v-f77eac96><div class="track-info" data-v-f77eac96><div class="track-header" data-v-f77eac96><span class="track-number" data-v-f77eac96>${ssrInterpolate(track.number)}</span>`);
          if (track.description) {
            _push(`<span class="track-desc-badge" data-v-f77eac96>${ssrInterpolate(track.description)}</span>`);
          } else {
            _push(`<!---->`);
          }
          _push(`</div><span class="track-date" data-v-f77eac96>${ssrInterpolate(unref(t)("dashboard.added"))} ${ssrInterpolate(formatDate(track.createdAt))}</span></div><div class="track-actions" data-v-f77eac96><span class="${ssrRenderClass(["status-badge", track.status])}" data-v-f77eac96>${ssrInterpolate(getStatusLabel(track.status))}</span><button class="delete-btn" title="Удалить" data-v-f77eac96> ✕ </button></div></div>`);
        });
        _push(`<!--]--></div>`);
      }
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$5 = _sfc_main$5.setup;
_sfc_main$5.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/DashboardContent.vue");
  return _sfc_setup$5 ? _sfc_setup$5(props, ctx) : void 0;
};
const DashboardContent = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["__scopeId", "data-v-f77eac96"]]);
const _sfc_main$4 = {
  __name: "AdminContent",
  __ssrInlineRender: true,
  props: ["triggerAnim"],
  emits: ["navigate"],
  setup(__props, { emit: __emit }) {
    const { $db, $auth } = useNuxtApp();
    const { t } = useI18n();
    const tracks = ref([]);
    const loading = ref(true);
    const isAdmin = ref(false);
    const uploading = ref(false);
    const syncing = ref(false);
    const archiving = ref(false);
    ref(null);
    ref(null);
    const pageSize = ref(50);
    const pageHistory = ref([]);
    ref(null);
    ref(null);
    const isLastPage = ref(false);
    const searchQuery = ref("");
    const selectedTracks = ref([]);
    const bulkStatus = ref("");
    const bulkUpdating = ref(false);
    const allSelected = computed(() => {
      if (tracks.value.length === 0) return false;
      return selectedTracks.value.length === tracks.value.length;
    });
    const isSelected = (id) => selectedTracks.value.includes(id);
    const formatDate = (ts) => ts ? new Date(ts.seconds * 1e3).toLocaleString("ru-RU") : "";
    return (_ctx, _push, _parent, _attrs) => {
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "admin-content" }, _attrs))} data-v-39282d8e><div class="header-section" data-v-39282d8e><div class="title-group" data-v-39282d8e><h1 class="page-title" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.title"))}</h1></div><div class="header-actions" data-v-39282d8e><button class="text-btn" data-v-39282d8e>${ssrInterpolate(unref(t)("nav.profile"))}</button><button class="text-btn danger" data-v-39282d8e>${ssrInterpolate(unref(t)("nav.logout"))}</button></div></div><div class="content-grid" data-v-39282d8e><div class="glass-panel upload-panel" data-v-39282d8e><h2 class="panel-title" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.upload_title"))}</h2><div class="action-buttons-group" data-v-39282d8e><button class="action-btn blue"${ssrIncludeBooleanAttr(uploading.value) ? " disabled" : ""} data-v-39282d8e>`);
      if (uploading.value) {
        _push(`<span data-v-39282d8e>${ssrInterpolate(unref(t)("admin.uploading"))}</span>`);
      } else {
        _push(`<span data-v-39282d8e>${ssrInterpolate(unref(t)("admin.upload_china"))}</span>`);
      }
      _push(`</button><button class="action-btn green"${ssrIncludeBooleanAttr(uploading.value) ? " disabled" : ""} data-v-39282d8e>`);
      if (uploading.value) {
        _push(`<span data-v-39282d8e>${ssrInterpolate(unref(t)("admin.uploading"))}</span>`);
      } else {
        _push(`<span data-v-39282d8e>${ssrInterpolate(unref(t)("admin.upload_received"))}</span>`);
      }
      _push(`</button><button class="action-btn orange"${ssrIncludeBooleanAttr(syncing.value) ? " disabled" : ""} data-v-39282d8e>`);
      if (syncing.value) {
        _push(`<span data-v-39282d8e>${ssrInterpolate(unref(t)("admin.syncing"))}</span>`);
      } else {
        _push(`<span data-v-39282d8e>🔄 ${ssrInterpolate(unref(t)("admin.sync_btn"))}</span>`);
      }
      _push(`</button></div><p class="info-text" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.format_info"))}</p><input type="file" class="hidden" accept=".xlsx, .xls" data-v-39282d8e><input type="file" class="hidden" accept=".xlsx, .xls" data-v-39282d8e></div>`);
      if (!isAdmin.value) {
        _push(`<div class="glass-panel error-panel" data-v-39282d8e><strong class="error-title" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.error_access"))}</strong><span class="error-desc" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.error_access_desc"))}</span></div>`);
      } else {
        _push(`<div class="glass-panel table-panel" data-v-39282d8e><div class="table-header" data-v-39282d8e><h2 class="panel-title mb-0" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.all_parcels"))}</h2><div class="table-controls" data-v-39282d8e><div class="control-group" data-v-39282d8e><span class="control-label" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.rows_per_page"))}</span><select class="glass-select" data-v-39282d8e><option${ssrRenderAttr("value", 50)} data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(pageSize.value) ? ssrLooseContain(pageSize.value, 50) : ssrLooseEqual(pageSize.value, 50)) ? " selected" : ""}>50</option><option${ssrRenderAttr("value", 100)} data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(pageSize.value) ? ssrLooseContain(pageSize.value, 100) : ssrLooseEqual(pageSize.value, 100)) ? " selected" : ""}>100</option><option${ssrRenderAttr("value", 500)} data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(pageSize.value) ? ssrLooseContain(pageSize.value, 500) : ssrLooseEqual(pageSize.value, 500)) ? " selected" : ""}>500</option></select></div><div class="search-wrapper" data-v-39282d8e><input${ssrRenderAttr("value", searchQuery.value)} type="text"${ssrRenderAttr("placeholder", unref(t)("admin.search_placeholder"))} class="glass-input search-input" data-v-39282d8e><button class="search-btn" data-v-39282d8e>🔍</button></div><button class="text-btn small-btn"${ssrIncludeBooleanAttr(archiving.value) ? " disabled" : ""} data-v-39282d8e>${ssrInterpolate(archiving.value ? unref(t)("admin.archiving") : unref(t)("admin.archive_btn"))}</button></div></div>`);
        if (selectedTracks.value.length > 0) {
          _push(`<div class="bulk-actions-bar" data-v-39282d8e><span class="bulk-label" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.bulk_selected"))} ${ssrInterpolate(selectedTracks.value.length)}</span><div class="bulk-controls" data-v-39282d8e><select class="glass-select sm" data-v-39282d8e><option value="" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(bulkStatus.value) ? ssrLooseContain(bulkStatus.value, "") : ssrLooseEqual(bulkStatus.value, "")) ? " selected" : ""}>${ssrInterpolate(unref(t)("admin.bulk_status_placeholder"))}</option><option value="pending" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(bulkStatus.value) ? ssrLooseContain(bulkStatus.value, "pending") : ssrLooseEqual(bulkStatus.value, "pending")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.pending"))}</option><option value="in_transit" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(bulkStatus.value) ? ssrLooseContain(bulkStatus.value, "in_transit") : ssrLooseEqual(bulkStatus.value, "in_transit")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.in_transit"))}</option><option value="arrived" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(bulkStatus.value) ? ssrLooseContain(bulkStatus.value, "arrived") : ssrLooseEqual(bulkStatus.value, "arrived")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.arrived"))}</option><option value="delivered" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(bulkStatus.value) ? ssrLooseContain(bulkStatus.value, "delivered") : ssrLooseEqual(bulkStatus.value, "delivered")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.delivered"))}</option><option value="lost" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(bulkStatus.value) ? ssrLooseContain(bulkStatus.value, "lost") : ssrLooseEqual(bulkStatus.value, "lost")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.lost"))}</option></select><button${ssrIncludeBooleanAttr(!bulkStatus.value || bulkUpdating.value) ? " disabled" : ""} class="action-btn small blue" data-v-39282d8e>${ssrInterpolate(bulkUpdating.value ? unref(t)("admin.bulk_applying") : unref(t)("admin.bulk_apply"))}</button><button class="text-btn small-btn" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.bulk_clear"))}</button></div></div>`);
        } else {
          _push(`<!---->`);
        }
        if (loading.value) {
          _push(`<div class="loading-state" data-v-39282d8e><div class="spinner" data-v-39282d8e></div><p data-v-39282d8e>${ssrInterpolate(unref(t)("admin.loading_data"))}</p></div>`);
        } else {
          _push(`<div class="table-container" data-v-39282d8e><table class="glass-table" data-v-39282d8e><thead data-v-39282d8e><tr data-v-39282d8e><th class="w-10" data-v-39282d8e><input type="checkbox"${ssrIncludeBooleanAttr(allSelected.value) ? " checked" : ""} class="checkbox-custom" data-v-39282d8e></th><th data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.track"))}</th><th data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.desc"))}</th><th data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.email"))}</th><th data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.name"))}</th><th data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.date"))}</th><th data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.status"))}</th><th class="text-right" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.table.actions"))}</th></tr></thead><tbody data-v-39282d8e><!--[-->`);
          ssrRenderList(tracks.value, (track) => {
            _push(`<tr class="${ssrRenderClass({ "selected-row": isSelected(track.id) })}" data-v-39282d8e><td class="text-center" data-v-39282d8e><input type="checkbox"${ssrIncludeBooleanAttr(isSelected(track.id)) ? " checked" : ""} class="checkbox-custom" data-v-39282d8e></td><td class="font-mono" data-v-39282d8e>${ssrInterpolate(track.number)}</td><td class="desc-cell"${ssrRenderAttr("title", track.description)} data-v-39282d8e>${ssrInterpolate(track.description || "-")}</td><td data-v-39282d8e>${ssrInterpolate(track.userEmail || "-")}</td><td data-v-39282d8e>${ssrInterpolate(track.userName || "-")}</td><td class="text-sm date-cell" data-v-39282d8e>${ssrInterpolate(formatDate(track.createdAt))}</td><td data-v-39282d8e><select class="${ssrRenderClass([track.status, "status-select"])}" data-v-39282d8e><option value="pending" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(track.status) ? ssrLooseContain(track.status, "pending") : ssrLooseEqual(track.status, "pending")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.pending"))}</option><option value="in_transit" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(track.status) ? ssrLooseContain(track.status, "in_transit") : ssrLooseEqual(track.status, "in_transit")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.in_transit"))}</option><option value="arrived" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(track.status) ? ssrLooseContain(track.status, "arrived") : ssrLooseEqual(track.status, "arrived")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.arrived"))}</option><option value="delivered" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(track.status) ? ssrLooseContain(track.status, "delivered") : ssrLooseEqual(track.status, "delivered")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.delivered"))}</option><option value="lost" data-v-39282d8e${ssrIncludeBooleanAttr(Array.isArray(track.status) ? ssrLooseContain(track.status, "lost") : ssrLooseEqual(track.status, "lost")) ? " selected" : ""}>${ssrInterpolate(unref(t)("status.lost"))}</option></select></td><td class="text-right" data-v-39282d8e><button class="delete-icon-btn" title="Удалить" data-v-39282d8e> ✕ </button></td></tr>`);
          });
          _push(`<!--]--></tbody></table></div>`);
        }
        _push(`<div class="pagination-footer" data-v-39282d8e><span class="page-info" data-v-39282d8e>На странице: ${ssrInterpolate(tracks.value.length)}</span><div class="pagination-buttons" data-v-39282d8e><button${ssrIncludeBooleanAttr(pageHistory.value.length === 0) ? " disabled" : ""} class="nav-btn" data-v-39282d8e> ← ${ssrInterpolate(unref(t)("admin.prev"))}</button><button${ssrIncludeBooleanAttr(isLastPage.value) ? " disabled" : ""} class="nav-btn" data-v-39282d8e>${ssrInterpolate(unref(t)("admin.next"))} → </button></div></div></div>`);
      }
      _push(`</div></div>`);
    };
  }
};
const _sfc_setup$4 = _sfc_main$4.setup;
_sfc_main$4.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("components/AdminContent.vue");
  return _sfc_setup$4 ? _sfc_setup$4(props, ctx) : void 0;
};
const AdminContent = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["__scopeId", "data-v-39282d8e"]]);
const _sfc_main$3 = {
  __name: "page",
  __ssrInlineRender: true,
  setup(__props) {
    const showSplash = ref(true);
    const globePositionX = ref(190);
    const currentView = ref("home");
    useI18n();
    const onMenuSelect = (item) => {
      if (item.key === "services") {
        currentView.value = "services";
      } else if (item.key === "about") {
        currentView.value = "about";
      } else if (item.key === "contacts") {
        currentView.value = "contacts";
      } else if (item.key === "tracking") {
        currentView.value = "tracking";
      } else if (item.key === "login") {
        currentView.value = "login";
      } else {
        currentView.value = "home";
      }
    };
    const goHome = () => {
      currentView.value = "home";
    };
    const goToPrivacy = () => {
      currentView.value = "privacy";
    };
    const navigateTo2 = (key) => {
      currentView.value = key;
    };
    const BASE_SETTINGS = {
      scale: 1.4,
      positionY: 30,
      rotationSpeed: 1,
      // Зафиксированное значение
      flickerIntensity: 0.33,
      // Зафиксированное значение
      gradientIntensity: 1,
      connectionSwitching: 0.01,
      // Зафиксированное значение
      connectionQuantity: 0.01,
      // Зафиксированное значение
      whiteIntensity: 0.1,
      cyanIntensity: 0.63,
      blueIntensity: 0.3,
      purpleIntensity: 0.56,
      purpleHue: 254,
      // Зафиксированное значение
      blueHue: 271,
      // Зафиксированное значение
      cyanHue: 276
      // Зафиксированное значение
    };
    const backgroundHue1 = ref(240);
    const backgroundSaturation1 = ref(44);
    const backgroundLightness1 = ref(19);
    const backgroundHue2 = ref(221);
    const backgroundSaturation2 = ref(96);
    const backgroundLightness2 = ref(0);
    const { locale } = useI18n();
    useHead({
      link: [
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        { rel: "preconnect", href: "https://fonts.gstatic.com", crossorigin: "" },
        { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Montserrat:wght@300;400;500;600;700&display=swap" }
      ],
      htmlAttrs: {
        lang: computed(() => locale.value)
      }
    });
    return (_ctx, _push, _parent, _attrs) => {
      const _component_RocketLaunch = __nuxt_component_0;
      _push(`<div${ssrRenderAttrs(mergeProps({ class: "relative w-full h-screen overflow-hidden" }, _attrs))} data-v-7d7063dd>`);
      if (showSplash.value) {
        _push(ssrRenderComponent(_component_RocketLaunch, {
          onLoaded: ($event) => showSplash.value = false
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="absolute inset-0 w-full h-full" style="${ssrRenderStyle({
        background: `linear-gradient(135deg, hsl(${backgroundHue1.value}, ${backgroundSaturation1.value}%, ${backgroundLightness1.value}%), hsl(${backgroundHue2.value}, ${backgroundSaturation2.value}%, ${backgroundLightness2.value}%))`
      })}" data-v-7d7063dd></div>`);
      _push(ssrRenderComponent(PlexusGlobe, {
        class: "absolute inset-0 w-full h-full",
        scale: BASE_SETTINGS.scale,
        "position-x": globePositionX.value,
        "position-y": BASE_SETTINGS.positionY,
        "rotation-speed": BASE_SETTINGS.rotationSpeed,
        "flicker-intensity": BASE_SETTINGS.flickerIntensity,
        "gradient-intensity": BASE_SETTINGS.gradientIntensity,
        "connection-switching": BASE_SETTINGS.connectionSwitching,
        "connection-quantity": BASE_SETTINGS.connectionQuantity,
        "white-intensity": BASE_SETTINGS.whiteIntensity,
        "cyan-intensity": BASE_SETTINGS.cyanIntensity,
        "blue-intensity": BASE_SETTINGS.blueIntensity,
        "purple-intensity": BASE_SETTINGS.purpleIntensity,
        "purple-hue": BASE_SETTINGS.purpleHue,
        "blue-hue": BASE_SETTINGS.blueHue,
        "cyan-hue": BASE_SETTINGS.cyanHue
      }, null, _parent));
      _push(ssrRenderComponent(VerticalSidebar, {
        "active-key": currentView.value,
        onSelect: onMenuSelect
      }, null, _parent));
      if (currentView.value === "home") {
        _push(ssrRenderComponent(HomeContent, {
          "trigger-anim": !showSplash.value,
          onNavigate: navigateTo2
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "services") {
        _push(ssrRenderComponent(ServicesContent, {
          "trigger-anim": !showSplash.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "about") {
        _push(ssrRenderComponent(AboutContent, {
          "trigger-anim": !showSplash.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "contacts") {
        _push(ssrRenderComponent(ContactsContent, {
          "trigger-anim": !showSplash.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "tracking") {
        _push(ssrRenderComponent(TrackingContent, {
          "trigger-anim": !showSplash.value
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "privacy") {
        _push(ssrRenderComponent(PrivacyContent, {
          "trigger-anim": !showSplash.value,
          onClose: goHome
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "login") {
        _push(ssrRenderComponent(LoginContent, {
          "trigger-anim": !showSplash.value,
          onNavigate: navigateTo2
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "email-auth") {
        _push(ssrRenderComponent(EmailAuthContent, {
          "trigger-anim": !showSplash.value,
          onNavigate: navigateTo2
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "auth-finish") {
        _push(ssrRenderComponent(AuthFinishContent, null, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "dashboard") {
        _push(ssrRenderComponent(DashboardContent, {
          "trigger-anim": !showSplash.value,
          onNavigate: navigateTo2
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      if (currentView.value === "admin") {
        _push(ssrRenderComponent(AdminContent, {
          "trigger-anim": !showSplash.value,
          onNavigate: navigateTo2
        }, null, _parent));
      } else {
        _push(`<!---->`);
      }
      _push(`<div class="relative z-50 w-full h-full flex flex-col justify-between pointer-events-none" data-v-7d7063dd><div class="pointer-events-auto" data-v-7d7063dd>`);
      _push(ssrRenderComponent(WavesHeader, { onLogoClick: goHome }, null, _parent));
      _push(`</div><div class="flex-grow" data-v-7d7063dd></div><div class="pointer-events-auto footer-wrapper" data-v-7d7063dd>`);
      _push(ssrRenderComponent(WavesFooter, { onPrivacyClick: goToPrivacy }, null, _parent));
      _push(`</div></div></div>`);
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app/page.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
const Home = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["__scopeId", "data-v-7d7063dd"]]);
const _sfc_main$2 = {
  components: {
    Home
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Home = resolveComponent("Home");
  _push(`<div${ssrRenderAttrs(mergeProps({ id: "app" }, _attrs))}>`);
  _push(ssrRenderComponent(_component_Home, null, null, _parent));
  _push(`</div>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("app.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
const AppComponent = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender]]);
const _sfc_main$1 = {
  __name: "nuxt-error-page",
  __ssrInlineRender: true,
  props: {
    error: Object
  },
  setup(__props) {
    const props = __props;
    const _error = props.error;
    const statusCode = Number(_error.statusCode || 500);
    const is404 = statusCode === 404;
    const statusMessage = _error.statusMessage ?? (is404 ? "Page Not Found" : "Internal Server Error");
    const description = _error.message || _error.toString();
    const stack = void 0;
    const _Error404 = defineAsyncComponent(() => import("./_nuxt/error-404-BwZMoq80.js"));
    const _Error = defineAsyncComponent(() => import("./_nuxt/error-500-DEKRU9dS.js"));
    const ErrorTemplate = is404 ? _Error404 : _Error;
    return (_ctx, _push, _parent, _attrs) => {
      _push(ssrRenderComponent(unref(ErrorTemplate), mergeProps({ statusCode: unref(statusCode), statusMessage: unref(statusMessage), description: unref(description), stack: unref(stack) }, _attrs), null, _parent));
    };
  }
};
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-error-page.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
const _sfc_main = {
  __name: "nuxt-root",
  __ssrInlineRender: true,
  setup(__props) {
    const IslandRenderer = () => null;
    const nuxtApp = useNuxtApp();
    nuxtApp.deferHydration();
    nuxtApp.ssrContext.url;
    const SingleRenderer = false;
    provide(PageRouteSymbol, useRoute());
    nuxtApp.hooks.callHookWith((hooks) => hooks.map((hook) => hook()), "vue:setup");
    const error = /* @__PURE__ */ useError();
    const abortRender = error.value && !nuxtApp.ssrContext.error;
    onErrorCaptured((err, target, info) => {
      nuxtApp.hooks.callHook("vue:error", err, target, info).catch((hookError) => console.error("[nuxt] Error in `vue:error` hook", hookError));
      {
        const p = nuxtApp.runWithContext(() => showError(err));
        onServerPrefetch(() => p);
        return false;
      }
    });
    const islandContext = nuxtApp.ssrContext.islandContext;
    return (_ctx, _push, _parent, _attrs) => {
      ssrRenderSuspense(_push, {
        default: () => {
          if (unref(abortRender)) {
            _push(`<div></div>`);
          } else if (unref(error)) {
            _push(ssrRenderComponent(unref(_sfc_main$1), { error: unref(error) }, null, _parent));
          } else if (unref(islandContext)) {
            _push(ssrRenderComponent(unref(IslandRenderer), { context: unref(islandContext) }, null, _parent));
          } else if (unref(SingleRenderer)) {
            ssrRenderVNode(_push, createVNode(resolveDynamicComponent(unref(SingleRenderer)), null, null), _parent);
          } else {
            _push(ssrRenderComponent(unref(AppComponent), null, null, _parent));
          }
        },
        _: 1
      });
    };
  }
};
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = useSSRContext();
  (ssrContext.modules || (ssrContext.modules = /* @__PURE__ */ new Set())).add("node_modules/nuxt/dist/app/components/nuxt-root.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
let entry;
{
  entry = async function createNuxtAppServer(ssrContext) {
    const vueApp = createApp(_sfc_main);
    const nuxt = createNuxtApp({ vueApp, ssrContext });
    try {
      await applyPlugins(nuxt, plugins);
      await nuxt.hooks.callHook("app:created", vueApp);
    } catch (error) {
      await nuxt.hooks.callHook("app:error", error);
      nuxt.payload.error ||= createError(error);
    }
    if (ssrContext?._renderResponse) {
      throw new Error("skipping render");
    }
    return vueApp;
  };
}
const entry_default = (ssrContext) => entry(ssrContext);
export {
  _export_sfc as _,
  useNuxtApp as a,
  useRuntimeConfig as b,
  nuxtLinkDefaults as c,
  useHead as d,
  entry_default as default,
  navigateTo as n,
  resolveRouteObject as r,
  useRouter as u
};
//# sourceMappingURL=server.mjs.map
