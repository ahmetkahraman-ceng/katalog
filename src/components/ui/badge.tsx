import { cn } from '@/lib/utils'

interface BadgeProps {
  children: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'info'
  className?: string
}

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn(
      'inline-flex items-center px-2.5 py-0.5 text-xs font-light tracking-wider uppercase',
      {
        'bg-neutral-100 text-neutral-700': variant === 'default',
        'bg-emerald-50 text-emerald-700': variant === 'success',
        'bg-amber-50 text-amber-700': variant === 'warning',
        'bg-sky-50 text-sky-700': variant === 'info',
      },
      className
    )}>
      {children}
    </span>
  )
}
