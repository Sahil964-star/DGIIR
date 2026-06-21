import { Router } from 'express';
import { getNotifications, markAsRead } from '../controllers/notification.controller.js';
import { protect } from '../middlewares/auth.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Notifications
 *   description: Notification operations
 */

router.use(protect);

/**
 * @swagger
 * /notifications:
 *   get:
 *     summary: Get all notifications for current user
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of notifications
 */
router.get('/', getNotifications);
/**
 * @swagger
 * /notifications/{id}/read:
 *   patch:
 *     summary: Mark a notification as read
 *     tags: [Notifications]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Notification marked as read
 */
router.patch('/:id/read', markAsRead);

export default router;
