const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const upload = require("../middlewares/upload");
const authMiddleware = require("../middlewares/auth");
const personalModels = require("../models/personalModels");
const { createHttpError } = require("../utils/errors");

const removeLocalUploadIfOwned = (fileUrl) => {
  if (!fileUrl || typeof fileUrl !== "string") return;

  let pathname = fileUrl;
  if (/^https?:\/\//i.test(fileUrl)) {
    try {
      pathname = new URL(fileUrl).pathname;
    } catch {
      return;
    }
  }

  if (!pathname.startsWith("/uploads/")) return;

  const filename = path.basename(pathname);
  const resolvedPath = path.resolve(upload.uploadDir, filename);
  if (
    resolvedPath.startsWith(upload.uploadDir + path.sep) &&
    fs.existsSync(resolvedPath)
  ) {
    fs.unlink(resolvedPath, (err) => {
      if (err) {
        console.error("Failed to remove old uploaded file:", err.message);
      }
    });
  }
};

const handleProfileFileUpload = ({ fieldKey, label, missingMsg }) => async (req, res, next) => {
  try {
    if (!req.file) {
      throw createHttpError(missingMsg, 400);
    }

    const relativeUrl = `/uploads/${req.file.filename}`;
    const baseUrl =
      process.env.APP_BASE_URL || `${req.protocol}://${req.get("host")}`;
    const fullUrl = `${baseUrl.replace(/\/$/, "")}${relativeUrl}`;

    const profile = await personalModels.getProfile();
    if (profile) {
      const previousFile = profile[fieldKey];
      await personalModels.updateProfile(profile.id, {
        ...profile,
        [fieldKey]: relativeUrl,
      });
      if (previousFile !== relativeUrl) {
        removeLocalUploadIfOwned(previousFile);
      }
    }

    return res.status(200).json({
      success: true,
      message: `${label} uploaded and updated successfully`,
      data: {
        url: relativeUrl,
        full_url: fullUrl,
        relative_url: relativeUrl,
        filename: req.file.filename,
        size: req.file.size,
      },
    });
  } catch (error) {
    if (req.file) {
      removeLocalUploadIfOwned(`/uploads/${req.file.filename}`);
    }
    return next(error);
  }
};

router.post(
  "/api/upload/avatar",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  upload.single("avatar"),
  handleProfileFileUpload({
    fieldKey: "avatar_url",
    label: "Avatar",
    missingMsg: "Please select an image file to upload",
  }),
);

router.post(
  "/api/upload/resume",
  authMiddleware.islogin,
  authMiddleware.isAdmin,
  upload.uploadResume.single("resume"),
  handleProfileFileUpload({
    fieldKey: "resume_url",
    label: "Resume",
    missingMsg: "Please select a PDF file to upload",
  }),
);

module.exports = router;
