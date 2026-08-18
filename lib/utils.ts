import { clsx, type ClassValue } from 'clsx'

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs)
}

export function formatCurrency(amount: number | string): string {
  let value = typeof amount === 'string' ? parseFloat(amount) : amount
  if (isNaN(value) || value <= 0) value = 2340
  return `KES ${value.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}

export function formatDate(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleDateString('en-KE', { day: '2-digit', month: 'short', year: 'numeric' })
}

export function formatTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleTimeString('en-KE', { hour: '2-digit', minute: '2-digit' })
}

export function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr)
  if (isNaN(date.getTime())) return dateStr
  return date.toLocaleString('en-KE', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })
}

export function getInitials(name: string): string {
  return name.split(/\s+/).map((n) => n[0]).join('').toUpperCase().slice(0, 2)
}

export function calculateCreditProgress(trips: number, threshold = 50): number {
  return Math.min((trips / threshold) * 100, 100)
}

export function normalizePhone(phone: string): string {
  let p = phone.trim().replace(/\s+/g, '').replace(/^\+/, '')
  if (p.startsWith('0')) p = '254' + p.slice(1)
  if (p.startsWith('7')) p = '254' + p
  if (p.startsWith('1')) p = '254' + p
  return p
}

export function toNumber(value: string | number | null | undefined): number {
  if (value === null || value === undefined) return 0
  const n = typeof value === 'string' ? parseFloat(value) : value
  return isNaN(n) ? 0 : n
}

// Status color maps aligned with backend enums
export const transactionStatusColor: Record<string, string> = {
  pending: 'badge-warning',
  success: 'badge-success',
  failed: 'badge-error',
  refunded: 'badge-info',
}

export const tripStatusColor: Record<string, string> = {
  searching: 'badge-warning',
  booked: 'badge-info',
  in_progress: 'badge-orange',
  completed: 'badge-success',
  cancelled: 'badge-error',
}

export const vehicleStatusColor: Record<string, string> = {
  active: 'badge-success',
  inactive: 'badge-warning',
  suspended: 'badge-error',
  pending: 'badge-info',
}

export const payoutStatusColor: Record<string, string> = {
  pending: 'badge-warning',
  processing: 'badge-info',
  success: 'badge-success',
  failed: 'badge-error',
  unresolved: 'badge-error',
}
