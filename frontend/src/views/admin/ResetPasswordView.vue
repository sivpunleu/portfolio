<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/admin/login" class="back-link">
          <ArrowLeft :size="16" />
          Back to Sign In
        </router-link>
        <div class="brand-badge">🔐 New Password</div>
        <h2>Reset Password</h2>
        <p>Choose a strong new password for your admin account.</p>
      </div>

      <div v-if="!token" class="alert alert-error">
        Missing or invalid reset token. Please request a new password reset link.
      </div>
      <div v-if="errorMsg" class="alert alert-error">❌ {{ errorMsg }}</div>

      <form v-if="token" @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="password">New Password</label>
          <input
            id="password"
            v-model="password"
            type="password"
            class="form-input"
            placeholder="Min 8 chars, upper, lower, number & symbol"
            required
          />
        </div>

        <div class="form-group">
          <label for="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            class="form-input"
            placeholder="Re-enter new password"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? "Updating..." : "Reset Password" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { ArrowLeft } from "lucide-vue-next";
import { useAuthStore } from "../../stores/auth";
import { extractErrorMessage } from "../../utils/helpers";

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();

const token = computed(() => String(route.query.token || "").trim());
const password = ref("");
const confirmPassword = ref("");
const loading = ref(false);
const errorMsg = ref("");

const handleSubmit = async () => {
  errorMsg.value = "";
  if (password.value !== confirmPassword.value) {
    errorMsg.value = "Passwords do not match.";
    return;
  }

  loading.value = true;
  try {
    await authStore.resetPassword(token.value, password.value);
    router.push({ name: "admin-login", query: { reset: "1" } });
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Failed to reset password.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.auth-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 1.5rem;
}

.auth-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.auth-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 1.75rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1.25rem;
}

.brand-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 700;
  color: #2506ad;
  background: #eef2ff;
  padding: 0.25rem 0.75rem;
  border-radius: 9999px;
  margin-bottom: 0.75rem;
}

.auth-header h2 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0e2431;
}

.auth-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.auth-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0e2431;
  margin-bottom: 0.35rem;
}

.btn-block {
  width: 100%;
  margin-top: 0.75rem;
}
</style>

