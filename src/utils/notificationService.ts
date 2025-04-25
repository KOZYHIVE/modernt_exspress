import { MessagingTopicManagementResponse } from 'firebase-admin/lib/messaging/messaging-api';
import firebaseMessaging from '../config/firebase';
import prisma from '../config/prisma';
import { NotificationResponse } from "./notificationType";

export class NotificationService {
    // Kirim notifikasi ke semua perangkat
    async sendAllNotification(notification: { title: any; body: any }): Promise<NotificationResponse> {
        try {
            const tokens = await prisma.token.findMany();
            const registrationTokens = tokens.map((token) => token.token);

            if (registrationTokens.length === 0) {
                throw new Error('No tokens found');
            }

            const message = {
                notification: {
                    title: notification.title ?? 'Notification Title',
                    body: notification.body ?? 'Notification Body',
                },
                tokens: registrationTokens,
            };

            const response = await firebaseMessaging.sendEachForMulticast(message);
            return response;
        } catch (error: any) {
            console.error("❌ Error sending notification:", error);
            throw new Error(error?.message || `Internal server error!`);
        }
    }

    // Kirim notifikasi ke satu perangkat berdasarkan token
    async sendNotificationToToken(token: string, notification: Notification): Promise<string> {
        try {
            const message = {
                notification: {
                    title: notification.title ?? 'Notification Title',
                    body: notification.body ?? 'Notification Body',
                },
                token,
            };

            const response = await firebaseMessaging.send(message);
            return response;
        } catch (error: any) {
            console.error("❌ Error sending notification to token:", error);
            throw new Error(error?.message || `Internal server error!`);
        }
    }

    // Kirim notifikasi ke sebuah topik
    async sendNotificationToTopic(topic: string, notification: Notification): Promise<string> {
        try {
            const message = {
                notification: {
                    title: notification.title ?? 'Notification Title',
                    body: notification.body ?? 'Notification Body',
                },
                topic,
            };

            const response = await firebaseMessaging.send(message);
            return response;
        } catch (error: any) {
            console.error("❌ Error sending topic notification:", error);
            throw new Error(error?.message || `Internal server error!`);
        }
    }

    // Langganan ke topik
    async subscribeToTopic(token: string, topic: string): Promise<MessagingTopicManagementResponse> {
        try {
            const response = await firebaseMessaging.subscribeToTopic(token, topic);
            return response;
        } catch (error: any) {
            console.error("❌ Error subscribing to topic:", error);
            throw new Error(error?.message || `Internal server error!`);
        }
    }

    // Batalkan langganan ke topik
    async unSubscribeToTopic(token: string, topic: string): Promise<MessagingTopicManagementResponse> {
        try {
            const response = await firebaseMessaging.unsubscribeFromTopic(token, topic);
            return response;
        } catch (error: any) {
            console.error("❌ Error unsubscribing from topic:", error);
            throw new Error(error?.message || `Internal server error!`);
        }
    }
}

export default new NotificationService();
