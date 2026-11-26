<template>
  <section id="skills" class="section">
    <div class="container text-center">
      <!-- Section Header Banner (matching screenshot) -->
      <div class="banner-wrapper">
        <div class="skills-banner">
          <span class="banner-icon">💻</span>
          <span>Skills &amp; Abilities</span>
        </div>
      </div>

      <!-- Category Filter Pills -->
      <div class="category-filters">
        <button
          v-for="cat in categories"
          :key="cat"
          class="cat-btn"
          :class="{ active: selectedCategory === cat }"
          @click="selectedCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Skills Grid with 3D Tilt Hover Effect -->
      <div class="skills-grid">
        <div
          v-for="skill in filteredSkills"
          :key="skill.id"
          class="skill-card-tilt"
          @mousemove="handleTilt($event)"
          @mouseleave="resetTilt($event)"
        >
          <div class="skill-icon-box">
            <img
              v-if="isImageUrl(skill.icon_url)"
              :src="resolveAssetUrl(skill.icon_url)"
              :alt="skill.name"
              class="skill-icon-img"
            />
            <span v-else class="tech-emoji">{{ getTechIcon(skill.icon_url || skill.name, skill.name) }}</span>
          </div>
          <h4 class="skill-title">{{ skill.name }}</h4>
          <span class="skill-cat-tag">{{ skill.category }}</span>
          <div
            v-if="skill.proficiency_percent !== null && skill.proficiency_percent !== undefined"
            class="proficiency-bar"
            :title="`${skill.proficiency_percent}%`"
          >
            <div class="bar-fill" :style="{ width: skill.proficiency_percent + '%' }"></div>
          </div>
        </div>
      </div>

      <div v-if="filteredSkills.length === 0" class="no-data">
        No skills recorded in this category yet.
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from "vue";
import { resolveAssetUrl } from "../utils/helpers";

const props = defineProps({
  skills: {
    type: Array,
    default: () => [],
  },
});

const selectedCategory = ref("All");

const categories = computed(() => {
  const cats = new Set(props.skills.map((s) => s.category).filter(Boolean));
  return ["All", ...Array.from(cats)];
});

const filteredSkills = computed(() => {
  if (selectedCategory.value === "All") return props.skills;
  return props.skills.filter((s) => s.category === selectedCategory.value);
});

// Interactive 3D Tilt Effect on mouse movement
const handleTilt = (e) => {
  const card = e.currentTarget;
  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const centerX = rect.width / 2;
  const centerY = rect.height / 2;

  const rotateX = ((y - centerY) / centerY) * -12;
  const rotateY = ((x - centerX) / centerX) * 12;

  card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`;
};

const resetTilt = (e) => {
  const card = e.currentTarget;
  card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)";
};

const isImageUrl = (val) =>
  Boolean(val && (/^(https?:|data:|\/uploads\/)/i.test(val.trim())));

const getTechIcon = (iconKey, fallbackName = "") => {
  const map = {
    "vuejs": "💚",
    "vue.js": "💚",
    "nodedotjs": "🟢",
    "node.js": "🟢",
    "express": "⚡",
    "express.js": "⚡",
    "mysql": "🐬",
    "javascript": "🟨",
    "javascript (es6+)": "🟨",
    "html5": "🌐",
    "html5 & css3": "🎨",
    "html": "🌐",
    "css": "🎨",
    "css3": "🎨",
    "git": "🐙",
    "git & github": "🐙",
    "docker": "🐳",
    "postman": "🚀",
    "fastapi": "🔗",
    "restful apis": "🔗",
  };
  const primary = String(iconKey || "").toLowerCase().trim();
  const secondary = String(fallbackName || "").toLowerCase().trim();
  return map[primary] || map[secondary] || "💻";
};
</script>

<style scoped>
.text-center {
  text-align: center;
}

.banner-wrapper {
  display: flex;
  justify-content: center;
  margin-bottom: 2rem;
}

.skills-banner {
  background: #2506ad;
  color: #ffffff;
  padding: 0.85rem 2.5rem;
  border-radius: 12px;
  display: inline-flex;
  align-items: center;
  gap: 0.8rem;
  font-size: 1.6rem;
  font-weight: 800;
  box-shadow: 0 10px 25px rgba(37, 6, 173, 0.35);
  letter-spacing: 0.5px;
}

.banner-icon {
  font-size: 1.8rem;
}

.category-filters {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 0.6rem;
  margin-bottom: 2.5rem;
}

.cat-btn {
  padding: 0.5rem 1.25rem;
  border-radius: 9999px;
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  color: #0e2431;
  font-weight: 600;
  font-size: 0.9rem;
  transition: all 0.2s ease;
  cursor: pointer;
}

.cat-btn:hover,
.cat-btn.active {
  background: #2506ad;
  border-color: #2506ad;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 6, 173, 0.2);
}

.skills-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 1.5rem;
  perspective: 1000px;
}

.skill-card-tilt {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  transition: transform 0.15s ease-out, box-shadow 0.25s ease, border-color 0.25s ease;
  cursor: pointer;
  will-change: transform;
}

.skill-card-tilt:hover {
  border-color: #2506ad;
  box-shadow: 0 15px 30px rgba(37, 6, 173, 0.15);
}

.skill-icon-box {
  width: 58px;
  height: 58px;
  border-radius: 14px;
  background: #f8fafc;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.3rem;
  box-shadow: inset 0 2px 4px rgba(0, 0, 0, 0.04);
}

.tech-emoji {
  font-size: 2.2rem;
}

.skill-icon-img {
  width: 38px;
  height: 38px;
  object-fit: contain;
}

.no-data {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}

.skill-title {
  font-size: 1rem;
  font-weight: 700;
  color: #0e2431;
  margin: 0;
}

.skill-cat-tag {
  font-size: 0.75rem;
  font-weight: 600;
  color: #2506ad;
  background: #eef2ff;
  padding: 0.15rem 0.55rem;
  border-radius: 9999px;
}

.proficiency-bar {
  width: 100%;
  height: 5px;
  background: #f1f5f9;
  border-radius: 9999px;
  overflow: hidden;
  margin-top: 0.4rem;
}

.bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #2506ad, #ff7b00);
  border-radius: 9999px;
  transition: width 0.6s ease;
}
</style>
