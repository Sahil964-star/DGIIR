import { prisma } from '../db/prisma.js';
import { NotificationType } from '@prisma/client';

export class NotificationService {
  static async notify(
    userId: string,
    type: NotificationType,
    title: string,
    message: string,
    linkTarget?: string
  ) {
    try {
      await prisma.notification.create({
        data: {
          userId,
          type,
          title,
          message,
          linkTarget: linkTarget ?? null,
        },
      });

      // TODO: Push Notification via Firebase (Device Token)
    } catch (error) {
      console.error('Failed to send notification:', error);
    }
  }

  static async notifyRoleInDistrict(
    districtId: string,
    role: any, // Use proper Role enum from Prisma
    type: NotificationType,
    title: string,
    message: string,
    linkTarget?: string
  ) {
    try {
      const users = await prisma.user.findMany({
        where: { districtId, role },
        select: { id: true },
      });

      if (users.length > 0) {
        await prisma.notification.createMany({
          data: users.map((user) => ({
            userId: user.id,
            type,
            title,
            message,
            linkTarget: linkTarget ?? null,
          })),
        });
      }
    } catch (error) {
      console.error('Failed to send role notifications:', error);
    }
  }
}
