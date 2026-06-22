import { prisma } from '../db/prisma.js';
import { asyncHandler } from '../utils/asyncHandler.js';
export const getOperationsOverview = asyncHandler(async (req, res) => {
    const total = await prisma.complaint.count();
    const unassigned = await prisma.complaint.count({ where: { status: 'UNDER_REVIEW' } });
    const escalations = await prisma.escalation.count();
    res.status(200).json({ status: 'success', data: { total, unassigned, escalations } });
});
export const getSlaPerformance = asyncHandler(async (req, res) => {
    const total = await prisma.complaint.count({ where: { status: 'CLOSED' } });
    const breached = await prisma.complaint.count({ where: { status: 'CLOSED', isOverdue: true } });
    const compliant = total - breached;
    res.status(200).json({ status: 'success', data: { total, breached, compliant, complianceRate: total ? ((compliant / total) * 100).toFixed(2) : 0 } });
});
export const getOfficerWorkload = asyncHandler(async (req, res) => {
    const officers = await prisma.user.findMany({
        where: { role: 'FIELD_OFFICER', isActive: true },
        select: {
            id: true,
            name: true,
            role: true,
            district: {
                select: {
                    name: true,
                },
            },
            _count: {
                select: {
                    complaintsAssigned: {
                        where: {
                            status: {
                                in: ['ASSIGNED', 'IN_PROGRESS'],
                            },
                        },
                    },
                },
            },
        },
    });
    const assignedCounts = await prisma.complaint.groupBy({
        by: ['officerId'],
        where: {
            officerId: { in: officers.map(o => o.id) },
            status: 'ASSIGNED',
        },
        _count: { id: true },
    });
    const assignedCountMap = new Map(assignedCounts.map(c => [c.officerId, c._count.id]));
    const formattedOfficers = officers.map(officer => ({
        officerId: officer.id,
        officerName: officer.name,
        officerRole: officer.role,
        district: officer.district?.name || 'Unassigned',
        activeComplaintCount: officer._count.complaintsAssigned,
        assignedComplaintCount: assignedCountMap.get(officer.id) || 0,
    }));
    res.status(200).json({ status: 'success', data: { workload: formattedOfficers } });
});
//# sourceMappingURL=analytics.operations.controller.js.map