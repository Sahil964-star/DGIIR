import type { Request, Response, NextFunction } from 'express';
import { Role } from '@prisma/client';
export declare const restrictTo: (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=rbac.d.ts.map