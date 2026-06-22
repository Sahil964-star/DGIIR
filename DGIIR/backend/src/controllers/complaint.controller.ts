import type { Request, Response } from 'express';
import { prisma } from '../db/prisma.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { CloudinaryService } from '../services/cloudinary.service.js';
import { AuditService } from '../services/audit.service.js';
import { NotificationService } from '../services/notification.service.js';
import { ComplaintStatus, MediaType } from '@prisma/client';

export const createComplaint = asyncHandler(async (req: Request, res: Response) => {
  const { title, description, districtId, categoryId, address, latitude, longitude, citizenId: providedCitizenId } = req.body;
  
  if (!title || !description || !districtId || !categoryId || !address) {
    throw new AppError('Please provide all required fields', 400);
  }

  let lat: number | null = null;
  let lng: number | null = null;

  if (latitude !== undefined && latitude !== null) {
    lat = Number(latitude);
    if (isNaN(lat)) throw new AppError('Invalid latitude value', 400);
  }

  if (longitude !== undefined && longitude !== null) {
    lng = Number(longitude);
    if (isNaN(lng)) throw new AppError('Invalid longitude value', 400);
  }

  let targetCitizenId: string;

  if (req.user!.role === 'OPERATIONS') {
    if (!providedCitizenId) {
      throw new AppError('citizenId is required when creating a complaint on behalf of a citizen.', 400);
    }
    const citizenUser = await prisma.user.findUnique({ where: { id: providedCitizenId } });
    if (!citizenUser || citizenUser.role !== 'CITIZEN') {
      throw new AppError('Invalid citizen identifier. The user must exist and have the CITIZEN role.', 400);
    }
    targetCitizenId = citizenUser.id;
  } else {
    targetCitizenId = req.user!.id;
  }

  // Generate Complaint No e.g. CMP-20231012-XXXX
  const complaintNo = `CMP-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${Math.floor(1000 + Math.random() * 9000)}`;

  const category = await prisma.category.findUnique({ where: { id: categoryId } });
  if (!category) throw new AppError('Invalid category', 400);

  const complaint = await prisma.complaint.create({
    data: {
      complaintNo,
      title,
      description,
      districtId,
      categoryId,
      departmentId: category.departmentId,
      citizenId: targetCitizenId,
      address,
      latitude: lat,
      longitude: lng,
    },
  });

  await prisma.complaintEvent.create({
    data: {
      complaintId: complaint.id,
      action: 'CREATED',
      newStatus: 'PENDING',
      actorId: req.user!.id,
      comments: req.user!.role === 'OPERATIONS' ? 'Complaint registered by Operations staff on behalf of citizen' : 'Complaint registered by citizen',
    },
  });

  await AuditService.log(req.user!.id, 'CREATE_COMPLAINT', 'Complaint', complaint.id);
  await NotificationService.notify(
    targetCitizenId,
    'SYSTEM_ALERT',
    'Complaint Registered',
    `Your complaint ${complaint.complaintNo} has been successfully registered.`,
    `/citizen/complaints/${complaint.id}`
  );

  res.status(201).json({ status: 'success', data: { complaint } });
});

export const getComplaints = asyncHandler(async (req: Request, res: Response) => {
  const { status, priority, districtId } = req.query;
  const filter: any = {};

  if (status) filter.status = status as string;
  if (priority) filter.priority = priority as string;
  if (districtId) filter.districtId = districtId as string;

  // RBAC Filtering
  if (req.user!.role === 'CITIZEN') {
    filter.citizenId = req.user!.id;
  } else if (req.user!.role === 'FIELD_OFFICER') {
    filter.officerId = req.user!.id;
  } else if (req.user!.role === 'OPERATIONS' && req.user!.districtId) {
    filter.districtId = req.user!.districtId;
  }

  const complaints = await prisma.complaint.findMany({
    where: filter,
    include: { category: true, district: true },
    orderBy: { createdAt: 'desc' },
  });

  res.status(200).json({ status: 'success', results: complaints.length, data: { complaints } });
});

