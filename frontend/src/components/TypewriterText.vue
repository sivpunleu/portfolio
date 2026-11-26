<template>
  <span class="typewriter-container">
    <span class="typed-text">{{ currentText }}</span>
    <span class="cursor" :class="{ blinking: isWaiting }">|</span>
  </span>
</template>

<script setup>
import { onMounted, onUnmounted, ref, watch } from "vue";

const props = defineProps({
  words: {
    type: Array,
    default: () => [
      "Web Development",
      "Full-Stack Development",
      "Vue.js & Node.js",
      "MySQL & REST APIs",
    ],
  },
  typingSpeed: {
    type: Number,
    default: 100,
  },
  deletingSpeed: {
    type: Number,
    default: 50,
  },
  delayBetweenWords: {
    type: Number,
    default: 1800,
  },
});

const currentText = ref("");
const wordIndex = ref(0);
const isDeleting = ref(false);
const isWaiting = ref(false);
let timer = null;

const type = () => {
  if (!props.words || props.words.length === 0) return;

  if (wordIndex.value >= props.words.length) {
    wordIndex.value = 0;
  }
  const currentWord = String(props.words[wordIndex.value] || "");

  if (isDeleting.value) {
    currentText.value = currentWord.substring(0, currentText.value.length - 1);
  } else {
    currentText.value = currentWord.substring(0, currentText.value.length + 1);
  }

  let timeout = isDeleting.value ? props.deletingSpeed : props.typingSpeed;

  if (!isDeleting.value && currentText.value === currentWord) {
    isWaiting.value = true;
    timeout = props.delayBetweenWords;
    isDeleting.value = true;
  } else if (isDeleting.value && currentText.value === "") {
    isDeleting.value = false;
    isWaiting.value = false;
    wordIndex.value = (wordIndex.value + 1) % props.words.length;
    timeout = 400;
  } else {
    isWaiting.value = false;
  }

  timer = setTimeout(type, timeout);
};

watch(
  () => props.words,
  () => {
    wordIndex.value = 0;
  },
);

onMounted(() => {
  type();
});

onUnmounted(() => {
  if (timer) clearTimeout(timer);
});
</script>

<style scoped>
.typewriter-container {
  display: inline-flex;
  align-items: center;
  font-weight: 700;
}

.typed-text {
  color: #e11d48;
}

.cursor {
  display: inline-block;
  color: #e11d48;
  font-weight: 300;
  margin-left: 2px;
  animation: blink 0.8s infinite;
}

@keyframes blink {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0;
  }
}
</style>
