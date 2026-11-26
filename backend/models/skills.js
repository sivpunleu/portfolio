const db = require("../config/db");

const getAll = async (category = null) => {
  let query = "SELECT * FROM skills";
  const params = [];

  if (category) {
    query += " WHERE category = ?";
    params.push(category);
  }

  query += " ORDER BY display_order ASC, name ASC";

  const [rows] = await db.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM skills WHERE id = ?", [id]);
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await db.query(
    `INSERT INTO skills (name, category, proficiency_percent, icon_url, display_order)
     VALUES (?, ?, ?, ?, ?)`,
    [
      data.name,
      data.category || "Other",
      data.proficiency_percent ?? null,
      data.icon_url ?? null,
      data.display_order ?? 0,
    ],
  );
  return result.insertId;
};

const update = async (id, data) => {
  const [result] = await db.query(
    `UPDATE skills SET 
      name = ?,
      category = ?,
      proficiency_percent = ?,
      icon_url = ?,
      display_order = ?
     WHERE id = ?`,
    [
      data.name,
      data.category || "Other",
      data.proficiency_percent ?? null,
      data.icon_url ?? null,
      data.display_order ?? 0,
      id,
    ],
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM skills WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
