<template>
  <section id="education" class="section section-bg">
    <div class="container">
      <div class="section-header">
        <h2 class="section-title">My <span>Education</span></h2>
        <div class="title-underline"></div>
        <p class="section-subtitle">
          Education is not the learning of facts, but the training of the mind to think.
        </p>
      </div>

      <div class="education-timeline">
        <div class="timeline-line"></div>

        <div v-for="edu in education" :key="edu.id" class="timeline-item">
          <div class="timeline-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M22 10v6M2 10l10-5 10 5-10 5z"></path>
              <path d="M6 12v5c3 3 9 3 12 0v-5"></path>
            </svg>
          </div>

          <div class="timeline-card">
            <div class="card-header">
              <h3 class="school-name">{{ edu.school_name }}</h3>
              <span class="edu-date">{{ formatDateRange(edu.start_date, edu.end_date) }}</span>
            </div>

            <h4 class="degree-title">
              {{ edu.degree }}
              <span v-if="edu.field_of_study"> - {{ edu.field_of_study }}</span>
            </h4>

            <span v-if="edu.grade" class="grade-badge">{{ edu.grade }}</span>

            <p v-if="edu.description" class="edu-desc">{{ edu.description }}</p>
          </div>
        </div>

        <div v-if="education.length === 0" class="no-data">
          No education history recorded yet.
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { formatDisplayDate } from "../utils/helpers";

defineProps({
  education: {
    type: Array,
    default: () => [],
  },
});

const formatDateRange = (start, end) => {
  return `${formatDisplayDate(start)} - ${formatDisplayDate(end)}`;
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
  font-style: italic;
}

.education-timeline {
  position: relative;
  max-width: 800px;
  margin: 0 auto;
}

.timeline-line {
  position: absolute;
  top: 10px;
  bottom: 10px;
  left: 20px;
  width: 3px;
  background: #cbd5e1;
}

.timeline-item {
  position: relative;
  padding-left: 56px;
  margin-bottom: 2.5rem;
}

.timeline-icon {
  position: absolute;
  left: 2px;
  top: 0;
  width: 38px;
  height: 38px;
  border-radius: 50%;
  background: #2506ad;
  color: #ffffff;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(37, 6, 173, 0.3);
  z-index: 2;
}

.timeline-card {
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 14px;
  padding: 1.5rem 1.75rem;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  transition: all 0.25s ease;
}

.timeline-card:hover {
  transform: translateX(6px);
  border-color: #2506ad;
  box-shadow: 0 10px 25px rgba(37, 6, 173, 0.1);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.school-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: #0e2431;
}

.edu-date {
  font-size: 0.85rem;
  font-weight: 600;
  color: #ff7b00;
  background: #fff7ed;
  padding: 0.2rem 0.6rem;
  border-radius: 9999px;
}

.degree-title {
  font-size: 1rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.6rem;
}

.grade-badge {
  display: inline-block;
  font-size: 0.8rem;
  font-weight: 600;
  color: #2506ad;
  background: #eef2ff;
  padding: 0.2rem 0.6rem;
  border-radius: 6px;
  margin-bottom: 0.6rem;
}

.edu-desc {
  font-size: 0.92rem;
  color: #64748b;
  line-height: 1.6;
}

.no-data {
  text-align: center;
  color: #94a3b8;
  padding: 2rem;
}
</style>
