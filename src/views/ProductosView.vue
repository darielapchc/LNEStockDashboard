<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Catálogo
      </span>
      <h2>
        Productos
      </h2>
      <p class="muted">
        Administra los artículos y consulta sus existencias.
      </p>
    </div>
    <button v-if="isAdmin" class="button button-primary" @click="openCreate">
      ＋ Nuevo producto
    </button>
  </div>
  <div class="toolbar card">
    <div class="search-field">
      ⌕
      <input v-model="search" placeholder="Buscar por nombre o código..." />
    </div>
    <select v-model="categoryFilter">
      <option value="">
        Todas las categorías
      </option>
      <option v-for="category in categories" :key="category.id" :value="String(category.id)">
        {{ category.nombre }}
      </option>
    </select>
    <span class="muted">
      {{ filtered.length }} resultados
    </span>
  </div>
  <ErrorMessage v-if="error" :message="error" />
  <LoadingSpinner v-if="loading" text="Cargando productos..." />
  <section v-else-if="!filtered.length" class="card">
    <EmptyState title="No hay productos" message="No encontramos productos que coincidan con tus filtros." />
  </section>
  <section v-else class="card table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>
              Producto
            </th>
            <th>
              Código
            </th>
            <th>
              Categoría
            </th>
            <th>
              Precio
            </th>
            <th>
              Stock
            </th>
            <th v-if="isAdmin">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="product in filtered" :key="product.id">
            <td>
              <div class="product-cell">
                <div class="product-thumb">
                  {{ product.nombre?.[0] }}
                </div>
                <div>
                  <strong>
                    {{ product.nombre }}
                  </strong>
                  <small>
                    {{ product.descripcion || 'Sin descripción' }}
                  </small>
                </div>
              </div>
            </td>
            <td>
              <code>
                {{ product.codigo }}
              </code>
            </td>
            <td>
              {{ product.categoria?.nombre || `#${product.categoriaId}` }}
            </td>
            <td>
              {{ money(product.precio) }}
            </td>
            <td>
              <span class="stock-badge" :class="{ low: product.stock
                < 10 }">
                  {{ product.stock }} uds.
                </span>
              </td>
              <td v-if="isAdmin">
                <div class="row-actions">
                  <button class="icon-button" title="Editar" @click="openEdit(product)">
                    ✎
                  </button>
                  <button class="icon-button danger-text" title="Eliminar" @click="askDelete(product)">
                    ⌫
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </section>
    <div v-if="modalOpen" class="modal-backdrop" @click.self="modalOpen = false">
      <div class="modal-card modal-large">
        <div class="modal-heading">
          <div>
            <span class="section-kicker">
              {{ editing ? 'Editar' : 'Nuevo' }}
            </span>
            <h3>
              {{ editing ? 'Editar producto' : 'Registrar producto' }}
            </h3>
          </div>
          <button class="icon-button" @click="modalOpen = false">
            ×
          </button>
        </div>
        <ProductForm ref="productForm" :product="selected" :categories="categories" :editing="editing" :saving="saving" @submit="save" @cancel="modalOpen = false" />
      </div>
    </div>
    <ConfirmDialog :open="Boolean(deleteTarget)" title="Eliminar producto" :message="`¿Seguro que deseas eliminar ${deleteTarget?.nombre || 'este producto'}? El backend rechazará la operación si tiene movimientos.`" @cancel="deleteTarget = null" @confirm="remove" />
  </div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import productoService from '../services/productoService';
import categoriaService from '../services/categoriaService';
import { money, errorMessage } from '../utils/formatters';
import ErrorMessage from '../components/ErrorMessage.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';
import ProductForm from '../components/ProductForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
const auth = useAuthStore();
const isAdmin = computed(() => auth.user?.role === 'admin');
const products = ref([]);
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const search = ref('');
const categoryFilter = ref('');
const modalOpen = ref(false);
const editing = ref(false);
const selected = ref(null);
const productForm = ref(null);
const deleteTarget = ref(null);
const filtered = computed(() => products.value.filter(p => `${p.nombre || ''} ${p.codigo || ''}`.toLowerCase().includes(search.value.toLowerCase()) && (!categoryFilter.value || String(p.categoriaId) === categoryFilter.value)));
async function load() {
  try {
    const [p, c] = await Promise.all([productoService.getProductos(), categoriaService.getCategorias()]);
    products.value = p.data;
    categories.value = c.data.filter(item => item.activo !== false);
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    loading.value = false;
  }
}
function openCreate() {
  editing.value = false;
  selected.value = null;
  modalOpen.value = true;
}
function openEdit(p) {
  editing.value = true;
  selected.value = p;
  modalOpen.value = true;
}
async function save() {
  saving.value = true;
  error.value = '';
  try {
    const data = {
      ...productForm.value.form
    };
    if (editing.value) {
      delete data.stock;
      await productoService.updateProducto(selected.value.id, data);
    } else await productoService.createProducto(data);
    modalOpen.value = false;
    await load();
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    saving.value = false;
  }
}
function askDelete(p) {
  deleteTarget.value = p;
}
async function remove() {
  try {
    await productoService.deleteProducto(deleteTarget.value.id);
    deleteTarget.value = null;
    await load();
  } catch (e) {
    error.value = errorMessage(e);
    deleteTarget.value = null;
  }
}
onMounted(load);
</script>
