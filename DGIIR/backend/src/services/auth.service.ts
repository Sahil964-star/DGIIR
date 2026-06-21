import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { prisma } from '../db/prisma.js';
import { AppError } from '../utils/AppError.js';
import { ConsoleOtpProvider } from './otp/ConsoleOtpProvider.js';

const otpProvider = new ConsoleOtpProvider();

export class AuthService {
  static generateAccessToken(userId: string, role: string) {
    return jwt.sign({ id: userId, role }, process.env.JWT_SECRET || 'fallback_secret', {
      expiresIn: (process.env.JWT_EXPIRES_IN || '30m') as any,
    });
  }

  static generateRefreshToken(userId: string, role: string) {
    return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET || 'fallback_refresh_secret', {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
  }

  static async requestOtp(phone: string) {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) {
      throw new AppError('User with this phone number not found', 404);
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await prisma.otpVerification.create({
      data: {
        userId: user.id,
        otpHash,
        expiresAt,
      },
    });

    await otpProvider.sendOtp(phone, otp);
  }

  static async verifyOtp(phone: string, otp: string) {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) throw new AppError('User not found', 404);

    const verification = await prisma.otpVerification.findFirst({
      where: { userId: user.id, isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) throw new AppError('Invalid or expired OTP', 400);

    const isValid = await bcrypt.compare(otp, verification.otpHash);
    if (!isValid) throw new AppError('Invalid OTP', 400);

    await prisma.otpVerification.update({
      where: { id: verification.id },
      data: { isUsed: true },
    });

    return {
      accessToken: this.generateAccessToken(user.id, user.role),
      refreshToken: this.generateRefreshToken(user.id, user.role),
      user,
    };
  }

  static async resetPassword(phone: string, otp: string, newPassword: string) {
    const user = await prisma.user.findUnique({ where: { phone } });
    if (!user) throw new AppError('User not found', 404);

    const verification = await prisma.otpVerification.findFirst({
      where: { userId: user.id, isUsed: false, expiresAt: { gt: new Date() } },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) throw new AppError('Invalid or expired OTP', 400);

    const isValid = await bcrypt.compare(otp, verification.otpHash);
    if (!isValid) throw new AppError('Invalid OTP', 400);

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.$transaction([
      prisma.otpVerification.update({
        where: { id: verification.id },
        data: { isUsed: true },
      }),
      prisma.user.update({
        where: { id: user.id },
        data: { passwordHash },
      })
    ]);

    return user;
  }
}
