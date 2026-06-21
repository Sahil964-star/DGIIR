import { Router } from 'express';
import { getDistricts, getDepartments, getCategories } from '../controllers/meta.controller.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Meta
 *   description: Metadata and reference operations
 */
/**
 * @swagger
 * /meta/districts:
 *   get:
 *     summary: Get all districts
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: List of districts
 */
router.get('/districts', getDistricts);
/**
 * @swagger
 * /meta/departments:
 *   get:
 *     summary: Get all departments
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: List of departments
 */
router.get('/departments', getDepartments);
/**
 * @swagger
 * /meta/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Meta]
 *     responses:
 *       200:
 *         description: List of categories
 */
router.get('/categories', getCategories);
export default router;
//# sourceMappingURL=meta.routes.js.map