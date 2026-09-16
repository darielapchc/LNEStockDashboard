import api from './api'

export default {
  getUsuarios: () => api.get('/usuarios'),
  getUsuario: (id) => api.get(`/usuarios/${id}`),
  updateStatus: (id, isActive) => api.patch(`/usuarios/${id}/status`, { isActive }),
  resetPassword: (id, password) => api.put(`/usuarios/${id}/password`, { password }),
}
