<template>
<div class="alert alert-error">
  {{ message }}
</div>
</template>
<script setup>
defineProps({
  message: {
    type: String,
    default: 'No se pudo cargar la información.'
  }
});
</script>
