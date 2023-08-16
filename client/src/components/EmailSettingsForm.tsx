import { useFormContext } from 'react-hook-form'
import { Input } from '../elements/Input'
import { ControlledCheckbox } from '../elements/Checkbox'
import { cn } from '../utils/strings'
import { EmailSettings, PostEmailSettings } from '../schemas/notifications-services'

type EmailSettingsFormProps = {
  defaultSettings?: EmailSettings
  className?: string
}

export const EmailSettingsForm = ({ className }: EmailSettingsFormProps) => {
  const {
    register,
    formState: { errors },
  } = useFormContext<PostEmailSettings>()

  return (
    <div className={cn('space-y-6', className)}>
      <ControlledCheckbox label="Enabled" name="settings.enabled" />

      <Input
        label="Hostname"
        type="text"
        error={errors.settings?.smtpHost?.message}
        {...register('settings.smtpHost')}
      />

      <Input label="Port" type="number" error={errors.settings?.smtpPort?.message} {...register('settings.smtpPort')} />

      <Input
        label="Username"
        type="text"
        error={errors.settings?.smtpUser?.message}
        {...register('settings.smtpUser')}
      />

      <Input
        label="Password"
        type="password"
        error={errors.settings?.smtpPassword?.message}
        {...register('settings.smtpPassword')}
      />

      <Input
        label="Sender address"
        type="email"
        error={errors.settings?.senderAddress?.message}
        {...register('settings.senderAddress')}
      />

      <Input
        label="Sender name"
        type="text"
        error={errors.settings?.senderName?.message}
        {...register('settings.senderName')}
      />

      <ControlledCheckbox label="SSL" name="settings.ssl" />
    </div>
  )
}
