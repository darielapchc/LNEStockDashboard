<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Resumen general
      </span>
      <h2>
        Todo bajo control, {{ firstName }}
      </h2>
      <p class="muted">
        Consulta el estado actual de tu inventario.
      </p>
    </div>
    <RouterLink to="/movimientos" class="button button-primary">
      Registrar movimiento
      <span>
        →
      </span>
    </RouterLink>
  </div>
  <div v-if="error" class="alert alert-error">
    {{ error }}
  </div>
  <LoadingSpinner v-if="loading" text="Sincronizando inventario..." />
  <template v-else-if="!error">
    <div class="stats-grid">
      <StatCard label="Productos" :value="products.length" hint="en catálogo" :icon="Package" />
      <StatCard label="Categorías" :value="categories.length" hint="activas y registradas" :icon="Tags" />
      <StatCard label="Stock total" :value="stock" hint="unidades disponibles" :icon="Boxes" />
      <StatCard label="Stock bajo" :value="lowStock.length" hint="Menos de 10 unidades" :icon="TriangleAlert" />
    </div>
    <div class="dashboard-grid">
      <section class="card">
        <div class="card-heading">
          <div>
            <span class="section-kicker">
              Actividad
            </span>
            <h3>
              Movimientos recientes
            </h3>
          </div>
          <RouterLink to="/movimientos" class="text-link">
            Ver todos →
          </RouterLink>
        </div>
        <EmptyState v-if="!movements.length" title="Sin movimientos" message="Los movimientos registrados aparecerán aquí." />
        <div v-else class="activity-list">
          <div v-for="movement in movements.slice(0, 5)" :key="movement.id" class="activity-row">
            <span class="activity-dot" :class="movement.tipoMovimiento === 'ENTRADA' ? 'in' : 'out'">
              {{ movement.tipoMovimiento === 'ENTRADA' ? '+' : '−' }}
            </span>
            <div>
              <strong>
                {{ movement.producto?.nombre || `Producto #${movement.productoId}` }}
              </strong>
              <small>
                {{ movement.tipoMovimiento }} · {{ dateTime(movement.fecha) }}
              </small>
            </div>
            <b :class="movement.tipoMovimiento === 'ENTRADA' ? 'positive' : 'negative'">
              {{ movement.tipoMovimiento === 'ENTRADA' ? '+' : '-' }}{{ movement.cantidad }}
            </b>
          </div>
        </div>
      </section>
      <section class="card">
        <div class="card-heading">
          <div>
            <span class="section-kicker">
              Inventario
            </span>
            <h3>
              Stock bajo
            </h3>
          </div>
          <RouterLink to="/productos" class="text-link">
            Ver productos →
          </RouterLink>
        </div>
        <EmptyState v-if="!lowStock.length" title="Inventario saludable" message="No hay productos con stock bajo." />
        <div v-else class="low-stock-list">
          <div v-for="product in lowStock" :key="product.id">
            <span>
              {{ product.nombre }}
            </span>
            <strong>
              {{ product.stock }} uds.
            </strong>
          </div>
        </div>
      </section>
    </div>
  </template>
  <section v-else class="card"><EmptyState title="No se pudo cargar el dashboard" message="Revisa la conexión con la API e inténtalo nuevamente." /></section>
</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import { Package, Tags, Boxes, TriangleAlert } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import productoService from '../services/productoService';
import categoriaService from '../services/categoriaService';
import movimientoService from '../services/movimientoService';
import { dateTime, errorMessage } from '../utils/formatters';
import StatCard from '../components/StatCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';
const auth = useAuthStore();
const products = ref([]);
const categories = ref([]);
const movements = ref([]);
const loading = ref(true);
const error = ref('');
const firstName = computed(() => auth.user?.fullName?.split(' ')[0] || 'administrador');
const stock = computed(() => products.value.reduce((sum, p) => sum + Number(p.stock || 0), 0));
const lowStock = computed(() => products.value.filter(p => Number(p.stock) < 10));
onMounted(async () => {
  try {
    const results = await Promise.all([productoService.getProductos(), categoriaService.getCategorias(), movimientoService.getMovimientos()]);
    products.value = results[0].data;
    categories.value = results[1].data.filter(c => c.activo !== false);
    movements.value = results[2].data;
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    loading.value = false;
  }
});
</script>
