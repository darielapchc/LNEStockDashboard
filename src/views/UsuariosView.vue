<template>
<div class="view-stack">
  <div class="page-intro">
    <div>
      <span class="section-kicker">
        Acceso administrativo
      </span>
      <h2>
        Usuarios
      </h2>
      <p class="muted">
        Consulta de usuarios autorizados del sistema.
      </p>
    </div>
  </div>
  <section class="card pending-card">
    <div class="pending-icon">
      ⌁
    </div>
    <h3>
      Funcionalidad pendiente de API
    </h3>
    <p>
      El backend actual no expone todavía un endpoint de usuarios. Cuando esté disponible, esta vista podrá consumirlo sin cambiar la navegación.
    </p>
    <code>
      GET /api/usuarios
    </code>
  </section>
</div>
</template>
<script setup>

</script>
