<template>
<article class="stat-card">
  <div>
    <span class="stat-label">
      {{ label }}
    </span>
    <strong>
      {{ value }}
    </strong>
    <small v-if="hint">
      {{ hint }}
    </small>
  </div>
  <div class="stat-icon">
    <component :is="icon" :size="22" />
  </div>
</article>
</template>
<script setup>
defineProps({
  label: String,
  value: [String, Number],
  hint: String,
  icon: Object
});
</script>
