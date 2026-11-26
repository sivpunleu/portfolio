const db = require("../config/db");

const create = async (data) => {
  const [result] = await db.query(
    `INSERT INTO contact_messages (sender_name, sender_email, subject, message)
     VALUES (?, ?, ?, ?)`,
    [data.sender_name, data.sender_email, data.subject, data.message],
  );
  return result.insertId;
};

const getAll = async (options = {}) => {
  let query = "SELECT * FROM contact_messages";
  const params = [];

  if (options.unreadOnly) {
    query += " WHERE is_read = 0";
  }

  query += " ORDER BY created_at DESC";

  const parsedLimit = Number.parseInt(options.limit, 10);
  if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
    query += " LIMIT ?";
    params.push(Math.min(parsedLimit, 100));
  }

  const [rows] = await db.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query(
    "SELECT * FROM contact_messages WHERE id = ?",
    [id],
  );
  return rows[0] || null;
};

const markAsRead = async (id, isRead = true) => {
  const [result] = await db.query(
    "UPDATE contact_messages SET is_read = ? WHERE id = ?",
    [isRead ? 1 : 0, id],
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.query(
    "DELETE FROM contact_messages WHERE id = ?",
    [id],
  );
  return result.affectedRows;
};

module.exports = {
  create,
  getAll,
  getById,
  markAsRead,
  remove,
};
