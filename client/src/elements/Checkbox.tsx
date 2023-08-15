import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cn } from '../utils/strings'
import { Controller, useFormContext } from 'react-hook-form'

type CheckboxProps = RadixCheckbox.CheckboxProps & {
  label?: string
  error?: string
}

export const Checkbox = React.forwardRef<HTMLButtonElement, CheckboxProps>(
  ({ className, disabled, label, error, ...props }, ref) => {
    return (
      <div>
        <div className="flex items-center gap-3">
          <RadixCheckbox.Root
            ref={ref}
            className={cn(
              'ring-2 ring-primary w-5 h-5 flex items-center justify-center rounded',
              disabled && 'opacity-50 pointer-events-none',
              className,
            )}
            {...props}
          >
            <RadixCheckbox.Indicator>
              <FontAwesomeIcon icon={faCheck} />
            </RadixCheckbox.Indicator>
          </RadixCheckbox.Root>

          {label && <label className="Label">{label}</label>}
        </div>

        {error && <div className="text-sm text-danger-light">{error}</div>}
      </div>
    )
  },
)

type ControlledCheckboxProps = React.ButtonHTMLAttributes<HTMLButtonElement> & CheckboxProps & { name: string }

export const ControlledCheckbox: React.FC<ControlledCheckboxProps> = ({ name, ...props }) => {
  const { control } = useFormContext()
  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, ...rest } }) => (
        <Checkbox checked={value} onCheckedChange={onChange} {...rest} {...props} />
      )}
    />
  )
}
