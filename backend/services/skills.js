const skillModels = require("../models/skills");
const { createHttpError } = require("../utils/errors");

const getAllSkills = async (query = {}) => {
  const category = query.category || null;
  const skills = await skillModels.getAll(category);

  if (query.grouped === "true" || query.grouped === true) {
    const grouped = {};
    for (const skill of skills) {
      const cat = skill.category || "Other";
      if (!grouped[cat]) grouped[cat] = [];
      grouped[cat].push(skill);
    }
    return grouped;
  }

  return skills;
};

const getSkillById = async (id) => {
  const skill = await skillModels.getById(id);
  if (!skill) {
    throw createHttpError("Skill not found", 404);
  }
  return skill;
};

const parseProficiency = (val) => {
  if (val === undefined || val === null || val === "") return null;
  const num = Number(val);
  return Number.isNaN(num) ? null : num;
};

const createSkill = async (body) => {
  const payload = {
    name: body.name.trim(),
    category: body.category || "Other",
    proficiency_percent: parseProficiency(body.proficiency_percent),
    icon_url: body.icon_url ? body.icon_url.trim() : null,
    display_order: Number.isInteger(Number(body.display_order))
      ? Number(body.display_order)
      : 0,
  };

  const insertId = await skillModels.create(payload);
  return await skillModels.getById(insertId);
};

const updateSkill = async (id, body) => {
  const current = await getSkillById(id);

  const payload = {
    name: body.name !== undefined ? body.name.trim() : current.name,
    category: body.category !== undefined ? body.category : current.category,
    proficiency_percent:
      body.proficiency_percent !== undefined
        ? parseProficiency(body.proficiency_percent)
        : current.proficiency_percent,
    icon_url:
      body.icon_url !== undefined
        ? body.icon_url
          ? body.icon_url.trim()
          : null
        : current.icon_url,
    display_order:
      body.display_order !== undefined
        ? Number(body.display_order)
        : current.display_order,
  };

  await skillModels.update(id, payload);
  return await skillModels.getById(id);
};

const deleteSkill = async (id) => {
  await getSkillById(id);
  await skillModels.remove(id);
  return { id: Number(id) };
};

module.exports = {
  getAllSkills,
  getSkillById,
  createSkill,
  updateSkill,
  deleteSkill,
};
