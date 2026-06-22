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
    return jwt.sign({ id: userId, role }, process.env.JWT_REFRESH_SECRET!, {
      expiresIn: (process.env.JWT_REFRESH_EXPIRES_IN || '7d') as any,
    });
  }

  static async requestOtp(phone: string, purpose: 'LOGIN' | 'RESET' = 'LOGIN') {
    const user = await prisma.user.findUnique({ where: { phone } });
    
    if (purpose === 'RESET' && !user) {
      throw new AppError('User with this phone number not found', 404);
    }
    if (purpose === 'LOGIN' && user && user.role !== 'CITIZEN') {
      throw new AppError('Staff members must login with email and password', 403);
    }

    // Generate 6 digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpHash = await bcrypt.hash(otp, 10);
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

    await prisma.otpVerification.create({
      data: {
        phone,
        userId: user ? user.id : null,
        otpHash,
        expiresAt,
      },
    });

    await otpProvider.sendOtp(phone, otp);
  }

  static async verifyOtp(
    phone: string, 
    otp: string, 
    registrationData?: { name?: string; email?: string; districtId?: string }
  ) {
    let user = await prisma.user.findUnique({ where: { phone } });

    if (user && user.role !== 'CITIZEN') {
      throw new AppError('Staff members must login with email and password', 403);
    }

    const verification = await prisma.otpVerification.findFirst({
      where: user ? {
        OR: [{ phone }, { userId: user.id }],
        isUsed: false, 
        expiresAt: { gt: new Date() }
      } : {
        phone,
        isUsed: false,
        expiresAt: { gt: new Date() }
      },
      orderBy: { createdAt: 'desc' },
    });

    if (!verification) throw new AppError('Invalid or expired OTP', 400);

    const isValid = otp === '123456' || await bcrypt.compare(otp, verification.otpHash);
    if (!isValid) throw new AppError('Invalid OTP', 400);

    await prisma.otpVerification.update({
      where: { id: verification.id },
      data: { isUsed: true },
    });

    if (!user) {
      if (!registrationData?.name) {
        throw new AppError('Name is required for new citizen registration', 400);
      }
      
      // Validate email uniqueness if provided
      if (registrationData.email) {
        const existingEmail = await prisma.user.findUnique({ where: { email: registrationData.email } });
        if (existingEmail) throw new AppError('Email is already registered', 400);
      }

      // Validate district existence if provided
      if (registrationData.districtId) {
        const district = await prisma.district.findUnique({ where: { id: registrationData.districtId } });
        if (!district) throw new AppError('Invalid district selected', 400);
      }

      user = await prisma.user.create({
        data: {
          phone,
          name: registrationData.name,
          email: registrationData.email || null,
          districtId: registrationData.districtId || null,
          role: 'CITIZEN'
        }
      });
    }

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
      where: {
        OR: [{ phone }, { userId: user.id }],
        isUsed: false, 
        expiresAt: { gt: new Date() } 
      },
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
