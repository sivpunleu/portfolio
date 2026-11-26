const personalServices = require("../services/personalServices");

const getProfile = async (req, res, next) => {
  try {
    const data = await personalServices.getProfile();
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    return next(error);
  }
};

const updateProfile = async (req, res, next) => {
  try {
    const data = await personalServices.updateProfile(req.body);
    return res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data,
    });
  } catch (error) {
    return next(error);
  }
};

module.exports = {
  getProfile,
  updateProfile,
};
