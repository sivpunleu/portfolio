<template>
  <section id="home" class="hero-section">
    <!-- Interactive Canvas Particles Background -->
    <ParticlesBackground />

    <div class="container hero-container">
      <div class="hero-content">
        <!-- Left Column: Hero Text & Actions -->
        <div class="hero-text">
          <h3>Hi There,</h3>
          <h1>
            I'm <span class="first-name">{{ firstName }}</span>
            <span class="last-name"> {{ lastName }}</span>
          </h1>

          <div class="hero-typed">
            <span>I Am Into </span>
            <TypewriterText :words="typewriterWords" />
          </div>

          <div class="hero-actions">
            <a href="#about" class="btn btn-hero">
              <span>About Me</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19"></line>
                <polyline points="19 12 12 19 5 12"></polyline>
              </svg>
            </a>
          </div>

          <!-- Social Links Row -->
          <div class="hero-socials">
            <a
              v-if="profile?.linkedin_url"
              :href="profile.linkedin_url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn linkedin"
              title="LinkedIn"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>

            <a
              v-if="profile?.github_url"
              :href="profile.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn github"
              title="GitHub"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>

            <a
              v-if="profile?.twitter_url"
              :href="profile.twitter_url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-btn twitter"
              title="Twitter"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
              </svg>
            </a>

            <a
              v-if="profile?.email"
              :href="'mailto:' + profile.email"
              class="social-btn email"
              title="Email"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>

            <a
              v-if="profile?.phone"
              :href="'tel:' + profile.phone"
              class="social-btn phone"
              title="Phone"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </a>
          </div>
        </div>

        <!-- Right Column: Avatar Circle with developer illustration or photo -->
        <div class="hero-avatar-wrapper">
          <div class="avatar-circle" :class="{ 'has-photo': hasCustomAvatar }">
            <img
              :src="heroAvatarUrl"
              alt="Developer Avatar"
              class="avatar-character"
              :class="{ 'is-photo': hasCustomAvatar }"
            />
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from "vue";
import ParticlesBackground from "./ParticlesBackground.vue";
import TypewriterText from "./TypewriterText.vue";
import { DEFAULT_HERO_AVATAR, resolveAssetUrl } from "../utils/helpers";

const props = defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const fullName = computed(() => props.profile?.full_name || "Siv Punleu");

const firstName = computed(() => {
  const parts = fullName.value.split(" ");
  return parts.length > 1 ? parts[0] : fullName.value;
});

const lastName = computed(() => {
  const parts = fullName.value.split(" ");
  return parts.length > 1 ? parts.slice(1).join(" ") : "";
});

const heroAvatarUrl = computed(() => {
  return resolveAssetUrl(props.profile?.avatar_url, DEFAULT_HERO_AVATAR);
});

const hasCustomAvatar = computed(
  () => heroAvatarUrl.value !== DEFAULT_HERO_AVATAR,
);

const typewriterWords = computed(() => {
  const defaults = [
    "Full-Stack Development",
    "Vue.js & Node.js",
    "MySQL & RESTful APIs",
    "Modern Web Applications",
  ];
  const customTitle = props.profile?.title?.trim();
  if (!customTitle) return defaults;
  return [
    customTitle,
    ...defaults.filter((w) => w.toLowerCase() !== customTitle.toLowerCase()),
  ];
});
</script>

<style scoped>
.hero-section {
  min-height: 100vh;
  position: relative;
  display: flex;
  align-items: center;
  padding-top: 74px;
  background: #ffffff;
  overflow: hidden;
}

.hero-container {
  position: relative;
  z-index: 10;
  width: 100%;
}

.hero-content {
  display: grid;
  grid-template-columns: 1.2fr 0.8fr;
  align-items: center;
  gap: 3rem;
  padding: 3rem 0;
}

.hero-text h3 {
  font-size: 2.2rem;
  font-weight: 700;
  color: #0e2431;
  margin-bottom: 0.2rem;
}

.hero-text h1 {
  font-size: 3.6rem;
  font-weight: 800;
  color: #0e2431;
  line-height: 1.15;
  margin-bottom: 0.8rem;
}

.first-name {
  color: #0e2431;
}

.last-name {
  color: #ff7b00;
}

.hero-typed {
  font-size: 1.6rem;
  font-weight: 600;
  color: #0e2431;
  margin-bottom: 2.2rem;
  display: flex;
  align-items: center;
  gap: 0.6rem;
  min-height: 2.4rem;
}

.btn-hero {
  background: #2506ad;
  color: #ffffff;
  padding: 0.85rem 2.2rem;
  border-radius: 9999px;
  font-weight: 600;
  font-size: 1rem;
  display: inline-flex;
  align-items: center;
  gap: 0.6rem;
  box-shadow: 0 6px 20px rgba(37, 6, 173, 0.3);
  transition: all 0.3s ease;
}

.btn-hero:hover {
  background: #ff7b00;
  transform: translateY(-3px);
  box-shadow: 0 10px 25px rgba(255, 123, 0, 0.35);
}

.hero-actions {
  margin-bottom: 2rem;
}

.hero-socials {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.social-btn {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #0e2431;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.social-btn:hover {
  background: #ff7b00;
  transform: translateY(-4px) scale(1.1);
  box-shadow: 0 8px 20px rgba(255, 123, 0, 0.35);
}

.hero-avatar-wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.avatar-circle {
  width: 360px;
  height: 360px;
  border-radius: 50%;
  background: #ffae00;
  background: radial-gradient(circle, #facc15 0%, #f59e0b 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  box-shadow: 0 20px 50px rgba(245, 158, 11, 0.35);
  position: relative;
  transition: transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.avatar-circle.has-photo {
  padding: 8px;
}

.avatar-circle:hover {
  transform: scale(1.04) rotate(1deg);
}

.avatar-character {
  width: 80%;
  height: 80%;
  object-fit: contain;
  filter: drop-shadow(0 15px 25px rgba(0, 0, 0, 0.15));
}

.avatar-character.is-photo {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  object-position: center 20%;
  filter: none;
}

@media (max-width: 992px) {
  .hero-content {
    grid-template-columns: 1fr;
    text-align: center;
    gap: 2rem;
  }
  .hero-typed,
  .hero-actions,
  .hero-socials {
    justify-content: center;
  }
  .avatar-circle {
    width: 280px;
    height: 280px;
  }
}

@media (max-width: 600px) {
  .hero-text h1 {
    font-size: 2.6rem;
  }
  .hero-typed {
    font-size: 1.25rem;
  }
}
</style>
