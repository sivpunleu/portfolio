const projectModels = require("../models/projects");
const { createHttpError } = require("../utils/errors");

const slugify = (text) => {
  const cleaned = text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[\s\W-]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned || `project-${Date.now().toString(36)}`;
};

const formatProject = (project) => {
  if (!project) return null;
  let techStack = project.tech_stack;
  if (typeof techStack === "string") {
    try {
      techStack = JSON.parse(techStack);
    } catch {
      techStack = techStack.split(",").map((t) => t.trim());
    }
  }
  return {
    ...project,
    is_featured: Boolean(project.is_featured),
    tech_stack: Array.isArray(techStack) ? techStack : [],
  };
};

const getAllProjects = async (query = {}) => {
  const featuredOnly = query.featured === "true" || query.featured === true;
  const rows = await projectModels.getAll({
    featuredOnly,
    limit: query.limit,
  });
  return rows.map(formatProject);
};

const getProjectById = async (id) => {
  const project = await projectModels.getById(id);
  if (!project) {
    throw createHttpError("Project not found", 404);
  }
  return formatProject(project);
};

const getProjectBySlug = async (slug) => {
  const project = await projectModels.getBySlug(slug);
  if (!project) {
    throw createHttpError("Project not found", 404);
  }
  return formatProject(project);
};

const createProject = async (body) => {
  const slug = body.slug ? slugify(body.slug) : slugify(body.title);

  // Check if slug exists
  const existingSlug = await projectModels.getBySlug(slug);
  if (existingSlug) {
    throw createHttpError(
      "A project with this title or slug already exists",
      409,
    );
  }

  const payload = {
    title: body.title.trim(),
    slug,
    description: body.description.trim(),
    thumbnail_url: body.thumbnail_url || null,
    tech_stack: body.tech_stack || [],
    live_url: body.live_url || null,
    github_url: body.github_url || null,
    is_featured: Boolean(body.is_featured),
    display_order: Number.isInteger(Number(body.display_order))
      ? Number(body.display_order)
      : 0,
  };

  const insertId = await projectModels.create(payload);
  return await getProjectById(insertId);
};

const updateProject = async (id, body) => {
  const current = await getProjectById(id);

  let slug = current.slug;
  if (body.slug !== undefined || body.title !== undefined) {
    const hasCustomSlug = typeof body.slug === "string" && body.slug.trim().length > 0;
    const candidateSlug = hasCustomSlug
      ? slugify(body.slug)
      : body.slug === "" || body.slug === null
        ? slugify(body.title ?? current.title)
        : body.title
          ? slugify(body.title)
          : current.slug;
    if (candidateSlug !== current.slug) {
      const existingSlug = await projectModels.getBySlug(candidateSlug);
      if (existingSlug && Number(existingSlug.id) !== Number(id)) {
        throw createHttpError("Slug already in use by another project", 409);
      }
      slug = candidateSlug;
    }
  }

  const payload = {
    title: body.title !== undefined ? body.title.trim() : current.title,
    slug,
    description:
      body.description !== undefined
        ? body.description.trim()
        : current.description,
    thumbnail_url:
      body.thumbnail_url !== undefined
        ? body.thumbnail_url
        : current.thumbnail_url,
    tech_stack:
      body.tech_stack !== undefined ? body.tech_stack : current.tech_stack,
    live_url: body.live_url !== undefined ? body.live_url : current.live_url,
    github_url:
      body.github_url !== undefined ? body.github_url : current.github_url,
    is_featured:
      body.is_featured !== undefined
        ? Boolean(body.is_featured)
        : current.is_featured,
    display_order:
      body.display_order !== undefined
        ? Number(body.display_order)
        : current.display_order,
  };

  await projectModels.update(id, payload);
  return await getProjectById(id);
};

const deleteProject = async (id) => {
  await getProjectById(id);
  await projectModels.remove(id);
  return { id: Number(id) };
};

module.exports = {
  getAllProjects,
  getProjectById,
  getProjectBySlug,
  createProject,
  updateProject,
  deleteProject,
};
