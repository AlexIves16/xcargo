export default defineEventHandler((event) => {
    setResponseHeader(event, 'Cross-Origin-Opener-Policy', 'same-origin-allow-popups')
    setResponseHeader(event, 'Referrer-Policy', 'no-referrer-when-downgrade')
})
