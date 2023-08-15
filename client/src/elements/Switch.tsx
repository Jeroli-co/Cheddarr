import { Switch as HLUISwitch } from '@headlessui/react'
import { cn } from '../utils/strings'

type SwitchProps = {
  label: string
  checked: boolean
  onChange: (checked: boolean) => void
  className?: string
}

export const Switch = ({ label, checked, className, onChange }: SwitchProps) => {
  return (
    <HLUISwitch.Group>
      <div className={cn('flex items-center', className)}>
        <HLUISwitch.Label className="mr-4">{label}</HLUISwitch.Label>
        <HLUISwitch
          checked={checked}
          onChange={onChange}
          className={cn(
            'ring-2',
            checked ? 'bg-success-light ring-success' : 'bg-danger-light ring-danger',
            'relative inline-flex items-center h-6 w-11 rounded-full transition-colors',
            'focus:outline-none focus:ring-offset-1',
          )}
        >
          <span
            className={`${
              checked ? 'translate-x-6' : 'translate-x-1'
            } inline-block h-4 w-4 transform rounded-full bg-white transition-transform`}
          />
        </HLUISwitch>
      </div>
    </HLUISwitch.Group>
  )
}
