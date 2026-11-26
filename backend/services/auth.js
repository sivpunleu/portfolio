const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const authModels = require("../models/auth");
const mailerServices = require("./mailservices");
const { jwtSecret, jwtExpiresIn } = require("../config/jwt");
const { createHttpError } = require("../utils/errors");
const { hashToken } = require("../utils/tokens");

const PASSWORD_HASH_ROUNDS = 12;


const generateSecureToken = (hoursValid = 1) => {
  const token = crypto.randomBytes(32).toString("hex");
  return {
    token,
    tokenHash: hashToken(token),
    expiresAt: new Date(Date.now() + hoursValid * 60 * 60 * 1000),
  };
};

const getTokenValues = (token) => [hashToken(token), token];

// ==================== 1. REGISTER ====================
const register = async (body) => {
  const { email, full_name, password, phone } = body;

  const userCount = await authModels.countUsers();
  if (userCount > 0 && process.env.ALLOW_PUBLIC_REGISTRATION !== "true") {
    throw createHttpError(
      "Public registration is disabled. Please contact the administrator.",
      403,
    );
  }

  // Business Logic: ឆែកមើល Email ស្ទួន
  const existingUser = await authModels.findbyEmail(email);
  if (existingUser) {
    throw createHttpError("Email already exists", 409);
  }

  const verification = generateSecureToken();
  const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  const role = userCount === 0 ? "admin" : "user";

  let insertId;
  try {
    insertId = await authModels.register({
      email,
      full_name,
      role,
      password: hashedPassword,
      phone: phone || null,
      verification_token: verification.tokenHash,
      verification_expires: verification.expiresAt,
    });
  } catch (error) {
    if (error.code === "ER_DUP_ENTRY") {
      throw createHttpError("Email already exists", 409);
    }
    throw error;
  }

  // ផ្ញើ Email Verification
  let verificationEmailSent = true;
  try {
    await mailerServices.sendVerificationEmail(email, verification.token);
  } catch (error) {
    console.error("Failed to send verification email:", error.message);
    verificationEmailSent = false;
  }

  return {
    id: insertId,
    full_name,
    email,
    phone: phone || null,
    role,
    verificationEmailSent,
  };
};

// ==================== 2. LOGIN ====================
const login = async (body) => {
  const { email, password } = body;

  const user = await authModels.findbyEmail(email);
  if (!user) {
    throw createHttpError("Invalid email or password", 401);
  }

  const passwordMatches = await bcrypt.compare(password, user.password);
  if (!passwordMatches) {
    throw createHttpError("Invalid email or password", 401);
  }

  if (Number(user.is_verified) !== 1) {
    throw createHttpError("Email is not verified", 403);
  }

  const token = jwt.sign({ id: user.id, email: user.email }, jwtSecret, {
    expiresIn: jwtExpiresIn,
    algorithm: "HS256",
  });

  await authModels.updatetoken(user.id, hashToken(token));
  const decoded = jwt.decode(token);

  return {
    id: user.id,
    full_name: user.full_name,
    email: user.email,
    role: user.role,
    verified: true,
    token_expires: new Date(decoded.exp * 1000).toISOString(),
    token,
  };
};

// ==================== 3. LOGOUT ====================
const logout = async (userId) => {
  await authModels.updatetoken(userId, null);
};

// ==================== 4. VERIFY EMAIL ====================
const verifyEmail = async (token) => {
  if (!token || typeof token !== "string" || !token.trim()) {
    throw createHttpError("Verification token is required", 400);
  }

  const tokenValues = getTokenValues(token.trim());
  const user = await authModels.findByVerificationToken(tokenValues);

  if (!user) {
    throw createHttpError("Token is invalid or expired", 400);
  }

  if (Number(user.is_verified) === 1) {
    throw createHttpError("Email is already verified", 409);
  }

  const affectedRows = await authModels.verifyEmail(tokenValues, new Date());
  if (affectedRows !== 1) {
    throw createHttpError("Token is invalid or expired", 400);
  }
};

