import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getOperationsOverview = asyncHandler(async (req: Request, res: Response) => {
  const total = await prisma.complaint.count();
  const unassigned = await prisma.complaint.count({ where: { status: 'UNDER_REVIEW' } });
  const escalations = await prisma.escalation.count();
  
  res.status(200).json({ status: 'success', data: { total, unassigned, escalations } });
});

export const getSlaPerformance = asyncHandler(async (req: Request, res: Response) => {
  const total = await prisma.complaint.count({ where: { status: 'CLOSED' } });
  const breached = await prisma.complaint.count({ where: { status: 'CLOSED', isOverdue: true } });
  const compliant = total - breached;
  
  res.status(200).json({ status: 'success', data: { total, breached, compliant, complianceRate: total ? ((compliant/total)*100).toFixed(2) : 0 } });
});
