import React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { type VariantProps, cva } from 'class-variance-authority'
import { cn } from '../../utils/strings'
import { Spinner } from '../../shared/components/Spinner'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full border-2 tracking-tight',
  {
    variants: {
      color: {
        primary: '',
        secondary: '',
        success: '',
        danger: '',
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
      mode: {
        normal: '',
        square: '',
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
          'border-secondary bg-secondary text-secondary-lighter hover:border-secondary-dark hover:bg-secondary-dark hover:text-secondary-light',
      },
      {
        color: 'success',
        variant: 'contained',
        className:
          'border-success bg-success text-success-lighter hover:border-success-dark hover:bg-success-dark hover:text-success-light',
      },
      {
        color: 'danger',
        variant: 'contained',
        className:
          'border-danger bg-danger text-danger-lighter hover:border-danger-dark hover:bg-danger-dark hover:text-danger-light',
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
        className: 'border-secondary text-secondary hover:bg-secondary-light',
      },
      {
        color: 'danger',
        variant: 'outlined',
        className: 'border-danger text-danger hover:bg-danger-light',
      },
      {
        color: 'primary',
        variant: 'text',
        className: 'border-transparent text-primary-lighter ring-primary hover:bg-primary-dark',
      },
      {
        mode: 'square',
        size: 'sm',
        className: 'px-1.5',
      },
      {
        mode: 'square',
        size: 'md',
        className: 'px-2',
      },
      {
        mode: 'square',
        size: 'lg',
        className: 'px-3',
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
      mode: 'normal',
    },
  },
)

type ButtonProps = Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, 'color'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
    isLoading?: boolean
  }

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      color = 'primary',
      variant = 'contained',
      size = 'md',
      mode = 'normal',
      asChild,
      isLoading: loading,
      disabled,
      className,
      children,
      type = 'button',
      ...props
    },
    ref,
  ) => {
    const Comp = asChild ? Slot : 'button'
    return (
      <Comp
        ref={ref}
        className={cn(
          buttonVariants({ color, variant, size, mode, className }),
          (loading || disabled) && 'pointer-events-none',
          disabled && 'opacity-50',
        )}
        disabled={loading || disabled}
        type={type}
        {...props}
      >
        {loading ? <Spinner size={size} /> : children}
      </Comp>
    )
  },
)

Button.displayName = 'Button'