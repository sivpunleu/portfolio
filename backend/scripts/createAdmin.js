const path = require("path");
const bcrypt = require("bcryptjs");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const pool = require("../config/db");
const authModels = require("../models/auth");

const parseArg = (flag) => {
  const prefix = `--${flag}=`;
  const found = process.argv.find((arg) => arg.startsWith(prefix));
  return found ? found.slice(prefix.length).trim() : null;
};

const hasFlag = (flag) => process.argv.includes(`--${flag}`);

const createAdmin = async () => {
  const ifEmpty = hasFlag("if-empty");
  const email = (
    parseArg("email") ||
    process.env.ADMIN_EMAIL ||
    process.env.EMAIL_USER ||
    "admin@portfolio.com"
  )
    .toLowerCase()
    .trim();
  const fullName = parseArg("name") || process.env.ADMIN_NAME || "Siv Punleu";
  const password =
    parseArg("password") || process.env.ADMIN_PASSWORD || (ifEmpty ? null : "Admin@12345");
  const phone = parseArg("phone") || "0969596217";

  try {
    if (ifEmpty) {
      const userCount = await authModels.countUsers();
      if (userCount > 0) {
        console.log("ℹ️  Users already exist, skipping initial admin seed");
        return;
      }
      if (!password) {
        console.log("ℹ️  ADMIN_PASSWORD not set, skipping auto-seed");
        return;
      }
    }

    const existing = await authModels.findbyEmail(email);
    if (existing) {
      await pool.query(
        "UPDATE users SET role = 'admin', is_verified = 1 WHERE id = ?",
        [existing.id],
      );
      console.log(`ℹ️  Admin user already exists (${email}) — ensured role=admin and verified=1.`);
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const [result] = await pool.query(
      `INSERT INTO users (email, full_name, phone, role, password, is_verified)
       VALUES (?, ?, ?, 'admin', ?, 1)`,
      [email, fullName, phone, hashedPassword],
    );

    console.log(`✅ Admin account created (ID: ${result.insertId}, Email: ${email})`);
  } catch (error) {
    console.error("❌ Failed to create admin account:", error.message);
    process.exitCode = 1;
  } finally {
    await pool.end();
  }
};

createAdmin();

