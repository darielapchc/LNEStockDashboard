<template>
<main class="login-page">
  <div class="login-decoration">
    <div class="brand brand-light">
      <span class="brand-mark">
        L
      </span>
      <div>
        <strong>
          LNE STOCK
        </strong>
        <small>
          Inventario con propósito
        </small>
      </div>
    </div>
    <div class="login-quote">
      <span>
        ADMINISTRA.
      </span>
      <span>
        CONTROLA.
      </span>
      <span>
        CRECE.
      </span>
      <p>
        Una vista clara para cada decisión de inventario.
      </p>
    </div>
  </div>
  <section class="login-panel">
    <div class="login-card">
      <div class="mobile-brand brand">
        <span class="brand-mark">
          L
        </span>
        <strong>
          LNE STOCK
        </strong>
      </div>
      <span class="section-kicker">
        Panel administrativo
      </span>
      <h1>
        Bienvenido de vuelta
      </h1>
      <p class="muted">
        Ingresa tus credenciales para continuar.
      </p>
      <p class="muted">
        Modo de demostración: puedes usar cualquier correo y contraseña.
      </p>
      <form @submit.prevent="submit">
        <label>
          Correo electrónico
          <input v-model="form.email" type="email" autocomplete="email" required placeholder="admin@lnestock.hn" />
        </label>
        <label>
          Contraseña
          <input v-model="form.password" type="password" autocomplete="current-password" required placeholder="••••••••" />
        </label>
        <ErrorMessage v-if="error" :message="error" />
        <button class="button button-primary button-wide" :disabled="auth.loading">
          {{ auth.loading ? 'Iniciando sesión...' : 'Iniciar sesión' }}
          <span v-if="!auth.loading">
            →
          </span>
        </button>
      </form>
    </div>
  </section>
</main>
</template>
<script setup>
import { reactive, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from '../stores/auth';
import { errorMessage } from '../utils/formatters';
import ErrorMessage from '../components/ErrorMessage.vue';
const auth = useAuthStore();
const router = useRouter();
const form = reactive({
  email: '',
  password: ''
});
const error = ref('');
async function submit() {
  error.value = '';
  try {
    await auth.login(form);
    router.push('/dashboard');
  } catch (e) {
    error.value = errorMessage(e, 'No se pudo iniciar sesión.');
  }
}
</script>
