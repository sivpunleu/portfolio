<template>
  <div class="auth-wrapper">
    <div class="auth-card">
      <div class="brand-badge">✉️ Email Verification</div>
      <h2>Verify Your Email</h2>

      <p v-if="loading" class="status-text">Verifying your email address...</p>
      <div v-else-if="successMsg" class="alert alert-success">✅ {{ successMsg }}</div>
      <div v-else class="alert alert-error">❌ {{ errorMsg }}</div>

      <router-link to="/admin/login" class="btn btn-primary btn-block">
        Go to Sign In
      </router-link>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { extractErrorMessage } from "../../utils/helpers";

const route = useRoute();
const authStore = useAuthStore();

const loading = ref(true);
const successMsg = ref("");
const errorMsg = ref("");

onMounted(async () => {
  const token = String(route.query.token || "").trim();
  if (!token) {
    errorMsg.value = "Verification token is missing.";
    loading.value = false;
    return;
  }

  try {
    const res = await authStore.verifyEmail(token);
    successMsg.value = res.message || "Email verified successfully!";
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Token is invalid or expired.");
  } finally {
    loading.value = false;
  }
});
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
  text-align: center;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
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

.auth-card h2 {
  font-size: 1.7rem;
  font-weight: 800;
  color: #0e2431;
  margin-bottom: 1.25rem;
}

.status-text {
  color: #64748b;
  margin-bottom: 1.5rem;
}

.btn-block {
  width: 100%;
}
</style>

