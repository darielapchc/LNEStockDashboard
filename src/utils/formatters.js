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
) => error?.response?.data?.message
  || error?.response?.data?.errors?.[0]?.msg
  || error?.message
  || fallback

export const initials = (name = '') => name
  .split(' ')
  .filter(Boolean)
  .slice(0, 2)
  .map((part) => part[0])
  .join('')
  .toUpperCase() || 'A'
