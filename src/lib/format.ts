import type { EnrollmentStatus } from '@/types/database'

export function formatNaira(amount: number | string | null | undefined) {
  const value = Number(amount ?? 0)
  if (Number.isNaN(value)) return '₦0'
  return `₦${value.toLocaleString('en-NG', { maximumFractionDigits: 0 })}`
}

export function enrollmentStatusLabel(status: EnrollmentStatus) {
  const labels: Record<EnrollmentStatus, string> = {
    pending_payment: 'Payment Required',
    payment_submitted: 'Payment Under Review',
    payment_verified: 'Payment Verified',
    enrolled: 'Enrolled',
    active: 'Active',
    completed: 'Completed',
    cancelled: 'Cancelled',
    rejected: 'Rejected',
  }
  return labels[status]
}

export function formatDate(value: string | null) {
  if (!value) return 'Date to be announced'
  return new Intl.DateTimeFormat('en-NG', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  }).format(new Date(value))
}

export function errorMessage(error: unknown) {
  if (error instanceof Error) return error.message
  if (error && typeof error === 'object' && 'message' in error) {
    return String((error as { message: unknown }).message)
  }
  return 'Something went wrong. Please try again.'
}

export function initials(name: string) {
  const parts = name.trim().split(/\s+/).slice(0, 2)
  return parts.map((part) => part[0]?.toUpperCase() ?? '').join('') || 'VX'
}
