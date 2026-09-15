<template>
<form class="form-grid" @submit.prevent="$emit('submit')">
  <label>
    Nombre
    <input v-model="form.nombre" required maxlength="100" />
  </label>
  <label>
    Ícono
    <span class="muted">
      (opcional)
    </span>
    <input v-model="form.icono" maxlength="50" />
  </label>
  <label class="full">
    Descripción
    <textarea v-model="form.descripcion" rows="3" maxlength="255">
    </textarea>
  </label>
  <div class="form-actions full">
    <button type="button" class="button button-ghost" @click="$emit('cancel')">
      Cancelar
    </button>
    <button class="button button-primary" :disabled="saving">
      {{ saving ? 'Guardando...' : 'Guardar categoría' }}
    </button>
  </div>
</form>
</template>
<script setup>
import { reactive } from 'vue';
const props = defineProps({
  category: Object,
  saving: Boolean
});
const form = reactive({
  nombre: props.category?.nombre || '',
  descripcion: props.category?.descripcion || '',
  icono: props.category?.icono || ''
});
defineEmits(['submit', 'cancel']);
defineExpose({
  form
});
</script>
