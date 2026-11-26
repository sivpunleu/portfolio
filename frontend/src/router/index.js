import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "../stores/auth";
import HomeView from "../views/HomeView.vue";
import LoginView from "../views/admin/LoginView.vue";
import ForgotPasswordView from "../views/admin/ForgotPasswordView.vue";
import ResetPasswordView from "../views/admin/ResetPasswordView.vue";
import VerifyEmailView from "../views/admin/VerifyEmailView.vue";
import AdminLayout from "../views/admin/AdminLayout.vue";
import DashboardView from "../views/admin/DashboardView.vue";
import ProjectsManager from "../views/admin/ProjectsManager.vue";
import SkillsManager from "../views/admin/SkillsManager.vue";
import EducationManager from "../views/admin/EducationManager.vue";
import MessagesManager from "../views/admin/MessagesManager.vue";
import ProfileManager from "../views/admin/ProfileManager.vue";
import AccountSettingsView from "../views/admin/AccountSettingsView.vue";

const routes = [
  {
    path: "/",
    name: "home",
    component: HomeView,
  },
  {
    path: "/admin/login",
    name: "admin-login",
    component: LoginView,
  },
  {
    path: "/admin/forgot-password",
    name: "admin-forgot-password",
    component: ForgotPasswordView,
  },
  {
    path: "/reset-password",
    name: "reset-password",
    component: ResetPasswordView,
  },
  {
    path: "/verify-email",
    name: "verify-email",
    component: VerifyEmailView,
  },
  {
    path: "/admin",
    component: AdminLayout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "",
        redirect: "/admin/dashboard",
      },
      {
        path: "dashboard",
        name: "admin-dashboard",
        component: DashboardView,
      },
      {
        path: "profile",
        name: "admin-profile",
        component: ProfileManager,
      },
      {
        path: "projects",
        name: "admin-projects",
        component: ProjectsManager,
      },
      {
        path: "skills",
        name: "admin-skills",
        component: SkillsManager,
      },
      {
        path: "education",
        name: "admin-education",
        component: EducationManager,
      },
      {
        path: "messages",
        name: "admin-messages",
        component: MessagesManager,
      },
      {
        path: "account",
        name: "admin-account",
        component: AccountSettingsView,
      },
    ],
  },
  {
    path: "/:pathMatch(.*)*",
    redirect: "/",
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to) {
    if (to.hash) {
      return {
        el: to.hash,
        behavior: "smooth",
      };
    }
    return { top: 0 };
  },
});

router.beforeEach(async (to) => {
  const authStore = useAuthStore();

  if (to.meta.requiresAuth) {
    if (!authStore.token) {
      return { name: "admin-login" };
    }

    if (!authStore.sessionVerified) {
      const currentUser = await authStore.fetchCurrentUser();
      if (!currentUser) {
        return { name: "admin-login", query: { expired: "1" } };
      }
    }

    if (authStore.user?.role && authStore.user.role !== "admin") {
      authStore.clearSession();
      return { name: "admin-login", query: { unauthorized: "1" } };
    }
  } else if (to.name === "admin-login" && authStore.token) {
    if (!authStore.sessionVerified) {
      const currentUser = await authStore.fetchCurrentUser();
      if (!currentUser) return true;
    }
    if (!authStore.user?.role || authStore.user.role === "admin") {
      return { name: "admin-dashboard" };
    }
  }

  return true;
});

export default router;