export const getComplaintById = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
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

  if (!complaint) throw new AppError('Complaint not found', 404);

  // Authorization check
  if (req.user!.role === 'CITIZEN' && complaint.citizenId !== req.user!.id) {
    throw new AppError('Not authorized', 403);
  }
  if (req.user!.role === 'FIELD_OFFICER' && complaint.officerId !== req.user!.id) {
    throw new AppError('Not authorized', 403);
  }

  res.status(200).json({ status: 'success', data: { complaint } });
});

const validTransitions: Record<ComplaintStatus, ComplaintStatus[]> = {
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

export const updateStatus = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { status, comments } = req.body;

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);

  if (!status || status === complaint.status) {
    const action = comments?.toLowerCase().includes('visit') ? 'VISIT_LOG' : 'COMMENT';
    const event = await prisma.complaintEvent.create({
      data: {
        complaintId: id,
        action,
        oldStatus: complaint.status,
        newStatus: complaint.status,
        comments,
        actorId: req.user!.id,
      },
    });

    await AuditService.log(req.user!.id, action === 'VISIT_LOG' ? 'LOG_VISIT' : 'ADD_COMMENT', 'Complaint', id, { comments });
    
    return res.status(200).json({ status: 'success', data: { complaint, event } });
  }

  const allowedNextStatuses = validTransitions[complaint.status];
  if (!allowedNextStatuses.includes(status as ComplaintStatus)) {
    throw new AppError(`Invalid transition from ${complaint.status} to ${status}`, 400);
  }

  const updatedComplaint = await prisma.complaint.update({
    where: { id },
    data: { 
      status: status as ComplaintStatus,
      resolvedAt: status === 'RESOLVED' ? new Date() : null,
      closedAt: status === 'CLOSED' ? new Date() : null,
    },
  });

  await prisma.complaintEvent.create({
    data: {
      complaintId: id,
      action: 'STATUS_CHANGE',
      oldStatus: complaint.status,
      newStatus: status as ComplaintStatus,
      comments,
      actorId: req.user!.id,
    },
  });

  await AuditService.log(req.user!.id, 'STATUS_CHANGE', 'Complaint', id, { from: complaint.status, to: status });
  await NotificationService.notify(complaint.citizenId, 'STATUS_UPDATE', 'Status Updated', `Your complaint ${complaint.complaintNo} is now ${status}.`);

  res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});

export const assignComplaint = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { officerId } = req.body;

  const officer = await prisma.user.findFirst({ where: { id: officerId, role: 'FIELD_OFFICER' } });
  if (!officer) throw new AppError('Invalid officer ID', 400);

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
      actorId: req.user!.id,
      comments: `Assigned to ${officer.name}`,
    },
  });

  await AuditService.log(req.user!.id, 'ASSIGN_OFFICER', 'Complaint', id, { officerId });
  await NotificationService.notify(officerId, 'ASSIGNMENT', 'New Assignment', `Complaint ${complaint.complaintNo} has been assigned to you.`);

  res.status(200).json({ status: 'success', data: { complaint } });
});

export const uploadMedia = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  if (!req.file) throw new AppError('No file provided', 400);

  const result = await CloudinaryService.uploadImage(req.file.path);

  const media = await prisma.media.create({
    data: {
      complaintId: id,
      url: result.secure_url,
      publicId: result.public_id,
      type: req.user!.role === 'CITIZEN' ? MediaType.CITIZEN_EVIDENCE : MediaType.OFFICER_PROOF,
      uploadedById: req.user!.id,
    },
  });

  res.status(200).json({ status: 'success', data: { media } });
});

