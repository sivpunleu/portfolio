<template>
  <section id="projects" class="section">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Projects <span>Made</span></h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">
          A showcase of full-stack web applications, RESTful APIs, and responsive digital experiences.
        </p>
      </div>

      <div class="projects-grid">
        <div v-for="proj in projects" :key="proj.id" class="project-card">
          <div
            class="project-thumb"
            @click="selectedProject = proj"
            @keydown.enter.prevent="selectedProject = proj"
            @keydown.space.prevent="selectedProject = proj"
            role="button"
            tabindex="0"
          >
            <img
              :src="resolveAssetUrl(proj.thumbnail_url, DEFAULT_PROJECT_THUMBNAIL)"
              :alt="proj.title"
            />
            <span v-if="proj.is_featured" class="project-badge">Featured</span>
          </div>

          <div class="project-body">
            <h3 class="project-title" @click="selectedProject = proj">{{ proj.title }}</h3>
            <p class="project-desc">{{ proj.description }}</p>

            <div class="project-tags">
              <span v-for="tag in proj.tech_stack" :key="tag" class="tech-tag">
                {{ tag }}
              </span>
            </div>

            <div class="project-footer">
              <a
                v-if="proj.live_url"
                :href="proj.live_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-demo"
              >
                <span>Live Demo</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                  <polyline points="15 3 21 3 21 9"></polyline>
                  <line x1="10" y1="14" x2="21" y2="3"></line>
                </svg>
              </a>

              <a
                v-if="proj.github_url"
                :href="proj.github_url"
                target="_blank"
                rel="noopener noreferrer"
                class="btn btn-code"
              >
                <span>Code</span>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
                </svg>
              </a>

              <button type="button" class="btn btn-details" @click="selectedProject = proj">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="projects.length === 0" class="no-data">
        No projects published yet.
      </div>
    </div>

    <!-- Project Details Modal -->
    <div v-if="selectedProject" class="modal-overlay" @click.self="selectedProject = null">
      <div class="modal-card">
        <button type="button" class="modal-close" @click="selectedProject = null" aria-label="Close modal">
          ✕
        </button>
        <div class="modal-thumb">
          <img
            :src="resolveAssetUrl(selectedProject.thumbnail_url, DEFAULT_PROJECT_THUMBNAIL)"
            :alt="selectedProject.title"
          />
        </div>
        <div class="modal-body">
          <h3>{{ selectedProject.title }}</h3>
          <p class="modal-desc">{{ selectedProject.description }}</p>
          <div class="project-tags">
            <span v-for="tag in selectedProject.tech_stack" :key="tag" class="tech-tag">
              {{ tag }}
            </span>
          </div>
          <div class="project-footer">
            <a
              v-if="selectedProject.live_url"
              :href="selectedProject.live_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-demo"
            >
              Live Demo
            </a>
            <a
              v-if="selectedProject.github_url"
              :href="selectedProject.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-code"
            >
              Source Code
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, onUnmounted, ref } from "vue";
import { DEFAULT_PROJECT_THUMBNAIL, resolveAssetUrl } from "../utils/helpers";

defineProps({
  projects: {
    type: Array,
    default: () => [],
  },
});

const selectedProject = ref(null);

const handleKeyDown = (e) => {
  if (e.key === "Escape" && selectedProject.value) {
    selectedProject.value = null;
  }
};

onMounted(() => {
  window.addEventListener("keydown", handleKeyDown);
});

onUnmounted(() => {
  window.removeEventListener("keydown", handleKeyDown);
});
</script>

<style scoped>
.section-header {
  text-align: center;
  margin-bottom: 3.5rem;
}

.section-title {
  font-size: 2.5rem;
  font-weight: 800;
  color: #0e2431;
}

.section-title span {
  color: #2506ad;
}

.title-underline {
  width: 70px;
  height: 4px;
  background: #ff7b00;
  border-radius: 4px;
  margin: 0.5rem auto 0.8rem;
}

.section-subtitle {
  color: #64748b;
  font-size: 0.95rem;
}

.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 320px), 1fr));
  gap: 2rem;
}

.project-card {
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.06);
  border: 1.5px solid #e2e8f0;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
}

.project-card:hover {
  transform: translateY(-8px);
  border-color: #2506ad;
  box-shadow: 0 16px 35px rgba(37, 6, 173, 0.12);
}

.project-thumb {
  height: 210px;
  background: #0e2431;
  position: relative;
  overflow: hidden;
}

.project-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.project-card:hover .project-thumb img {
  transform: scale(1.06);
}

.project-badge {
  position: absolute;
  top: 12px;
  right: 12px;
  background: #ff7b00;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
}

.project-body {
  padding: 1.6rem;
  display: flex;
  flex-direction: column;
  flex: 1;
}

.project-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #0e2431;
  margin-bottom: 0.6rem;
}

.project-desc {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.6;
  margin-bottom: 1.25rem;
  flex: 1;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.project-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-bottom: 1.25rem;
}

.tech-tag {
  font-size: 0.75rem;
  font-weight: 600;
  background: #f1f5f9;
  color: #2506ad;
  padding: 0.25rem 0.65rem;
  border-radius: 9999px;
}

.project-footer {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.55rem;
  border-top: 1px solid #f1f5f9;
  padding-top: 1.1rem;
}

.btn-demo,
.btn-code,
.btn-details {
  padding: 0.55rem 0.9rem;
  border-radius: 9999px;
  font-size: 0.84rem;
  font-weight: 600;
  line-height: 1.2;
  white-space: nowrap;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.btn-demo svg,
.btn-code svg {
  flex-shrink: 0;
}

.btn-demo {
  flex: 1 1 auto;
  background: #2506ad;
  color: #ffffff;
}

.btn-demo:hover {
  background: #ff7b00;
}

.btn-code {
  flex: 1 1 auto;
  background: #0e2431;
  color: #ffffff;
}

.btn-code:hover {
  background: #334155;
}

.btn-details {
  background: #eef2ff;
  color: #2506ad;
}

.btn-details:hover {
  background: #e0e7ff;
}

.project-thumb,
.project-title {
  cursor: pointer;
}

.no-data {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(15, 23, 42, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2000;
  padding: 1.5rem;
}

.modal-card {
  position: relative;
  background: #ffffff;
  border-radius: 18px;
  max-width: 720px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
  overflow-x: hidden;
  box-shadow: 0 24px 48px rgba(0, 0, 0, 0.25);
}

.modal-close {
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 2;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(15, 23, 42, 0.78);
  border: 1.5px solid rgba(255, 255, 255, 0.25);
  color: #ffffff;
  font-weight: 700;
}

.modal-thumb {
  width: 100%;
  max-height: 460px;
  background: #0f172a;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.modal-thumb img {
  width: 100%;
  max-height: 460px;
  height: auto;
  object-fit: contain;
  display: block;
}

.modal-body {
  padding: 1.75rem;
}

.modal-body h3 {
  font-size: 1.5rem;
  font-weight: 800;
  color: #0e2431;
  margin-bottom: 0.75rem;
}

.modal-desc {
  color: #475569;
  font-size: 0.96rem;
  line-height: 1.7;
  margin-bottom: 1.25rem;
  white-space: pre-wrap;
}
</style>
