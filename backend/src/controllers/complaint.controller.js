import { prisma } from '../db/prisma.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CloudinaryService } from '../services/cloudinary.service.js';
import { AuditService } from '../services/audit.service.js';
import { NotificationService } from '../services/notification.service.js';
import { AIService } from '../services/ai.service.js';
import { ComplaintStatus, MediaType, Priority } from '@prisma/client';
import fs from 'fs';
export const createComplaint = asyncHandler(async (req, res) => {
    const { title, description, districtId, address, latitude, longitude, citizenId: providedCitizenId } = req.body;
    // Note: categoryId is now optional — AI will determine it
    const categoryIdOverride = req.body.categoryId;
    if (!title || !description || !districtId || !address) {
        throw new AppError('Please provide title, description, districtId, and address', 400);
    }
    let lat = null;
    let lng = null;
    if (latitude !== undefined && latitude !== null) {
        lat = Number(latitude);
        if (isNaN(lat))
            throw new AppError('Invalid latitude value', 400);
    }
    if (longitude !== undefined && longitude !== null) {
        lng = Number(longitude);
        if (isNaN(lng))
            throw new AppError('Invalid longitude value', 400);
    }
    // ── Resolve citizen ─────────────────────────────────────────────────────────
    let targetCitizenId;
    if (req.user.role === 'OPERATIONS') {
        if (!providedCitizenId) {
            throw new AppError('citizenId is required when creating a complaint on behalf of a citizen.', 400);
        }
        const citizenUser = await prisma.user.findUnique({ where: { id: providedCitizenId } });
        if (!citizenUser || citizenUser.role !== 'CITIZEN') {
            throw new AppError('Invalid citizen identifier. The user must exist and have the CITIZEN role.', 400);
        }
        targetCitizenId = citizenUser.id;
    }
    else {
        targetCitizenId = req.user.id;
    }
    // ── Resolve district name for AI ────────────────────────────────────────────
    const selectedDistrict = await prisma.district.findUnique({ where: { id: districtId } });
    if (!selectedDistrict)
        throw new AppError('Invalid districtId', 400);
    // ── AI Classification ────────────────────────────────────────────────────────
    // Runs async; if it fails, buildFallbackResult is returned (confidence 40)
    const imagePath = req.file?.path;
    const aiResult = await AIService.analyzeComplaint({
        title,
        description,
        address,
        district: selectedDistrict.name,
        ...(imagePath && { imagePath }),
    });
    // ── Map AI category suggestion → DB category ─────────────────────────────────
    let resolvedCategoryId;
    let resolvedDepartmentId = null;
    const getOtherCategory = async () => {
        let fallback = await prisma.category.findFirst({ where: { name: 'Other' } });
        if (!fallback) {
            let otherDept = await prisma.department.findFirst({ where: { name: 'Other' } });
            if (!otherDept) {
                otherDept = await prisma.department.create({ data: { name: 'Other', code: 'OTH' } });
            }
            fallback = await prisma.category.create({
                data: {
                    name: 'Other',
                    departmentId: otherDept.id,
                }
            });
            // Optionally create SLA Configuration for the newly created "Other" category
            try {
                await prisma.slaConfiguration.create({
                    data: {
                        categoryId: fallback.id,
                        resolveHours: 48,
                        escalationTarget: 'OPERATIONS',
                        priorityRules: { HIGH: 24, MEDIUM: 48, LOW: 72 },
                    }
                });
            }
            catch (slaErr) {
                // Suppress if already exists
            }
        }
        return fallback;
    };
    if (categoryIdOverride) {
        // Manual override (e.g., Operations creating on behalf of citizen)
        const cat = await prisma.category.findUnique({ where: { id: categoryIdOverride } });
        if (!cat)
            throw new AppError('Invalid categoryId override', 400);
        resolvedCategoryId = cat.id;
        resolvedDepartmentId = cat.departmentId;
    }
    else if (aiResult.confidence >= 60) {
        // AI is confident enough — use its suggestion
        const aiCategory = await prisma.category.findFirst({
            where: { name: { equals: aiResult.predictedCategory, mode: 'insensitive' } },
        });
        if (aiCategory) {
            resolvedCategoryId = aiCategory.id;
            resolvedDepartmentId = aiCategory.departmentId;
        }
        else {
            // AI suggested a category that doesn't exist — fall back to "Other"
            const fallback = await getOtherCategory();
            resolvedCategoryId = fallback.id;
            resolvedDepartmentId = fallback.departmentId;
        }
    }
    else {
        // Low confidence — use "Other" and route to Operations Review
        const fallback = await getOtherCategory();
        resolvedCategoryId = fallback.id;
        resolvedDepartmentId = null; // will be assigned manually
    }
    // ── District verification ──────────────────────────────────────────────────
    // Check if AI district suggestion differs from citizen's selection
    let aiDistrictMismatch = false;
    if (aiResult.districtSuggestion) {
        const aiDistrict = await prisma.district.findFirst({
            where: { name: { equals: aiResult.districtSuggestion, mode: 'insensitive' } },
        });
        if (aiDistrict && aiDistrict.id !== districtId) {
            aiDistrictMismatch = true;
        }
    }
    // ── Routing decision ─────────────────────────────────────────────────────────
    // confidence >= 80 AND no district mismatch → PENDING (auto-routed to department)
    // confidence < 80 OR district mismatch → UNDER_REVIEW (Admin Queue, flagged)
    const shouldFlagForReview = aiResult.confidence < 80 || aiDistrictMismatch;
    let initialStatus;
    if (aiResult.confidence >= 80 && !aiDistrictMismatch) {
        initialStatus = ComplaintStatus.PENDING;
    }
    else {
        initialStatus = ComplaintStatus.UNDER_REVIEW;
    }
    // If confidence is < 60, don't guess the department (leave null for manual review)
    if (aiResult.confidence < 60) {
        resolvedDepartmentId = null;
    }
    // ── Generate complaint number ──────────────────────────────────────────────
    const complaintNo = `CMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;
    // ── Create complaint in DB ─────────────────────────────────────────────────
    const complaint = await prisma.complaint.create({
        data: {
            complaintNo,
            title,
            description,
            districtId,
            categoryId: resolvedCategoryId,
            departmentId: resolvedDepartmentId,
            citizenId: targetCitizenId,
            address,
            latitude: lat,
            longitude: lng,
            status: initialStatus,
            priority: aiResult.priority,
            // ── AI Fields ──
            aiCategory: aiResult.predictedCategory,
            aiConfidence: aiResult.confidence,
            aiPriority: aiResult.priority,
            aiSeverityScore: aiResult.severityScore,
            aiSummary: aiResult.aiSummary,
            aiKeywords: aiResult.keywords,
            aiDepartmentSuggestion: aiResult.departmentSuggestion,
            aiDistrictSuggestion: aiResult.districtSuggestion,
            aiIsFlagged: shouldFlagForReview,
            aiDetectedObjects: aiResult.detectedObjects,
            aiImageConfidence: aiResult.imageConfidence,
        },
    });
    // ── Audit + Event ──────────────────────────────────────────────────────────
    const eventComment = shouldFlagForReview
        ? `AI routed to Operations Review (confidence: ${aiResult.confidence}%, district mismatch: ${aiDistrictMismatch})`
        : `AI auto-classified as "${aiResult.predictedCategory}" with ${aiResult.confidence}% confidence`;
    await prisma.complaintEvent.create({
        data: {
            complaintId: complaint.id,
            action: 'CREATED',
            newStatus: initialStatus,
            actorId: req.user.id,
            comments: eventComment,
        },
    });
    await AuditService.log(req.user.id, 'CREATE_COMPLAINT', 'Complaint', complaint.id, {
        aiCategory: aiResult.predictedCategory,
        aiConfidence: aiResult.confidence,
        aiPriority: aiResult.priority,
        aiIsFlagged: shouldFlagForReview,
    });
    // ── Upload image to Cloudinary if provided ─────────────────────────────────
    if (imagePath && fs.existsSync(imagePath)) {
        try {
            const cloudResult = await CloudinaryService.uploadImage(imagePath);
            await prisma.media.create({
                data: {
                    complaintId: complaint.id,
                    url: cloudResult.secure_url,
                    publicId: cloudResult.public_id,
                    type: MediaType.CITIZEN_EVIDENCE,
                    uploadedById: req.user.id,
                },
            });
        }
        catch {
            // Non-fatal: image upload failure should not block complaint creation
            console.error('[createComplaint] Cloudinary upload failed for', imagePath);
            if (fs.existsSync(imagePath))
                fs.unlinkSync(imagePath);
        }
    }
    // ── Notify citizen ─────────────────────────────────────────────────────────
    const notifMsg = initialStatus === ComplaintStatus.UNDER_REVIEW
        ? `Your complaint ${complaint.complaintNo} is under review by our team.`
        : `Your complaint ${complaint.complaintNo} has been successfully registered and routed to ${aiResult.departmentSuggestion || 'the relevant department'}.`;
    await NotificationService.notify(targetCitizenId, 'SYSTEM_ALERT', 'Complaint Registered', notifMsg, `/citizen/complaints/${complaint.id}`);
    // ── Notify operations if flagged or CRITICAL ───────────────────────────────
    if (shouldFlagForReview || aiResult.priority === 'CRITICAL') {
        const opsUsers = await prisma.user.findMany({ where: { role: 'OPERATIONS' }, take: 5 });
        for (const ops of opsUsers) {
            const opsTitle = shouldFlagForReview ? 'AI Review Required' : 'Critical Incident Detected';
            const opsMsg = shouldFlagForReview
                ? `Complaint ${complaint.complaintNo} flagged for manual review (AI confidence: ${aiResult.confidence}%).`
                : `CRITICAL priority complaint ${complaint.complaintNo} automatically routed and needs immediate attention.`;
            await NotificationService.notify(ops.id, 'SYSTEM_ALERT', opsTitle, opsMsg, `/dashboard/operations?tab=complaints`);
        }
    }
    res.status(201).json({
        status: 'success',
        data: {
            complaint,
            aiInsights: {
                category: aiResult.predictedCategory,
                confidence: aiResult.confidence,
                priority: aiResult.priority,
                severityScore: aiResult.severityScore,
                keywords: aiResult.keywords,
                summary: aiResult.aiSummary,
                department: aiResult.departmentSuggestion,
                district: aiResult.districtSuggestion,
                detectedObjects: aiResult.detectedObjects,
                isFlagged: shouldFlagForReview,
                requiresEscalation: aiResult.requiresEscalation,
            },
        },
    });
});
export const getComplaints = asyncHandler(async (req, res) => {
    const { status, priority, districtId } = req.query;
    const filter = {};
    if (status)
        filter.status = status;
    if (priority)
        filter.priority = priority;
    if (districtId)
        filter.districtId = districtId;
    // RBAC Filtering
    if (req.user.role === 'CITIZEN') {
        filter.citizenId = req.user.id;
    }
    else if (req.user.role === 'FIELD_OFFICER') {
        filter.officerId = req.user.id;
    }
    else if (req.user.role === 'OPERATIONS' && req.user.districtId) {
        filter.districtId = req.user.districtId;
    }
    const complaints = await prisma.complaint.findMany({
        where: filter,
        include: { category: true, district: true },
        orderBy: { createdAt: 'desc' },
    });
    res.status(200).json({ status: 'success', results: complaints.length, data: { complaints } });
});
export const getComplaintById = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const complaint = await prisma.complaint.findUnique({
        where: { id },
        include: {
            category: true,
            district: true,
            department: true,
            citizen: { select: { name: true, phone: true } },
            officer: { select: { name: true, phone: true } },
            events: { orderBy: { createdAt: 'desc' }, include: { actor: { select: { name: true, role: true } } } },
            media: true,
        },
    });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    // Authorization check
    if (req.user.role === 'CITIZEN' && complaint.citizenId !== req.user.id) {
        throw new AppError('Not authorized', 403);
    }
    if (req.user.role === 'FIELD_OFFICER' && complaint.officerId !== req.user.id) {
        throw new AppError('Not authorized', 403);
    }
    res.status(200).json({ status: 'success', data: { complaint } });
});
const validTransitions = {
    PENDING: ['UNDER_REVIEW'],
    UNDER_REVIEW: ['ASSIGNED', 'REJECTED'],
    ASSIGNED: ['IN_PROGRESS'],
    IN_PROGRESS: ['RESOLVED'],
    RESOLVED: ['VERIFICATION_PENDING'],
    VERIFICATION_PENDING: ['CLOSED', 'REOPENED'],
    CLOSED: [],
    REOPENED: ['ASSIGNED'],
    REJECTED: [],
};
export const updateStatus = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { status, comments } = req.body;
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    if (!status || status === complaint.status) {
        const action = comments?.toLowerCase().includes('visit') ? 'VISIT_LOG' : 'COMMENT';
        const event = await prisma.complaintEvent.create({
            data: {
                complaintId: id,
                action,
                oldStatus: complaint.status,
                newStatus: complaint.status,
                comments,
                actorId: req.user.id,
            },
        });
        await AuditService.log(req.user.id, action === 'VISIT_LOG' ? 'LOG_VISIT' : 'ADD_COMMENT', 'Complaint', id, { comments });
        return res.status(200).json({ status: 'success', data: { complaint, event } });
    }
    const allowedNextStatuses = validTransitions[complaint.status];
    if (!allowedNextStatuses.includes(status)) {
        throw new AppError(`Invalid transition from ${complaint.status} to ${status}`, 400);
    }
    const updatedComplaint = await prisma.complaint.update({
        where: { id },
        data: {
            status: status,
            resolvedAt: status === 'RESOLVED' ? new Date() : null,
            closedAt: status === 'CLOSED' ? new Date() : null,
        },
    });
    await prisma.complaintEvent.create({
        data: {
            complaintId: id,
            action: 'STATUS_CHANGE',
            oldStatus: complaint.status,
            newStatus: status,
            comments,
            actorId: req.user.id,
        },
    });
    await AuditService.log(req.user.id, 'STATUS_CHANGE', 'Complaint', id, { from: complaint.status, to: status });
    await NotificationService.notify(complaint.citizenId, 'STATUS_UPDATE', 'Status Updated', `Your complaint ${complaint.complaintNo} is now ${status}.`);
    res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});
export const assignComplaint = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { officerId } = req.body;
    const officer = await prisma.user.findFirst({ where: { id: officerId, role: 'FIELD_OFFICER' } });
    if (!officer)
        throw new AppError('Invalid officer ID', 400);
    const complaint = await prisma.complaint.update({
        where: { id },
        data: {
            officerId,
            status: 'ASSIGNED',
            assignedAt: new Date(),
        },
    });
    await prisma.complaintEvent.create({
        data: {
            complaintId: id,
            action: 'ASSIGNED',
            newStatus: 'ASSIGNED',
            actorId: req.user.id,
            comments: `Assigned to ${officer.name}`,
        },
    });
    await AuditService.log(req.user.id, 'ASSIGN_OFFICER', 'Complaint', id, { officerId });
    await NotificationService.notify(officerId, 'ASSIGNMENT', 'New Assignment', `Complaint ${complaint.complaintNo} has been assigned to you.`);
    res.status(200).json({ status: 'success', data: { complaint } });
});
export const uploadMedia = asyncHandler(async (req, res) => {
    const id = req.params.id;
    if (!req.file)
        throw new AppError('No file provided', 400);
    const result = await CloudinaryService.uploadImage(req.file.path);
    const media = await prisma.media.create({
        data: {
            complaintId: id,
            url: result.secure_url,
            publicId: result.public_id,
            type: req.user.role === 'CITIZEN' ? MediaType.CITIZEN_EVIDENCE : MediaType.OFFICER_PROOF,
            uploadedById: req.user.id,
        },
    });
    res.status(200).json({ status: 'success', data: { media } });
});
export const verifyComplaint = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { action, feedback, rating } = req.body; // action: 'APPROVE' | 'REJECT'
    if (action !== 'APPROVE' && action !== 'REJECT') {
        throw new AppError('Invalid action. Must be APPROVE or REJECT.', 400);
    }
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    if (complaint.citizenId !== req.user.id)
        throw new AppError('Not authorized', 403);
    // Note: For demo we allow RESOLVED or VERIFICATION_PENDING here
    if (complaint.status !== 'VERIFICATION_PENDING' && complaint.status !== 'RESOLVED') {
        throw new AppError('Complaint is not pending verification', 400);
    }
    const status = action === 'APPROVE' ? 'CLOSED' : 'REOPENED';
    await prisma.$transaction(async (tx) => {
        await tx.complaint.update({
            where: { id },
            data: { status },
        });
        await tx.complaintVerification.upsert({
            where: { complaintId: id },
            update: { status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED', feedback, rating, verifiedAt: new Date() },
            create: { complaintId: id, status: action === 'APPROVE' ? 'APPROVED' : 'REJECTED', feedback, rating, verifiedAt: new Date() },
        });
        await tx.complaintEvent.create({
            data: {
                complaintId: id,
                action: 'VERIFICATION',
                oldStatus: complaint.status,
                newStatus: status,
                comments: feedback,
                actorId: req.user.id,
            },
        });
    });
    await AuditService.log(req.user.id, 'VERIFY_COMPLAINT', 'Complaint', id, { action });
    if (complaint.officerId) {
        await NotificationService.notify(complaint.officerId, 'STATUS_UPDATE', `Complaint ${action === 'APPROVE' ? 'Closed' : 'Reopened'}`, `The citizen has ${action === 'APPROVE' ? 'approved' : 'rejected'} the resolution for complaint ${complaint.complaintNo}.`);
    }
    res.status(200).json({ status: 'success', message: `Complaint ${action.toLowerCase()}d successfully` });
});
export const acceptComplaint = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    if (complaint.officerId !== req.user.id) {
        throw new AppError('You are not authorized to accept this complaint', 403);
    }
    if (complaint.status !== 'ASSIGNED') {
        throw new AppError('Complaint is not in ASSIGNED state', 400);
    }
    const updatedComplaint = await prisma.complaint.update({
        where: { id },
        data: { status: 'IN_PROGRESS' },
    });
    await prisma.complaintEvent.create({
        data: {
            complaintId: id,
            action: 'STATUS_CHANGE',
            oldStatus: 'ASSIGNED',
            newStatus: 'IN_PROGRESS',
            comments: 'Officer accepted assignment and started work',
            actorId: req.user.id,
        },
    });
    await AuditService.log(req.user.id, 'ACCEPT_ASSIGNMENT', 'Complaint', id, {});
    await NotificationService.notify(complaint.citizenId, 'STATUS_UPDATE', 'Work Started', `Work has been started on your complaint ${complaint.complaintNo}.`);
    res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});
export const rejectComplaint = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { reason } = req.body;
    if (!reason)
        throw new AppError('Please provide a reason for rejection', 400);
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    if (complaint.officerId !== req.user.id) {
        throw new AppError('You are not authorized to reject this complaint', 403);
    }
    if (complaint.status !== 'ASSIGNED') {
        throw new AppError('Only newly assigned complaints can be rejected', 400);
    }
    const officerUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    const officerName = officerUser?.name || 'Officer';
    const updatedComplaint = await prisma.complaint.update({
        where: { id },
        data: {
            officerId: null,
            status: 'UNDER_REVIEW'
        },
    });
    await prisma.complaintEvent.create({
        data: {
            complaintId: id,
            action: 'ASSIGNMENT_REJECTED',
            oldStatus: 'ASSIGNED',
            newStatus: 'UNDER_REVIEW',
            comments: `Assignment rejected by officer. Reason: ${reason}`,
            actorId: req.user.id,
        },
    });
    await AuditService.log(req.user.id, 'REJECT_ASSIGNMENT', 'Complaint', id, { reason });
    // Notify Operations managers
    const opsUsers = await prisma.user.findMany({ where: { role: 'OPERATIONS' } });
    for (const ops of opsUsers) {
        await NotificationService.notify(ops.id, 'SYSTEM_ALERT', 'Assignment Rejected', `Officer ${officerName} rejected complaint ${complaint.complaintNo}. Reason: ${reason}`);
    }
    res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});
export const escalateComplaint = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { reason } = req.body;
    if (!reason)
        throw new AppError('Please provide a reason for escalation', 400);
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    if (complaint.officerId !== req.user.id) {
        throw new AppError('You are not authorized to escalate this complaint', 403);
    }
    const officerUser = await prisma.user.findUnique({ where: { id: req.user.id } });
    const officerName = officerUser?.name || 'Officer';
    // Find operations manager to escalate to
    const opsUser = await prisma.user.findFirst({ where: { role: 'OPERATIONS' } });
    if (!opsUser)
        throw new AppError('No operations manager available to escalate to', 404);
    const escalation = await prisma.escalation.create({
        data: {
            complaintId: id,
            escalatedFromId: req.user.id,
            escalatedToId: opsUser.id,
            reason,
        },
    });
    await prisma.complaintEvent.create({
        data: {
            complaintId: id,
            action: 'ESCALATION',
            comments: `Complaint escalated by officer. Reason: ${reason}`,
            actorId: req.user.id,
        },
    });
    await AuditService.log(req.user.id, 'ESCALATE_COMPLAINT', 'Complaint', id, { reason });
    await NotificationService.notify(opsUser.id, 'ESCALATION', 'Incident Escalated', `Complaint ${complaint.complaintNo} has been escalated by officer ${officerName}.`);
    res.status(200).json({ status: 'success', data: { escalation } });
});
export const overrideClassification = asyncHandler(async (req, res) => {
    const id = req.params.id;
    const { categoryId, departmentId, comments } = req.body;
    if (!categoryId || !departmentId) {
        throw new AppError('Please provide categoryId and departmentId for override', 400);
    }
    const complaint = await prisma.complaint.findUnique({ where: { id } });
    if (!complaint)
        throw new AppError('Complaint not found', 404);
    // Allow Super Admin or Operations
    if (req.user.role !== 'OPERATIONS' && req.user.role !== 'SUPER_ADMIN') {
        throw new AppError('Only Operations can override AI classification', 403);
    }
    const updatedComplaint = await prisma.complaint.update({
        where: { id },
        data: {
            categoryId,
            departmentId,
            status: 'PENDING', // moves out of UNDER_REVIEW
            aiIsFlagged: false, // resolved
        },
        include: { category: true, department: true },
    });
    await prisma.complaintEvent.create({
        data: {
            complaintId: id,
            action: 'AI_OVERRIDE',
            oldStatus: complaint.status,
            newStatus: 'PENDING',
            comments: comments || `Operations overrode AI classification. New Category: ${updatedComplaint.category.name}`,
            actorId: req.user.id,
        },
    });
    await AuditService.log(req.user.id, 'AI_OVERRIDE', 'Complaint', id, {
        oldCategory: complaint.categoryId,
        newCategory: categoryId,
        oldDepartment: complaint.departmentId,
        newDepartment: departmentId,
        comments
    });
    // Notify citizen that complaint is now routed
    await NotificationService.notify(complaint.citizenId, 'STATUS_UPDATE', 'Complaint Routed', `Your complaint ${complaint.complaintNo} has been routed to the ${updatedComplaint.department?.name || 'appropriate department'}.`, `/citizen/complaints/${complaint.id}`);
    res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});
//# sourceMappingURL=complaint.controller.js.map