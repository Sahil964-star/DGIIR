import type { Request, Response } from 'express';
export declare const requestOtp: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const verifyOtp: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const loginAdmin: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const refreshToken: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const getMe: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const logout: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const forgotPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
export declare const resetPassword: (req: Request, res: Response, next: import("express").NextFunction) => void;
//# sourceMappingURL=auth.controller.d.ts.map