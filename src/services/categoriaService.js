import api from './api'
export default {
  getCategorias: () => api.get('/categorias'),
  createCategoria: (data) => api.post('/categorias', data),
  updateCategoria: (id, data) => api.put(`/categorias/${id}`, data),
  deleteCategoria: (id) => api.delete(`/categorias/${id}`),
}
