import api from './api'
export default {
  getCategorias: () => api.get('/categorias'),
  getCategoria: (id) => api.get(`/categorias/${id}`),
  createCategoria: (data) => api.post('/categorias', data),
  updateCategoria: (id, data) => api.put(`/categorias/${id}`, data),
  deleteCategoria: (id) => api.delete(`/categorias/${id}`),
}
