import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  const notifications = await prisma.notification.findMany({
    where: { userId: req.user!.id },
    orderBy: { createdAt: 'desc' },
    take: 50,
  });
  
  res.status(200).json({ status: 'success', data: { notifications } });
});

export const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  
  await prisma.notification.updateMany({
    where: { id: id as string, userId: req.user!.id },
    data: { isRead: true },
  });
  
  res.status(200).json({ status: 'success', message: 'Notification marked as read' });
});

export const markAllRead = asyncHandler(async (req: Request, res: Response) => {
  await prisma.notification.updateMany({
    where: { userId: req.user!.id, isRead: false },
    data: { isRead: true },
  });
  
  res.status(200).json({ status: 'success', message: 'All notifications marked as read' });
});
