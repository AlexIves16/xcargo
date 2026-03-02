import { defineEventHandler } from 'h3';
import { getFirestore, Timestamp } from 'firebase-admin/firestore';

export default defineEventHandler(async (event) => {
    try {
        const db = getFirestore();
        
        // Проверяем подключение к Firestore
        const testDoc = await db.collection('system').doc('health-check').get();
        
        // Создаем тестовую запись
        await db.collection('system').doc('health-check').set({
            lastCheck: Timestamp.now(),
            status: 'healthy',
            timestamp: Date.now()
        });

        return { 
            success: true, 
            message: 'Firestore connection is working!',
            timestamp: new Date().toISOString()
        };
    } catch (error: any) {
        console.error('Health check failed:', error);
        return { 
            success: false, 
            error: error.message,
            message: 'Firestore connection failed'
        };
    }
});