import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPriceRange(min?: number | null, max?: number | null): string {
  if (!min && !max) return 'Fiyat bilgisi için iletişime geçin'
  if (min && max) {
    if (min === max) return `${min.toLocaleString('tr-TR')} ₺`
    return `${min.toLocaleString('tr-TR')} ₺ - ${max.toLocaleString('tr-TR')} ₺`
  }
  if (min) return `${min.toLocaleString('tr-TR')} ₺'den başlayan`
  return `${max!.toLocaleString('tr-TR')} ₺'ye kadar`
}

export function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[üÜ]/g, 'u')
    .replace(/[öÖ]/g, 'o')
    .replace(/[şŞ]/g, 's')
    .replace(/[çÇ]/g, 'c')
    .replace(/[ğĞ]/g, 'g')
    .replace(/[ıİ]/g, 'i')
    .replace(/[^a-z0-9\-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
}

export function truncate(text: string, length: number): string {
  if (text.length <= length) return text
  return text.slice(0, length) + '...'
}
