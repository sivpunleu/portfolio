<template>
  <section id="contact" class="section section-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">Get In <span>Touch</span></h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">
          Have a project in mind or want to collaborate? Send me a message and I'll get back to you promptly!
        </p>
      </div>

      <div class="contact-grid">
        <!-- Left Column: Contact Information Cards -->
        <div class="contact-info-col">
          <div class="info-card">
            <div class="info-icon email">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </div>
            <div>
              <h4>Email</h4>
              <a :href="'mailto:' + (profile?.email || 'sivpunleu174.email@gmail.com')">
                {{ profile?.email || 'sivpunleu174.email@gmail.com' }}
              </a>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon phone">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
              </svg>
            </div>
            <div>
              <h4>Phone</h4>
              <a :href="'tel:' + (profile?.phone || '0969596217')">
                {{ profile?.phone || '0969596217' }}
              </a>
            </div>
          </div>

          <div class="info-card">
            <div class="info-icon location">
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                <circle cx="12" cy="10" r="3"></circle>
              </svg>
            </div>
            <div>
              <h4>Location</h4>
              <p>{{ profile?.location || 'Phnom Penh, Cambodia' }}</p>
            </div>
          </div>
        </div>

        <!-- Right Column: Interactive Form -->
        <div class="contact-form-col">
          <form @submit.prevent="handleSubmit" class="contact-form">
            <!-- Success Alert Message -->
            <div v-if="successMessage" class="alert alert-success">
              <span>✅ {{ successMessage }}</span>
            </div>

            <!-- Error Alert Message -->
            <div v-if="errorMessage" class="alert alert-error">
              <span>❌ {{ errorMessage }}</span>
            </div>

            <div class="form-group">
              <label class="form-label" for="sender_name">Your Name</label>
              <input
                id="sender_name"
                v-model="form.sender_name"
                type="text"
                class="form-input"
                placeholder="e.g. John Doe"
                minlength="2"
                maxlength="100"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="sender_email">Your Email</label>
              <input
                id="sender_email"
                v-model="form.sender_email"
                type="email"
                class="form-input"
                placeholder="e.g. john@example.com"
                maxlength="100"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="subject">Subject</label>
              <input
                id="subject"
                v-model="form.subject"
                type="text"
                class="form-input"
                placeholder="e.g. Full-Stack Project Inquiry"
                minlength="3"
                maxlength="200"
                required
              />
            </div>

            <div class="form-group">
              <label class="form-label" for="message">Your Message</label>
              <textarea
                id="message"
                v-model="form.message"
                class="form-textarea"
                placeholder="Describe your project, timeline, or question here..."
                minlength="10"
                maxlength="3000"
                required
              ></textarea>
            </div>

            <button type="submit" class="btn btn-submit" :disabled="isSubmitting">
              <span v-if="!isSubmitting">Send Message</span>
              <span v-else>Sending...</span>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                <line x1="22" y1="2" x2="11" y2="13"></line>
                <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
              </svg>
            </button>
          </form>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { reactive, ref } from "vue";
import { usePortfolioStore } from "../stores/portfolio";
import { extractErrorMessage } from "../utils/helpers";

defineProps({
  profile: {
    type: Object,
    default: () => ({}),
  },
});

const portfolioStore = usePortfolioStore();

const form = reactive({
  sender_name: "",
  sender_email: "",
  subject: "",
  message: "",
});

const isSubmitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");

const handleSubmit = async () => {
  isSubmitting.value = true;
  successMessage.value = "";
  errorMessage.value = "";

  try {
    const res = await portfolioStore.sendContactMessage(form);
    successMessage.value =
      res.message || "Thank you! Your message has been sent successfully.";

    // Reset Form
    form.sender_name = "";
    form.sender_email = "";
    form.subject = "";
    form.message = "";

    setTimeout(() => {
      successMessage.value = "";
    }, 6000);
  } catch (err) {
    errorMessage.value = extractErrorMessage(
      err,
      "Failed to send message. Please try again later.",
    );
  } finally {
    isSubmitting.value = false;
  }
};
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
  max-width: 600px;
  margin: 0 auto;
}

.contact-grid {
  display: grid;
  grid-template-columns: 0.9fr 1.1fr;
  gap: 3rem;
  align-items: start;
}

.contact-info-col {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.info-card {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 16px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.04);
  transition: all 0.25s ease;
}

.info-card:hover {
  transform: translateX(6px);
  border-color: #2506ad;
  box-shadow: 0 8px 25px rgba(37, 6, 173, 0.1);
}

.info-icon {
  width: 52px;
  height: 52px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.info-icon.email {
  background: #eff6ff;
  color: #2563eb;
}

.info-icon.phone {
  background: #f0fdf4;
  color: #16a34a;
}

.info-icon.location {
  background: #fff7ed;
  color: #ea580c;
}

.info-card h4 {
  font-size: 0.85rem;
  text-transform: uppercase;
  color: #64748b;
  margin-bottom: 0.2rem;
  font-weight: 700;
}

.info-card a,
.info-card p {
  font-size: 1rem;
  font-weight: 600;
  color: #0e2431;
  overflow-wrap: anywhere;
  word-break: break-word;
}

.info-card a:hover {
  color: #ff7b00;
}

.contact-form {
  background: #ffffff;
  border: 1.5px solid #e2e8f0;
  border-radius: 20px;
  padding: 2.5rem;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.06);
}

.btn-submit {
  width: 100%;
  background: #2506ad;
  color: #ffffff;
  padding: 0.9rem;
  border-radius: 9999px;
  font-size: 1rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.6rem;
  box-shadow: 0 6px 20px rgba(37, 6, 173, 0.3);
  transition: all 0.25s ease;
}

.btn-submit:hover:not(:disabled) {
  background: #ff7b00;
  transform: translateY(-2px);
  box-shadow: 0 10px 25px rgba(255, 123, 0, 0.35);
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

@media (max-width: 868px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
}
</style>