export const verifyComplaint = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { action, feedback, rating } = req.body; // action: 'APPROVE' | 'REJECT'

  if (action !== 'APPROVE' && action !== 'REJECT') {
    throw new AppError('Invalid action. Must be APPROVE or REJECT.', 400);
  }

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);
  if (complaint.citizenId !== req.user!.id) throw new AppError('Not authorized', 403);
  
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
        actorId: req.user!.id,
      },
    });
  });

  await AuditService.log(req.user!.id, 'VERIFY_COMPLAINT', 'Complaint', id, { action });
  if (complaint.officerId) {
    await NotificationService.notify(
      complaint.officerId,
      'STATUS_UPDATE',
      `Complaint ${action === 'APPROVE' ? 'Closed' : 'Reopened'}`,
      `The citizen has ${action === 'APPROVE' ? 'approved' : 'rejected'} the resolution for complaint ${complaint.complaintNo}.`
    );
  }

  res.status(200).json({ status: 'success', message: `Complaint ${action.toLowerCase()}d successfully` });
});

export const acceptComplaint = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);

  if (complaint.officerId !== req.user!.id) {
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
      actorId: req.user!.id,
    },
  });

  await AuditService.log(req.user!.id, 'ACCEPT_ASSIGNMENT', 'Complaint', id, {});
  await NotificationService.notify(complaint.citizenId, 'STATUS_UPDATE', 'Work Started', `Work has been started on your complaint ${complaint.complaintNo}.`);

  res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});

export const rejectComplaint = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { reason } = req.body;
  if (!reason) throw new AppError('Please provide a reason for rejection', 400);

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);

  if (complaint.officerId !== req.user!.id) {
    throw new AppError('You are not authorized to reject this complaint', 403);
  }

  if (complaint.status !== 'ASSIGNED') {
    throw new AppError('Only newly assigned complaints can be rejected', 400);
  }

  const officerUser = await prisma.user.findUnique({ where: { id: req.user!.id } });
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
      actorId: req.user!.id,
    },
  });

  await AuditService.log(req.user!.id, 'REJECT_ASSIGNMENT', 'Complaint', id, { reason });

  // Notify Operations managers
  const opsUsers = await prisma.user.findMany({ where: { role: 'OPERATIONS' } });
  for (const ops of opsUsers) {
    await NotificationService.notify(
      ops.id,
      'SYSTEM_ALERT',
      'Assignment Rejected',
      `Officer ${officerName} rejected complaint ${complaint.complaintNo}. Reason: ${reason}`
    );
  }

  res.status(200).json({ status: 'success', data: { complaint: updatedComplaint } });
});

export const escalateComplaint = asyncHandler(async (req: Request, res: Response) => {
  const id = req.params.id as string;
  const { reason } = req.body;
  if (!reason) throw new AppError('Please provide a reason for escalation', 400);

  const complaint = await prisma.complaint.findUnique({ where: { id } });
  if (!complaint) throw new AppError('Complaint not found', 404);

  if (complaint.officerId !== req.user!.id) {
    throw new AppError('You are not authorized to escalate this complaint', 403);
  }

  const officerUser = await prisma.user.findUnique({ where: { id: req.user!.id } });
  const officerName = officerUser?.name || 'Officer';

  // Find operations manager to escalate to
  const opsUser = await prisma.user.findFirst({ where: { role: 'OPERATIONS' } });
  if (!opsUser) throw new AppError('No operations manager available to escalate to', 404);

  const escalation = await prisma.escalation.create({
    data: {
      complaintId: id,
      escalatedFromId: req.user!.id,
      escalatedToId: opsUser.id,
      reason,
    },
  });

  await prisma.complaintEvent.create({
    data: {
      complaintId: id,
      action: 'ESCALATION',
      comments: `Complaint escalated by officer. Reason: ${reason}`,
      actorId: req.user!.id,
    },
  });

  await AuditService.log(req.user!.id, 'ESCALATE_COMPLAINT', 'Complaint', id, { reason });
  await NotificationService.notify(
    opsUser.id,
    'ESCALATION',
    'Incident Escalated',
    `Complaint ${complaint.complaintNo} has been escalated by officer ${officerName}.`
  );

  res.status(200).json({ status: 'success', data: { escalation } });
});