// ==================== 5. RESEND EMAIL ====================
const resendEmail = async (body) => {
  const { email } = body;

  const user = await authModels.findbyEmail(email);
  if (!user) {
    return { emailSent: false, alreadyVerified: false };
  }

  if (Number(user.is_verified) === 1) {
    return { emailSent: false, alreadyVerified: true };
  }

  const verification = generateSecureToken();
  await authModels.updateVerificationToken(
    user.id,
    verification.tokenHash,
    verification.expiresAt,
  );

  try {
    await mailerServices.sendVerificationEmail(user.email, verification.token);
  } catch (error) {
    throw createHttpError(
      "Unable to send verification email. Please try again later.",
      503,
    );
  }

  return { emailSent: true, alreadyVerified: false };
};

// ==================== 6. FORGOT PASSWORD ====================
const forgotPassword = async (body) => {
  const { email } = body;

  const user = await authModels.findbyEmail(email);
  if (!user || Number(user.is_verified) !== 1) {
    // សម្រាប់ Security: កុំប្រាប់ឱ្យគេដឹងថា email នេះមានក្នុង DB ឬអត់
    return { emailSent: false };
  }

  const reset = generateSecureToken();
  await authModels.updatePasswordResetToken(
    user.id,
    reset.tokenHash,
    reset.expiresAt,
  );

  try {
    await mailerServices.sendPasswordResetEmail(user.email, reset.token);
  } catch (error) {
    throw createHttpError(
      "Unable to send password reset email. Please try again later.",
      503,
    );
  }

  return { emailSent: true };
};

// ==================== 7. RESET PASSWORD ====================
const resetPassword = async (body) => {
  const { token, password } = body;

  const now = new Date();
  const tokenValues = getTokenValues(token);
  const user = await authModels.findByPasswordResetToken(tokenValues, now);
  if (!user) {
    throw createHttpError("Password reset token is invalid or expired", 400);
  }

  const hashedPassword = await bcrypt.hash(password, PASSWORD_HASH_ROUNDS);
  const affectedRows = await authModels.resetPassword(
    tokenValues,
    hashedPassword,
    now,
  );

  if (affectedRows !== 1) {
    throw createHttpError("Password reset token is invalid or expired", 400);
  }

 
  await authModels.updatetoken(user.id, null);
};

// ==================== 8. CHANGE PASSWORD ====================
const changePassword = async (userId, body) => {
  const { oldPassword, newPassword } = body;

  const user = await authModels.findById(userId);
  if (!user) {
    throw createHttpError("User not found", 404);
  }

  if (Number(user.is_verified) !== 1) {
    throw createHttpError("Email is not verified", 403);
  }


  const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
  if (!isPasswordValid) {
    throw createHttpError("Old Password is incorrect", 400);
  }

 
  if (oldPassword === newPassword) {
    throw createHttpError(
      "New Password cannot be the same as Old Password",
      400,
    );
  }

  const hashedPassword = await bcrypt.hash(newPassword, PASSWORD_HASH_ROUNDS);
  await authModels.updatePassword(user.id, hashedPassword);


  await authModels.updatetoken(user.id, null);
};

// ==================== 9. GET CURRENT USER ====================
const getMe = async (userId) => {
  const user = await authModels.findPublicById(userId);
  if (!user) {
    throw createHttpError("User not found", 404);
  }
  return user;
};

// ==================== 10. UPDATE CURRENT USER ====================
const updateMe = async (userId, body) => {
  const user = await getMe(userId);

  const fullName =
    body.full_name !== undefined ? body.full_name : user.full_name;
  const phone = body.phone !== undefined ? body.phone : user.phone;

  await authModels.updateProfile(userId, fullName, phone || null);
  return await getMe(userId);
};

module.exports = {
  register,
  login,
  logout,
  verifyEmail,
  resendEmail,
  forgotPassword,
  resetPassword,
  changePassword,
  getMe,
  updateMe,
};
