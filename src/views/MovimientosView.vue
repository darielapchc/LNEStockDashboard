<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Auditoría de inventario
      </span>
      <h2>
        Movimientos
      </h2>
      <p class="muted">
        Cada entrada y salida actualiza el stock desde el backend.
      </p>
    </div>
    <button v-if="isAdmin" class="button button-primary" @click="modalOpen = true">
      ＋ Registrar movimiento
    </button>
  </div>
  <div class="toolbar card">
    <div class="search-field">
      ⌕
      <input v-model="search" placeholder="Buscar por producto o usuario..." />
    </div>
    <select v-model="typeFilter">
      <option value="">
        Todos los tipos
      </option>
      <option>
        ENTRADA
      </option>
      <option>
        SALIDA
      </option>
    </select>
    <select v-model="productFilter">
      <option value="">
        Todos los productos
      </option>
      <option v-for="product in products" :key="product.id" :value="String(product.id)">
        {{ product.nombre }}
      </option>
    </select>
  </div>
  <ErrorMessage v-if="error" :message="error" />
  <LoadingSpinner v-if="loading" text="Cargando movimientos..." />
  <section v-else-if="!filtered.length" class="card">
    <EmptyState title="Sin movimientos" message="El historial de entradas y salidas aparecerá aquí." />
  </section>
  <section v-else class="card table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>
              Fecha
            </th>
            <th>
              Producto
            </th>
            <th>
              Tipo
            </th>
            <th>
              Cantidad
            </th>
            <th>
              Usuario
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="m in filtered" :key="m.id">
            <td>
              {{ dateTime(m.fecha) }}
            </td>
            <td>
              <strong>
                {{ m.producto?.nombre || `Producto #${m.productoId}` }}
              </strong>
              <small v-if="m.producto?.codigo">
                {{ m.producto.codigo }}
              </small>
            </td>
            <td>
              <span class="movement-pill" :class="m.tipoMovimiento === 'ENTRADA' ? 'in' : 'out'">
                {{ m.tipoMovimiento }}
              </span>
            </td>
            <td>
              <strong>
                {{ m.cantidad }} uds.
              </strong>
            </td>
            <td>
              {{ m.usuario?.fullName || `Usuario #${m.usuarioId}` }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
  <div v-if="modalOpen" class="modal-backdrop" @click.self="modalOpen = false">
    <div class="modal-card">
      <div class="modal-heading">
        <div>
          <span class="section-kicker">
            Inventario
          </span>
          <h3>
            Registrar movimiento
          </h3>
        </div>
        <button class="icon-button" @click="modalOpen = false">
          ×
        </button>
      </div>
      <p class="muted form-note">
        La API validará stock, permisos y la transacción antes de guardar.
      </p>
      <MovementForm ref="movementForm" :products="products" :saving="saving" @submit="save" @cancel="modalOpen = false" />
    </div>
  </div>
</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import movimientoService from '../services/movimientoService';
import productoService from '../services/productoService';
import { dateTime, errorMessage } from '../utils/formatters';
import ErrorMessage from '../components/ErrorMessage.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';
import MovementForm from '../components/MovementForm.vue';
const auth = useAuthStore();
const isAdmin = computed(() => auth.user?.role === 'admin');
const movements = ref([]);
const products = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const search = ref('');
const typeFilter = ref('');
const productFilter = ref('');
const modalOpen = ref(false);
const movementForm = ref(null);
const filtered = computed(() => movements.value.filter(m => (!typeFilter.value || m.tipoMovimiento === typeFilter.value) && (!productFilter.value || String(m.productoId) === productFilter.value) && `${m.producto?.nombre || ''} ${m.usuario?.fullName || ''}`.toLowerCase().includes(search.value.toLowerCase())));
async function load() {
  try {
    const [m, p] = await Promise.all([movimientoService.getMovimientos(), productoService.getProductos()]);
    movements.value = m.data;
    products.value = p.data;
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    loading.value = false;
  }
}
async function save() {
  saving.value = true;
  error.value = '';
  try {
    await movimientoService.createMovimiento({
      ...movementForm.value.form
    });
    modalOpen.value = false;
    await load();
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    saving.value = false;
  }
}
onMounted(load);
</script>
