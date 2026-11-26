<template>
  <div class="dashboard-page">
    <div class="page-header">
      <h2>Welcome Back, Admin</h2>
      <p>Here is an overview of your portfolio metrics and visitor inquiries.</p>
    </div>

    <!-- Metric Cards Grid -->
    <div class="metrics-grid">
      <router-link to="/admin/projects" class="metric-card">
        <div class="metric-icon projects">🚀</div>
        <div class="metric-info">
          <h3>{{ portfolioStore.projects.length }}</h3>
          <span>Total Projects</span>
        </div>
      </router-link>

      <router-link to="/admin/skills" class="metric-card">
        <div class="metric-icon skills">💻</div>
        <div class="metric-info">
          <h3>{{ portfolioStore.skills.length }}</h3>
          <span>Total Skills</span>
        </div>
      </router-link>

      <router-link to="/admin/education" class="metric-card">
        <div class="metric-icon education">🎓</div>
        <div class="metric-info">
          <h3>{{ portfolioStore.education.length }}</h3>
          <span>Education Records</span>
        </div>
      </router-link>

      <router-link to="/admin/messages" class="metric-card">
        <div class="metric-icon messages">📬</div>
        <div class="metric-info">
          <h3>{{ unreadCount }}</h3>
          <span>Unread Inquiries</span>
        </div>
      </router-link>
    </div>

    <!-- Recent Messages Table -->
    <div class="dashboard-section">
      <div class="section-title-bar">
        <h3>Recent Contact Messages</h3>
        <router-link to="/admin/messages" class="link-more">View All</router-link>
      </div>

      <div class="table-container">
        <table class="admin-table">
          <thead>
            <tr>
              <th>Sender</th>
              <th>Email</th>
              <th>Subject</th>
              <th>Date</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="msg in recentMessages" :key="msg.id">
              <td><strong>{{ msg.sender_name }}</strong></td>
              <td>{{ msg.sender_email }}</td>
              <td>{{ msg.subject }}</td>
              <td>{{ formatDate(msg.created_at) }}</td>
              <td>
                <span class="badge" :class="msg.is_read ? 'badge-read' : 'badge-unread'">
                  {{ msg.is_read ? 'Read' : 'New' }}
                </span>
              </td>
            </tr>
            <tr v-if="recentMessages.length === 0">
              <td colspan="5" class="empty-table">No contact messages received yet.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { usePortfolioStore } from "../../stores/portfolio";

const portfolioStore = usePortfolioStore();

onMounted(async () => {
  await Promise.allSettled([
    portfolioStore.fetchProjects(),
    portfolioStore.fetchSkills(),
    portfolioStore.fetchEducation(),
    portfolioStore.fetchMessages(),
  ]);
});

const unreadCount = computed(() => {
  return portfolioStore.messages.filter((m) => !m.is_read).length;
});

const recentMessages = computed(() => {
  return portfolioStore.messages.slice(0, 5);
});

const formatDate = (dateStr) => {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  if (Number.isNaN(d.getTime())) return String(dateStr);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};
</script>

<style scoped>
.dashboard-page {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.page-header h2 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0e2431;
}

.page-header p {
  color: #64748b;
  font-size: 0.95rem;
}

.metrics-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.metric-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  transition: transform 0.2s ease, border-color 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-3px);
  border-color: #2506ad;
}

.metric-icon {
  width: 56px;
  height: 56px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.8rem;
}

.metric-icon.projects { background: #eff6ff; }
.metric-icon.skills { background: #fdf4ff; }
.metric-icon.education { background: #f0fdf4; }
.metric-icon.messages { background: #fff7ed; }

.metric-info h3 {
  font-size: 1.8rem;
  font-weight: 800;
  color: #0e2431;
  line-height: 1;
  margin-bottom: 0.25rem;
}

.metric-info span {
  font-size: 0.85rem;
  color: #64748b;
  font-weight: 600;
}

.dashboard-section {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
}

.section-title-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-title-bar h3 {
  font-size: 1.2rem;
  font-weight: 700;
  color: #0e2431;
}

.link-more {
  color: #2506ad;
  font-size: 0.88rem;
  font-weight: 600;
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

.badge {
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.badge-unread {
  background: #fef2f2;
  color: #dc2626;
}

.badge-read {
  background: #f1f5f9;
  color: #64748b;
}

.empty-table {
  text-align: center;
  padding: 2rem;
  color: #94a3b8;
}
</style>
