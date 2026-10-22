import React from 'react'
import { cn } from './Button'

export interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'raro' | 'comum' | 'lendario' | 'unico' | 'outline' | 'success'
}

export const Badge: React.FC<BadgeProps> = ({
  className,
  variant = 'raro',
  children,
  ...props
}) => {
  const variantStyles = {
    raro: 'bg-brand-bg text-brand border border-brand-muted',
    comum: 'bg-surface-elevated text-text-secondary border border-surface-border',
    lendario: 'bg-amber-950/60 text-amber-400 border border-amber-600',
    unico: 'bg-purple-950/60 text-purple-300 border border-purple-600',
    outline: 'border border-surface-border text-text-secondary',
    success: 'bg-emerald-950/60 text-emerald-400 border border-emerald-600',
  }

  return (
    <span
      className={cn(
        'inline-flex items-center px-2 py-0.5 text-[11px] font-mono font-semibold uppercase tracking-wider',
        variantStyles[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export const Skeleton: React.FC<React.HTMLAttributes<HTMLDivElement>> = ({
  className,
  ...props
}) => {
  return (
    <div
      className={cn('skeleton-shimmer rounded-sm', className)}
      aria-hidden="true"
      {...props}
    />
  )
}
