import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck } from '@fortawesome/free-solid-svg-icons'
import * as RadixCheckbox from '@radix-ui/react-checkbox'
import { cn } from '../../utils/strings'

import './checkbox.css'

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
            className={cn('CheckboxRoot', disabled && 'opacity-50 pointer-events-none')}
            {...props}
          >
            <RadixCheckbox.Indicator className="CheckboxIndicator">
              <FontAwesomeIcon icon={faCheck} />
            </RadixCheckbox.Indicator>
          </RadixCheckbox.Root>

          {label && <label className="Label">{label}</label>}
        </div>

        {error && <div className="text-sm text-danger-light">{error}</div>}
      </div>
    )
  }
)
