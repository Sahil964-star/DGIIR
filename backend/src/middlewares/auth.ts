import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { AppError } from '../utils/AppError.js';
import { prisma } from '../db/prisma.js';

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
      return next(new AppError('You are not logged in! Please log in to get access.', 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback_secret') as any;

    const currentUser = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, role: true, districtId: true, departmentId: true, isActive: true },
    });

    if (!currentUser || !currentUser.isActive) {
      return next(new AppError('The user belonging to this token does no longer exist or is inactive.', 401));
    }

    req.user = currentUser;
    next();
  } catch (error) {
    next(new AppError('Invalid token. Please log in again!', 401));
  }
};
