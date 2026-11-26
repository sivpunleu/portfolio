<template>
  <section id="about" class="section section-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">About <span>Me</span></h2>
        <div class="title-underline"></div>
      </div>

      <div class="about-grid">
        <!-- Left Column: Portrait Avatar -->
        <div class="about-image-wrapper">
          <div class="image-frame">
            <img
              :src="aboutAvatarUrl"
              alt="Developer Profile"
              class="about-img"
            />
          </div>
        </div>

        <!-- Right Column: Bio & Details -->
        <div class="about-details">
          <h3>I'm {{ profile?.full_name || 'Siv Punleu' }}</h3>
          <span class="about-role">{{ profile?.title || 'Full Stack Developer' }}</span>

          <p class="about-bio">
            {{ profile?.bio || 'I am a passionate Full Stack Developer specializing in Vue.js, Node.js, Express, and MySQL. I craft high-performance, responsive web applications with clean code architecture and seamless user experiences.' }}
          </p>

          <div class="info-list">
            <div class="info-item" v-if="profile?.email">
              <span class="info-label">Email:</span>
              <a :href="'mailto:' + profile.email" class="info-value info-link">{{ profile.email }}</a>
            </div>

            <div class="info-item" v-if="profile?.phone">
              <span class="info-label">Phone:</span>
              <a :href="'tel:' + profile.phone" class="info-value info-link">{{ profile.phone }}</a>
            </div>

            <div class="info-item" v-if="profile?.location">
              <span class="info-label">Location:</span>
              <span class="info-value">{{ profile.location }}</span>
            </div>
          </div>

          <div class="about-actions">
            <a
              v-if="resumeUrl"
              :href="resumeUrl"
              target="_blank"
              rel="noopener noreferrer"
              class="btn btn-primary"
            >
              <span>Resume</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
              </svg>
            </a>

            <a href="#contact" class="btn btn-outline">
              <span>Contact Me</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import { DEFAULT_PORTRAIT_AVATAR, resolveAssetUrl } from "../utils/helpers";

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const aboutAvatarUrl = computed(() =>
  resolveAssetUrl(props.profile?.avatar_url, DEFAULT_PORTRAIT_AVATAR),
);

const resumeUrl = computed(() =>
  resolveAssetUrl(props.profile?.resume_url, ""),
);
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
  margin: 0.5rem auto 0;
}

.about-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 3.5rem;
  align-items: center;
}

.about-image-wrapper {
  display: flex;
  justify-content: center;
}

.image-frame {
  width: min(100%, 320px);
  max-width: 100%;
  aspect-ratio: 320 / 380;
  border-radius: 20px;
  overflow: hidden;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.12);
  border: 4px solid #ffffff;
  transition: transform 0.3s ease;
}

.image-frame:hover {
  transform: translateY(-5px);
}

.about-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 20%;
}

.about-details h3 {
  font-size: 2rem;
  font-weight: 700;
  color: #0e2431;
  margin-bottom: 0.25rem;
}

.about-role {
  display: inline-block;
  font-size: 1.15rem;
  font-weight: 600;
  color: #ff7b00;
  margin-bottom: 1.25rem;
}

.about-bio {
  color: #475569;
  font-size: 1rem;
  line-height: 1.8;
  margin-bottom: 1.5rem;
}

.info-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
  background: #ffffff;
  padding: 1.25rem;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.info-item {
  display: flex;
  flex-direction: column;
}

.info-label {
  font-size: 0.8rem;
  color: #64748b;
  font-weight: 600;
  text-transform: uppercase;
}

.info-value {
  font-size: 0.95rem;
  color: #0e2431;
  font-weight: 600;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.info-link:hover {
  color: #ff7b00;
}

.about-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

@media (max-width: 900px) {
  .about-grid {
    grid-template-columns: 1fr;
    text-align: center;
  }
  .info-list {
    text-align: left;
  }
  .about-actions {
    justify-content: center;
  }
}
</style>
