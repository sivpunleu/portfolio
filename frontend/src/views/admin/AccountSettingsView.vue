<template>
  <div class="manager-page">
    <div class="manager-header">
      <div>
        <h2>Account &amp; Security</h2>
        <p>Manage your admin account details and update your password.</p>
      </div>
    </div>

    <div class="settings-grid">
      <!-- Account Details Card -->
      <div class="settings-card">
        <h3>Admin Account Info</h3>
        <div v-if="accountSuccess" class="alert alert-success">✅ {{ accountSuccess }}</div>
        <div v-if="accountError" class="alert alert-error">❌ {{ accountError }}</div>

        <form @submit.prevent="saveAccount">
          <div class="form-group">
            <label class="form-label">Email Address</label>
            <input :value="authStore.user?.email || ''" type="email" class="form-input" disabled />
          </div>

          <div class="form-group">
            <label class="form-label">Full Name</label>
            <input v-model="accountForm.full_name" type="text" class="form-input" minlength="3" required />
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input v-model="accountForm.phone" type="text" class="form-input" placeholder="e.g. 0969596217" />
          </div>

          <button type="submit" class="btn btn-primary" :disabled="savingAccount">
            {{ savingAccount ? "Saving..." : "Update Account" }}
          </button>
        </form>
      </div>

      <!-- Change Password Card -->
      <div class="settings-card">
        <h3>Change Password</h3>
        <p class="card-hint">Changing your password will require signing in again.</p>
        <div v-if="pwError" class="alert alert-error">❌ {{ pwError }}</div>

        <form @submit.prevent="savePassword">
          <div class="form-group">
            <label class="form-label">Current Password</label>
            <input v-model="pwForm.oldPassword" type="password" class="form-input" required />
          </div>

          <div class="form-group">
            <label class="form-label">New Password</label>
            <input
              v-model="pwForm.newPassword"
              type="password"
              class="form-input"
              placeholder="Min 8 chars, upper, lower, number & symbol"
              required
            />
          </div>

          <div class="form-group">
            <label class="form-label">Confirm New Password</label>
            <input v-model="pwForm.confirmPassword" type="password" class="form-input" required />
          </div>

          <button type="submit" class="btn btn-secondary" :disabled="savingPw">
            {{ savingPw ? "Updating..." : "Change Password" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "../../stores/auth";
import { extractErrorMessage } from "../../utils/helpers";

const authStore = useAuthStore();
const router = useRouter();

const accountForm = reactive({
  full_name: "",
  phone: "",
});
const savingAccount = ref(false);
const accountSuccess = ref("");
const accountError = ref("");

const pwForm = reactive({
  oldPassword: "",
  newPassword: "",
  confirmPassword: "",
});
const savingPw = ref(false);
const pwError = ref("");

onMounted(async () => {
  const user = await authStore.fetchCurrentUser();
  if (user) {
    accountForm.full_name = user.full_name || "";
    accountForm.phone = user.phone || "";
  }
});

const saveAccount = async () => {
  savingAccount.value = true;
  accountSuccess.value = "";
  accountError.value = "";
  try {
    await authStore.updateMe({
      full_name: accountForm.full_name,
      phone: accountForm.phone || null,
    });
    accountSuccess.value = "Account details updated successfully.";
  } catch (err) {
    accountError.value = extractErrorMessage(err, "Failed to update account.");
  } finally {
    savingAccount.value = false;
  }
};

const savePassword = async () => {
  pwError.value = "";
  if (pwForm.newPassword !== pwForm.confirmPassword) {
    pwError.value = "New Password and Confirm Password do not match.";
    return;
  }
  savingPw.value = true;
  try {
    await authStore.changePassword({ ...pwForm });
    router.push({ name: "admin-login", query: { reset: "1" } });
  } catch (err) {
    pwError.value = extractErrorMessage(err, "Failed to change password.");
  } finally {
    savingPw.value = false;
  }
};
</script>

<style scoped>
.manager-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  max-width: 960px;
}

.manager-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0e2431;
}

.manager-header p {
  color: #64748b;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
}

.settings-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 2rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.settings-card h3 {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0e2431;
  margin-bottom: 0.4rem;
}

.card-hint {
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 1.25rem;
}
</style>

