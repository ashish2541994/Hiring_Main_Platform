import OTP from '../models/OTP.js';
import crypto from 'crypto';
import config from '../config/appConfig.js';
import emailService from './emailService.js';

class OTPService {
  // Generate 6-digit OTP
  generateOTP() {
    return crypto.randomInt(100000, 999999).toString();
  }

  // Create and store OTP
  async createOTP(email, type = 'email_verification', expiryMinutes = null) {
    // Use config expiry if not provided
    const actualExpiryMinutes = expiryMinutes || config.otp.expiryMinutes;
    
    // Invalidate any existing OTPs for this email and type
    await OTP.updateMany(
      { email, type, isUsed: false },
      { isUsed: true }
    );

    const otp = this.generateOTP();
    const expiresAt = new Date(Date.now() + actualExpiryMinutes * 60 * 1000);

    const otpRecord = await OTP.create({
      email,
      otp,
      type,
      expiresAt,
    });

    // Print OTP to console for development
    if (config.otp.useConsoleOTP) {
      console.log('\n========================================');
      console.log(`🔐 OTP for ${email}`);
      console.log(`📧 Type: ${type}`);
      console.log(`🔢 Code: ${otp}`);
      console.log(`⏰ Expires: ${expiresAt.toLocaleString()}`);
      console.log('========================================\n');
    }

    // Send email via email service (will log to console in development)
    await emailService.sendOTPEmail(email, otp, type);

    return otpRecord;
  }

  // Verify OTP
  async verifyOTP(email, otp, type = 'email_verification') {
    const otpRecord = await OTP.findOne({
      email,
      otp,
      type,
      isUsed: false,
    });

    if (!otpRecord) {
      return { success: false, message: 'Invalid OTP' };
    }

    if (otpRecord.isExpired()) {
      return { success: false, message: 'OTP has expired' };
    }

    if (otpRecord.attempts >= config.otp.maxAttempts) {
      return { success: false, message: 'Maximum attempts exceeded' };
    }

    if (otpRecord.otp !== otp) {
      await otpRecord.incrementAttempts();
      const remainingAttempts = config.otp.maxAttempts - otpRecord.attempts;
      return {
        success: false,
        message: `Invalid OTP. ${remainingAttempts} attempts remaining`,
      };
    }

    // Mark as used
    await otpRecord.markAsUsed();

    return { success: true, message: 'OTP verified successfully' };
  }

  // Resend OTP
  async resendOTP(email, type = 'email_verification') {
    // Check if there's a recent OTP (within 1 minute)
    const recentOTP = await OTP.findOne({
      email,
      type,
      isUsed: false,
      createdAt: { $gte: new Date(Date.now() - 60 * 1000) },
    });

    if (recentOTP) {
      return {
        success: false,
        message: 'Please wait before requesting another OTP',
      };
    }

    return await this.createOTP(email, type);
  }

  // Clean up expired OTPs (called by cron job)
  async cleanupExpiredOTPs() {
    const result = await OTP.deleteMany({
      expiresAt: { $lt: new Date() },
    });
    return { deletedCount: result.deletedCount };
  }

  // Get OTP status
  async getOTPStatus(email, type = 'email_verification') {
    const otpRecord = await OTP.findOne({
      email,
      type,
      isUsed: false,
    }).sort({ createdAt: -1 });

    if (!otpRecord) {
      return { exists: false };
    }

    return {
      exists: true,
      isExpired: otpRecord.isExpired(),
      attempts: otpRecord.attempts,
      expiresAt: otpRecord.expiresAt,
      createdAt: otpRecord.createdAt,
    };
  }
}

export default new OTPService();
