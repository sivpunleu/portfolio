const authServices = require("../services/auth");

const register = async (req, res, next) => {
  try {
    const data = await authServices.register(req.body);
    return res.status(201).json({
      success: true,
      message: data.verificationEmailSent
        ? "Registration successful"
        : "Registration successful, but the verification email could not be sent. Please use resend-email later.",
      data: {
        id: data.id,
        full_name: data.full_name,
        email: data.email,
        phone: data.phone,
      },
    });
  } catch (error) {
    return next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const result = await authServices.login(req.body);
    return res.status(200).json({
      success: true,
      message: "Login successful",
      data: result,
    });
  } catch (error) {
    return next(error);
  }
};

const logout = async (req, res, next) => {
  try {
    await authServices.logout(req.user_id);
    return res.status(200).json({
      success: true,
      message: "Logout successful",
    });
  } catch (error) {
    return next(error);
  }
};

const verifyEmail = async (req, res, next) => {
  try {
    const token = req.validatedQuery?.token || req.query.token;
    await authServices.verifyEmail(token);
    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const resendEmail = async (req, res, next) => {
  try {
    const data = await authServices.resendEmail(req.body);
    return res.status(200).json({
      success: true,
      message: data.alreadyVerified
        ? "Email is already verified"
        : "If the account needs verification, an email has been sent.",
    });
  } catch (error) {
    return next(error);
  }
};

const forgotPassword = async (req, res, next) => {
  try {
    await authServices.forgotPassword(req.body);
    return res.status(200).json({
      success: true,
      message:
        "If an eligible account exists, a password reset email has been sent.",
    });
  } catch (error) {
    return next(error);
  }
};

const resetPassword = async (req, res, next) => {
  try {
    await authServices.resetPassword(req.body);
    return res.status(200).json({
      success: true,
      message: "Password reset successfully. Please log in again.",
    });
  } catch (error) {
    return next(error);
  }
};

const changePassword = async (req, res, next) => {
  try {
    await authServices.changePassword(req.user_id, req.body);
    return res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    return next(error);
  }
};

const getMe = async (req, res, next) => {
  try {
    const data = await authServices.getMe(req.user_id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const updateMe = async (req, res, next) => {
  try {
    const data = await authServices.updateMe(req.user_id, req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
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
