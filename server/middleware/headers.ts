export default defineEventHandler((event) => {
    setResponseHeader(event, 'Cross-Origin-Opener-Policy', 'unsafe-none')
    setResponseHeader(event, 'Referrer-Policy', 'no-referrer-when-downgrade')
})
