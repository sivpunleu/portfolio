const db = require("../config/db");

const getProfile = async () => {
  const [rows] = await db.query("SELECT * FROM personal_info LIMIT 1");
  return rows[0] || null;
};

const createProfile = async (data) => {
  const [result] = await db.query(
    `INSERT INTO personal_info (
      full_name, title, bio, email, phone, location,
      avatar_url, resume_url, github_url, linkedin_url, twitter_url
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      data.full_name,
      data.title,
      data.bio,
      data.email,
      data.phone ?? null,
      data.location ?? null,
      data.avatar_url ?? null,
      data.resume_url ?? null,
      data.github_url ?? null,
      data.linkedin_url ?? null,
      data.twitter_url ?? null,
    ],
  );
  return result.insertId;
};

const updateProfile = async (id, data) => {
  await db.query(
    `UPDATE personal_info SET 
        full_name = ?,
        title = ?,
        bio = ?,
        email = ?,
        phone = ?,
        location = ?,
        avatar_url = ?,
        resume_url = ?,
        github_url = ?,
        linkedin_url = ?,
        twitter_url = ?
     WHERE id = ?`,
    [
      data.full_name,
      data.title,
      data.bio,
      data.email,
      data.phone ?? null,
      data.location ?? null,
      data.avatar_url ?? null,
      data.resume_url ?? null,
      data.github_url ?? null,
      data.linkedin_url ?? null,
      data.twitter_url ?? null,
      id,
    ],
  );
};

module.exports = {
  getProfile,
  createProfile,
  updateProfile,
};
