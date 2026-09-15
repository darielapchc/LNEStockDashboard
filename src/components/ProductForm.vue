<template>
<form class="form-grid" @submit.prevent="$emit('submit')">
  <label>
    Nombre
    <input v-model="form.nombre" required maxlength="150" />
  </label>
  <label>
    Código
    <input v-model="form.codigo" required maxlength="100" />
  </label>
  <label>
    Precio
    <input v-model.number="form.precio" type="number" min="0" step="0.01" required />
  </label>
  <label>
    Stock inicial
    <span class="muted">
      (solo al crear)
    </span>
    <input v-model.number="form.stock" type="number" min="0" required :disabled="editing" />
  </label>
  <label>
    Categoría
    <select v-model.number="form.categoriaId" required>
      <option :value="null" disabled>
        Selecciona una categoría
      </option>
      <option v-for="category in categories" :key="category.id" :value="category.id">
        {{ category.nombre }}
      </option>
    </select>
  </label>
  <label>
    Imagen URL
    <input v-model="form.imagen" type="url" placeholder="https://..." />
  </label>
  <label class="full">
    Descripción
    <textarea v-model="form.descripcion" rows="3" maxlength="500">
    </textarea>
  </label>
  <div class="form-actions full">
    <button type="button" class="button button-ghost" @click="$emit('cancel')">
      Cancelar
    </button>
    <button class="button button-primary" :disabled="saving">
      {{ saving ? 'Guardando...' : 'Guardar producto' }}
    </button>
  </div>
</form>
</template>
<script setup>
import { reactive } from 'vue';
const props = defineProps({
  product: Object,
  categories: Array,
  editing: Boolean,
  saving: Boolean
});
const form = reactive({
  nombre: props.product?.nombre || '',
  codigo: props.product?.codigo || '',
  precio: props.product?.precio ?? 0,
  stock: props.product?.stock ?? 0,
  categoriaId: props.product?.categoriaId || props.product?.categoria?.id || null,
  imagen: props.product?.imagen || '',
  descripcion: props.product?.descripcion || ''
});
defineEmits(['submit', 'cancel']);
defineExpose({
  form
});
</script>
