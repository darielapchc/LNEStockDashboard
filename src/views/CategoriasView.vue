<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Catálogo
      </span>
      <h2>
        Categorías
      </h2>
      <p class="muted">
        Organiza tus productos por familias.
      </p>
    </div>
    <button v-if="isAdmin" class="button button-primary" @click="openCreate">
      ＋ Nueva categoría
    </button>
  </div>
  <div class="toolbar card">
    <div class="search-field">
      ⌕
      <input v-model="search" placeholder="Buscar categoría..." />
    </div>
  </div>
  <ErrorMessage v-if="error" :message="error" />
  <LoadingSpinner v-if="loading" text="Cargando categorías..." />
  <section v-else-if="!filtered.length" class="card">
    <EmptyState title="Sin categorías" message="Crea la primera categoría para organizar tu inventario." />
  </section>
  <section v-else class="card table-card">
    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>
              ID
            </th>
            <th>
              Nombre
            </th>
            <th>
              Descripción
            </th>
            <th>
              Estado
            </th>
            <th v-if="isAdmin">
              Acciones
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in filtered" :key="item.id">
            <td>
              #{{ item.id }}
            </td>
            <td>
              <strong>
                {{ item.nombre }}
              </strong>
            </td>
            <td>
              {{ item.descripcion || '—' }}
            </td>
            <td>
              <span class="status-pill" :class="item.activo ? 'active' : 'inactive'">
                {{ item.activo ? 'Activa' : 'Inactiva' }}
              </span>
            </td>
            <td v-if="isAdmin">
              <div class="row-actions">
                <button class="icon-button" @click="openEdit(item)">
                  ✎
                </button>
                <button class="icon-button danger-text" @click="askDelete(item)">
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
    <div class="modal-card">
      <div class="modal-heading">
        <h3>
          {{ editing ? 'Editar categoría' : 'Nueva categoría' }}
        </h3>
        <button class="icon-button" @click="modalOpen = false">
          ×
        </button>
      </div>
      <CategoryForm ref="categoryForm" :category="selected" :saving="saving" @submit="save" @cancel="modalOpen = false" />
    </div>
  </div>
  <ConfirmDialog :open="Boolean(deleteTarget)" title="Desactivar categoría" message="La categoría se marcará como inactiva para conservar el historial." @cancel="deleteTarget = null" @confirm="remove" />
</div>
</template>
<script setup>
import { computed, onMounted, ref } from 'vue';
import { useAuthStore } from '../stores/auth';
import categoriaService from '../services/categoriaService';
import { errorMessage } from '../utils/formatters';
import ErrorMessage from '../components/ErrorMessage.vue';
import LoadingSpinner from '../components/LoadingSpinner.vue';
import EmptyState from '../components/EmptyState.vue';
import CategoryForm from '../components/CategoryForm.vue';
import ConfirmDialog from '../components/ConfirmDialog.vue';
const auth = useAuthStore();
const isAdmin = computed(() => auth.user?.role === 'admin');
const categories = ref([]);
const loading = ref(true);
const saving = ref(false);
const error = ref('');
const search = ref('');
const modalOpen = ref(false);
const editing = ref(false);
const selected = ref(null);
const categoryForm = ref(null);
const deleteTarget = ref(null);
const filtered = computed(() => categories.value.filter(c => c.nombre.toLowerCase().includes(search.value.toLowerCase())));
async function load() {
  try {
    categories.value = (await categoriaService.getCategorias()).data;
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
function openEdit(c) {
  editing.value = true;
  selected.value = c;
  modalOpen.value = true;
}
async function save() {
  saving.value = true;
  try {
    const data = {
      ...categoryForm.value.form
    };
    if (editing.value) await categoriaService.updateCategoria(selected.value.id, data);else await categoriaService.createCategoria(data);
    modalOpen.value = false;
    await load();
  } catch (e) {
    error.value = errorMessage(e);
  } finally {
    saving.value = false;
  }
}
function askDelete(c) {
  deleteTarget.value = c;
}
async function remove() {
  try {
    await categoriaService.deleteCategoria(deleteTarget.value.id);
    deleteTarget.value = null;
    await load();
  } catch (e) {
    error.value = errorMessage(e);
    deleteTarget.value = null;
  }
}
onMounted(load);
</script>
