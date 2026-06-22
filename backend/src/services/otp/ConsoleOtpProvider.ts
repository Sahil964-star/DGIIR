import type { OtpProvider } from './OtpProvider.js';

export class ConsoleOtpProvider implements OtpProvider {
  async sendOtp(phoneOrEmail: string, otp: string): Promise<void> {
    console.log('\n=============================================');
    console.log(`[DEVELOPMENT] OTP for ${phoneOrEmail} is: ${otp}`);
    console.log('=============================================\n');
  }
}
