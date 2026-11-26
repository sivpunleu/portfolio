<template>
  <div class="manager-page">
    <div class="manager-header">
      <div>
        <h2>Visitor Inquiries</h2>
        <p>Messages received from the contact form on your portfolio.</p>
      </div>
      <div class="header-actions">
        <div class="filter-tabs">
          <button
            type="button"
            class="filter-btn"
            :class="{ active: !unreadOnly }"
            @click="setFilter(false)"
          >
            All
          </button>
          <button
            type="button"
            class="filter-btn"
            :class="{ active: unreadOnly }"
            @click="setFilter(true)"
          >
            Unread
          </button>
        </div>
        <button @click="loadMessages" class="btn btn-outline">
          🔄 Refresh
        </button>
      </div>
    </div>

    <div v-if="errorMsg" class="alert alert-error">❌ {{ errorMsg }}</div>

    <!-- Messages List -->
    <div class="messages-container">
      <div
        v-for="msg in portfolioStore.messages"
        :key="msg.id"
        class="message-card"
        :class="{ unread: !msg.is_read }"
      >
        <div class="msg-header">
          <div class="msg-meta">
            <h4>{{ msg.sender_name }}</h4>
            <a :href="'mailto:' + msg.sender_email" class="msg-email">{{ msg.sender_email }}</a>
            <span class="msg-date">{{ formatDate(msg.created_at) }}</span>
          </div>

          <div class="msg-actions">
            <button
              @click="toggleRead(msg)"
              class="btn-sm"
              :class="msg.is_read ? 'btn-unread-toggle' : 'btn-read-toggle'"
            >
              {{ msg.is_read ? 'Mark Unread' : 'Mark Read' }}
            </button>
            <button @click="confirmDelete(msg.id)" class="btn-sm btn-delete">
              Delete
            </button>
          </div>
        </div>

        <div class="msg-subject">
          <strong>Subject:</strong> {{ msg.subject }}
        </div>

        <div class="msg-body">
          {{ msg.message }}
        </div>
      </div>

      <div v-if="portfolioStore.messages.length === 0" class="empty-state">
        <p>{{ unreadOnly ? "No unread messages." : "No messages received yet." }}</p>
      </div>
    </div>

    <ConfirmModal
      :show="deleteTargetId !== null"
      title="Delete Message"
      message="Are you sure you want to delete this inquiry message?"
      :loading="deleting"
      @cancel="deleteTargetId = null"
      @confirm="executeDelete"
    />
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { usePortfolioStore } from "../../stores/portfolio";
import ConfirmModal from "../../components/ConfirmModal.vue";
import { extractErrorMessage } from "../../utils/helpers";

const portfolioStore = usePortfolioStore();

const unreadOnly = ref(false);
const errorMsg = ref("");
const deleting = ref(false);
const deleteTargetId = ref(null);

const loadMessages = async () => {
  errorMsg.value = "";
  try {
    await portfolioStore.fetchMessages(unreadOnly.value ? { unread: true } : {});
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Failed to load messages.");
  }
};

onMounted(loadMessages);

const setFilter = async (onlyUnread) => {
  unreadOnly.value = onlyUnread;
  await loadMessages();
};

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const toggleRead = async (msg) => {
  errorMsg.value = "";
  try {
    await portfolioStore.markMessageRead(
      msg.id,
      !msg.is_read,
      unreadOnly.value ? { unread: true } : {},
    );
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Failed to update message status.");
  }
};

const confirmDelete = (id) => {
  deleteTargetId.value = id;
};

const executeDelete = async () => {
  if (deleteTargetId.value === null) return;
  deleting.value = true;
  errorMsg.value = "";
  try {
    await portfolioStore.deleteMessage(
      deleteTargetId.value,
      unreadOnly.value ? { unread: true } : {},
    );
    deleteTargetId.value = null;
  } catch (err) {
    errorMsg.value = extractErrorMessage(err, "Failed to delete message.");
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.filter-tabs {
  display: inline-flex;
  background: #e2e8f0;
  padding: 0.25rem;
  border-radius: 9999px;
}

.filter-btn {
  padding: 0.45rem 1rem;
  border-radius: 9999px;
  font-size: 0.85rem;
  font-weight: 600;
  color: #475569;
}

.filter-btn.active {
  background: #2506ad;
  color: #ffffff;
}

.messages-container {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.message-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  transition: all 0.2s ease;
}

.message-card.unread {
  border-left: 5px solid #2506ad;
  background: #fdfefe;
}

.msg-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 1rem;
  margin-bottom: 1rem;
  border-bottom: 1px solid #f1f5f9;
  padding-bottom: 0.8rem;
}

.msg-meta h4 {
  font-size: 1.15rem;
  font-weight: 700;
  color: #0e2431;
}

.msg-email {
  font-size: 0.9rem;
  color: #2506ad;
  margin-right: 1rem;
}

.msg-date {
  font-size: 0.8rem;
  color: #94a3b8;
}

.msg-actions {
  display: flex;
  gap: 0.5rem;
}

.msg-subject {
  font-size: 1rem;
  color: #0e2431;
  margin-bottom: 0.8rem;
}

.msg-body {
  font-size: 0.95rem;
  color: #475569;
  line-height: 1.7;
  white-space: pre-wrap;
  background: #f8fafc;
  padding: 1rem;
  border-radius: 8px;
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  border-radius: 6px;
  font-size: 0.82rem;
  font-weight: 600;
}

.btn-read-toggle {
  background: #eff6ff;
  color: #2563eb;
}

.btn-unread-toggle {
  background: #f1f5f9;
  color: #64748b;
}

.btn-delete {
  background: #fef2f2;
  color: #dc2626;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  background: #ffffff;
  border-radius: 14px;
  border: 1.5px solid #e2e8f0;
  color: #94a3b8;
}
</style>
