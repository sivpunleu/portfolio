<template>
  <div class="manager-page">
    <div class="manager-header">
      <div>
        <h2>Manage Projects</h2>
        <p>Add, edit, or remove projects shown on your portfolio.</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Add New Project
      </button>
    </div>

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div v-if="pageErrorMsg" class="alert alert-error">❌ {{ pageErrorMsg }}</div>

    <!-- Projects Grid / List -->
    <div class="manager-grid">
      <div v-for="proj in portfolioStore.projects" :key="proj.id" class="manager-card">
        <div class="card-thumb">
          <img
            :src="resolveAssetUrl(proj.thumbnail_url, DEFAULT_PROJECT_THUMBNAIL)"
            :alt="proj.title"
          />
          <span v-if="proj.is_featured" class="featured-badge">Featured</span>
        </div>
        <div class="card-content">
          <h4>{{ proj.title }}</h4>
          <p class="slug-tag">/slug/{{ proj.slug }} · Order: {{ proj.display_order ?? 0 }}</p>
          <p class="desc">{{ proj.description }}</p>
          <div class="card-actions">
            <button @click="openEditModal(proj)" class="btn-sm btn-edit">Edit</button>
            <button @click="confirmDelete(proj.id)" class="btn-sm btn-delete">Delete</button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h3>{{ isEditing ? 'Edit Project' : 'Create New Project' }}</h3>
        <div v-if="modalErrorMsg" class="alert alert-error">❌ {{ modalErrorMsg }}</div>
        <form @submit.prevent="saveProject" class="modal-form">
          <div class="form-group">
            <label>Title</label>
            <input v-model="form.title" type="text" class="form-input" required />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Slug (optional, auto-generated)</label>
              <input v-model="form.slug" type="text" class="form-input" placeholder="my-awesome-project" />
            </div>
            <div class="form-group">
              <label>Display Order</label>
              <input v-model.number="form.display_order" type="number" min="0" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" class="form-textarea" required></textarea>
          </div>

          <div class="form-group">
            <label>Thumbnail URL</label>
            <input v-model="form.thumbnail_url" type="text" class="form-input" placeholder="https://... or /uploads/..." />
          </div>

          <div class="form-group">
            <label>Tech Stack (comma-separated, e.g. Vue.js, Node.js, MySQL)</label>
            <input v-model="techStackInput" type="text" class="form-input" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Live Demo URL</label>
              <input v-model="form.live_url" type="url" class="form-input" placeholder="https://..." />
            </div>
            <div class="form-group">
              <label>GitHub URL</label>
              <input v-model="form.github_url" type="url" class="form-input" placeholder="https://github.com/..." />
            </div>
          </div>

          <div class="checkbox-group">
            <label>
              <input v-model="form.is_featured" type="checkbox" />
              Feature this project on home page
            </label>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Project' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      :show="deleteTargetId !== null"
      title="Delete Project"
      message="Are you sure you want to delete this project? This action cannot be undone."
      :loading="deleting"
      @cancel="deleteTargetId = null"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from "vue";
import { usePortfolioStore } from "../../stores/portfolio";
import ConfirmModal from "../../components/ConfirmModal.vue";
import {
  DEFAULT_PROJECT_THUMBNAIL,
  extractErrorMessage,
  resolveAssetUrl,
} from "../../utils/helpers";

const portfolioStore = usePortfolioStore();

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const deleting = ref(false);
const deleteTargetId = ref(null);
const techStackInput = ref("");
const successMsg = ref("");
const pageErrorMsg = ref("");
const modalErrorMsg = ref("");

const form = reactive({
  title: "",
  slug: "",
  description: "",
  thumbnail_url: "",
  live_url: "",
  github_url: "",
  is_featured: false,
  display_order: 0,
});

