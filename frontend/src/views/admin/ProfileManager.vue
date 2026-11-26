<template>
  <div class="manager-page">
    <div class="manager-header">
      <div>
        <h2>Portfolio Profile Settings</h2>
        <p>Update your personal info, developer title, bio, avatar, and social links.</p>
      </div>
      <button type="submit" form="profileForm" class="btn btn-primary" :disabled="saving || uploading || uploadingResume">
        {{ saving ? 'Saving Changes...' : 'Save Profile' }}
      </button>
    </div>

    <div v-if="successMsg" class="alert alert-success">
      ✅ {{ successMsg }}
    </div>

    <div v-if="errorMsg" class="alert alert-error">
      ❌ {{ errorMsg }}
    </div>

    <div class="profile-card">
      <form id="profileForm" @submit.prevent="saveProfile" class="profile-form">
        <!-- Avatar Preview and Direct File Upload Section -->
        <div class="avatar-upload-card">
          <div class="avatar-box">
            <img
              :src="avatarDisplayUrl"
              alt="Avatar Preview"
            />
          </div>

          <div class="avatar-action-details">
            <h4>Profile Avatar Photo</h4>
            <p class="avatar-hint">
              Upload a real photo from your computer (PNG, JPG, WEBP, max 5MB).
            </p>

            <div class="upload-btn-row">
              <!-- Hidden File Input -->
              <input
                ref="fileInputRef"
                type="file"
                accept="image/*"
                @change="handleFileUpload"
                style="display: none"
              />

              <button
                type="button"
                @click="$refs.fileInputRef.click()"
                class="btn btn-upload"
                :disabled="uploading"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                  <polyline points="17 8 12 3 7 8"></polyline>
                  <line x1="12" y1="3" x2="12" y2="15"></line>
                </svg>
                <span>{{ uploading ? 'Uploading...' : 'Upload New Photo' }}</span>
              </button>

              <button
                v-if="form.avatar_url"
                type="button"
                @click="resetToDefaultAvatar"
                class="btn btn-text"
              >
                Reset to Default
              </button>
            </div>

            <!-- Optional Custom URL input -->
            <div class="custom-url-toggle">
              <label>Or use external Image URL / Uploaded Path:</label>
              <input
                v-model="form.avatar_url"
                type="text"
                class="form-input form-input-sm"
                placeholder="https://images.unsplash.com/... or /uploads/..."
              />
            </div>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Full Name</label>
            <input v-model="form.full_name" type="text" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Professional Title</label>
            <input v-model="form.title" type="text" class="form-input" placeholder="e.g. Full Stack Developer" required />
          </div>
        </div>

        <div class="form-group">
          <label>Bio (Short summary about your background & passion)</label>
          <textarea v-model="form.bio" class="form-textarea" rows="4" required></textarea>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Email Address</label>
            <input v-model="form.email" type="email" class="form-input" required />
          </div>

          <div class="form-group">
            <label>Phone Number</label>
            <input v-model="form.phone" type="text" class="form-input" placeholder="e.g. 0969596217" />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Location</label>
            <input v-model="form.location" type="text" class="form-input" placeholder="e.g. Phnom Penh, Cambodia" />
          </div>

          <div class="form-group">
            <label>Resume / CV (Upload PDF or paste Google Drive / URL)</label>
            <div class="resume-input-row">
              <input
                v-model="form.resume_url"
                type="text"
                class="form-input"
                placeholder="https://... or /uploads/resume-....pdf"
              />
              <input
                ref="resumeInputRef"
                type="file"
                accept="application/pdf,.pdf"
                @change="handleResumeUpload"
                style="display: none"
              />
              <button
                type="button"
                @click="$refs.resumeInputRef.click()"
                class="btn-resume-upload"
                :disabled="uploadingResume"
              >
                {{ uploadingResume ? "Uploading..." : "Upload PDF" }}
              </button>
              <button
                v-if="form.resume_url"
                type="button"
                @click="form.resume_url = ''"
                class="btn-text"
              >
                Clear
              </button>
            </div>
            <a
              v-if="resumePreviewUrl"
              :href="resumePreviewUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="resume-preview-link"
            >
              View current Resume ↗
            </a>
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>GitHub Profile URL</label>
            <input v-model="form.github_url" type="url" class="form-input" placeholder="https://github.com/..." />
          </div>

          <div class="form-group">
            <label>LinkedIn Profile URL</label>
            <input v-model="form.linkedin_url" type="url" class="form-input" placeholder="https://linkedin.com/in/..." />
          </div>
        </div>

        <div class="form-group">
          <label>Twitter / X Profile URL</label>
          <input v-model="form.twitter_url" type="url" class="form-input" placeholder="https://twitter.com/..." />
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, onUnmounted } from "vue";
import { usePortfolioStore } from "../../stores/portfolio";
import api from "../../api/axios";
import {
  DEFAULT_HERO_AVATAR,
  extractErrorMessage,
  resolveAssetUrl,
} from "../../utils/helpers";

const portfolioStore = usePortfolioStore();

const saving = ref(false);
const uploading = ref(false);
const uploadingResume = ref(false);
const successMsg = ref("");
const errorMsg = ref("");
const fileInputRef = ref(null);
const resumeInputRef = ref(null);
let activeBlobUrl = null;

const form = reactive({
  full_name: "",
  title: "",
  bio: "",
  email: "",
  phone: "",
  location: "",
  avatar_url: "",
  resume_url: "",
  github_url: "",
  linkedin_url: "",
  twitter_url: "",
});

