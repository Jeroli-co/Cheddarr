import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { Input } from '../../../../../elements/Input'
import { PlexSettings, PostPlexSettings } from '../../../../../schemas/media-servers'
import { Switch } from '../../../../../elements/Switch'
import { ControlledCheckbox } from '../../../../../elements/Checkbox'

type PlexSettingsFormProps = {
  defaultSettings?: PlexSettings
}

export const PlexSettingsForm = ({ defaultSettings }: PlexSettingsFormProps) => {
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

  // const deleteSettings = () => {
  //   if (!defaultSettings) return

  //   httpClient.delete(`/settings/plex/${defaultSettings.id}`).then((res) => {
  //     if (res.status !== 204) {
  //       pushDanger('Cannot delete config')
  //       return
  //     }

  //     pushSuccess('Configuration deleted')
  //     queryClient.invalidateQueries(['settings', 'plex'])
  //   })
  // }

  // const onSubmitCreate = handleSubmit((data) => {
  //   return httpClient.post<PlexSettings>('/settings/plex', data).then((res) => {
  //     if (res.status === 409) {
  //       pushDanger('Config already added')
  //       return
  //     }

  //     if (res.status !== 201) {
  //       pushDanger('Cannot create config')
  //       return
  //     }

  //     pushSuccess('Configuration created')
  //     queryClient.invalidateQueries(['settings', 'plex'])
  //   })
  // })

  // const onSubmitEdit = handleSubmit((data) => {
  //   if (!defaultSettings) return

  //   return httpClient.put<PlexSettings>(`/settings/plex/${defaultSettings.id}`, data).then((res) => {
  //     if (res.status !== 200) {
  //       pushDanger('Cannot update config')
  //       return
  //     }

  //     pushSuccess('Configuration updated')
  //     queryClient.invalidateQueries(['settings', 'plex'])
  //   })
  // })

  return (
    <div className="space-y-6">
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
