import { getFirebaseAdmin } from '@/server/utils/firebase'
import { defineEventHandler, readBody, createError } from 'h3'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { trackingNumber, token } = body

    if (!trackingNumber) {
        throw createError({ statusCode: 400, message: 'Missing tracking number' })
    }

    if (!token) {
        throw createError({ statusCode: 422, message: 'Missing CAPTCHA token' })
    }

    // 1. Verify CAPTCHA
    // 1. Verify Google ReCAPTCHA
    const config = useRuntimeConfig()
    // Default to empty string if undefined to avoid crash, but verification will fail if empty
    const secretKey = config.recaptchaSecretKey || process.env.NUXT_RECAPTCHA_SECRET_KEY || ''

    if (!secretKey) {
        console.error('❌ Server missing NUXT_RECAPTCHA_SECRET_KEY')
        throw createError({ statusCode: 500, statusMessage: 'Server configuration error' })
    }

    const verifyUrl = 'https://www.google.com/recaptcha/api/siteverify'
    const formData = new URLSearchParams()
    formData.append('secret', secretKey)
    formData.append('response', token)

    const verifyRes = await $fetch(verifyUrl, {
        method: 'POST',
        body: formData,
    }) as any

    if (!verifyRes.success) {
        console.error('❌ ReCAPTCHA Failed:', verifyRes)
        throw createError({ statusCode: 403, statusMessage: 'CAPTCHA validation failed' })
    }

    // 2. Search in Firestore (Admin SDK - bypasses security rules)
    const { db } = getFirebaseAdmin()

    try {
        const tracksRef = db.collection('tracks')
        const snapshot = await tracksRef.where('number', '==', trackingNumber.trim()).get()

        if (snapshot.empty) {
            return { found: false, results: [] }
        }

        // Map results (sanitize internal fields if necessary)
        const results = snapshot.docs.map(doc => {
            const data = doc.data()
            // Remove userId/email from public result
            const { userId, userEmail, userName, ...publicData } = data
            // Convert timestamps
            if (publicData.createdAt && typeof publicData.createdAt.toDate === 'function') {
                publicData.createdAt = publicData.createdAt.toDate()
            }
            if (publicData.updatedAt && typeof publicData.updatedAt.toDate === 'function') {
                publicData.updatedAt = publicData.updatedAt.toDate()
            }
            return publicData
        })

        return { found: true, results }

    } catch (e) {
        console.error('Tracking API Error:', e)
        throw createError({ statusCode: 500, message: 'Search failed' })
    }
})
