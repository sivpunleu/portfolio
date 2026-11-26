<template>
  <div class="portfolio-page">
    <Navbar />

    <div v-if="portfolioStore.loading" class="loading-bar" aria-label="Loading portfolio"></div>

    <div v-if="portfolioStore.error" class="api-warning-banner">
      <span>{{ portfolioStore.error }}</span>
      <button type="button" @click="portfolioStore.loadPortfolioData()" class="retry-btn">
        Retry
      </button>
    </div>

    <HeroSection :profile="portfolioStore.profile" />
    <AboutSection :profile="portfolioStore.profile" />
    <SkillsSection :skills="portfolioStore.skills" />
    <EducationSection :education="portfolioStore.education" />
    <ProjectsSection :projects="portfolioStore.projects" />
    <ContactSection :profile="portfolioStore.profile" />
    <Footer :profile="portfolioStore.profile" />
  </div>
</template>

<script setup>
import { onMounted, watch } from "vue";
import { usePortfolioStore } from "../stores/portfolio";

import Navbar from "../components/Navbar.vue";
import HeroSection from "../components/HeroSection.vue";
import AboutSection from "../components/AboutSection.vue";
import SkillsSection from "../components/SkillsSection.vue";
import EducationSection from "../components/EducationSection.vue";
import ProjectsSection from "../components/ProjectsSection.vue";
import ContactSection from "../components/ContactSection.vue";
import Footer from "../components/Footer.vue";

const portfolioStore = usePortfolioStore();

watch(
  () => portfolioStore.profile,
  (profile) => {
    if (profile?.full_name) {
      document.title = `${profile.full_name} | ${profile.title || "Portfolio"}`;
    }
  },
  { immediate: true },
);

onMounted(() => {
  portfolioStore.loadPortfolioData();
});
</script>

<style scoped>
.portfolio-page {
  position: relative;
  min-height: 100vh;
}

.loading-bar {
  position: fixed;
  top: 74px;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2506ad, #ff7b00, #2506ad);
  background-size: 200% 100%;
  animation: shimmer 1.2s infinite linear;
  z-index: 1050;
}

@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}

.api-warning-banner {
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1100;
  background: #fef2f2;
  color: #991b1b;
  border: 1px solid #fecaca;
  padding: 0.75rem 1rem;
  border-radius: 10px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.12);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.85rem;
  font-weight: 600;
}

.retry-btn {
  background: #991b1b;
  color: #ffffff;
  padding: 0.25rem 0.65rem;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 600;
}
</style>
