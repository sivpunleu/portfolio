<template>
  <div class="manager-page">
    <div class="manager-header">
      <div>
        <h2>Manage Education</h2>
        <p>Record your universities, degrees, and academic achievements.</p>
      </div>
      <button @click="openCreateModal" class="btn btn-primary">
        + Add Education
      </button>
    </div>

    <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
    <div v-if="pageErrorMsg" class="alert alert-error">❌ {{ pageErrorMsg }}</div>

    <!-- Education Table -->
    <div class="manager-card">
      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>School / University</th>
              <th>Degree &amp; Field</th>
              <th>Dates</th>
              <th>Grade</th>
              <th>Order</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="edu in portfolioStore.education" :key="edu.id">
              <td><strong>{{ edu.school_name }}</strong></td>
              <td>{{ edu.degree }} <span v-if="edu.field_of_study">({{ edu.field_of_study }})</span></td>
              <td>{{ formatDateRange(edu.start_date, edu.end_date) }}</td>
              <td><span v-if="edu.grade" class="grade-pill">{{ edu.grade }}</span></td>
              <td>{{ edu.display_order ?? 0 }}</td>
              <td>
                <div class="action-buttons">
                  <button @click="openEditModal(edu)" class="btn-sm btn-edit">Edit</button>
                  <button @click="confirmDelete(edu.id)" class="btn-sm btn-delete">Delete</button>
                </div>
              </td>
            </tr>
            <tr v-if="portfolioStore.education.length === 0">
              <td colspan="6" class="empty-table">No education records found.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal Form -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-card">
        <h3>{{ isEditing ? 'Edit Education' : 'Add Education Record' }}</h3>
        <div v-if="modalErrorMsg" class="alert alert-error">❌ {{ modalErrorMsg }}</div>
        <form @submit.prevent="saveEducation" class="modal-form">
          <div class="form-group">
            <label>School / University Name</label>
            <input v-model="form.school_name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Degree</label>
            <input v-model="form.degree" type="text" class="form-input" placeholder="e.g. B.S. in Computer Science" required />
          </div>

          <div class="form-group">
            <label>Field of Study</label>
            <input v-model="form.field_of_study" type="text" class="form-input" placeholder="e.g. Software Engineering" />
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Start Date</label>
              <input v-model="form.start_date" type="date" class="form-input" required />
            </div>
            <div class="form-group">
              <label>End Date (leave empty if present)</label>
              <input v-model="form.end_date" type="date" class="form-input" />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Grade / Honor</label>
              <input v-model="form.grade" type="text" class="form-input" placeholder="e.g. GPA 3.8 / First Class" />
            </div>
            <div class="form-group">
              <label>Display Order</label>
              <input v-model="form.display_order" type="number" min="0" class="form-input" />
            </div>
          </div>

          <div class="form-group">
            <label>Description / Relevant Coursework</label>
            <textarea v-model="form.description" class="form-textarea"></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" @click="showModal = false" class="btn btn-outline">Cancel</button>
            <button type="submit" class="btn btn-primary" :disabled="saving">
              {{ saving ? 'Saving...' : 'Save Record' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <ConfirmModal
      :show="deleteTargetId !== null"
      title="Delete Education Record"
      message="Are you sure you want to delete this education record?"
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
  extractErrorMessage,
  formatIsoDateInput,
} from "../../utils/helpers";

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
  school_name: "",
  degree: "",
  field_of_study: "",
  start_date: "",
  end_date: "",
  grade: "",
  description: "",
  display_order: 0,
});

onMounted(() => {
  portfolioStore.fetchEducation();
});

const formatDateRange = (start, end) => {
  const s = formatIsoDateInput(start) || "-";
  const e = end ? formatIsoDateInput(end) : "Present";
  return `${s} to ${e}`;
};

const openCreateModal = () => {
  isEditing.value = false;
  editingId.value = null;
  modalErrorMsg.value = "";
  form.school_name = "";
  form.degree = "";
  form.field_of_study = "";
  form.start_date = "";
  form.end_date = "";
  form.grade = "";
  form.description = "";
  form.display_order = portfolioStore.education.length + 1;
  showModal.value = true;
};

const openEditModal = (edu) => {
  isEditing.value = true;
  editingId.value = edu.id;
  modalErrorMsg.value = "";
  form.school_name = edu.school_name;
  form.degree = edu.degree;
  form.field_of_study = edu.field_of_study || "";
  form.start_date = formatIsoDateInput(edu.start_date);
  form.end_date = edu.end_date ? formatIsoDateInput(edu.end_date) : "";
  form.grade = edu.grade || "";
  form.description = edu.description || "";
  form.display_order = edu.display_order ?? 0;
  showModal.value = true;
};

const saveEducation = async () => {
  saving.value = true;
  modalErrorMsg.value = "";
  pageErrorMsg.value = "";

  const payload = {
    school_name: form.school_name,
    degree: form.degree,
    field_of_study: form.field_of_study || null,
    start_date: form.start_date,
    end_date: form.end_date || null,
    grade: form.grade || null,
    description: form.description || null,
    display_order:
      form.display_order === "" || form.display_order === null
        ? 0
        : Number(form.display_order),
  };

  try {
    if (isEditing.value) {
      await portfolioStore.updateEducation(editingId.value, payload);
      successMsg.value = "Education record updated successfully.";
    } else {
      await portfolioStore.createEducation(payload);
      successMsg.value = "Education record created successfully.";
    }
    showModal.value = false;
    setTimeout(() => {
      successMsg.value = "";
    }, 4000);
  } catch (err) {
    modalErrorMsg.value = extractErrorMessage(err, "Failed to save education record");
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
    await portfolioStore.deleteEducation(deleteTargetId.value);
    successMsg.value = "Education record deleted successfully.";
    deleteTargetId.value = null;
    setTimeout(() => {
      successMsg.value = "";
    }, 4000);
  } catch (err) {
    pageErrorMsg.value = extractErrorMessage(err, "Failed to delete record");
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

.grade-pill {
  font-size: 0.8rem;
  font-weight: 600;
  color: #16a34a;
  background: #f0fdf4;
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
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
  max-width: 540px;
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

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
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
