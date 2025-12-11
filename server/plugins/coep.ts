import { defineNitroPlugin } from '#nitro'

export default defineNitroPlugin((nitro) => {
    nitro.hooks.hook('request', (event) => {
        event.res.setHeader('Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
        event.res.setHeader('Cross-Origin-Embedder-Policy', 'unsafe-none')
    })
})
