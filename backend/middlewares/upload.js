const multer = require("multer");
const path = require("path");
const fs = require("fs");
const { createHttpError } = require("../utils/errors");

const uploadDir = path.resolve(__dirname, "../uploads");

// Ensure upload directory exists
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const IMAGE_MIME_TO_EXT = {
  "image/jpeg": ".jpg",
  "image/jpg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
};

const PDF_MIME_TO_EXT = {
  "application/pdf": ".pdf",
};

const createUploader = ({ prefix, mimeToExt, allowedExts, invalidMessage, maxSizeBytes }) => {
  const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const ext =
        mimeToExt[file.mimetype.toLowerCase()] ||
        path.extname(file.originalname).toLowerCase();
      const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
      cb(null, `${prefix}-${uniqueSuffix}${ext}`);
    },
  });

  const fileFilter = (req, file, cb) => {
    const mime = file.mimetype.toLowerCase();
    const ext = path.extname(file.originalname).toLowerCase();

    if (mimeToExt[mime] && allowedExts.has(ext)) {
      cb(null, true);
    } else {
      cb(createHttpError(invalidMessage, 400), false);
    }
  };

  return multer({
    storage,
    fileFilter,
    limits: {
      fileSize: maxSizeBytes,
    },
  });
};

const upload = createUploader({
  prefix: "avatar",
  mimeToExt: IMAGE_MIME_TO_EXT,
  allowedExts: new Set([".jpg", ".jpeg", ".png", ".webp", ".gif"]),
  invalidMessage: "Invalid file type. Only JPG, PNG, WEBP, and GIF images are allowed.",
  maxSizeBytes: 5 * 1024 * 1024, // 5MB
});

const uploadResume = createUploader({
  prefix: "resume",
  mimeToExt: PDF_MIME_TO_EXT,
  allowedExts: new Set([".pdf"]),
  invalidMessage: "Invalid file type. Only PDF files are allowed for Resume.",
  maxSizeBytes: 10 * 1024 * 1024, // 10MB
});

module.exports = upload;
module.exports.uploadResume = uploadResume;
module.exports.uploadDir = uploadDir;
