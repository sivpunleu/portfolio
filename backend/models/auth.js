const db = require("../config/db");

let roleColumnEnsured = false;
let ensureRolePromise = null;

/**
 * Lazily ensures `users.role` exists so existing databases without the column
 * continue working seamlessly and promote prior accounts to `admin`.
 */
const ensureUsersRoleColumn = async () => {
  if (roleColumnEnsured) return;
  if (!ensureRolePromise) {
    ensureRolePromise = (async () => {
      const [cols] = await db.query("SHOW COLUMNS FROM users LIKE 'role'");
      if (cols.length === 0) {
        await db.query(
          "ALTER TABLE users ADD COLUMN role ENUM('admin', 'user') NOT NULL DEFAULT 'user' AFTER phone",
        );
        await db.query("UPDATE users SET role = 'admin'");
      }
      roleColumnEnsured = true;
    })().catch((err) => {
      ensureRolePromise = null;
      throw err;
    });
  }
  return ensureRolePromise;
};

const countUsers = async () => {
  await ensureUsersRoleColumn();
  const [rows] = await db.query("SELECT COUNT(*) AS total FROM users");
  return Number(rows[0]?.total || 0);
};

const findbyEmail = async (email) => {
  await ensureUsersRoleColumn();
  const [results] = await db.query(
    `SELECT id, email, full_name, phone, role, password, is_verified
     FROM users
     WHERE email = ?`,
    [email],
  );
  return results[0] || null;
};

const findById = async (id) => {
  await ensureUsersRoleColumn();
  const [results] = await db.query(
    `SELECT id, email, full_name, phone, role, password, is_verified
     FROM users
     WHERE id = ?`,
    [id],
  );
  return results[0] || null;
};

const findPublicById = async (id) => {
  await ensureUsersRoleColumn();
  const [results] = await db.query(
    `SELECT id, full_name, email, phone, role, is_verified, created_at, updated_at
     FROM users
     WHERE id = ?`,
    [id],
  );
  return results[0] || null;
};

const updateProfile = async (id, fullName, phone) => {
  await db.query(
    `UPDATE users
     SET full_name = ?, phone = ?
     WHERE id = ?`,
    [fullName, phone, id],
  );
};

const register = async (user) => {
  await ensureUsersRoleColumn();
  const [result] = await db.query(
    `INSERT INTO users (
       email,
       full_name,
       phone,
       role,
       password,
       verification_token,
       verification_expires
     )
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [
      user.email,
      user.full_name,
      user.phone,
      user.role || "user",
      user.password,
      user.verification_token,
      user.verification_expires,
    ],
  );
  return result.insertId;
};

const updatetoken = async (id, token) => {
  await db.query(`UPDATE users SET token = ? WHERE id = ?`, [token, id]);
};

const checktoken = async (tokenValues) => {
  await ensureUsersRoleColumn();
  const [results] = await db.query(
    `SELECT id, role
     FROM users
     WHERE token IN (?, ?)`,
    [...tokenValues],
  );
  return results[0] || null;
};

const findByVerificationToken = async (tokenValues) => {
  const [results] = await db.query(
    `SELECT id, is_verified
     FROM users
     WHERE verification_token IN (?, ?)`,
    [...tokenValues],
  );
  return results[0] || null;
};

const verifyEmail = async (tokenValues, now = new Date()) => {
  const [result] = await db.query(
    `UPDATE users
     SET is_verified = 1,
         verification_token = NULL,
         verification_expires = NULL
     WHERE verification_token IN (?, ?)
       AND verification_expires > ?
       AND is_verified = 0`,
    [...tokenValues, now],
  );
  return result.affectedRows;
};

const updateVerificationToken = async (id, token, expiresAt) => {
  await db.query(
    `UPDATE users
     SET verification_token = ?, verification_expires = ?
     WHERE id = ? AND is_verified = 0`,
    [token, expiresAt, id],
  );
};

const updatePasswordResetToken = async (id, token, expiresAt) => {
  await db.query(
    `UPDATE users
     SET reset_password_token = ?, reset_password_expires = ?
     WHERE id = ?`,
    [token, expiresAt, id],
  );
};

const findByPasswordResetToken = async (tokenValues, now = new Date()) => {
  const [results] = await db.query(
    `SELECT id
     FROM users
     WHERE reset_password_token IN (?, ?)
       AND reset_password_expires > ?`,
    [...tokenValues, now],
  );
  return results[0] || null;
};

const resetPassword = async (tokenValues, password, now = new Date()) => {
  const [result] = await db.query(
    `UPDATE users
     SET password = ?,
         token = NULL,
         reset_password_token = NULL,
         reset_password_expires = NULL
     WHERE reset_password_token IN (?, ?)
       AND reset_password_expires > ?`,
    [password, ...tokenValues, now],
  );
  return result.affectedRows;
};

const updatePassword = async (id, password) => {
  await db.query(
    `UPDATE users
     SET password = ?, token = NULL
     WHERE id = ?`,
    [password, id],
  );
};

module.exports = {
  countUsers,
  findbyEmail,
  findById,
  findPublicById,
  updateProfile,
  register,
  updatetoken,
  checktoken,
  findByVerificationToken,
  verifyEmail,
  updateVerificationToken,
  updatePasswordResetToken,
  findByPasswordResetToken,
  resetPassword,
  updatePassword,
};
