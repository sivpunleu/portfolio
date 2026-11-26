const projectServices = require("../services/projects");

const getProjects = async (req, res, next) => {
  try {
    const data = await projectServices.getAllProjects(req.query);
    return res.status(200).json({
      success: true,
      count: data.length,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectById = async (req, res, next) => {
  try {
    const data = await projectServices.getProjectById(req.params.id);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const getProjectBySlug = async (req, res, next) => {
  try {
    const data = await projectServices.getProjectBySlug(req.params.slug);
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const addProject = async (req, res, next) => {
  try {
    const data = await projectServices.createProject(req.body);
    return res.status(201).json({
      success: true,
      message: "Project created successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProject = async (req, res, next) => {
  try {
    const data = await projectServices.updateProject(req.params.id, req.body);
    return res.status(200).json({
      success: true,
      message: "Project updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const deleteProject = async (req, res, next) => {
  try {
    await projectServices.deleteProject(req.params.id);
    return res.status(200).json({
      success: true,
      message: "Project deleted successfully",
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProjects,
  getProjectById,
  getProjectBySlug,
  addProject,
  updateProject,
  deleteProject,
};
