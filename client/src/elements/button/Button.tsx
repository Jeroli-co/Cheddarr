import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '../../utils/strings'
import { Loader } from '../../shared/components/PageLoader'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 tracking-tight',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        plex: '',
      },
      variant: {
        contained: '',
        outlined: 'bg-transparent',
        text: 'border-transparent bg-transparent',
        link: '',
      },
      size: {
        sm: 'min-h-[32px] min-w-[32px] px-3 py-1.5 text-sm',
        md: 'min-h-[44px] min-w-[44px] px-6 py-2',
        lg: 'min-h-[72px] min-w-[72px] px-8 py-3 text-lg',
      },
    },
    compoundVariants: [
      {
        color: 'primary',
        variant: 'contained',
        className:
          'border-primary bg-primary text-primary-lighter hover:border-primary-dark hover:bg-primary-dark hover:text-primary-light',
      },
      {
        color: 'secondary',
        variant: 'contained',
        className:
          'border-secondary-lighter bg-secondary-dark hover:border-secondary-light hover:bg-secondary',
      },
      {
        color: 'plex',
        variant: 'contained',
        className: 'border-plex bg-plex',
      },
      {
        color: 'primary',
        variant: 'outlined',
        className: 'border-primary text-primary hover:bg-primary-light',
      },
      {
        color: 'secondary',
        variant: 'outlined',
        className:
          'border-secondary-lighter bg-secondary-dark hover:border-secondary-light hover:bg-secondary',
      },
      {
        color: 'primary',
        variant: 'text',
        className: 'border-transparent text-primary-950 ring-primary-500 hover:bg-primary-100',
      },
      {
        variant: 'link',
        className:
          'min-h-0 min-w-0 whitespace-normal border-0 p-0 text-inherit hover:underline focus-visible:underline',
      },
    ],
    defaultVariants: {
      color: 'primary',
      variant: 'contained',
      size: 'md',
    },
  }
)

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    loading?: boolean
  }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = 'primary',
      variant = 'contained',
      size = 'md',
      asChild,
      loading,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ color, variant, size, className }),
          (loading || disabled) && 'pointer-events-none',
          disabled && 'opacity-50'
        )}
        disabled={loading || disabled}
        type={type}
        {...props}
      >
        {loading ? <Loader /*size={loaderSize}*/ /> : children}
      </Comp>
    )
  }
)

Button.displayName = 'Button'
