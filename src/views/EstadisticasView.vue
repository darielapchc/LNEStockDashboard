<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Lectura del inventario
      </span>
      <h2>
        Estadísticas
      </h2>
      <p class="muted">
        Cálculos de presentación basados en los datos actuales de la API.
      </p>
    </div>
  </div>
  <LoadingSpinner v-if="loading" text="Calculando estadísticas..." />
  <template v-else>
    <div v-if="error" class="alert alert-error">
      {{ error }}
    </div>
    <div class="stats-grid">
      <StatCard label="Entradas" :value="summary.in" hint="unidades registradas" :icon="ArrowDownToLine" />
      <StatCard label="Salidas" :value="summary.out" hint="unidades registradas" :icon="ArrowUpFromLine" />
      <StatCard label="Valor del stock" :value="money(summary.value)" hint="precio × stock" :icon="Coins" />
      <StatCard label="Productos con stock bajo" :value="summary.low" hint="5 unidades o menos" :icon="TriangleAlert" />
    </div>
    <section class="card chart-card">
      <div class="card-heading">
        <div>
          <span class="section-kicker">
            Actividad
          </span>
          <h3>
            Distribución de movimientos
          </h3>
        </div>
      </div>
      <div v-if="!movements.length" class="chart-empty">
        No hay datos suficientes para mostrar un gráfico.
      </div>
      <div v-else class="bar-chart">
        <div class="chart-bar-group">
          <div class="bar-track">
            <div class="bar in" :style="{ height: `${Math.max(8, (summary.in / maxMovement) * 100)}%` }">
            </div>
          </div>
          <strong>
            {{ summary.in }}
          </strong>
          <span>
            Entradas
          </span>
        </div>
        <div class="chart-bar-group">
          <div class="bar-track">
            <div class="bar out" :style="{ height: `${Math.max(8, (summary.out / maxMovement) * 100)}%` }">
            </div>
          </div>
          <strong>
            {{ summary.out }}
          </strong>
          <span>
            Salidas
          </span>
        </div>
      </div>
    </section>
  </template>
</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { ArrowDownToLine, ArrowUpFromLine, Coins, TriangleAlert } from 'lucide-vue-next';
import productoService from '../services/productoService';
import movimientoService from '../services/movimientoService';
import { money, errorMessage } from '../utils/formatters';
import StatCard from '../components/StatCard.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
const products = ref([]);
const movements = ref([]);
const loading = ref(true);
const error = ref('');
const summary = computed(() => ({
  in: movements.value.filter(m => m.tipoMovimiento === 'ENTRADA').reduce((n, m) => n + Number(m.cantidad || 0), 0),
  out: movements.value.filter(m => m.tipoMovimiento === 'SALIDA').reduce((n, m) => n + Number(m.cantidad || 0), 0),
  low: products.value.filter(p => Number(p.stock) <= 5).length,
  value: products.value.reduce((n, p) => n + Number(p.stock || 0) * Number(p.precio || 0), 0)
}));
const maxMovement = computed(() => Math.max(summary.value.in, summary.value.out, 1));
onMounted(async () => {
  try {
    const [p, m] = await Promise.all([productoService.getProductos(), movimientoService.getMovimientos()]);
    products.value = p.data;
    movements.value = m.data;
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    loading.value = false;
  }
});
</script>
