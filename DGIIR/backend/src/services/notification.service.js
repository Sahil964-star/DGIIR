import { prisma } from '../db/prisma.js';
import { NotificationType } from '@prisma/client';
export class NotificationService {
    static async notify(userId, type, title, message, linkTarget) {
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
        }
        catch (error) {
            console.error('Failed to send notification:', error);
        }
    }
    static async notifyRoleInDistrict(districtId, role, // Use proper Role enum from Prisma
    type, title, message, linkTarget) {
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
        }
        catch (error) {
            console.error('Failed to send role notifications:', error);
        }
    }
}
//# sourceMappingURL=notification.service.js.map