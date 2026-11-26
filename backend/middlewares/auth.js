const jwt = require("jsonwebtoken");
const { checktoken } = require("../models/auth");
const { jwtSecret } = require("../config/jwt");
const { hashToken } = require("../utils/tokens");

const getBearerToken = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    res.status(401).json({ success: false, message: "You need to login first" });
    return null;
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer" || !parts[1]) {
    res.status(401).json({ success: false, message: "Token is invalid format" });
    return null;
  }

  return parts[1];
};

const findSessionUser = async (token, decoded) => {
  const user = await checktoken([hashToken(token), token]);
  if (!user || Number(user.id) !== Number(decoded.id)) {
    return null;
  }
  return user;
};

const islogin = async (req, res, next) => {
  try {
    const token = getBearerToken(req, res);
    if (!token) return;

    const decoded = jwt.verify(token, jwtSecret, { algorithms: ["HS256"] });
    const user = await findSessionUser(token, decoded);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is invalid or expired",
      });
    }

    req.user_id = user.id;
    req.user_role = user.role;
    return next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Token has expired",
      });
    }

    return res.status(401).json({ success: false, message: "Token is invalid" });
  }
};

const isloginOrExpired = async (req, res, next) => {
  try {
    const token = getBearerToken(req, res);
    if (!token) return;

    const decoded = jwt.verify(token, jwtSecret, {
      algorithms: ["HS256"],
      ignoreExpiration: true,
    });

    const user = await findSessionUser(token, decoded);
    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Token is not valid or already logged out",
      });
    }

    req.user_id = user.id;
    req.user_role = user.role;
    return next();
  } catch (error) {
    return res.status(401).json({ success: false, message: "Token is invalid" });
  }
};

const isAdmin = (req, res, next) => {
  if (req.user_role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Forbidden: Admin access required",
    });
  }
  return next();
};

module.exports = {
  islogin,
  isloginOrExpired,
  isAdmin,
};
