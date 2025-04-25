import { Request, Response } from 'express';
import NotificationService from '../utils/notificationService';

class NotificationController {
    // Kirim notifikasi ke semua perangkat
    async sendAllNotification(req: Request, res: Response) {
        try {
            console.log("📥 Request body:", req.body); // 🔎 Debugging input

            const { title, body } = req.body;

            if (!title || !body) {
                return res.status(400).json({ success: false, message: "❌ Title dan Body tidak boleh kosong!" });
            }

            const response = await NotificationService.sendAllNotification({ title, body });

            res.status(200).json(response);
        } catch (error: any) {
            console.error("❌ Error sending notification:", error);
            res.status(500).json({ success: false, message: error.message || "❌ Internal Server Error" });
        }
    }

    // Kirim notifikasi ke perangkat berdasarkan token
    async sendNotificationToToken(req: Request, res: Response) {
        try {
            const { token, notification } = req.body;
            if (!token) return res.status(400).json({ message: 'Token is required' });
            if (!notification) return res.status(400).json({ message: 'Notification is required' });

            const response = await NotificationService.sendNotificationToToken(token, notification);

            res.status(200).json({
                statusCode: 200,
                success: true,
                message: 'Notification sent successfully',
                response,
            });
        } catch (error: any) {
            console.error("Error sending notification to token:", error);
            res.status(500).json({ statusCode: 500, success: false, message: error.message || 'Internal Server Error' });
        }
    }

    // Kirim notifikasi ke sebuah topik
    async sendNotificationToTopic(req: Request, res: Response) {
        try {
            const { topic, notification } = req.body;
            if (!topic) return res.status(400).json({ message: 'Topic is required' });
            if (!notification) return res.status(400).json({ message: 'Notification is required' });

            const response = await NotificationService.sendNotificationToTopic(topic, notification);

            res.status(200).json({
                statusCode: 200,
                success: true,
                message: 'Notification sent successfully',
                data: response,
            });
        } catch (error: any) {
            console.error("Error sending notification to topic:", error);
            res.status(500).json({ statusCode: 500, success: false, message: error.message || 'Internal Server Error' });
        }
    }

    // Langganan ke topik
    async subscribeToTopic(req: Request, res: Response) {
        try {
            const { token, topic } = req.body;
            if (!token) return res.status(400).json({ message: 'Token is required' });
            if (!topic) return res.status(400).json({ message: 'Topic is required' });

            const response = await NotificationService.subscribeToTopic(token, topic);

            res.status(200).json({
                statusCode: 200,
                success: true,
                message: 'Subscribed to topic successfully',
                data: response,
            });
        } catch (error: any) {
            console.error("Error subscribing to topic:", error);
            res.status(500).json({ statusCode: 500, success: false, message: error.message || 'Internal Server Error' });
        }
    }

    // Batalkan langganan ke topik
    async unSubscribeToTopic(req: Request, res: Response) {
        try {
            const { token, topic } = req.body;
            if (!token) return res.status(400).json({ message: 'Token is required' });
            if (!topic) return res.status(400).json({ message: 'Topic is required' });

            const response = await NotificationService.unSubscribeToTopic(token, topic);

            res.status(200).json({
                statusCode: 200,
                success: true,
                message: 'Unsubscribed from topic successfully',
                data: response,
            });
        } catch (error: any) {
            console.error("Error unsubscribing from topic:", error);
            res.status(500).json({ statusCode: 500, success: false, message: error.message || 'Internal Server Error' });
        }
    }
}

export default new NotificationController();
