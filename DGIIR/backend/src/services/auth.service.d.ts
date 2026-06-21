export declare class AuthService {
    static generateAccessToken(userId: string, role: string): string;
    static generateRefreshToken(userId: string, role: string): string;
    static requestOtp(phone: string): Promise<void>;
    static verifyOtp(phone: string, otp: string): Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: string;
            name: string;
            deletedAt: Date | null;
            departmentId: string | null;
            updatedAt: Date;
            email: string | null;
            phone: string | null;
            passwordHash: string | null;
            twoFactorSec: string | null;
            role: import("@prisma/client").$Enums.Role;
            isActive: boolean;
            deviceToken: string | null;
            createdAt: Date;
            districtId: string | null;
        };
    }>;
    static resetPassword(phone: string, otp: string, newPassword: string): Promise<{
        id: string;
        name: string;
        deletedAt: Date | null;
        departmentId: string | null;
        updatedAt: Date;
        email: string | null;
        phone: string | null;
        passwordHash: string | null;
        twoFactorSec: string | null;
        role: import("@prisma/client").$Enums.Role;
        isActive: boolean;
        deviceToken: string | null;
        createdAt: Date;
        districtId: string | null;
    }>;
}
//# sourceMappingURL=auth.service.d.ts.map