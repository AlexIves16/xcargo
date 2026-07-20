import { getFirebaseAdmin } from '@/server/utils/firebase'
import { defineEventHandler, readBody, createError } from 'h3'

const STATUS_MAP: Record<string, string> = {
    'pending': 'Ожидает отправки',
    'in_transit': 'В пути',
    'arrived': 'Прибыл на склад',
    'delivered': 'Доставлен',
    'lost': 'Утерян'
}

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { trackId, status } = body

    if (!trackId || !status) {
        throw createError({ statusCode: 400, message: 'Missing trackId or status' })
    }

    const { db, messaging } = getFirebaseAdmin()

    try {
        // 1. Update the track in Firestore
        const trackRef = db.collection('tracks').doc(trackId)

        // Check if exists
        const trackSnap = await trackRef.get()
        if (!trackSnap.exists) {
            throw createError({ statusCode: 404, message: 'Track not found' })
        }

        await trackRef.update({
            status,
            updatedAt: new Date() // Firestore Timestamp
        })

        const trackData = trackSnap.data()

        // 2. Try to send notification
        let notificationSent = false
        if (trackData && trackData.userId) {
            // Get user profile for FCM token
            const userSnap = await db.collection('users').doc(trackData.userId).get()
            const userData = userSnap.data()

            if (userData && userData.fcmToken) {
                console.log(`🔍 Found FCM Token for user ${userData.email}:`, userData.fcmToken.substring(0, 10) + '...')

                const statusText = STATUS_MAP[status] || status

                const message = {
                    token: userData.fcmToken,
                    notification: {
                        title: '📦 Обновление статуса',
                        body: `Посылка ${trackData.number}: ${statusText}`
                    },
                    data: {
                        trackId: trackId,
                        status: status,
                        url: '/dashboard'
                    }
                }

                console.log('🚀 Sending FCM payload:', JSON.stringify(message, null, 2))

                try {
                    const response = await messaging.send(message)
                    notificationSent = true
                    console.log(`✅ Notification sent to ${userData.email} for track ${trackData.number}. Message ID:`, response)
                } catch (msgError) {
                    console.error('❌ FCM Send Error Details:', JSON.stringify(msgError, null, 2))
                    // Don't fail the whole request just because notification failed
                }
            } else {
                console.log(`ℹ️ No FCM token found for user ${trackData.userId}. User Data:`, userData ? 'Exists' : 'Missing')
            }
        }

        return { success: true, notificationSent }

    } catch (error: any) {
        console.error('Update track error:', error)
        throw createError({ statusCode: 500, message: error.message || 'Internal Server Error' })
    }
})
