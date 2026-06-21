import express from 'express';
import dotenv from 'dotenv';
import { prisma } from './db/prisma.js';
import { errorHandler } from './middlewares/errorHandler.js';
import { requestLogger } from './middlewares/logger.js';
import { securityHeaders, corsMiddleware, globalRateLimiter } from './middlewares/security.js';
import { setupSwagger } from './docs/swagger.js';

// Route imports
import authRoutes from './routes/auth.routes.js';
import complaintRoutes from './routes/complaint.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import metaRoutes from './routes/meta.routes.js';
import notificationRoutes from './routes/notification.routes.js';
import officerRoutes from './routes/officer.routes.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Security & Utility Middlewares
app.use(securityHeaders);
app.use(corsMiddleware);
app.use(globalRateLimiter);
app.use(express.json({ limit: '10kb' })); // limit body size
app.use(requestLogger);

// Setup Swagger UI
setupSwagger(app);

// Basic health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

// API Routes
const v1Router = express.Router();

v1Router.use('/auth', authRoutes);
v1Router.use('/complaints', complaintRoutes);
v1Router.use('/analytics', analyticsRoutes);
v1Router.use('/meta', metaRoutes);
v1Router.use('/notifications', notificationRoutes);
v1Router.use('/officer', officerRoutes);

app.use('/api/v1', v1Router);

import { startSlaJob } from './jobs/sla.job.js';
import { startAnalyticsJob } from './jobs/analytics.job.js';

// Global Error Handler
app.use(errorHandler);

// Start Cron Jobs
startSlaJob();
startAnalyticsJob();

// Handle unhandled rejections
process.on('unhandledRejection', (err: any) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message);
  process.exit(1);
});

// Start server
app.listen(port, () => {
  console.log(`DGIIR Backend running on port ${port}`);
  console.log(`Swagger UI available at http://localhost:${port}/api/v1/docs`);
});
