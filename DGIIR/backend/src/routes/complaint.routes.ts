import { Router } from 'express';
import {
  createComplaint,
  getComplaints,
  getComplaintById,
  updateStatus,
  assignComplaint,
  uploadMedia,
  verifyComplaint,
  acceptComplaint,
  rejectComplaint,
  escalateComplaint,
} from '../controllers/complaint.controller.js';
import { protect } from '../middlewares/auth.js';
import { restrictTo } from '../middlewares/rbac.js';
import { upload } from '../middlewares/upload.js';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Complaints
 *   description: Complaint management operations
 */

router.use(protect);

/**
 * @swagger
 * /complaints:
 *   post:
 *     summary: Create a new complaint
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       201:
 *         description: Complaint created
 *   get:
 *     summary: Get all complaints
 *     tags: [Complaints]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of complaints
 */
router.route('/')
  .post(restrictTo('CITIZEN', 'OPERATIONS'), createComplaint)
  .get(getComplaints);

/**
 * @swagger
 * /complaints/{id}:
 *   get:
 *     summary: Get a complaint by ID
 *     tags: [Complaints]
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
 *         description: Complaint details
 */
router.route('/:id')
  .get(getComplaintById);

/**
 * @swagger
 * /complaints/{id}/status:
 *   patch:
 *     summary: Update complaint status
 *     tags: [Complaints]
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
 *         description: Status updated
 */
router.patch('/:id/status', restrictTo('FIELD_OFFICER', 'OPERATIONS', 'SUPER_ADMIN'), updateStatus);
/**
 * @swagger
 * /complaints/{id}/assign:
 *   patch:
 *     summary: Assign a complaint to an officer
 *     tags: [Complaints]
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
 *         description: Complaint assigned
 */
router.patch('/:id/assign', restrictTo('OPERATIONS', 'SUPER_ADMIN'), assignComplaint);
/**
 * @swagger
 * /complaints/{id}/media:
 *   post:
 *     summary: Upload media for a complaint
 *     tags: [Complaints]
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
 *         description: Media uploaded
 */
router.post('/:id/media', upload.single('file'), uploadMedia);
/**
 * @swagger
 * /complaints/{id}/verify:
 *   post:
 *     summary: Verify a resolved complaint
 *     tags: [Complaints]
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
 *         description: Complaint verified
 */
router.post('/:id/verify', restrictTo('CITIZEN'), verifyComplaint);
router.post('/:id/accept', restrictTo('FIELD_OFFICER'), acceptComplaint);
router.post('/:id/reject', restrictTo('FIELD_OFFICER'), rejectComplaint);
router.post('/:id/escalate', restrictTo('FIELD_OFFICER'), escalateComplaint);

export default router;
