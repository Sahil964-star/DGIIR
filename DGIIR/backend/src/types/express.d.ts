import { Role } from '@prisma/client';

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: Role;
        districtId?: string | null;
        departmentId?: string | null;
      };
    }
  }
}
