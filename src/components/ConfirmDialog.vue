<template>
<div v-if="open" class="modal-backdrop" @click.self="$emit('cancel')">
  <div class="modal-card">
    <h3>
      {{ title }}
    </h3>
    <p>
      {{ message }}
    </p>
    <div class="modal-actions">
      <button class="button button-ghost" @click="$emit('cancel')">
        Cancelar
      </button>
      <button class="button button-danger" @click="$emit('confirm')">
        Confirmar
      </button>
    </div>
  </div>
</div>
</template>
<script setup>
defineProps({
  open: Boolean,
  title: String,
  message: String
});
defineEmits(['cancel', 'confirm']);
</script>
