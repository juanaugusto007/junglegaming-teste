import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: any[]) {
  return twMerge(clsx(inputs))
}

const buttonVariants = cva(
  'inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-50 select-none cursor-pointer',
  {
    variants: {
      variant: {
        brand: 'bg-brand text-background hover:bg-brand-hover font-semibold shadow-md active:scale-[0.98]',
        secondary: 'bg-surface-elevated text-text-primary hover:bg-surface-hover border border-surface-border',
        outline: 'border border-surface-border text-text-primary hover:border-brand hover:text-brand bg-transparent',
        ghost: 'text-text-secondary hover:text-text-primary hover:bg-surface-elevated',
        danger: 'bg-status-error text-white hover:bg-red-600',
      },
      size: {
        sm: 'h-9 px-3 text-xs rounded-sm',
        md: 'h-11 px-5 text-sm rounded-sm',
        lg: 'h-13 px-8 text-base font-semibold rounded-sm',
        icon: 'h-10 w-10 p-0 rounded-sm',
      },
    },
    defaultVariants: {
      variant: 'brand',
      size: 'md',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  isLoading?: boolean
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(buttonVariants({ variant, size, className }))}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8v8H4z"
              ></path>
            </svg>
            <span>Processando...</span>
          </span>
        ) : (
          children
        )}
      </button>
    )
  }
)
Button.displayName = 'Button'
