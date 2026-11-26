<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="auth-header">
        <router-link to="/admin/login" class="back-link">
          <ArrowLeft :size="16" />
          Back to Sign In
        </router-link>
        <div class="brand-badge">🔑 Password Recovery</div>
        <h2>Forgot Password</h2>
        <p>Enter your admin email to receive a password reset link.</p>
      </div>

      <div v-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
      <div v-if="errorMsg" class="alert alert-error">❌ {{ errorMsg }}</div>

      <form @submit.prevent="handleSubmit" class="auth-form">
        <div class="form-group">
          <label for="email">Admin Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            class="form-input"
            placeholder="admin@example.com"
            required
          />
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          {{ loading ? "Sending..." : "Send Reset Link" }}
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { ArrowLeft } from "lucide-vue-next";
import { useAuthStore } from "../../stores/auth";
import { extractErrorMessage } from "../../utils/helpers";

const authStore = useAuthStore();
const email = ref("");
const loading = ref(false);
const successMsg = ref("");
const errorMsg = ref("");

const handleSubmit = async () => {
  loading.value = true;
  successMsg.value = "";
  errorMsg.value = "";

  try {
    const res = await authStore.forgotPassword(email.value);
    successMsg.value =
      res.message || "If an eligible account exists, a reset email has been sent.";
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Failed to request password reset.");
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

.back-link:hover {
  color: #ff7b00;
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

