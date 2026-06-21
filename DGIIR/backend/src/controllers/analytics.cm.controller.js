import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getCmOverview = asyncHandler(async (req, res) => {
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
export const getTopConcerns = asyncHandler(async (req, res) => {
    const categories = await prisma.complaint.groupBy({
        by: ['categoryId'],
        _count: { id: true },
        orderBy: { _count: { id: 'desc' } },
        take: 5,
    });
    const categoryData = await Promise.all(categories.map(async (c) => {
        const cat = await prisma.category.findUnique({ where: { id: c.categoryId } });
        return { name: cat?.name || 'Unknown', count: c._count.id };
    }));
    res.status(200).json({ status: 'success', data: categoryData });
});
export const getDistrictRisk = asyncHandler(async (req, res) => {
    const districts = await prisma.complaint.groupBy({
        by: ['districtId'],
        _count: { id: true },
    });
    const districtData = await Promise.all(districts.map(async (d) => {
        const dist = await prisma.district.findUnique({ where: { id: d.districtId } });
        const overdueCount = await prisma.complaint.count({ where: { districtId: d.districtId, isOverdue: true } });
        return {
            district: dist?.name || 'Unknown',
            total: d._count.id,
            overdue: overdueCount,
            riskLevel: overdueCount > 50 ? 'HIGH' : overdueCount > 20 ? 'MEDIUM' : 'LOW',
        };
    }));
    res.status(200).json({ status: 'success', data: districtData });
});
export const getResolutionTime = asyncHandler(async (req, res) => {
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
export const getPriorityDistribution = asyncHandler(async (req, res) => {
    const distribution = await prisma.complaint.groupBy({
        by: ['priority'],
        _count: { id: true },
    });
    res.status(200).json({ status: 'success', data: distribution });
});
//# sourceMappingURL=analytics.cm.controller.js.map