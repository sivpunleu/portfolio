const personalModels = require("../models/personalModels");
const { createHttpError } = require("../utils/errors");

const getProfile = async () => {
  const data = await personalModels.getProfile();
  if (!data) {
    throw createHttpError("Personal profile not found", 404);
  }
  return data;
};

const updateProfile = async (body) => {
  const existing = await personalModels.getProfile();

  // Joi validation ensures required fields (full_name, title, bio, email) exist and URLs are valid.
  const updatedPayload = {
    full_name: body.full_name,
    title: body.title,
    bio: body.bio,
    email: body.email,
    phone: body.phone || null,
    location: body.location || null,
    avatar_url: body.avatar_url || null,
    resume_url: body.resume_url || null,
    github_url: body.github_url || null,
    linkedin_url: body.linkedin_url || null,
    twitter_url: body.twitter_url || null,
  };

  if (!existing) {
    await personalModels.createProfile(updatedPayload);
  } else {
    await personalModels.updateProfile(existing.id, updatedPayload);
  }

  return await personalModels.getProfile();
};

module.exports = {
  getProfile,
  updateProfile,
};
