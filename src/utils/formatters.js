export const money = (value) => (
  value === null || value === undefined
    ? '--'
    : new Intl.NumberFormat('es-HN', {
        style: 'currency',
        currency: 'HNL'
      }).format(Number(value))
)

export const dateTime = (value) => (
  value
    ? new Intl.DateTimeFormat('es-HN', {
        dateStyle: 'medium',
        timeStyle: 'short'
      }).format(new Date(value))
    : '--'
)

export const errorMessage = (
  error,
  fallback = 'Ocurrió un error. Intenta de nuevo.'
) => {
  const status = error?.response?.status
  const responseData = error?.response?.data?.data || error?.response?.data
  const apiMessage = responseData?.message
    || responseData?.errors?.[0]?.msg
  if (apiMessage) return apiMessage
  if (status === 401) return 'Tu sesión no es válida o ha expirado. Inicia sesión nuevamente.'
  if (status === 403) return 'No tienes permisos para realizar esta acción.'
  if (status === 404) return 'No se encontró el recurso solicitado.'
  if ([400, 409, 422].includes(status)) return 'La información enviada no es válida o entra en conflicto.'
  if (status >= 500) return 'El servidor no está disponible. Intenta de nuevo más tarde.'
  if (['ECONNABORTED', 'ETIMEDOUT'].includes(error?.code)) return 'El servidor tardó demasiado en responder.'
  if (!error?.response && (error?.request || error?.code === 'ERR_NETWORK')) return 'No se pudo conectar con el servidor.'
  return error?.message || fallback
}

export const initials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase() || 'A'
