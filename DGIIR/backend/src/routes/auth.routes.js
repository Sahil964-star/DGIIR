import { Router } from 'express';
import { requestOtp, verifyOtp, loginAdmin, refreshToken, getMe, logout, forgotPassword, resetPassword, } from '../controllers/auth.controller.js';
import { protect } from '../middlewares/auth.js';
import { authRateLimiter } from '../middlewares/security.js';
const router = Router();
/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Authentication operations
 */
/**
 * @swagger
 * /auth/request-otp:
 *   post:
 *     summary: Request OTP for login (Citizens only)
 *     description: Generates an OTP for citizen login. If the phone number does not exist, an OTP is still generated. Returns 403 for staff numbers.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9999999999"
 *           examples:
 *             CitizenRequest:
 *               summary: Standard OTP request
 *               value: { "phone": "9999999999" }
 *     responses:
 *       200:
 *         description: OTP requested successfully
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 summary: OTP sent
 *                 value: { "status": "success", "message": "OTP sent successfully" }
 *       403:
 *         description: Forbidden for staff members
 */
router.post('/request-otp', authRateLimiter, requestOtp);
/**
 * @swagger
 * /auth/verify-otp:
 *   post:
 *     summary: Verify OTP and Login (Citizens only)
 *     description: Verifies the OTP. If the citizen does not exist, an account is automatically created. Returns access token and sets refresh token in cookie.
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - phone
 *               - otp
 *             properties:
 *               phone:
 *                 type: string
 *                 example: "9999999999"
 *               otp:
 *                 type: string
 *                 example: "123456"
 *           examples:
 *             CitizenVerify:
 *               summary: Standard OTP verification
 *               value: { "phone": "9999999999", "otp": "123456" }
 *     responses:
 *       200:
 *         description: OTP verified successfully
 *         content:
 *           application/json:
 *             examples:
 *               Success:
 *                 summary: Login successful
 *                 value: { "status": "success", "data": { "accessToken": "ey...", "user": { "id": "uuid", "name": "Citizen", "role": "CITIZEN" } } }
 *       400:
 *         description: Invalid or expired OTP
 *       403:
 *         description: Forbidden for staff members
 */
router.post('/verify-otp', authRateLimiter, verifyOtp);
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Admin login
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 example: admin@dgiir.gov.in
 *               password:
 *                 type: string
 *                 example: Password@123
 *     responses:
 *       200:
 *         description: Logged in successfully
 */
router.post('/login', authRateLimiter, loginAdmin);
/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh token
 *     description: Reads the HttpOnly cookie 'refreshToken' and returns a new access token. When testing in Swagger UI, you must first execute the login or verify-otp endpoint to set the cookie in your browser.
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Token refreshed
 */
router.post('/refresh', refreshToken);
/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout user
 *     tags: [Auth]
 *     responses:
 *       200:
 *         description: Successfully logged out
 */
router.post('/logout', logout);
/**
 * @swagger
 * /auth/forgot-password:
 *   post:
 *     summary: Request OTP for password reset
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *     responses:
 *       200:
 *         description: OTP sent successfully
 */
router.post('/forgot-password', authRateLimiter, forgotPassword);
/**
 * @swagger
 * /auth/reset-password:
 *   post:
 *     summary: Reset password with OTP
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               phone:
 *                 type: string
 *               otp:
 *                 type: string
 *               newPassword:
 *                 type: string
 *     responses:
 *       200:
 *         description: Password reset successfully
 */
router.post('/reset-password', authRateLimiter, resetPassword);
router.use(protect);
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User data
 */
router.get('/me', getMe);
export default router;
//# sourceMappingURL=auth.routes.js.map