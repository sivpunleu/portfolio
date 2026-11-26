const educationModels = require("../models/education");
const { createHttpError } = require("../utils/errors");

const formatDate = (dateVal) => {
  if (!dateVal) return null;
  if (typeof dateVal === "string") {
    const match = dateVal.trim().match(/^(\d{4}-\d{2}-\d{2})/);
    if (match) return match[1];
  }
  const d = new Date(dateVal);
  if (isNaN(d.getTime())) return null;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const sanitizeString = (val) => {
  if (val === undefined || val === null) return null;
  const str = String(val).trim();
  return str.length > 0 ? str : null;
};

const formatPayload = (body) => {
  return {
    school_name: sanitizeString(body.school_name),
    degree: sanitizeString(body.degree),
    field_of_study: sanitizeString(body.field_of_study),
    start_date: formatDate(body.start_date),
    end_date: formatDate(body.end_date),
    grade: sanitizeString(body.grade),
    description: sanitizeString(body.description),
    display_order: Number.isInteger(Number(body.display_order))
      ? Number(body.display_order)
      : 0,
  };
};

const getAllEducation = async () => {
  return await educationModels.getAll();
};

const getEducationById = async (id) => {
  const item = await educationModels.getById(id);
  if (!item) {
    throw createHttpError("Education record not found", 404);
  }
  return item;
};

const createEducation = async (body) => {
  const payload = formatPayload(body);
  const insertId = await educationModels.create(payload);
  return await educationModels.getById(insertId);
};

const updateEducation = async (id, body) => {
  await getEducationById(id);
  const payload = formatPayload(body);

  await educationModels.update(id, payload);
  return await educationModels.getById(id);
};

const deleteEducation = async (id) => {
  await getEducationById(id);
  await educationModels.remove(id);
  return { id: Number(id) };
};

module.exports = {
  getAllEducation,
  getEducationById,
  createEducation,
  updateEducation,
  deleteEducation,
};
