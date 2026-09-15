import api from './api'
export default {
  getProductos: () => api.get('/productos'),
  getProducto: (id) => api.get(`/productos/${id}`),
  createProducto: (data) => api.post('/productos', data),
  updateProducto: (id, data) => api.put(`/productos/${id}`, data),
  deleteProducto: (id) => api.delete(`/productos/${id}`),
}
