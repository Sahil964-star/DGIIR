import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getCmOverview = asyncHandler(async (req: Request, res: Response) => {
  const total = await prisma.complaint.count();
  const resolved = await prisma.complaint.count({ where: { status: 'CLOSED' } }); // Assuming closed is the final resolved state
  const inProgress = await prisma.complaint.count({ where: { status: { in: ['ASSIGNED', 'IN_PROGRESS'] } } });
  const overdue = await prisma.complaint.count({ where: { isOverdue: true } });

  const resolutionRate = total === 0 ? 0 : ((resolved / total) * 100).toFixed(2);

  res.status(200).json({
    status: 'success',
    data: { total, resolved, inProgress, overdue, resolutionRate },
  });
});

export const getTopConcerns = asyncHandler(async (req: Request, res: Response) => {
  const categories = await prisma.complaint.groupBy({
    by: ['categoryId'],
    _count: { id: true },
    orderBy: { _count: { id: 'desc' } },
    take: 10,
  });

  const categoryData = await Promise.all(categories.map(async (c) => {
    const cat = await prisma.category.findUnique({ where: { id: c.categoryId } });
    return { name: cat?.name || 'Unknown', count: c._count.id };
  }));

  res.status(200).json({ status: 'success', data: categoryData });
});

export const getDistrictRisk = asyncHandler(async (req: Request, res: Response) => {
  const districts = await prisma.complaint.groupBy({
    by: ['districtId'],
    _count: { id: true },
  });

  const districtData = await Promise.all(districts.map(async (d) => {
    const dist = await prisma.district.findUnique({ where: { id: d.districtId } });
    const overdueCount = await prisma.complaint.count({ where: { districtId: d.districtId, isOverdue: true } });

    const name = dist?.name || 'Unknown';
    const id = name.toLowerCase().replace(/\s+/g, '-');
    
    let riskLevel = 'healthy';
    if (overdueCount > 50) riskLevel = 'critical';
    else if (overdueCount > 20) riskLevel = 'concern';
    else if (overdueCount > 5) riskLevel = 'watch';

    return {
      id,
      district: name,
      total: d._count.id,
      overdue: overdueCount,
      riskLevel,
    };
  }));

  res.status(200).json({ status: 'success', data: districtData });
});

export const getResolutionTime = asyncHandler(async (req: Request, res: Response) => {
  const resolvedComplaints = await prisma.complaint.findMany({
    where: { status: 'CLOSED', resolvedAt: { not: null } },
    select: { createdAt: true, resolvedAt: true },
  });

  let totalTime = 0;
  resolvedComplaints.forEach((c) => {
    if (c.resolvedAt) {
      totalTime += c.resolvedAt.getTime() - c.createdAt.getTime();
    }
  });

  const averageMs = resolvedComplaints.length ? totalTime / resolvedComplaints.length : 0;
  const averageDays = (averageMs / (1000 * 60 * 60 * 24)).toFixed(2);

  res.status(200).json({ status: 'success', data: { averageDays } });
});

export const getPriorityDistribution = asyncHandler(async (req: Request, res: Response) => {
  const distribution = await prisma.complaint.groupBy({
    by: ['priority'],
    _count: { id: true },
  });

  res.status(200).json({ status: 'success', data: distribution });
});

export const getAiAnalytics = asyncHandler(async (req: Request, res: Response) => {
  const totalWithAi = await prisma.complaint.count({ where: { aiConfidence: { not: null } } });
  
  // Auto-routed (>90 confidence and not flagged)
  const autoRouted = await prisma.complaint.count({ 
    where: { aiConfidence: { gt: 90 }, aiIsFlagged: false } 
  });
  
  // Manual Review (flagged or <=90)
  const manualReview = totalWithAi - autoRouted;

  // AI Category Distribution
  const categoryDist = await prisma.complaint.groupBy({
    by: ['aiCategory'],
    _count: { id: true },
    where: { aiCategory: { not: null } },
  });

  // Calculate Accuracy (if categoryId matches AI predicted category name)
  // Since we don't have a direct boolean, we can do a rough count by querying those where it was overridden
  const overriddenEvents = await prisma.complaintEvent.count({
    where: { action: 'AI_OVERRIDE' }
  });

  const accuracyRate = totalWithAi === 0 ? 100 : (((totalWithAi - overriddenEvents) / totalWithAi) * 100).toFixed(1);

  // Emerging Issues (count by keyword, very rough estimation in code, but we'll return recent keywords)
  // For simplicity, we just return basic stats since Prisma doesn't group by string arrays easily.
  const recentComplaints = await prisma.complaint.findMany({
    where: { aiKeywords: { isEmpty: false } },
    take: 50,
    orderBy: { createdAt: 'desc' },
    select: { aiKeywords: true }
  });

  const keywordCounts: Record<string, number> = {};
  recentComplaints.forEach(c => {
    c.aiKeywords.forEach(kw => {
      keywordCounts[kw] = (keywordCounts[kw] || 0) + 1;
    });
  });

  const topKeywords = Object.entries(keywordCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 10)
    .map(([keyword, count]) => ({ keyword, count }));

  res.status(200).json({ 
    status: 'success', 
    data: {
      totalWithAi,
      autoRouted,
      manualReview,
      accuracyRate: Number(accuracyRate),
      aiCategoryDistribution: categoryDist.map(d => ({ name: d.aiCategory, count: d._count.id })),
      emergingKeywords: topKeywords
    } 
  });
});