<template>
  <div v-if="show" class="confirm-overlay" @click.self="$emit('cancel')">
    <div class="confirm-card" role="dialog" aria-modal="true">
      <h3>{{ title }}</h3>
      <p>{{ message }}</p>
      <div class="confirm-actions">
        <button type="button" class="btn btn-outline" @click="$emit('cancel')" :disabled="loading">
          Cancel
        </button>
        <button type="button" class="btn btn-danger" @click="$emit('confirm')" :disabled="loading">
          {{ loading ? "Processing..." : confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: { type: Boolean, default: false },
  title: { type: String, default: "Confirm Action" },
  message: { type: String, default: "Are you sure you want to continue?" },
  confirmText: { type: String, default: "Delete" },
  loading: { type: Boolean, default: false },
});

defineEmits(["confirm", "cancel"]);
</script>

<style scoped>
.confirm-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.55);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 3000;
  padding: 1.5rem;
}

.confirm-card {
  background: #ffffff;
  border-radius: 16px;
  max-width: 420px;
  width: 100%;
  padding: 1.75rem;
  box-shadow: 0 20px 45px rgba(0, 0, 0, 0.2);
}

.confirm-card h3 {
  font-size: 1.25rem;
  font-weight: 800;
  color: #0e2431;
  margin-bottom: 0.5rem;
}

.confirm-card p {
  color: #475569;
  font-size: 0.94rem;
  line-height: 1.5;
  margin-bottom: 1.5rem;
}

.confirm-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
}

.btn-danger {
  background: #dc2626;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(220, 38, 38, 0.25);
}

.btn-danger:hover:not(:disabled) {
  background: #b91c1c;
}
</style>

