export interface OtpProvider {
  sendOtp(phoneOrEmail: string, otp: string): Promise<void>;
}
