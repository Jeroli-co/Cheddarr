import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '../elements/Input'
import { PlexSettings, PostPlexSettings } from '../schemas/media-servers'
import { Switch } from '../elements/Switch'
import { ControlledCheckbox } from '../elements/Checkbox'
import { cn } from '../utils/strings'

type PlexSettingsFormProps = {
  defaultSettings?: PlexSettings
  className?: string
}

export const PlexSettingsForm = ({ defaultSettings, className }: PlexSettingsFormProps) => {
  const [isPortNeeded, setIsPortNeeded] = useState(!!defaultSettings?.port)

  const {
    register,
    formState: { errors },
    setValue,
  } = useFormContext<PostPlexSettings>()

  const onPortNeededChange = () => {
    if (isPortNeeded) setValue('port', undefined)
    setIsPortNeeded(!isPortNeeded)
  }

  return (
    <div className={cn('space-y-6', className)}>
      <Input label="Config name" type="text" error={errors.name?.message} {...register('name')} />

      <Input label="Authentication token" type="text" error={errors.apiKey?.message} {...register('apiKey')} />

      <Input label="Hostname or IP Address" type="text" error={errors.host?.message} {...register('host')} />

      <div className="flex flex-col gap-3">
        <Switch label="Port needed ?" checked={isPortNeeded} onChange={() => onPortNeededChange()} />
        {isPortNeeded && (
          <Input
            type="number"
            placeholder="34000"
            error={errors.port?.message}
            disabled={!isPortNeeded}
            {...register('port')}
          />
        )}
      </div>

      <Input label="Server ID" type="text" error={errors.serverId?.message} {...register('serverId')} />

      <Input label="Server name" type="text" error={errors.serverName?.message} {...register('serverName')} />

      <ControlledCheckbox label="SSL" name="ssl" />
    </div>
  )
}
