import { defineEventHandler, setHeader } from 'h3'

export default defineEventHandler((event) => {
    // Add COOP and COEP headers to **every** response (HTML, JS, CSS, images, etc.)
    setHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
    setHeader(event, 'Cross-Origin-Embedder-Policy', 'unsafe-none')
})
