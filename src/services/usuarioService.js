// El backend actual aún no expone rutas de usuarios. Se mantiene este módulo
// para conectar el recurso cuando el contrato esté disponible.
export default {
  getUsuarios: () => Promise.reject(new Error('El backend no expone /usuarios todavía.')),
}
