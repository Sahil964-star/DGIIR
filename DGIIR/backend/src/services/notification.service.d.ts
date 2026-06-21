import { NotificationType } from '@prisma/client';
export declare class NotificationService {
    static notify(userId: string, type: NotificationType, title: string, message: string, linkTarget?: string): Promise<void>;
    static notifyRoleInDistrict(districtId: string, role: any, // Use proper Role enum from Prisma
    type: NotificationType, title: string, message: string, linkTarget?: string): Promise<void>;
}
//# sourceMappingURL=notification.service.d.ts.map