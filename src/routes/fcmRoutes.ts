import { Router } from 'express';
import NotificationController from '../controllers/fcmController';

const router = Router();

// Rute untuk mengirim notifikasi ke semua perangkat
router.post('/all', NotificationController.sendAllNotification);

// Rute untuk mengirim notifikasi ke token tertentu
router.post('/token', NotificationController.sendNotificationToToken);

// Rute untuk mengirim notifikasi ke topik tertentu
router.post('/topic', NotificationController.sendNotificationToTopic);

// Rute untuk berlangganan topik
router.post('/subscribe', NotificationController.subscribeToTopic);

// Rute untuk berhenti berlangganan topik
router.post('/unsubscribe', NotificationController.unSubscribeToTopic);

export default router;
