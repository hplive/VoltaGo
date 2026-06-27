import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number) {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
  }).format(value)
}

export function formatDate(date: string) {
  return new Intl.DateTimeFormat('pt-PT', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(new Date(date))
}

export function getTipoLabel(tipo: string) {
  const map: Record<string, string> = {
    condominio: 'Condomínio',
    restaurante: 'Restaurante',
    casa: 'Casa',
  }
  return map[tipo] || tipo
}

export function getTipoEmoji(tipo: string) {
  const map: Record<string, string> = {
    condominio: '🏢',
    restaurante: '☕',
    casa: '🏠',
  }
  return map[tipo] || '📍'
}
