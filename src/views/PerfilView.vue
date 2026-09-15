<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Cuenta
      </span>
      <h2>
        Mi perfil
      </h2>
      <p class="muted">
        Información de la sesión administrativa actual.
      </p>
    </div>
  </div>
  <section class="card profile-card">
    <div class="profile-avatar">
      {{ initials(auth.user?.fullName) }}
    </div>
    <div class="profile-info">
      <h3>
        {{ auth.user?.fullName || '—' }}
      </h3>
      <span class="status-pill active">
        {{ auth.user?.role || '—' }}
      </span>
      <dl>
        <div>
          <dt>
            Correo electrónico
          </dt>
          <dd>
            {{ auth.user?.email || '—' }}
          </dd>
        </div>
        <div>
          <dt>
            ID de usuario
          </dt>
          <dd>
            #{{ auth.user?.id || '—' }}
          </dd>
        </div>
      </dl>
      <div class="profile-note">
        La edición de perfil estará disponible cuando el backend publique el endpoint correspondiente.
      </div>
    </div>
  </section>
</div>
</template>
<script setup>
import { useAuthStore } from '../stores/auth';
import { initials } from '../utils/formatters';
const auth = useAuthStore();
</script>
