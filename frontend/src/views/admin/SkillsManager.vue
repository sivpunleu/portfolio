<template>
  <div class="manager-page">
    <div class="manager-header">
      <div>
        <h2>Manage Skills</h2>
        <p>Add, edit, or adjust skills and proficiency levels.</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Add New Skill
      </button>
    </div>

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div v-if="pageErrorMsg" class="alert alert-error">❌ {{ pageErrorMsg }}</div>

    <!-- Skills Table -->
    <div class="manager-card">
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Skill Name</th>
              <th>Category</th>
              <th>Proficiency</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="skill in portfolioStore.skills" :key="skill.id">
              <td><strong>{{ skill.name }}</strong></td>
              <td><span class="cat-pill">{{ skill.category }}</span></td>
              <td>
                {{
                  skill.proficiency_percent !== null &&
                  skill.proficiency_percent !== undefined
                    ? skill.proficiency_percent + "%"
                    : "-"
                }}
              </td>
              <td>{{ skill.display_order }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(skill)" class="btn-sm btn-edit">Edit</button>
                  <button @click="confirmDelete(skill.id)" class="btn-sm btn-delete">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="portfolioStore.skills.length === 0">
              <td colspan="5" class="empty-table">No skills found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h3>{{ isEditing ? 'Edit Skill' : 'Add New Skill' }}</h3>
        <div v-if="modalErrorMsg" class="alert alert-error">❌ {{ modalErrorMsg }}</div>
        <form @submit.prevent="saveSkill" class="modal-form">
          <div class="form-group">
            <label>Skill Name</label>
            <input v-model="form.name" type="text" class="form-input" placeholder="e.g. Vue.js" required />
          </div>

          <div class="form-group">
            <label>Category</label>
            <select v-model="form.category" class="form-input" required>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Database">Database</option>
              <option value="Tools">Tools</option>
              <option value="DevOps">DevOps</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label>Proficiency Percentage (0 - 100, leave empty to hide)</label>
            <input v-model="form.proficiency_percent" type="number" min="0" max="100" class="form-input" />
          </div>

          <div class="form-group">
            <label>Icon Key or URL (optional, e.g. vuejs, mysql, or image URL)</label>
            <input v-model="form.icon_url" type="text" class="form-input" placeholder="vuejs" />
          </div>

          <div class="form-group">
            <label>Display Order</label>
            <input v-model="form.display_order" type="number" min="0" class="form-input" />
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Skill' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      :show="deleteTargetId !== null"
      title="Delete Skill"
      message="Are you sure you want to delete this skill?"
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
import { extractErrorMessage } from "../../utils/helpers";

const portfolioStore = usePortfolioStore();

const showModal = ref(false);
const isEditing = ref(false);
const editingId = ref(null);
const saving = ref(false);
const deleting = ref(false);
const deleteTargetId = ref(null);
const successMsg = ref("");
const pageErrorMsg = ref("");
const modalErrorMsg = ref("");

const form = reactive({
  name: "",
  category: "Frontend",
  proficiency_percent: 85,
  icon_url: "",
  display_order: 0,
});

onMounted(() => {
  portfolioStore.fetchSkills();
});

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  modalErrorMsg.value = "";
  form.name = "";
  form.category = "Frontend";
  form.proficiency_percent = 85;
  form.icon_url = "";
  form.display_order = portfolioStore.skills.length + 1;
  showModal.value = true;
};

const openEditModal = (skill) => {
  isEditing.value = true;
  editingId.value = skill.id;
  modalErrorMsg.value = "";
  form.name = skill.name;
  form.category = skill.category;
  form.proficiency_percent =
    skill.proficiency_percent !== null && skill.proficiency_percent !== undefined
      ? skill.proficiency_percent
      : "";
  form.icon_url = skill.icon_url || "";
  form.display_order = skill.display_order ?? 0;
  showModal.value = true;
};

const saveSkill = async () => {
  saving.value = true;
  modalErrorMsg.value = "";
  pageErrorMsg.value = "";

  const payload = {
    name: form.name,
    category: form.category,
    proficiency_percent:
      form.proficiency_percent === "" || form.proficiency_percent === null
        ? null
        : Number(form.proficiency_percent),
    icon_url: form.icon_url ? form.icon_url.trim() : null,
    display_order:
      form.display_order === "" || form.display_order === null
        ? 0
        : Number(form.display_order),
  };

  try {
    if (isEditing.value) {
      await portfolioStore.updateSkill(editingId.value, payload);
      successMsg.value = "Skill updated successfully.";
    } else {
      await portfolioStore.createSkill(payload);
      successMsg.value = "Skill created successfully.";
    }
    showModal.value = false;
    setTimeout(() => {
      successMsg.value = "";
    }, 4000);
  } catch (err) {
    modalErrorMsg.value = extractErrorMessage(err, "Failed to save skill");
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
    await portfolioStore.deleteSkill(deleteTargetId.value);
    successMsg.value = "Skill deleted successfully.";
    deleteTargetId.value = null;
    setTimeout(() => {
      successMsg.value = "";
    }, 4000);
  } catch (err) {
    pageErrorMsg.value = extractErrorMessage(err, "Failed to delete skill");
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

.manager-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.table-container {
  overflow-x: auto;
}

.admin-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.92rem;
}

.admin-table th {
  padding: 0.75rem 1rem;
  color: #64748b;
  font-weight: 600;
  border-bottom: 1.5px solid #e2e8f0;
}

.admin-table td {
  padding: 1rem;
  border-bottom: 1px solid #f1f5f9;
  color: #334155;
}

.cat-pill {
  font-size: 0.78rem;
  font-weight: 600;
  color: #2506ad;
  background: #eef2ff;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.action-buttons {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
}

.btn-edit { background: #eff6ff; color: #2563eb; }
.btn-delete { background: #fef2f2; color: #dc2626; }

.empty-table {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}

/* Modal */
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
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.modal-card h3 {
  font-size: 1.3rem;
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

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.8rem;
  border-top: 1px solid #e2e8f0;
  padding-top: 1.2rem;
}
</style>
