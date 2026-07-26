import multer from 'multer';
import path from 'path';
import fs from 'fs';
import config from '../config/appConfig.js';

// Storage directories - use config values
const STORAGE_DIRS = config.uploadDirs;

// Initialize storage directories
const initializeStorageDirs = () => {
  Object.values(STORAGE_DIRS).forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
};

// Initialize on module load
initializeStorageDirs();

// Configure storage with directory routing
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    let uploadDir = 'uploads/';
    
    // Determine destination based on file type or request parameter
    const fileType = req.body.fileType || req.query.fileType;
    
    if (fileType && STORAGE_DIRS[fileType]) {
      uploadDir = STORAGE_DIRS[fileType];
    } else if (file.mimetype.startsWith('image/')) {
      // Default image storage
      uploadDir = STORAGE_DIRS.gallery;
    } else if (file.mimetype === 'application/pdf') {
      // Default PDF storage
      uploadDir = STORAGE_DIRS.resumes;
    } else {
      // Default document storage
      uploadDir = STORAGE_DIRS.documents;
    }
    
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // Generate unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9]/g, '_').substring(0, 50);
    cb(null, sanitizedName + '-' + uniqueSuffix + ext);
  }
});

// File filter - use config allowed types
const fileFilter = (req, file, cb) => {
  const allowedTypes = [...config.storage.allowedImageTypes, ...config.storage.allowedDocTypes];
  
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only JPEG, PNG, WebP, PDF, and Word documents are allowed.'), false);
  }
};

// Configure multer - use config max file size
const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: config.storage.maxFileSize,
  },
});

class UploadService {
  // Upload avatar
  uploadAvatar() {
    return upload.single('avatar');
  }

  // Upload company logo
  uploadCompanyLogo() {
    return upload.single('logo');
  }

  // Upload job images
  uploadJobImages(maxCount = 5) {
    return upload.array('jobImages', maxCount);
  }

  // Upload resume
  uploadResume() {
    return upload.single('resume');
  }

  // Upload document
  uploadDocument() {
    return upload.single('document');
  }

  // Upload gallery images
  uploadGalleryImages(maxCount = 10) {
    return upload.array('galleryImages', maxCount);
  }

  // Single file upload with type
  uploadSingle(fieldName) {
    return upload.single(fieldName);
  }

  // Multiple files upload
  uploadMultiple(fieldName, maxCount = 5) {
    return upload.array(fieldName, maxCount);
  }

  // Upload with custom field names
  uploadFields(fields) {
    return upload.fields(fields);
  }

  // Get relative file path for storage in database
  getRelativePath(filePath) {
    return filePath.replace(/\\/g, '/').replace(/^uploads\//, '');
  }

  // Get full file path for serving
  getFullPath(relativePath) {
    return path.join('uploads', relativePath);
  }

  // Delete file
  deleteFile(relativePath) {
    const fullPath = this.getFullPath(relativePath);
    if (fs.existsSync(fullPath)) {
      fs.unlinkSync(fullPath);
      return { success: true };
    }
    return { success: false, error: 'File not found' };
  }

  // Get file info
  getFileInfo(relativePath) {
    const fullPath = this.getFullPath(relativePath);
    if (fs.existsSync(fullPath)) {
      const stats = fs.statSync(fullPath);
      return {
        success: true,
        size: stats.size,
        created: stats.birthtime,
        modified: stats.mtime,
        path: relativePath,
        url: `/uploads/${relativePath}`,
      };
    }
    return { success: false, error: 'File not found' };
  }

  // Validate file size - use config max file size
  validateFileSize(file, maxSize = null) {
    const actualMaxSize = maxSize || config.storage.maxFileSize;
    if (file.size > actualMaxSize) {
      throw new Error(`File size exceeds ${actualMaxSize / 1024 / 1024}MB limit`);
    }
    return { success: true };
  }

  // Validate file type - use config allowed types
  validateFileType(file, allowedTypes = null) {
    const actualAllowedTypes = allowedTypes || [...config.storage.allowedImageTypes, ...config.storage.allowedDocTypes];
    if (!actualAllowedTypes.includes(file.mimetype)) {
      throw new Error('Invalid file type');
    }
    return { success: true };
  }

  // Get storage directory for file type
  getStorageDir(fileType) {
    return STORAGE_DIRS[fileType] || STORAGE_DIRS.documents;
  }

  // Clean up old files (for maintenance)
  cleanupOldFiles(dir, maxAgeDays = 30) {
    const directory = STORAGE_DIRS[dir] || dir;
    if (!fs.existsSync(directory)) {
      return { success: false, error: 'Directory not found' };
    }

    const files = fs.readdirSync(directory);
    const now = Date.now();
    let deletedCount = 0;

    files.forEach((file) => {
      const filePath = path.join(directory, file);
      const stats = fs.statSync(filePath);
      const fileAge = now - stats.mtimeMs;
      const maxAgeMs = maxAgeDays * 24 * 60 * 60 * 1000;

      if (fileAge > maxAgeMs) {
        fs.unlinkSync(filePath);
        deletedCount++;
      }
    });

    return { success: true, deletedCount };
  }
}

export default new UploadService();
