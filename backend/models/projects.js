const db = require("../config/db");

const getAll = async (options = {}) => {
  let query = "SELECT * FROM projects";
  const params = [];

  if (options.featuredOnly) {
    query += " WHERE is_featured = 1";
  }

  query += " ORDER BY display_order ASC, created_at DESC";

  const parsedLimit = Number.parseInt(options.limit, 10);
  if (Number.isInteger(parsedLimit) && parsedLimit > 0) {
    query += " LIMIT ?";
    params.push(Math.min(parsedLimit, 100));
  }

  const [rows] = await db.query(query, params);
  return rows;
};

const getById = async (id) => {
  const [rows] = await db.query("SELECT * FROM projects WHERE id = ?", [id]);
  return rows[0] || null;
};

const getBySlug = async (slug) => {
  const [rows] = await db.query("SELECT * FROM projects WHERE slug = ?", [slug]);
  return rows[0] || null;
};

const create = async (data) => {
  const [result] = await db.query(
    `INSERT INTO projects 
      (title, slug, description, thumbnail_url, tech_stack, live_url, github_url, is_featured, display_order)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.title,
      data.slug,
      data.description,
      data.thumbnail_url ?? null,
      data.tech_stack ? JSON.stringify(data.tech_stack) : null,
      data.live_url ?? null,
      data.github_url ?? null,
      data.is_featured ? 1 : 0,
      data.display_order ?? 0,
    ],
  );
  return result.insertId;
};

const update = async (id, data) => {
  const [result] = await db.query(
    `UPDATE projects SET 
      title = ?,
      slug = ?,
      description = ?,
      thumbnail_url = ?,
      tech_stack = ?,
      live_url = ?,
      github_url = ?,
      is_featured = ?,
      display_order = ?
     WHERE id = ?`,
    [
      data.title,
      data.slug,
      data.description,
      data.thumbnail_url ?? null,
      data.tech_stack ? JSON.stringify(data.tech_stack) : null,
      data.live_url ?? null,
      data.github_url ?? null,
      data.is_featured ? 1 : 0,
      data.display_order ?? 0,
      id,
    ],
  );
  return result.affectedRows;
};

const remove = async (id) => {
  const [result] = await db.query("DELETE FROM projects WHERE id = ?", [id]);
  return result.affectedRows;
};

module.exports = {
  getAll,
  getById,
  getBySlug,
  create,
  update,
  remove,
};
