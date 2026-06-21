import cron from 'node-cron';
import { prisma } from '../db/prisma.js';
import { NotificationService } from '../services/notification.service.js';

export const startSlaJob = () => {
  // Run every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[SLA Job] Running SLA check...');
    try {
      const activeComplaints = await prisma.complaint.findMany({
        where: {
          status: { notIn: ['CLOSED', 'REJECTED'] },
          isOverdue: false,
        },
        include: { category: { include: { slaConfig: true } } },
      });

      for (const complaint of activeComplaints) {
        if (!complaint.category.slaConfig) continue;
        
        const slaHours = complaint.category.slaConfig.resolveHours;
        const deadline = new Date(complaint.createdAt.getTime() + slaHours * 60 * 60 * 1000);

        if (new Date() > deadline) {
          // Breach
          await prisma.complaint.update({
            where: { id: complaint.id },
            data: { isOverdue: true, slaBreachAt: new Date() },
          });

          // Trigger Escalation logic here
          const escalationTarget = complaint.category.slaConfig.escalationTarget;
          
          if (escalationTarget === 'OPERATIONS') {
            await NotificationService.notifyRoleInDistrict(
              complaint.districtId,
              'OPERATIONS',
              'SLA_BREACH',
              'SLA Breached',
              `Complaint ${complaint.complaintNo} has breached its SLA.`
            );
          }
        }
      }
      console.log('[SLA Job] SLA check completed.');
    } catch (error) {
      console.error('[SLA Job] Error:', error);
    }
  });
};
