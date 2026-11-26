import { defineStore } from "pinia";
import { ref } from "vue";
import api from "../api/axios";

export const usePortfolioStore = defineStore("portfolio", () => {
  const profile = ref(null);
  const projects = ref([]);
  const skills = ref([]);
  const education = ref([]);
  const messages = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch Public Profile
  const fetchProfile = async () => {
    try {
      const res = await api.get("/profile");
      profile.value = res.data.data;
      return profile.value;
    } catch (err) {
      console.error("Failed to fetch profile", err);
      return null;
    }
  };

  // Fetch Projects
  const fetchProjects = async (params = {}) => {
    try {
      const res = await api.get("/projects", { params });
      projects.value = res.data.data;
      return projects.value;
    } catch (err) {
      console.error("Failed to fetch projects", err);
      return null;
    }
  };

  // Fetch Skills
  const fetchSkills = async (params = {}) => {
    try {
      const res = await api.get("/skills", { params });
      skills.value = res.data.data;
      return skills.value;
    } catch (err) {
      console.error("Failed to fetch skills", err);
      return null;
    }
  };

  // Fetch Education
  const fetchEducation = async () => {
    try {
      const res = await api.get("/education");
      education.value = res.data.data;
      return education.value;
    } catch (err) {
      console.error("Failed to fetch education", err);
      return null;
    }
  };

  // Send Contact Message (Public)
  const sendContactMessage = async (payload) => {
    const res = await api.post("/contact", payload);
    return res.data;
  };

  // Load All Public Portfolio Data at once
  const loadPortfolioData = async () => {
    loading.value = true;
    error.value = null;
    try {
      const results = await Promise.all([
        fetchProfile(),
        fetchProjects(),
        fetchSkills(),
        fetchEducation(),
      ]);
      if (results.every((r) => r === null)) {
        error.value = "Unable to connect to the server. Displaying fallback info.";
      }
    } finally {
      loading.value = false;
    }
  };

  // --- ADMIN METHODS ---
  // Projects CRUD
  const createProject = async (payload) => {
    const res = await api.post("/projects", payload);
    await fetchProjects();
    return res.data;
  };

  const updateProject = async (id, payload) => {
    const res = await api.put(`/projects/${id}`, payload);
    await fetchProjects();
    return res.data;
  };

  const deleteProject = async (id) => {
    const res = await api.delete(`/projects/${id}`);
    await fetchProjects();
    return res.data;
  };

  // Skills CRUD
  const createSkill = async (payload) => {
    const res = await api.post("/skills", payload);
    await fetchSkills();
    return res.data;
  };

  const updateSkill = async (id, payload) => {
    const res = await api.put(`/skills/${id}`, payload);
    await fetchSkills();
    return res.data;
  };

  const deleteSkill = async (id) => {
    const res = await api.delete(`/skills/${id}`);
    await fetchSkills();
    return res.data;
  };

  // Education CRUD
  const createEducation = async (payload) => {
    const res = await api.post("/education", payload);
    await fetchEducation();
    return res.data;
  };

  const updateEducation = async (id, payload) => {
    const res = await api.put(`/education/${id}`, payload);
    await fetchEducation();
    return res.data;
  };

  const deleteEducation = async (id) => {
    const res = await api.delete(`/education/${id}`);
    await fetchEducation();
    return res.data;
  };

  // Profile Update
  const updateProfile = async (payload) => {
    const res = await api.put("/profile", payload);
    profile.value = res.data.data;
    return res.data;
  };

  // Messages CRUD
  const fetchMessages = async (params = {}) => {
    const res = await api.get("/contact", { params });
    messages.value = res.data.data;
    return messages.value;
  };

  const markMessageRead = async (id, isRead = true, params = {}) => {
    await api.patch(`/contact/${id}/read`, { is_read: isRead });
    await fetchMessages(params);
  };

  const deleteMessage = async (id, params = {}) => {
    await api.delete(`/contact/${id}`);
    await fetchMessages(params);
  };

  return {
    profile,
    projects,
    skills,
    education,
    messages,
    loading,
    error,
    fetchProfile,
    fetchProjects,
    fetchSkills,
    fetchEducation,
    sendContactMessage,
    loadPortfolioData,
    createProject,
    updateProject,
    deleteProject,
    createSkill,
    updateSkill,
    deleteSkill,
    createEducation,
    updateEducation,
    deleteEducation,
    updateProfile,
    fetchMessages,
    markMessageRead,
    deleteMessage,
  };
});
