const db = require("../config/db");


const getAll = async () => {
  const [rows] = await db.query(
    "SELECT * FROM education ORDER BY display_order ASC, start_date DESC",
  );
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM education WHERE id = ?", [id]);
  return rows[0] || null;
};


const create = async (data) => {
  const [result] = await db.query(
    `INSERT INTO education 
      (school_name, degree, field_of_study, start_date, end_date, grade, description, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.school_name,
      data.degree,
      data.field_of_study ?? null,
      data.start_date,
      data.end_date ?? null,
      data.grade ?? null,
      data.description ?? null,
      data.display_order ?? 0,
    ],
  );
  return result.insertId;
};


const update = async (id, data) => {
  const [result] = await db.query(
    `UPDATE education SET 
      school_name = ?,
      degree = ?,
      field_of_study = ?,
      start_date = ?,
      end_date = ?,
      grade = ?,
      description = ?,
      display_order = ?
     WHERE id = ?`,
    [
      data.school_name,
      data.degree,
      data.field_of_study ?? null,
      data.start_date,
      data.end_date ?? null,
      data.grade ?? null,
      data.description ?? null,
      data.display_order ?? 0,
      id,
    ],
  );
  return result.affectedRows;
};


const remove = async (id) => {
  const [result] = await db.query("DELETE FROM education WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  create,
  update,
  remove,
};
