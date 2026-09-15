<template>
<form class="form-grid" @submit.prevent="$emit('submit')">
  <label>
    Producto
    <select v-model.number="form.productoId" required>
      <option :value="null" disabled>
        Selecciona un producto
      </option>
      <option v-for="product in products" :key="product.id" :value="product.id">
        {{ product.nombre }} · stock {{ product.stock }}
      </option>
    </select>
  </label>
  <label>
    Tipo
    <select v-model="form.tipoMovimiento">
      <option>
        ENTRADA
      </option>
      <option>
        SALIDA
      </option>
    </select>
  </label>
  <label>
    Cantidad
    <input v-model.number="form.cantidad" type="number" min="1" step="1" required />
  </label>
  <div class="form-actions full">
    <button type="button" class="button button-ghost" @click="$emit('cancel')">
      Cancelar
    </button>
    <button class="button button-primary" :disabled="saving">
      {{ saving ? 'Registrando...' : 'Registrar movimiento' }}
    </button>
  </div>
</form>
</template>
<script setup>
import { reactive } from 'vue';
const form = reactive({
  productoId: null,
  tipoMovimiento: 'ENTRADA',
  cantidad: 1
});
defineProps({
  products: Array,
  saving: Boolean
});
defineEmits(['submit', 'cancel']);
defineExpose({
  form
});
</script>
