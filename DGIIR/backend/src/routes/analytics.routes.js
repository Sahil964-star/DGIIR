import { Router } from 'express';
import { getCmOverview, getTopConcerns, getDistrictRisk, getResolutionTime, getPriorityDistribution } from '../controllers/analytics.cm.controller.js';
import { getOperationsOverview, getSlaPerformance, getOfficerWorkload } from '../controllers/analytics.operations.controller.js';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/rbac.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Analytics
 *   description: Analytics and reporting operations
 */
router.use(protect);
// CM Analytics
/**
 * @swagger
 * /analytics/cm/overview:
 *   get:
 *     summary: Get CM overview analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: CM overview data
 */
router.get('/cm/overview', restrictTo('CHIEF_MINISTER', 'SUPER_ADMIN'), getCmOverview);
/**
 * @swagger
 * /analytics/cm/top-concerns:
 *   get:
 *     summary: Get top concerns analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Top concerns data
 */
router.get('/cm/top-concerns', restrictTo('CHIEF_MINISTER', 'SUPER_ADMIN'), getTopConcerns);
/**
 * @swagger
 * /analytics/cm/district-risk:
 *   get:
 *     summary: Get district risk analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: District risk data
 */
router.get('/cm/district-risk', restrictTo('CHIEF_MINISTER', 'SUPER_ADMIN'), getDistrictRisk);
/**
 * @swagger
 * /analytics/cm/resolution-time:
 *   get:
 *     summary: Get resolution time analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Resolution time data
 */
router.get('/cm/resolution-time', restrictTo('CHIEF_MINISTER', 'SUPER_ADMIN'), getResolutionTime);
/**
 * @swagger
 * /analytics/cm/priority:
 *   get:
 *     summary: Get priority distribution analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Priority distribution data
 */
router.get('/cm/priority', restrictTo('CHIEF_MINISTER', 'SUPER_ADMIN'), getPriorityDistribution);
// Operations Analytics
/**
 * @swagger
 * /analytics/operations/overview:
 *   get:
 *     summary: Get operations overview analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Operations overview data
 */
router.get('/operations/overview', restrictTo('OPERATIONS', 'SUPER_ADMIN'), getOperationsOverview);
/**
 * @swagger
 * /analytics/operations/sla:
 *   get:
 *     summary: Get SLA performance analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: SLA performance data
 */
router.get('/operations/sla', restrictTo('OPERATIONS', 'SUPER_ADMIN'), getSlaPerformance);
/**
 * @swagger
 * /analytics/operations/officer-workload:
 *   get:
 *     summary: Get officer workload analytics
 *     tags: [Analytics]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Officer workload data
 */
router.get('/operations/officer-workload', restrictTo('OPERATIONS', 'SUPER_ADMIN'), getOfficerWorkload);
export default router;
//# sourceMappingURL=analytics.routes.js.map