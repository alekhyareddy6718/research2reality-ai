import multer from 'multer';

const storage = multer.memoryStorage();

export const uploadPDFMiddleware = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024, // 15 MB max
  },
  fileFilter: (req, file, cb) => {
    const isPdfMime = file.mimetype === 'application/pdf' || file.mimetype === 'application/x-pdf';
    const isPdfExt = file.originalname.toLowerCase().endsWith('.pdf');
    if (isPdfMime || isPdfExt) {
      cb(null, true);
    } else {
      cb(new Error('INVALID_FILE_TYPE: Only PDF (.pdf) files are allowed.'));
    }
  }
}).single('file');
