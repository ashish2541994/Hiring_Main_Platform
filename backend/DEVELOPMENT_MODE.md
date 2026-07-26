# Development Mode Configuration

This document explains the development mode architecture for Wind Hire, which allows the application to run without external services like SMTP, Cloudinary, or paid APIs.

## Architecture Overview

The application uses a **service abstraction layer** that allows switching between development and production implementations without modifying controllers, routes, or frontend code.

### Key Components

1. **Configuration Layer** (`config/appConfig.js`)
   - Centralized configuration with feature flags
   - Environment-based settings
   - Development/production mode detection

2. **Service Layer**
   - `emailService.js` - Email delivery abstraction
   - `uploadService.js` - File storage abstraction
   - `otpService.js` - OTP generation and verification

## Development Mode Features

### OTP System

**Development Mode:**
- OTPs are generated and stored in MongoDB
- OTPs are printed to the backend console
- Email service logs to console (no actual email delivery)
- Frontend can verify OTPs using the console code

**Production Mode:**
- OTPs are generated and stored in MongoDB
- OTPs are sent via email (SMTP)
- Frontend verifies OTPs from email

### Image Upload

**Development Mode:**
- Uses Multer for local file storage
- Files stored in `uploads/` directory structure
- Served via Express static middleware
- Relative paths stored in MongoDB

**Production Mode:**
- Uses Cloudinary for cloud storage
- Files stored in Cloudinary CDN
- Cloudinary URLs stored in MongoDB

### Email Delivery

**Development Mode:**
- Emails logged to console with full HTML content
- No SMTP connection required
- All email templates rendered in console

**Production Mode:**
- Emails sent via SMTP (Nodemailer)
- Uses configured SMTP server
- Actual email delivery

## Directory Structure

```
backend/
├── uploads/
│   ├── avatars/       # User profile pictures
│   ├── companies/     # Company logos
│   ├── jobs/          # Job-related images
│   ├── gallery/       # General gallery images
│   ├── resumes/       # PDF resumes
│   └── documents/     # Other documents
├── config/
│   ├── appConfig.js   # Centralized configuration
│   └── database.js    # Database configuration
└── services/
    ├── emailService.js    # Email abstraction
    ├── uploadService.js   # Upload abstraction
    └── otpService.js      # OTP service
```

## Environment Variables

### Development Mode Flags

```env
# Development Mode (set to true for local development)
USE_CONSOLE_OTP=true
USE_LOCAL_STORAGE=true
USE_SMTP=false
USE_CLOUDINARY=false
```

### Production Mode Flags

```env
# Production Mode (set to false for production)
USE_CONSOLE_OTP=false
USE_LOCAL_STORAGE=false
USE_SMTP=true
USE_CLOUDINARY=true
```

### Configuration Variables

```env
# OTP Configuration
OTP_EXPIRY_MINUTES=10
OTP_MAX_ATTEMPTS=3

# Storage Configuration
MAX_FILE_SIZE=5242880  # 5MB in bytes

# Cloudinary (Production)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# SMTP (Production)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your_email@gmail.com
SMTP_PASSWORD=your_app_password
SMTP_FROM_EMAIL=noreply@windhire.com
```

## Switching to Production

To switch from development to production mode:

1. **Update environment variables:**
   ```env
   NODE_ENV=production
   USE_CONSOLE_OTP=false
   USE_LOCAL_STORAGE=false
   USE_SMTP=true
   USE_CLOUDINARY=true
   ```

2. **Configure Cloudinary:**
   - Add Cloudinary credentials
   - Ensure Cloudinary account is active

3. **Configure SMTP:**
   - Add SMTP server credentials
   - Ensure SMTP server is accessible

4. **No code changes required:**
   - Controllers remain unchanged
   - Routes remain unchanged
   - Frontend code remains unchanged
   - Only configuration changes

## Console OTP Usage

During development, OTPs are displayed in the backend console:

```
========================================
🔐 OTP for user@example.com
📧 Type: email_verification
🔢 Code: 123456
⏰ Expires: 7/22/2026, 12:25:00 AM
========================================
```

Use this code in the frontend to verify the OTP.

## Console Email Usage

During development, emails are logged to the console:

```
========================================
📧 EMAIL (Development Mode)
========================================
To: user@example.com
Subject: Verify your email address
----------------------------------------
HTML Content:
<!DOCTYPE html>
<html>
...
</html>
========================================
```

## File Upload in Development

### Upload Flow

1. Frontend sends file via multipart/form-data
2. Multer middleware processes the upload
3. File stored in appropriate `uploads/` subdirectory
4. Relative path stored in MongoDB
5. File accessible via `/uploads/relative/path`

### Example

Upload avatar:
- Request: `POST /api/users/avatar`
- File stored: `uploads/avatars/user-1234567890-abc123.jpg`
- MongoDB stores: `avatars/user-1234567890-abc123.jpg`
- Accessible at: `http://localhost:5000/uploads/avatars/user-1234567890-abc123.jpg`

## Testing Development Mode

### Test OTP

1. Register a new account
2. Check backend console for OTP
3. Enter OTP in frontend verification form
4. Verify successful authentication

### Test File Upload

1. Navigate to profile settings
2. Upload an avatar image
3. Check `uploads/avatars/` directory
4. Verify image displays in frontend
5. Check MongoDB for relative path

### Test Email

1. Trigger an email action (e.g., password reset)
2. Check backend console for email content
3. Verify HTML template renders correctly

## Benefits of This Architecture

1. **No External Dependencies in Development**
   - No SMTP server required
   - No Cloudinary account required
   - No paid APIs required

2. **Easy Production Transition**
   - Single configuration change
   - No code refactoring needed
   - Zero downtime deployment

3. **Cost-Effective Development**
   - Free to develop locally
   - No subscription costs during development
   - Pay only for production usage

4. **Faster Development Cycle**
   - Instant OTP verification via console
   - Local file storage is faster
   - No network latency for external services

5. **Consistent API Interface**
   - Same service methods in both modes
   - Same response structure
   - Same error handling

## Troubleshooting

### OTP Not Showing in Console

- Verify `USE_CONSOLE_OTP=true` in `.env`
- Check that `NODE_ENV=development`
- Restart the backend server

### File Upload Failing

- Verify `uploads/` directories exist
- Check `USE_LOCAL_STORAGE=true` in `.env`
- Ensure write permissions on `uploads/` directory
- Check file size doesn't exceed `MAX_FILE_SIZE`

### Email Not Logging to Console

- Verify `USE_SMTP=false` in `.env`
- Check that `NODE_ENV=development`
- Ensure emailService is imported correctly

## Security Considerations

### Development Mode

- Never use development mode in production
- Console OTPs are visible to anyone with server access
- Local storage files are not backed up
- No email encryption in console logs

### Production Mode

- Always use HTTPS
- Enable SMTP with TLS
- Use Cloudinary with signed URLs
- Implement proper file access controls
- Regular security audits

## Future Enhancements

Potential improvements to the development mode:

1. **Mock Cloudinary Service**
   - Simulate Cloudinary responses
   - Test Cloudinary-specific features locally

2. **Email Preview UI**
   - Web interface to view sent emails
   - Better than console logging

3. **File Manager UI**
   - Web interface to manage uploaded files
   - View, delete, and organize files

4. **OTP Dashboard**
   - Web interface to view active OTPs
   - Manually invalidate OTPs

## Support

For issues or questions about development mode:
- Check this documentation first
- Review `config/appConfig.js` for configuration options
- Check service implementations for behavior details
