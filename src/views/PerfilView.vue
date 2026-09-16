<template>
  <div class="view-stack">
    <div class="page-intro"><div><span class="section-kicker">Cuenta</span><h2>Mi perfil</h2><p class="muted">Consulta y actualiza tu información administrativa.</p></div></div>
    <ErrorMessage v-if="error" :message="error" />
    <LoadingSpinner v-if="loading" text="Cargando perfil..." />
    <section v-else class="card profile-card">
      <div class="profile-avatar">{{ initials(auth.user?.fullName) }}</div>
      <div class="profile-info"><h3>{{ auth.user?.fullName || '—' }}</h3><span class="status-pill active">{{ auth.user?.role || '—' }}</span>
        <form class="form-grid profile-form" @submit.prevent="save"><label>Nombre<input v-model.trim="form.fullName" required /></label><label>Correo electrónico<input v-model.trim="form.email" type="email" required /></label><div class="form-actions full"><button class="button button-primary" :disabled="saving">{{ saving ? 'Guardando...' : 'Guardar cambios' }}</button></div></form>
      </div>
    </section>
  </div>
</template>
<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useAuthStore } from '../stores/auth'
import authService from '../services/authService'
import { USER_KEY } from '../services/api'
import { errorMessage, initials } from '../utils/formatters'
import ErrorMessage from '../components/ErrorMessage.vue'
import LoadingSpinner from '../components/LoadingSpinner.vue'
const auth = useAuthStore(); const loading = ref(true); const saving = ref(false); const error = ref(''); const form = reactive({ fullName: '', email: '' })
async function load() { try { const { data } = await authService.me(); auth.user = data; form.fullName = data.fullName || ''; form.email = data.email || ''; sessionStorage.setItem(USER_KEY, JSON.stringify(data)) } catch (e) { error.value = errorMessage(e) } finally { loading.value = false } }
async function save() { saving.value = true; error.value = ''; try { const { data } = await authService.updateMe({ fullName: form.fullName, email: form.email }); auth.user = data; sessionStorage.setItem(USER_KEY, JSON.stringify(data)) } catch (e) { error.value = errorMessage(e) } finally { saving.value = false } }
onMounted(load)
</script>
