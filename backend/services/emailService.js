// Email Service - Abstracted for development/production
// In development: logs to console
// In production: uses SMTP (Nodemailer)

import config from '../config/appConfig.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initTransporter();
  }

  // Initialize email transporter based on configuration
  initTransporter() {
    if (config.email.useSMTP && config.email.smtp.host) {
      // Production: Use SMTP
      const nodemailer = require('nodemailer');
      this.transporter = nodemailer.createTransporter({
        host: config.email.smtp.host,
        port: config.email.smtp.port,
        secure: config.email.smtp.secure,
        auth: {
          user: config.email.smtp.user,
          pass: config.email.smtp.password,
        },
      });
      console.log('✉️ SMTP email service initialized');
    } else {
      // Development: Console logging
      this.transporter = 'console';
      console.log('✉️ Console email service initialized (development mode)');
    }
  }

  // Send email
  async sendEmail({ to, subject, html, text }) {
    if (this.transporter === 'console') {
      // Development: Log to console
      console.log('\n========================================');
      console.log('📧 EMAIL (Development Mode)');
      console.log('========================================');
      console.log(`To: ${to}`);
      console.log(`Subject: ${subject}`);
      console.log('----------------------------------------');
      console.log('HTML Content:');
      console.log(html);
      if (text) {
        console.log('----------------------------------------');
        console.log('Text Content:');
        console.log(text);
      }
      console.log('========================================\n');
      return { success: true, message: 'Email logged to console' };
    }

    // Production: Send via SMTP
    try {
      const info = await this.transporter.sendMail({
        from: config.email.smtp.fromEmail,
        to,
        subject,
        html,
        text,
      });
      console.log('Email sent:', info.messageId);
      return { success: true, messageId: info.messageId };
    } catch (error) {
      console.error('Email send error:', error);
      return { success: false, error: error.message };
    }
  }

  // Send OTP email
  async sendOTPEmail(email, otp, type = 'email_verification') {
    const subject = type === 'email_verification' 
      ? 'Verify your email address' 
      : type === 'password_reset'
      ? 'Reset your password'
      : 'Your verification code';

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>${subject}</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .otp { font-size: 36px; font-weight: bold; color: #667eea; text-align: center; margin: 30px 0; letter-spacing: 5px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wind Hire</h1>
          </div>
          <div class="content">
            <h2>${subject}</h2>
            <p>Your verification code is:</p>
            <div class="otp">${otp}</div>
            <p>This code will expire in ${config.otp.expiryMinutes} minutes.</p>
            <p>If you didn't request this code, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Wind Hire. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({ to: email, subject, html });
  }

  // Send welcome email
  async sendWelcomeEmail(email, name) {
    const subject = 'Welcome to Wind Hire!';
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Welcome to Wind Hire</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wind Hire</h1>
          </div>
          <div class="content">
            <h2>Welcome, ${name}!</h2>
            <p>Thank you for joining Wind Hire. We're excited to help you find your next opportunity.</p>
            <p>Get started by completing your profile and exploring available jobs.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Wind Hire. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({ to: email, subject, html });
  }

  // Send password reset email
  async sendPasswordResetEmail(email, resetToken) {
    const subject = 'Reset your password';
    const resetUrl = `${config.server.frontendUrl}/reset-password?token=${resetToken}`;
    
    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset your password</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
          .container { max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
          .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
          .button { display: inline-block; padding: 12px 30px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
          .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>Wind Hire</h1>
          </div>
          <div class="content">
            <h2>Reset your password</h2>
            <p>We received a request to reset your password. Click the button below to proceed:</p>
            <div style="text-align: center;">
              <a href="${resetUrl}" class="button">Reset Password</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #667eea;">${resetUrl}</p>
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          </div>
          <div class="footer">
            <p>&copy; ${new Date().getFullYear()} Wind Hire. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    return await this.sendEmail({ to: email, subject, html });
  }
}

export default new EmailService();