const avatarDisplayUrl = computed(() => {
  return resolveAssetUrl(form.avatar_url, DEFAULT_HERO_AVATAR);
});

const resumePreviewUrl = computed(() => {
  return resolveAssetUrl(form.resume_url, "");
});

onMounted(async () => {
  const profile = await portfolioStore.fetchProfile();
  if (profile) {
    Object.assign(form, {
      full_name: profile.full_name || "",
      title: profile.title || "",
      bio: profile.bio || "",
      email: profile.email || "",
      phone: profile.phone || "",
      location: profile.location || "",
      avatar_url: profile.avatar_url || "",
      resume_url: profile.resume_url || "",
      github_url: profile.github_url || "",
      linkedin_url: profile.linkedin_url || "",
      twitter_url: profile.twitter_url || "",
    });
  }
});

const revokeBlobPreview = () => {
  if (activeBlobUrl) {
    URL.revokeObjectURL(activeBlobUrl);
    activeBlobUrl = null;
  }
};

onUnmounted(() => {
  revokeBlobPreview();
});

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const previousAvatar = form.avatar_url;
  revokeBlobPreview();
  activeBlobUrl = URL.createObjectURL(file);
  form.avatar_url = activeBlobUrl;

  uploading.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    const formData = new FormData();
    formData.append("avatar", file);

    const res = await api.post("/upload/avatar", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const uploadedUrl = res.data.data.url;
    form.avatar_url = uploadedUrl;

    successMsg.value = "Avatar image uploaded and saved successfully!";
    await portfolioStore.fetchProfile();

    setTimeout(() => {
      successMsg.value = "";
    }, 5000);
  } catch (err) {
    form.avatar_url = previousAvatar;
    errorMsg.value = extractErrorMessage(
      err,
      "Failed to upload image. Please try again.",
    );
  } finally {
    revokeBlobPreview();
    uploading.value = false;
    if (fileInputRef.value) {
      fileInputRef.value.value = "";
    }
  }
};

const resetToDefaultAvatar = () => {
  form.avatar_url = "";
};

const handleResumeUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  uploadingResume.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await api.post("/upload/resume", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    form.resume_url = res.data.data.url;
    successMsg.value = "Resume PDF uploaded and saved successfully!";
    await portfolioStore.fetchProfile();

    setTimeout(() => {
      successMsg.value = "";
    }, 5000);
  } catch (err) {
    errorMsg.value = extractErrorMessage(
      err,
      "Failed to upload resume PDF. Please try again.",
    );
  } finally {
    uploadingResume.value = false;
    if (resumeInputRef.value) {
      resumeInputRef.value.value = "";
    }
  }
};

const saveProfile = async () => {
  saving.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    await portfolioStore.updateProfile(form);
    successMsg.value = "Portfolio profile updated successfully!";
    setTimeout(() => {
      successMsg.value = "";
    }, 5000);
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Failed to update profile");
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>
.manager-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 900px;
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

.alert {
  padding: 1rem 1.25rem;
  border-radius: 10px;
  font-size: 0.95rem;
  font-weight: 600;
}

.alert-success {
  background: #ecfdf5;
  color: #065f46;
  border: 1px solid #a7f3d0;
}

.alert-error {
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
}

.profile-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 2.5rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.avatar-upload-card {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-bottom: 2rem;
  padding: 1.75rem;
  background: #f8fafc;
  border: 1.5px dashed #cbd5e1;
  border-radius: 14px;
}

.avatar-box {
  width: 120px;
  height: 120px;
  border-radius: 50%;
  background: #facc15;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  flex-shrink: 0;
  border: 3px solid #ffffff;
}

.avatar-box img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}

.avatar-action-details {
  flex: 1;
}

.avatar-action-details h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0e2431;
  margin-bottom: 0.25rem;
}

.avatar-hint {
  font-size: 0.85rem;
  color: #64748b;
  margin-bottom: 1rem;
}

.upload-btn-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1rem;
}

.btn-upload {
  background: #2506ad;
  color: #ffffff;
  padding: 0.65rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.88rem;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(37, 6, 173, 0.25);
  transition: all 0.2s ease;
}

.btn-upload:hover:not(:disabled) {
  background: #ff7b00;
  transform: translateY(-2px);
}

.btn-upload:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-text {
  color: #dc2626;
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.btn-text:hover {
  background: #fee2e2;
}

.custom-url-toggle {
  margin-top: 0.8rem;
}

.custom-url-toggle label {
  display: block;
  font-size: 0.78rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 0.3rem;
}

.form-input-sm {
  padding: 0.5rem 0.8rem;
  font-size: 0.85rem;
}

.form-group {
  margin-bottom: 1.3rem;
}

.form-group label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0e2431;
  margin-bottom: 0.35rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.resume-input-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-resume-upload {
  background: #0e2431;
  color: #ffffff;
  padding: 0.72rem 1rem;
  border-radius: 8px;
  font-size: 0.84rem;
  font-weight: 600;
  white-space: nowrap;
  transition: all 0.2s ease;
}

.btn-resume-upload:hover:not(:disabled) {
  background: #2506ad;
}

.btn-resume-upload:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.resume-preview-link {
  display: inline-block;
  margin-top: 0.4rem;
  font-size: 0.82rem;
  font-weight: 600;
  color: #2506ad;
}

.resume-preview-link:hover {
  color: #ff7b00;
}

@media (max-width: 680px) {
  .avatar-upload-card {
    flex-direction: column;
    text-align: center;
  }
  .upload-btn-row {
    justify-content: center;
  }
  .form-row {
    grid-template-columns: 1fr;
  }
}
</style>
