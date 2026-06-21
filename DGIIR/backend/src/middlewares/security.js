import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';
const isDev = process.env.NODE_ENV !== 'production';
const helmetOptions = {};
if (isDev) {
    helmetOptions.contentSecurityPolicy = {
        useDefaults: true,
        directives: {
            "upgrade-insecure-requests": null,
        },
    };
    helmetOptions.crossOriginResourcePolicy = { policy: "cross-origin" };
}
export const securityHeaders = helmet(helmetOptions);
const whitelist = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:5000',
    'http://127.0.0.1:5000',
    process.env.FRONTEND_URL,
].filter(Boolean);
export const corsMiddleware = cors({
    origin: (origin, callback) => {
        if (!origin) {
            return callback(null, true);
        }
        if (whitelist.includes(origin)) {
            return callback(null, true);
        }
        console.warn(`Blocked by CORS: ${origin}`);
        if (isDev) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials: true,
});
export const globalRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again after 15 minutes',
    standardHeaders: true,
    legacyHeaders: false,
});
export const authRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 20,
    message: 'Too many auth requests from this IP, please try again after 15 minutes',
});
//# sourceMappingURL=security.js.map