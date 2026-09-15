<template>
<div class="empty-state">
  <div class="empty-icon">
    ⌁
  </div>
  <h3>
    {{ title }}
  </h3>
  <p>
    {{ message }}
  </p>
  <button v-if="$slots.action" class="button button-primary">
    <slot name="action" />
  </button>
</div>
</template>
<script setup>
defineProps({
  title: {
    type: String,
    default: 'Sin datos todavía'
  },
  message: {
    type: String,
    default: 'No hay registros para mostrar.'
  }
});
</script>
