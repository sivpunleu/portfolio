import { createApp } from "vue";
import { createPinia } from "pinia";
import router from "./router";
import { setUnauthorizedHandler } from "./api/axios";
import { useAuthStore } from "./stores/auth";
import "./assets/main.css";
import App from "./App.vue";

const app = createApp(App);
const pinia = createPinia();

app.use(pinia);
app.use(router);

setUnauthorizedHandler(() => {
  const authStore = useAuthStore(pinia);
  authStore.clearSession();
  if (router.currentRoute.value.meta.requiresAuth) {
    router.replace({ name: "admin-login", query: { expired: "1" } });
  }
});

app.mount("#app");
