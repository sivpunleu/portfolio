const educationServices = require("../services/education");

const getEducation = async (req, res, next) => {
  try {
    const data = await educationServices.getAllEducation();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getEducationById = async (req, res, next) => {
  try {
    const data = await educationServices.getEducationById(req.params.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const addEducation = async (req, res, next) => {
  try {
    const data = await educationServices.createEducation(req.body);
    return res.status(201).json({
      success: true,
      message: "Education added successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const updateEducation = async (req, res, next) => {
  try {
    const data = await educationServices.updateEducation(
      req.params.id,
      req.body,
    );
    return res.status(200).json({
      success: true,
      message: "Education updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteEducation = async (req, res, next) => {
  try {
    await educationServices.deleteEducation(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Education deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getEducation,
  getEducationById,
  addEducation,
  updateEducation,
  deleteEducation,
};
