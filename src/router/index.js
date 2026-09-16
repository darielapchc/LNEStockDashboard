import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginView from '../views/LoginView.vue'
import DashboardLayout from '../layouts/DashboardLayout.vue'
import DashboardView from '../views/DashboardView.vue'
import ProductosView from '../views/ProductosView.vue'
import CategoriasView from '../views/CategoriasView.vue'
import MovimientosView from '../views/MovimientosView.vue'
import EstadisticasView from '../views/EstadisticasView.vue'
import UsuariosView from '../views/UsuariosView.vue'
import PerfilView from '../views/PerfilView.vue'

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/login', component: LoginView, meta: { guest: true } },
    {
      path: '/',
      component: DashboardLayout,
      meta: { auth: true, admin: true },
      children: [
        { path: 'dashboard', component: DashboardView, meta: { title: 'Dashboard' } },
        { path: 'productos', component: ProductosView, meta: { title: 'Productos' } },
        { path: 'categorias', component: CategoriasView, meta: { title: 'Categorías' } },
        { path: 'movimientos', component: MovimientosView, meta: { title: 'Movimientos' } },
        { path: 'estadisticas', component: EstadisticasView, meta: { title: 'Estadísticas' } },
        { path: 'usuarios', component: UsuariosView, meta: { title: 'Usuarios' } },
        { path: 'perfil', component: PerfilView, meta: { title: 'Mi perfil' } }
      ]
    },
    { path: '/:pathMatch(.*)*', redirect: '/dashboard' }
  ]
})

router.beforeEach(async (to) => {
  const auth = useAuthStore()
  if (!auth.initialized) await auth.initialize()
  if (to.meta.auth && !auth.isAuthenticated) return '/login'
  if (to.meta.admin && auth.user?.role !== 'admin') {
    await auth.logout(false)
    return { path: '/login', query: { reason: 'admin_required' } }
  }
  if (to.meta.guest && auth.isAuthenticated) return '/dashboard'
})

window.addEventListener('lne:unauthorized', () => {
  const auth = useAuthStore()
  auth.logout(false)
  if (router.currentRoute.value.path !== '/login') router.push('/login')
})

export default router
