const path = require("path");

require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const jwtSecret = process.env.JWT_SECRET;

if (!jwtSecret) {
  throw new Error("JWT_SECRET must be configured");
}

const jwtExpiresIn = process.env.JWT_EXPIRES_IN || "1d";

module.exports = { jwtSecret, jwtExpiresIn };
