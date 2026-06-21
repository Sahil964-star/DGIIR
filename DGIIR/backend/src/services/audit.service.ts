import { prisma } from '../db/prisma.js';

export class AuditService {
  static async log(
    actorId: string,
    action: string,
    entityType: string,
    entityId: string,
    details: any = {},
    ipAddress?: string
  ) {
    try {
      await prisma.auditLog.create({
        data: {
          actorId,
          action,
          entityType,
          entityId,
          details,
          ipAddress: ipAddress ?? null,
        },
      });
    } catch (error) {
      console.error('Failed to write audit log:', error);
    }
  }
}
