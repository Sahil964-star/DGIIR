import type { Request, Response } from 'express';
export declare const createComplaint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getComplaints: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getComplaintById: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const updateStatus: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const assignComplaint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const uploadMedia: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyComplaint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const acceptComplaint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const rejectComplaint: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const escalateComplaint: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=complaint.controller.d.ts.map