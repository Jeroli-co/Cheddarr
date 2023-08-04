import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { Input } from '../../../../../elements/Input'
import { providerBaseSettingsSchema } from '../../../../../components/RadarrSettingsForm'
import { z } from 'zod'
import { Checkbox } from '../../../../../elements/checkbox/Checkbox'
import httpClient from '../../../../../http-client'
import { useAlert } from '../../../../../shared/contexts/AlertContext'
import { useQueryClient } from 'react-query'
import { Button } from '../../../../../elements/button/Button'

const postPlexSettingsSchema = providerBaseSettingsSchema.merge(
  z.object({
    serverName: z.string({ required_error: 'Server name is required' }).trim(),
    serverId: z.string({ required_error: 'Server ID is required' }).trim(),
    libraries: z.array(z.number()),
  })
)

type PostPlexSettingsFormData = z.infer<typeof postPlexSettingsSchema>

export type PlexSettings = PostPlexSettingsFormData & {
  id: string
}

type PlexSettingsFormProps = {
  defaultSettings?: PlexSettings
}

export const PlexSettingsForm = ({ defaultSettings }: PlexSettingsFormProps) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()
  const [isPortNeeded, setIsPortNeeded] = useState(!!defaultSettings?.port)

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm<PostPlexSettingsFormData>()

  const deleteSettings = () => {
    if (!defaultSettings) return

    httpClient.delete(`/settings/plex/${defaultSettings.id}`).then((res) => {
      if (res.status !== 204) {
        pushDanger('Cannot delete config')
        return
      }

      pushSuccess('Configuration deleted')
      queryClient.invalidateQueries(['settings', 'plex'])
    })
  }

  const onSubmitCreate = handleSubmit((data) => {
    return httpClient.post<PostPlexSettingsFormData>('/settings/plex', data).then((res) => {
      if (res.status === 409) {
        pushDanger('Config already added')
        return
      }

      if (res.status !== 201) {
        pushDanger('Cannot create config')
        return
      }

      pushSuccess('Configuration created')
      queryClient.invalidateQueries(['settings', 'plex'])
    })
  })

  const onSubmitEdit = handleSubmit((data) => {
    if (!defaultSettings) return

    return httpClient
      .put<PostPlexSettingsFormData>(`/settings/plex/${defaultSettings.id}`, data)
      .then((res) => {
        if (res.status !== 200) {
          pushDanger('Cannot update config')
          return
        }

        pushSuccess('Configuration updated')
        queryClient.invalidateQueries(['settings', 'plex'])
      })
  })

  return (
    <form onSubmit={defaultSettings ? onSubmitEdit : onSubmitCreate}>
      <Input label="Config name" type="text" error={errors.name?.message} {...register('name')} />

      <Input
        label="Authentication token"
        type="text"
        error={errors.apiKey?.message}
        {...register('apiKey')}
      />

      <Input
        label="Hostname or IP Address"
        type="text"
        error={errors.host?.message}
        {...register('host')}
      />

      <Input
        label={
          <label>
            Port <Checkbox checked={isPortNeeded} onChange={() => setIsPortNeeded(!isPortNeeded)} />
          </label>
        }
        type="number"
        placeholder="34000"
        error={errors.port?.message}
        disabled={!isPortNeeded}
        {...register('port')}
      />

      <Input
        label="Server ID"
        type="text"
        error={errors.serverId?.message}
        {...register('serverId')}
      />

      <Input
        label="Server name"
        type="text"
        error={errors.serverName?.message}
        {...register('serverName')}
      />

      <Checkbox label="SSL" {...register('ssl')} />

      {defaultSettings && (
        <Button type="button" onClick={() => deleteSettings()}>
          Delete
        </Button>
      )}
      <Button type="submit">Save</Button>
    </form>
  )
}
