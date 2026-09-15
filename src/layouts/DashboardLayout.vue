<template>
<div class="app-shell">
  <aside class="sidebar" :class="{ open: sidebarOpen }">
    <div class="brand">
      <span class="brand-mark">
        L
      </span>
      <div>
        <strong>
          LNE STOCK
        </strong>
        <small>
          Panel administrativo
        </small>
      </div>
    </div>
    <nav>
      <RouterLink v-for="item in navigation" :key="item.to" :to="item.to" @click="sidebarOpen = false">
        <component :is="item.icon" :size="19" />
        <span>
          {{ item.label }}
        </span>
      </RouterLink>
    </nav>
    <button class="logout-link" @click="logout">
      <LogOut :size="19" />
      Cerrar sesión
    </button>
  </aside>
  <div v-if="sidebarOpen" class="drawer-overlay" @click="sidebarOpen = false">
  </div>
  <main class="main-content">
    <header class="topbar">
      <button class="menu-button" @click="sidebarOpen = !sidebarOpen">
        <Menu :size="22" />
      </button>
      <div>
        <p class="eyebrow">
          LNE STOCK / {{ route.meta.title }}
        </p>
        <h1>
          {{ route.meta.title }}
        </h1>
      </div>
      <div class="user-menu">
        <div class="avatar">
          {{ initials(auth.user?.fullName) }}
        </div>
        <div class="user-copy">
          <strong>
            {{ auth.user?.fullName || 'Administrador' }}
          </strong>
          <span>
            {{ auth.user?.role || 'admin' }}
          </span>
        </div>
        <RouterLink to="/perfil" class="icon-button" title="Perfil">
          <UserRound :size="19" />
        </RouterLink>
      </div>
    </header>
    <section class="page-content">
      <RouterView />
    </section>
  </main>
</div>
</template>
<script setup>
import { ref } from 'vue';
import { useRoute, useRouter, RouterLink, RouterView } from 'vue-router';
import { LayoutDashboard, Package, Tags, ArrowLeftRight, BarChart3, Users, UserRound, LogOut, Menu } from 'lucide-vue-next';
import { useAuthStore } from '../stores/auth';
import { initials } from '../utils/formatters';
const auth = useAuthStore();
const route = useRoute();
const router = useRouter();
const sidebarOpen = ref(false);
const navigation = [{
  label: 'Dashboard',
  to: '/dashboard',
  icon: LayoutDashboard
}, {
  label: 'Productos',
  to: '/productos',
  icon: Package
}, {
  label: 'Categorías',
  to: '/categorias',
  icon: Tags
}, {
  label: 'Movimientos',
  to: '/movimientos',
  icon: ArrowLeftRight
}, {
  label: 'Estadísticas',
  to: '/estadisticas',
  icon: BarChart3
}, {
  label: 'Usuarios',
  to: '/usuarios',
  icon: Users
}, {
  label: 'Mi perfil',
  to: '/perfil',
  icon: UserRound
}];
async function logout() {
  await auth.logout();
  router.push('/login');
}
</script>
