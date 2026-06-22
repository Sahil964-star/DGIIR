import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getMyComplaints = asyncHandler(async (req: Request, res: Response) => {
  const complaints = await prisma.complaint.findMany({
    where: { officerId: req.user!.id },
    include: { 
      category: true, 
      district: true,
      events: {
        orderBy: { createdAt: 'desc' },
        include: { actor: { select: { name: true, role: true } } }
      }
    },
    orderBy: { createdAt: 'desc' },
  });
  
  res.status(200).json({ status: 'success', data: { complaints } });
});

export const getWorkload = asyncHandler(async (req: Request, res: Response) => {
  const assigned = await prisma.complaint.count({ where: { officerId: req.user!.id, status: 'ASSIGNED' } });
  const inProgress = await prisma.complaint.count({ where: { officerId: req.user!.id, status: 'IN_PROGRESS' } });
  const resolved = await prisma.complaint.count({ where: { officerId: req.user!.id, status: 'RESOLVED' } });
  const overdue = await prisma.complaint.count({ where: { officerId: req.user!.id, isOverdue: true } });
  
  res.status(200).json({ status: 'success', data: { assigned, inProgress, resolved, overdue } });
});

export const getPerformance = asyncHandler(async (req: Request, res: Response) => {
  const totalAssigned = await prisma.complaint.count({ where: { officerId: req.user!.id } });
  const resolved = await prisma.complaint.count({ where: { officerId: req.user!.id, status: 'CLOSED' } });
  const verificationPending = await prisma.complaint.count({ where: { officerId: req.user!.id, status: 'VERIFICATION_PENDING' } });
  
  res.status(200).json({ status: 'success', data: { totalAssigned, resolved, verificationPending } });
});
