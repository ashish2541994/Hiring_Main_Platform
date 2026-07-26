import { format, formatDistanceToNow } from 'date-fns'

export const formatDate = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM dd, yyyy')
}

export const formatDateTime = (date) => {
  if (!date) return 'N/A'
  return format(new Date(date), 'MMM dd, yyyy HH:mm')
}

export const formatRelativeTime = (date) => {
  if (!date) return 'N/A'
  return formatDistanceToNow(new Date(date), { addSuffix: true })
}

export const formatCurrency = (amount, currency = 'USD') => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount)
}

export const formatNumber = (number) => {
  return new Intl.NumberFormat('en-US').format(number)
}

export const truncateText = (text, maxLength = 100) => {
  if (!text) return ''
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength) + '...'
}

export const capitalizeFirst = (str) => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1)
}

export const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-')
}
