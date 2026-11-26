const skillServices = require("../services/skills");

const getSkills = async (req, res, next) => {
  try {
    const data = await skillServices.getAllSkills(req.query);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getSkillById = async (req, res, next) => {
  try {
    const data = await skillServices.getSkillById(req.params.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const addSkill = async (req, res, next) => {
  try {
    const data = await skillServices.createSkill(req.body);
    return res.status(201).json({
      success: true,
      message: "Skill created successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const updateSkill = async (req, res, next) => {
  try {
    const data = await skillServices.updateSkill(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Skill updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteSkill = async (req, res, next) => {
  try {
    await skillServices.deleteSkill(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Skill deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getSkills,
  getSkillById,
  addSkill,
  updateSkill,
  deleteSkill,
};
