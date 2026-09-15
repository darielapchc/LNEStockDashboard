import api from './api'
export default {
  getMovimientos: () => api.get('/movimientos'),
  createMovimiento: (data) => api.post('/movimientos', data),
}
