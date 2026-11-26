<template>
  <footer class="footer">
    <div class="footer-accent-line"></div>
    <div class="container footer-container">
      <div class="footer-top">
        <!-- Brand & Socials -->
        <div class="footer-brand">
          <a href="#home" class="footer-logo">
            <span class="brand-code">&lt;</span>
            <span>{{ profile?.full_name || "Siv Punleu" }}</span>
            <span class="brand-code">/&gt;</span>
          </a>
          <p class="footer-tagline">
            Thank you for visiting my personal portfolio website. Connect with me over socials or send a message anytime.
          </p>

          <div class="footer-socials">
            <a
              v-if="profile?.github_url"
              :href="profile.github_url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-pill"
              title="GitHub"
              aria-label="GitHub"
            >
              <Github :size="18" />
            </a>
            <a
              v-if="profile?.linkedin_url"
              :href="profile.linkedin_url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-pill"
              title="LinkedIn"
              aria-label="LinkedIn"
            >
              <Linkedin :size="18" />
            </a>
            <a
              v-if="profile?.twitter_url"
              :href="profile.twitter_url"
              target="_blank"
              rel="noopener noreferrer"
              class="social-pill"
              title="Twitter"
              aria-label="Twitter"
            >
              <Twitter :size="18" />
            </a>
            <a
              :href="'mailto:' + (profile?.email || 'sivpunleu174.email@gmail.com')"
              class="social-pill"
              title="Email"
              aria-label="Email"
            >
              <Mail :size="18" />
            </a>
          </div>
        </div>

        <!-- Quick Links (2-column compact grid) -->
        <div class="footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li v-for="item in navLinks" :key="item.id">
              <a :href="'#' + item.id">
                <ChevronRight :size="15" class="link-arrow" />
                <span>{{ item.label }}</span>
              </a>
            </li>
          </ul>
        </div>

        <!-- Contact Info with Icons -->
        <div class="footer-contact">
          <h4>Contact Info</h4>
          <div class="contact-list">
            <a :href="'tel:' + (profile?.phone || '+855969596217')" class="contact-item">
              <span class="contact-icon"><Phone :size="15" /></span>
              <span>{{ profile?.phone || "+855 96 959 6217" }}</span>
            </a>

            <a :href="'mailto:' + (profile?.email || 'sivpunleu174.email@gmail.com')" class="contact-item">
              <span class="contact-icon"><Mail :size="15" /></span>
              <span>{{ profile?.email || "sivpunleu174.email@gmail.com" }}</span>
            </a>

            <div class="contact-item">
              <span class="contact-icon"><MapPin :size="15" /></span>
              <span>{{ profile?.location || "Phnom Penh, Cambodia" }}</span>
            </div>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>
          © {{ currentYear }}
          <span class="author-name">{{ profile?.full_name || "Siv Punleu" }}</span>.
          Built with ❤️ using Vue.js &amp; Node.js
        </p>

        <a href="#home" class="back-top-btn" aria-label="Back to top">
          <span>Top</span>
          <ArrowUp :size="15" />
        </a>
      </div>
    </div>
  </footer>
</template>

<script setup>
import {
  ArrowUp,
  ChevronRight,
  Github,
  Linkedin,
  Mail,
  MapPin,
  Phone,
  Twitter,
} from "lucide-vue-next";

defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const currentYear = new Date().getFullYear();

const navLinks = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "education", label: "Education" },
  { id: "projects", label: "Work" },
  { id: "contact", label: "Contact" },
];
</script>

<style scoped>
.footer {
  position: relative;
  background: linear-gradient(180deg, #070b24 0%, #030516 100%);
  color: #ffffff;
  padding: 4rem 0 2rem;
}

.footer-accent-line {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 3px;
  background: linear-gradient(90deg, #2506ad 0%, #ff7b00 50%, #2506ad 100%);
}

.footer-top {
  display: grid;
  grid-template-columns: 1.4fr 1fr 1.1fr;
  gap: 3rem;
  margin-bottom: 2.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  padding-bottom: 2.5rem;
}

.footer-logo {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  margin-bottom: 0.85rem;
}

.brand-code {
  color: #ff7b00;
  font-family: "Fira Code", monospace;
}

.footer-tagline {
  color: #94a3b8;
  font-size: 0.92rem;
  line-height: 1.7;
  max-width: 360px;
  margin-bottom: 1.35rem;
}

.footer-socials {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.social-pill {
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #e2e8f0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
}

.social-pill:hover {
  background: #ff7b00;
  border-color: #ff7b00;
  color: #ffffff;
  transform: translateY(-3px);
}

.footer-links h4,
.footer-contact h4 {
  font-size: 1.1rem;
  font-weight: 700;
  margin-bottom: 1.25rem;
  color: #ffffff;
  position: relative;
  padding-bottom: 0.5rem;
}

.footer-links h4::after,
.footer-contact h4::after {
  content: "";
  position: absolute;
  left: 0;
  bottom: 0;
  width: 34px;
  height: 3px;
  border-radius: 9999px;
  background: #ff7b00;
}

.footer-links ul {
  list-style: none;
  display: grid;
  grid-template-columns: repeat(2, minmax(110px, 1fr));
  gap: 0.75rem 1.25rem;
}

.footer-links a {
  color: #94a3b8;
  font-size: 0.92rem;
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  transition: all 0.2s ease;
}

.link-arrow {
  color: #ff7b00;
  transition: transform 0.2s ease;
}

.footer-links a:hover {
  color: #ffffff;
}

.footer-links a:hover .link-arrow {
  transform: translateX(3px);
}

.contact-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.contact-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  color: #cbd5e1;
  font-size: 0.92rem;
  overflow-wrap: anywhere;
  transition: color 0.2s ease;
}

a.contact-item:hover {
  color: #ff7b00;
}

.contact-icon {
  width: 32px;
  height: 32px;
  flex-shrink: 0;
  border-radius: 8px;
  background: rgba(255, 123, 0, 0.14);
  color: #ff7b00;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.footer-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.author-name {
  color: #ff7b00;
  font-weight: 600;
}

.back-top-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  padding: 0.45rem 0.9rem;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.14);
  color: #e2e8f0;
  font-size: 0.82rem;
  font-weight: 600;
  transition: all 0.2s ease;
}

.back-top-btn:hover {
  background: #ff7b00;
  border-color: #ff7b00;
  color: #ffffff;
  transform: translateY(-2px);
}

@media (max-width: 868px) {
  .footer-top {
    grid-template-columns: 1fr;
    gap: 2.25rem;
  }

  .footer-bottom {
    flex-direction: column;
    text-align: center;
  }
}
</style>
