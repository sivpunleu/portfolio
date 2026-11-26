<template>
  <div class="login-wrapper">
    <div class="login-card">
      <div class="login-header">
        <router-link to="/" class="back-link">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <line x1="19" y1="12" x2="5" y2="12"></line>
            <polyline points="12 19 5 12 12 5"></polyline>
          </svg>
          Back to Portfolio
        </router-link>

        <div class="brand-badge">🔐 Admin Portal</div>
        <h2>Sign In to CMS</h2>
        <p>Enter your admin credentials to manage your portfolio</p>
      </div>

      <div v-if="noticeMsg" class="alert alert-warning">
        {{ noticeMsg }}
      </div>

      <div v-if="errorMsg" class="alert alert-error">
        {{ errorMsg }}
      </div>

      <form @submit.prevent="handleLogin" class="login-form">
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

        <div class="form-group">
          <label for="password">Password</label>
          <div class="password-input-wrap">
            <input
              id="password"
              v-model="password"
              :type="showPassword ? 'text' : 'password'"
              class="form-input password-input"
              placeholder="••••••••"
              autocomplete="current-password"
              required
            />
            <button
              type="button"
              class="toggle-pw-btn"
              @click="showPassword = !showPassword"
              :aria-label="showPassword ? 'Hide password' : 'Show password'"
              :title="showPassword ? 'Hide password' : 'Show password'"
            >
              <EyeOff v-if="showPassword" :size="18" />
              <Eye v-else :size="18" />
            </button>
          </div>
          <p v-if="hasPasswordEdgeSpaces" class="space-warning">
            Password contains leading or trailing spaces (count: {{ password.length }} chars).
          </p>
        </div>

        <div class="forgot-row">
          <router-link to="/admin/forgot-password" class="forgot-link">
            Forgot password?
          </router-link>
        </div>

        <button type="submit" class="btn btn-primary btn-block" :disabled="loading">
          <span v-if="!loading">Log In</span>
          <span v-else>Authenticating...</span>
        </button>
      </form>
    </div>
  </div>
</template>

<script setup>
import { computed, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Eye, EyeOff } from "lucide-vue-next";
import { useAuthStore } from "../../stores/auth";
import { extractErrorMessage } from "../../utils/helpers";

const authStore = useAuthStore();
const router = useRouter();
const route = useRoute();

const email = ref("");
const password = ref("");
const showPassword = ref(false);
const loading = ref(false);
const errorMsg = ref("");

const hasPasswordEdgeSpaces = computed(
  () => password.value.length > 0 && password.value !== password.value.trim(),
);

const noticeMsg = computed(() => {
  if (route.query.expired === "1") {
    return "Your session has expired. Please sign in again.";
  }
  if (route.query.unauthorized === "1") {
    return "Admin role is required to access the CMS.";
  }
  if (route.query.reset === "1") {
    return "Password reset successful. You can now sign in with your new password.";
  }
  return "";
});

const handleLogin = async () => {
  loading.value = true;
  errorMsg.value = "";

  try {
    await authStore.login(email.value, password.value);
    router.push("/admin/dashboard");
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Invalid credentials. Please try again.");
  } finally {
    loading.value = false;
  }
};
</script>

<style scoped>
.login-wrapper {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #f8fafc;
  padding: 1.5rem;
}

.login-card {
  width: 100%;
  max-width: 440px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.08);
}

.login-header {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  margin-bottom: 2rem;
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.85rem;
  font-weight: 600;
  color: #64748b;
  margin-bottom: 1.25rem;
  transition: all 0.2s ease;
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

.login-header h2 {
  font-size: 1.75rem;
  font-weight: 800;
  color: #0e2431;
  margin-bottom: 0.25rem;
}

.login-header p {
  color: #64748b;
  font-size: 0.9rem;
}

.login-form .form-group {
  margin-bottom: 1.25rem;
}

.login-form label {
  display: block;
  font-size: 0.85rem;
  font-weight: 600;
  color: #0e2431;
  margin-bottom: 0.35rem;
}

.password-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
}

.password-input {
  padding-right: 2.75rem;
}

.toggle-pw-btn {
  position: absolute;
  right: 0.75rem;
  color: #64748b;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.25rem;
}

.toggle-pw-btn:hover {
  color: #2506ad;
}

.space-warning {
  margin-top: 0.35rem;
  font-size: 0.78rem;
  font-weight: 600;
  color: #b45309;
}

.forgot-row {
  display: flex;
  justify-content: flex-end;
  margin-top: -0.5rem;
  margin-bottom: 0.75rem;
}

.forgot-link {
  font-size: 0.85rem;
  font-weight: 600;
  color: #2506ad;
}

.forgot-link:hover {
  color: #ff7b00;
}

.btn-block {
  width: 100%;
  margin-top: 0.5rem;
}
</style>
