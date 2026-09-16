<template>
  <div class="view-stack">
    <div class="page-intro"><div><span class="section-kicker">Acceso administrativo</span><h2>Usuarios</h2><p class="muted">Administra el acceso y el estado de los usuarios del sistema.</p></div></div>
    <ErrorMessage v-if="error" :message="error" />
    <LoadingSpinner v-if="loading" text="Cargando usuarios..." />
    <section v-else-if="!users.length" class="card"><EmptyState title="Sin usuarios" message="No hay usuarios disponibles para mostrar." /></section>
    <section v-else class="card table-card"><div class="table-wrapper"><table>
      <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Email verificado</th><th>Estado</th><th>Creación</th><th>Acciones</th></tr></thead>
      <tbody><tr v-for="item in users" :key="item.id">
        <td><strong>{{ item.fullName || '—' }}</strong></td><td>{{ item.email || '—' }}</td><td>{{ item.role || '—' }}</td>
        <td><span class="status-pill" :class="item.emailVerified ? 'active' : 'inactive'">{{ item.emailVerified ? 'Sí' : 'No' }}</span></td>
        <td><span class="status-pill" :class="item.isActive ? 'active' : 'inactive'">{{ item.isActive ? 'ACTIVO' : 'INACTIVO' }}</span></td>
        <td>{{ dateTime(item.createdAt) }}</td>
        <td><div class="row-actions"><button class="button button-ghost button-small" @click="openDetail(item)">Detalle</button><button class="button button-ghost button-small" :disabled="actionId === item.id || item.id === auth.user?.id" @click="askStatus(item)">{{ item.isActive ? 'Desactivar' : 'Activar' }}</button><button class="button button-ghost button-small" :disabled="actionId === item.id" @click="openPassword(item)">Restablecer contraseña</button></div></td>
      </tr></tbody>
    </table></div></section>

    <div v-if="detailTarget" class="modal-backdrop" @click.self="detailTarget = null"><div class="modal-card"><div class="modal-heading"><h3>Detalle de usuario</h3><button class="icon-button" @click="detailTarget = null">×</button></div><dl class="detail-list"><div><dt>Nombre</dt><dd>{{ detailTarget.fullName || '—' }}</dd></div><div><dt>Email</dt><dd>{{ detailTarget.email || '—' }}</dd></div><div><dt>Rol</dt><dd>{{ detailTarget.role || '—' }}</dd></div><div><dt>Estado</dt><dd>{{ detailTarget.isActive ? 'ACTIVO' : 'INACTIVO' }}</dd></div><div><dt>Email verificado</dt><dd>{{ detailTarget.emailVerified ? 'Sí' : 'No' }}</dd></div><div><dt>Creado</dt><dd>{{ dateTime(detailTarget.createdAt) }}</dd></div></dl></div></div>
    <ConfirmDialog :open="Boolean(statusTarget)" :title="statusTarget?.isActive ? 'Desactivar usuario' : 'Activar usuario'" :message="statusTarget ? `¿Confirmas ${statusTarget.isActive ? 'desactivar' : 'activar'} a ${statusTarget.fullName || statusTarget.email}?` : ''" :busy="Boolean(actionId)" @cancel="statusTarget = null" @confirm="changeStatus" />
    <div v-if="passwordTarget" class="modal-backdrop" @click.self="closePassword"><div class="modal-card"><div class="modal-heading"><h3>Restablecer contraseña</h3><button class="icon-button" @click="closePassword">×</button></div><p class="muted">Nueva contraseña para {{ passwordTarget.fullName || passwordTarget.email }}.</p><form class="form-grid" @submit.prevent="askPasswordReset"><label class="full">Nueva contraseña<input v-model="passwordForm.password" type="password" minlength="8" required autocomplete="new-password" /></label><label class="full">Confirmar contraseña<input v-model="passwordForm.confirmation" type="password" minlength="8" required autocomplete="new-password" /></label><p v-if="passwordError" class="field-error full">{{ passwordError }}</p><div class="form-actions full"><button type="button" class="button button-ghost" @click="closePassword">Cancelar</button><button class="button button-primary" :disabled="Boolean(actionId)">{{ actionId ? 'Guardando...' : 'Continuar' }}</button></div></form></div></div>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import usuarioService from '../services/usuarioService'
import { dateTime, errorMessage } from '../utils/formatters'
import ErrorMessage from '../components/ErrorMessage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
import EmptyState from '../components/EmptyState.vue'
import ConfirmDialog from '../components/ConfirmDialog.vue'
const auth = useAuthStore(); const users = ref([]); const loading = ref(true); const error = ref(''); const actionId = ref(null); const detailTarget = ref(null); const statusTarget = ref(null); const passwordTarget = ref(null); const passwordError = ref(''); const passwordForm = reactive({ password: '', confirmation: '' })
async function load() { loading.value = true; error.value = ''; try { users.value = (await usuarioService.getUsuarios()).data || [] } catch (e) { error.value = errorMessage(e) } finally { loading.value = false } }
async function openDetail(user) { error.value = ''; try { detailTarget.value = (await usuarioService.getUsuario(user.id)).data } catch (e) { error.value = errorMessage(e) } }
function askStatus(user) { if (user.id !== auth.user?.id) statusTarget.value = user }
async function changeStatus() { if (!statusTarget.value) return; const target = statusTarget.value; actionId.value = target.id; error.value = ''; try { await usuarioService.updateStatus(target.id, !target.isActive); statusTarget.value = null; await load() } catch (e) { error.value = errorMessage(e) } finally { actionId.value = null } }
function openPassword(user) { passwordTarget.value = user; passwordError.value = ''; passwordForm.password = ''; passwordForm.confirmation = '' }
function closePassword() { if (!actionId.value) passwordTarget.value = null }
async function askPasswordReset() { passwordError.value = ''; if (passwordForm.password.length < 8 || !/\d/.test(passwordForm.password)) { passwordError.value = 'La contraseña debe tener al menos 8 caracteres y un número.'; return } if (passwordForm.password !== passwordForm.confirmation) { passwordError.value = 'Las contraseñas no coinciden.'; return } if (!window.confirm('¿Confirmas restablecer esta contraseña?')) return; actionId.value = passwordTarget.value.id; try { await usuarioService.resetPassword(passwordTarget.value.id, passwordForm.password); passwordTarget.value = null } catch (e) { passwordError.value = errorMessage(e) } finally { actionId.value = null } }
onMounted(load)
</script>
