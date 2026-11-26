<template>
  <div class="admin-layout">
    <!-- Mobile Top Bar -->
    <header class="mobile-topbar">
      <div class="mobile-brand">
        <span class="logo-badge">DevCMS</span>
        <span>Admin Panel</span>
      </div>
      <button
        type="button"
        class="mobile-menu-btn"
        @click="sidebarOpen = !sidebarOpen"
        aria-label="Toggle admin menu"
      >
        <X v-if="sidebarOpen" :size="22" />
        <Menu v-else :size="22" />
      </button>
    </header>

    <!-- Backdrop for Mobile Drawer -->
    <div v-if="sidebarOpen" class="sidebar-backdrop" @click="sidebarOpen = false"></div>

    <!-- Sidebar -->
    <aside class="admin-sidebar" :class="{ open: sidebarOpen }">
      <div class="sidebar-header">
        <span class="logo-badge">DevCMS</span>
        <h3>Admin Panel</h3>
        <p v-if="authStore.user?.email" class="admin-user-email">
          {{ authStore.user.full_name || authStore.user.email }}
        </p>
      </div>

      <nav class="sidebar-nav" @click="closeMobile">
        <router-link to="/admin/dashboard" class="nav-item">
          <LayoutDashboard :size="18" />
          Dashboard
        </router-link>

        <router-link to="/admin/profile" class="nav-item">
          <User :size="18" />
          Profile
        </router-link>

        <router-link to="/admin/projects" class="nav-item">
          <Layers :size="18" />
          Projects
        </router-link>

        <router-link to="/admin/skills" class="nav-item">
          <Zap :size="18" />
          Skills
        </router-link>

        <router-link to="/admin/education" class="nav-item">
          <GraduationCap :size="18" />
          Education
        </router-link>

        <router-link to="/admin/messages" class="nav-item">
          <Mail :size="18" />
          Messages
        </router-link>

        <router-link to="/admin/account" class="nav-item">
          <ShieldCheck :size="18" />
          Account &amp; Security
        </router-link>
      </nav>

      <div class="sidebar-footer">
        <router-link to="/" class="nav-item view-site" @click="closeMobile">
          <ExternalLink :size="18" />
          View Live Site
        </router-link>

        <button @click="handleLogout" class="nav-item logout-btn">
          <LogOut :size="18" />
          Sign Out
        </button>
      </div>
    </aside>

    <!-- Main Admin Content -->
    <main class="admin-main">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import {
  LayoutDashboard,
  User,
  Layers,
  Zap,
  GraduationCap,
  Mail,
  ShieldCheck,
  ExternalLink,
  LogOut,
  Menu,
  X,
} from "lucide-vue-next";
import { useAuthStore } from "../../stores/auth";

const authStore = useAuthStore();
const router = useRouter();
const sidebarOpen = ref(false);

const closeMobile = () => {
  sidebarOpen.value = false;
};

const handleLogout = async () => {
  await authStore.logout();
  router.push("/admin/login");
};
</script>

<style scoped>
.admin-layout {
  display: flex;
  min-height: 100vh;
  background: #f8fafc;
}

.mobile-topbar {
  display: none;
}

.sidebar-backdrop {
  display: none;
}

.admin-sidebar {
  width: 260px;
  background: #0e2431;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  padding: 1.75rem 1.25rem;
  flex-shrink: 0;
  position: sticky;
  top: 0;
  height: 100vh;
}

.sidebar-header {
  margin-bottom: 2rem;
}

.logo-badge {
  display: inline-block;
  font-size: 0.75rem;
  font-weight: 700;
  color: #ff7b00;
  background: rgba(255, 123, 0, 0.15);
  padding: 0.2rem 0.5rem;
  border-radius: 6px;
  margin-bottom: 0.4rem;
}

.sidebar-header h3 {
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
}

.admin-user-email {
  font-size: 0.78rem;
  color: #94a3b8;
  margin-top: 0.25rem;
  word-break: break-all;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  flex: 1;
  overflow-y: auto;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  color: #94a3b8;
  font-size: 0.92rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.nav-item:hover,
.nav-item.router-link-active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.08);
}

.nav-item.router-link-active {
  background: #2506ad;
  color: #ffffff;
}

.sidebar-footer {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.logout-btn {
  width: 100%;
  color: #f87171;
  text-align: left;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.15);
  color: #fca5a5;
}

.admin-main {
  flex: 1;
  min-width: 0;
  padding: 2.5rem;
  overflow-y: auto;
}

@media (max-width: 900px) {
  .admin-layout {
    flex-direction: column;
  }

  .mobile-topbar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: #0e2431;
    color: #ffffff;
    padding: 0.85rem 1.25rem;
    position: sticky;
    top: 0;
    z-index: 1200;
  }

  .mobile-brand {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    font-weight: 700;
  }

  .mobile-brand .logo-badge {
    margin-bottom: 0;
  }

  .mobile-menu-btn {
    color: #ffffff;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0.35rem;
    border-radius: 8px;
  }

  .sidebar-backdrop {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(15, 23, 42, 0.55);
    z-index: 1250;
  }

  .admin-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    bottom: 0;
    height: 100vh;
    height: 100dvh;
    z-index: 1300;
    transform: translateX(-100%);
    transition: transform 0.25s ease;
  }

  .admin-sidebar.open {
    transform: translateX(0);
  }

  .admin-main {
    padding: 1.5rem 1rem;
  }
}
</style>
