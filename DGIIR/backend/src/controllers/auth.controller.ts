import type { Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { prisma } from '../db/prisma.js';
import { AppError } from '../utils/AppError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { AuthService } from '../services/auth.service.js';
import { AuditService } from '../services/audit.service.js';

export const requestOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) throw new AppError('Please provide a phone number', 400);

  await AuthService.requestOtp(phone, 'LOGIN');

  res.status(200).json({ status: 'success', message: 'OTP sent successfully' });
});

export const verifyOtp = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp } = req.body;
  if (!phone || !otp) throw new AppError('Please provide phone and OTP', 400);

  const result = await AuthService.verifyOtp(phone, otp);

  res.cookie('refreshToken', result.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({
    status: 'success',
    data: {
      accessToken: result.accessToken,
      user: {
        id: result.user.id,
        name: result.user.name,
        role: result.user.role,
      },
    },
  });
});

export const loginAdmin = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;
  if (!email || !password) throw new AppError('Please provide email and password', 400);

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user || !user.passwordHash || user.role === 'CITIZEN') {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.passwordHash);
  if (!isMatch) throw new AppError('Invalid email or password', 401);

  const accessToken = AuthService.generateAccessToken(user.id, user.role);
  const refreshToken = AuthService.generateRefreshToken(user.id, user.role);

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
  });

  res.status(200).json({
    status: 'success',
    data: { accessToken, user: { id: user.id, name: user.name, role: user.role } },
  });
});

export const refreshToken = asyncHandler(async (req: Request, res: Response) => {
  const { refreshToken } = req.cookies;
  if (!refreshToken) throw new AppError('Please provide a refresh token', 400);

  const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET!) as any;
  const user = await prisma.user.findUnique({ where: { id: decoded.id } });

  if (!user) throw new AppError('User not found', 404);

  const newAccessToken = AuthService.generateAccessToken(user.id, user.role);

  res.status(200).json({ status: 'success', data: { accessToken: newAccessToken } });
});

export const getMe = asyncHandler(async (req: Request, res: Response) => {
  const user = await prisma.user.findUnique({
    where: { id: req.user!.id },
    select: { id: true, name: true, email: true, phone: true, role: true, departmentId: true, districtId: true },
  });

  res.status(200).json({ status: 'success', data: { user } });
});

export const logout = asyncHandler(async (req: Request, res: Response) => {
  res.clearCookie('refreshToken', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });
  res.status(200).json({ status: 'success', message: 'Logged out successfully' });
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response) => {
  const { phone } = req.body;
  if (!phone) throw new AppError('Please provide a phone number', 400);

  await AuthService.requestOtp(phone, 'RESET');

  res.status(200).json({ status: 'success', message: 'Password reset OTP sent successfully' });
});

export const resetPassword = asyncHandler(async (req: Request, res: Response) => {
  const { phone, otp, newPassword } = req.body;
  if (!phone || !otp || !newPassword) throw new AppError('Please provide phone, OTP and new password', 400);

  const user = await AuthService.resetPassword(phone, otp, newPassword);
  
  await AuditService.log(user.id, 'RESET_PASSWORD', 'User', user.id, {});

  res.status(200).json({ status: 'success', message: 'Password reset successfully' });
});
