export declare class AuthService {
    static generateAccessToken(userId: string, role: string): string;
    static generateRefreshToken(userId: string, role: string): string;
    static requestOtp(phone: string, purpose?: 'LOGIN' | 'RESET'): Promise<void>;
    static verifyOtp(phone: string, otp: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            email: string | null;
            phone: string | null;
            passwordHash: string | null;
            twoFactorSec: string | null;
            name: string;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
            deviceToken: string | null;
            departmentId: string | null;
            districtId: string | null;
            createdAt: Date;
            updatedAt: Date;
            deletedAt: Date | null;
        };
    }>;
    static resetPassword(phone: string, otp: string, newPassword: string): Promise<{
        id: string;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        twoFactorSec: string | null;
        name: string;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        deviceToken: string | null;
        departmentId: string | null;
        districtId: string | null;
        createdAt: Date;
        updatedAt: Date;
        deletedAt: Date | null;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map