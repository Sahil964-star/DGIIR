import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import cors from 'cors';

export const securityHeaders = helmet();

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

    // Development mode
    return callback(null, true);
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