onMounted(() => {
  portfolioStore.fetchProjects();
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  modalErrorMsg.value = "";
  form.title = "";
  form.slug = "";
  form.description = "";
  form.thumbnail_url = "";
  form.live_url = "";
  form.github_url = "";
  form.is_featured = false;
  form.display_order = portfolioStore.projects.length + 1;
  techStackInput.value = "";
  showModal.value = true;
};

const openEditModal = (proj) => {
  isEditing.value = true;
  editingId.value = proj.id;
  modalErrorMsg.value = "";
  form.title = proj.title;
  form.slug = proj.slug;
  form.description = proj.description;
  form.thumbnail_url = proj.thumbnail_url || "";
  form.live_url = proj.live_url || "";
  form.github_url = proj.github_url || "";
  form.is_featured = Boolean(proj.is_featured);
  form.display_order = proj.display_order ?? 0;
  techStackInput.value = Array.isArray(proj.tech_stack)
    ? proj.tech_stack.join(", ")
    : "";
  showModal.value = true;
};

const saveProject = async () => {
  saving.value = true;
  modalErrorMsg.value = "";
  pageErrorMsg.value = "";
  const tech_stack = techStackInput.value
    ? techStackInput.value.split(",").map((s) => s.trim()).filter(Boolean)
    : [];

  const payload = {
    title: form.title,
    description: form.description,
    thumbnail_url: form.thumbnail_url || null,
    live_url: form.live_url || null,
    github_url: form.github_url || null,
    is_featured: Boolean(form.is_featured),
    display_order:
      form.display_order === "" || form.display_order === null
        ? 0
        : Number(form.display_order),
    tech_stack,
  };

  if (form.slug && form.slug.trim()) {
    payload.slug = form.slug.trim();
  }

  try {
    if (isEditing.value) {
      await portfolioStore.updateProject(editingId.value, payload);
      successMsg.value = "Project updated successfully.";
    } else {
      await portfolioStore.createProject(payload);
      successMsg.value = "Project created successfully.";
    }
    showModal.value = false;
    setTimeout(() => {
      successMsg.value = "";
    }, 4000);
  } catch (err) {
    modalErrorMsg.value = extractErrorMessage(err, "Failed to save project");
  } finally {
    saving.value = false;
  }
};

const confirmDelete = (id) => {
  deleteTargetId.value = id;
};

const executeDelete = async () => {
  if (deleteTargetId.value === null) return;
  deleting.value = true;
  pageErrorMsg.value = "";
  try {
    await portfolioStore.deleteProject(deleteTargetId.value);
    successMsg.value = "Project deleted successfully.";
    deleteTargetId.value = null;
    setTimeout(() => {
      successMsg.value = "";
    }, 4000);
  } catch (err) {
    pageErrorMsg.value = extractErrorMessage(err, "Failed to delete project");
    deleteTargetId.value = null;
  } finally {
    deleting.value = false;
  }
};
</script>

<style scoped>
.manager-page {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.manager-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 1rem;
}

.manager-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0e2431;
}

.manager-header p {
  color: #64748b;
}

.manager-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.manager-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04);
}

.card-thumb {
  height: 160px;
  position: relative;
  background: #1e293b;
}

.card-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.featured-badge {
  position: absolute;
  top: 10px;
  right: 10px;
  background: #ff7b00;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.5rem;
  border-radius: 9999px;
}

.card-content {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.card-content h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0e2431;
  margin-bottom: 0.2rem;
}

.slug-tag {
  font-size: 0.75rem;
  color: #2506ad;
  font-family: monospace;
  margin-bottom: 0.5rem;
}

.desc {
  font-size: 0.88rem;
  color: #64748b;
  flex: 1;
  margin-bottom: 1rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-actions {
  display: flex;
  gap: 0.6rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 0.8rem;
}

.btn-sm {
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
}

.btn-edit {
  background: #eff6ff;
  color: #2563eb;
}

.btn-edit:hover { background: #dbeafe; }

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.btn-delete:hover { background: #fee2e2; }

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1.5rem;
}

.modal-card {
  background: #ffffff;
  border-radius: 16px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-card h3 {
  font-size: 1.4rem;
  font-weight: 800;
  color: #0e2431;
  margin-bottom: 1.25rem;
}

.modal-form .form-group {
  margin-bottom: 1.2rem;
}

.modal-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0e2431;
  margin-bottom: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.checkbox-group {
  margin-bottom: 1.5rem;
}

.checkbox-group label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  font-size: 0.9rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.2rem;
}

@media (max-width: 600px) {
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
