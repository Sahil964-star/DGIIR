import cron from 'node-cron';
import { prisma } from '../db/prisma.js';

export const startAnalyticsJob = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    console.log('[Analytics Job] Generating daily snapshot...');
    try {
      const totalComplaints = await prisma.complaint.count();
      const resolved = await prisma.complaint.count({ where: { status: 'CLOSED' } });
      const inProgress = await prisma.complaint.count({ where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } } });
      const overdue = await prisma.complaint.count({ where: { isOverdue: true } });

      await prisma.analyticsSnapshot.create({
        data: {
          totalComplaints,
          resolved,
          inProgress,
          overdue,
          districtMetrics: {},
          departmentMetrics: {},
          categoryMetrics: {},
          resolutionTrends: {},
        },
      });
      console.log('[Analytics Job] Snapshot generated.');
    } catch (error) {
      console.error('[Analytics Job] Error:', error);
    }
  });
};
