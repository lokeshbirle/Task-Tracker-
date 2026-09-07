import { format, formatDistanceToNow, isValid } from 'date-fns'

export function formatDate(value) {
  if (!value) return '—'
  const d = new Date(value)
  return isValid(d) ? format(d, 'dd MMM yyyy') : '—'
}

export function formatDateTime(value) {
  if (!value) return '—'
  const d = new Date(value)
  return isValid(d) ? format(d, 'dd MMM yyyy, HH:mm') : '—'
}

export function formatRelative(value) {
  if (!value) return '—'
  const d = new Date(value)
  return isValid(d) ? formatDistanceToNow(d, { addSuffix: true }) : '—'
}

// <input type="date"> needs yyyy-MM-dd; backend Instant fields accept ISO strings on the way back
export function toDateInputValue(value) {
  if (!value) return ''
  const d = new Date(value)
  return isValid(d) ? format(d, 'yyyy-MM-dd') : ''
}
