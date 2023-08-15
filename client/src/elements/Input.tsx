import * as React from 'react'
import { cva, VariantProps } from 'class-variance-authority'
import { cn } from '../utils/strings'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IconProp } from '@fortawesome/fontawesome-svg-core'
import { Slot } from '@radix-ui/react-slot'

const inputVariants = cva(
  'w-full px-3 py-2 md:py-3 border border-primary rounded bg-primary-dark opacity-70 focus:opacity-100 outline-none',
)

type InputProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> &
  VariantProps<typeof inputVariants> & {
    label?: string | React.ReactNode
    type?: 'text' | 'password' | 'email' | 'number' | 'search'
    icon?: IconProp
    error?: string
    asChild?: boolean
  }

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', className, disabled, label, icon, error, asChild, hidden, ...props }, ref) => {
    if (hidden) return <input ref={ref} type={type} disabled={disabled} hidden {...props} />

    const Comp = asChild ? Slot : 'input'

    return (
      <div className="w-full space-y-1">
        {label && typeof label === 'string' ? <label>{label}</label> : label}

        <div className={cn('w-full', icon && 'relative')}>
          {icon && <FontAwesomeIcon icon={icon} className="absolute top-1/2 transform -translate-y-1/2 left-3" />}
          <Comp
            ref={ref}
            type={type}
            className={cn(inputVariants({ className }), disabled && 'opacity-50 pointer-events-none', icon && 'pl-10')}
            disabled={disabled}
            {...props}
          />
        </div>

        {error && <div className="text-sm text-danger-light">{error}</div>}
      </div>
    )
  },
)
