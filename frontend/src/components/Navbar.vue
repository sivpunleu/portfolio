<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="container nav-container">
      <a href="#home" class="nav-brand">
        <span class="brand-code">&lt;</span>
        <span class="brand-name">{{ brandName }}</span>
        <span class="brand-code">/&gt;</span>
      </a>

      <!-- Desktop Menu -->
      <ul class="nav-menu">
        <li v-for="item in navItems" :key="item.id">
          <a
            :href="'#' + item.id"
            class="nav-link"
            :class="{ active: activeSection === item.id }"
          >
            {{ item.label }}
          </a>
        </li>
        <li>
          <a
            href="#contact"
            class="nav-cta"
            :class="{ active: activeSection === 'contact' }"
          >
            Contact
          </a>
        </li>
      </ul>

      <!-- Mobile Hamburger Button -->
      <button
        class="mobile-toggle"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
        aria-label="Toggle Menu"
        :aria-expanded="isMobileMenuOpen"
      >
        <span class="bar" :class="{ open: isMobileMenuOpen }"></span>
        <span class="bar" :class="{ open: isMobileMenuOpen }"></span>
        <span class="bar" :class="{ open: isMobileMenuOpen }"></span>
      </button>
    </div>

    <!-- Mobile Drawer -->
    <div class="mobile-drawer" :class="{ open: isMobileMenuOpen }">
      <ul class="mobile-menu">
        <li v-for="item in allNavItems" :key="item.id">
          <a
            :href="'#' + item.id"
            :class="{ active: activeSection === item.id }"
            @click="closeMobileMenu"
          >
            {{ item.label }}
          </a>
        </li>
      </ul>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { usePortfolioStore } from "../stores/portfolio";

const portfolioStore = usePortfolioStore();

const brandName = computed(() => {
  return portfolioStore.profile?.full_name || "Siv Punleu";
});

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Work" },
];

const allNavItems = [...navItems, { id: "contact", label: "Contact" }];

const isScrolled = ref(false);
const isMobileMenuOpen = ref(false);
const activeSection = ref("home");

const handleScroll = () => {
  isScrolled.value = window.scrollY > 40;

  if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 20) {
    activeSection.value = "contact";
    return;
  }

  const sections = ["home", "about", "skills", "education", "projects", "contact"];
  const scrollPos = window.scrollY + 200;

  for (const sec of sections) {
    const el = document.getElementById(sec);
    if (el) {
      const top = el.offsetTop;
      const height = el.offsetHeight;
      if (scrollPos >= top && scrollPos < top + height) {
        activeSection.value = sec;
        break;
      }
    }
  }
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style scoped>
.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 74px;
  background: rgba(255, 255, 255, 0.86);
  backdrop-filter: blur(14px);
  border-bottom: 1px solid rgba(226, 232, 240, 0.7);
  z-index: 1000;
  transition: all 0.3s ease;
}

.navbar.scrolled {
  background: rgba(255, 255, 255, 0.96);
  box-shadow: 0 8px 28px rgba(14, 36, 49, 0.08);
}

.nav-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
}

.nav-brand {
  font-size: 1.35rem;
  font-weight: 800;
  color: #0e2431;
  display: flex;
  align-items: center;
  gap: 3px;
}

.brand-code {
  color: #ff7b00;
  font-family: "Fira Code", monospace;
  font-weight: 700;
}

.brand-name {
  color: #0e2431;
  margin: 0 2px;
}

.nav-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  list-style: none;
}

.nav-link {
  font-size: 0.92rem;
  font-weight: 600;
  color: #334155;
  padding: 0.5rem 0.95rem;
  border-radius: 9999px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  color: #2506ad;
  background: rgba(37, 6, 173, 0.06);
}

.nav-link.active {
  color: #2506ad;
  background: #eef2ff;
}

.nav-cta {
  margin-left: 0.5rem;
  padding: 0.52rem 1.25rem;
  border-radius: 9999px;
  font-size: 0.92rem;
  font-weight: 600;
  background: #2506ad;
  color: #ffffff;
  box-shadow: 0 4px 12px rgba(37, 6, 173, 0.22);
  transition: all 0.2s ease;
}

.nav-cta:hover,
.nav-cta.active {
  background: #ff7b00;
  box-shadow: 0 6px 16px rgba(255, 123, 0, 0.28);
  transform: translateY(-1px);
}

/* Mobile Toggle */
.mobile-toggle {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 6px;
}

.bar {
  width: 24px;
  height: 2.5px;
  background: #0e2431;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.bar.open:nth-child(1) {
  transform: translateY(7.5px) rotate(45deg);
}

.bar.open:nth-child(2) {
  opacity: 0;
}

.bar.open:nth-child(3) {
  transform: translateY(-7.5px) rotate(-45deg);
}

.mobile-drawer {
  display: none;
  position: fixed;
  top: 74px;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.98);
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.1);
  padding: 1.25rem 1.5rem;
  transform: translateY(-120%);
  visibility: hidden;
  pointer-events: none;
  transition: transform 0.3s ease, visibility 0.3s ease;
}

.mobile-drawer.open {
  transform: translateY(0);
  visibility: visible;
  pointer-events: auto;
}

.mobile-menu {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.mobile-menu a {
  display: block;
  padding: 0.65rem 1rem;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: 600;
  color: #0e2431;
  transition: all 0.2s ease;
}

.mobile-menu a:hover,
.mobile-menu a.active {
  color: #2506ad;
  background: #eef2ff;
}

@media (max-width: 868px) {
  .nav-menu {
    display: none;
  }
  .mobile-toggle {
    display: flex;
  }
  .mobile-drawer {
    display: block;
  }
}
</style>
