import { Router } from 'express';
import { getMyComplaints, getWorkload, getPerformance } from '../controllers/officer.controller.js';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/rbac.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Officer
 *   description: Field officer operations
 */

router.use(protect);
router.use(restrictTo('FIELD_OFFICER'));

/**
 * @swagger
 * /officer/my-complaints:
 *   get:
 *     summary: Get assigned complaints for current officer
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.get('/my-complaints', getMyComplaints);
/**
 * @swagger
 * /officer/workload:
 *   get:
 *     summary: Get workload stats for current officer
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Workload stats
 */
router.get('/workload', getWorkload);
/**
 * @swagger
 * /officer/performance:
 *   get:
 *     summary: Get performance stats for current officer
 *     tags: [Officer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Performance stats
 */
router.get('/performance', getPerformance);

export default router;
