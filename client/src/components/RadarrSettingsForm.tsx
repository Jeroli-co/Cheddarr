import { useEffect, useState } from 'react'
import { Input } from '../elements/Input'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useAlert } from '../shared/contexts/AlertContext'
import httpClient from '../utils/http-client'
import { Button } from '../elements/button/Button'
import { useQueryClient } from 'react-query'
import { Checkbox } from '../elements/checkbox/Checkbox'

export type ProviderQualityProfile = {
  id: number
  name: string
}

export type ProviderTag = {
  id: number
  name: string
}

export const providerBaseNetworkSettingsSchema = z.object({
  host: z.string({ required_error: 'Host is required' }).trim(),
  port: z.number().int().min(1).max(65535),
  ssl: z.boolean(),
  apiKey: z.string({ required_error: 'API key is required' }).trim(),
  version: z.number({ required_error: 'Version is required' }),
})

export const providerBaseSettingsSchema = providerBaseNetworkSettingsSchema.merge(
  z.object({
    name: z.string({ required_error: 'Name is required' }).trim(),
    enabled: z.boolean(),
  }),
)

// type ProviderBaseSettings = z.infer<typeof providerSettingsSchema>

export const postMediaProviderSettingsSchema = providerBaseSettingsSchema.merge(
  z.object({
    isDefault: z.boolean(),
    rootFolder: z.string({ required_error: 'Root folder is required' }).trim(),
    qualityProfileId: z.number({ required_error: 'Quality profile is required' }),
    tags: z.array(z.string()),
  }),
)

const postRadarrSettingsSchema = postMediaProviderSettingsSchema.merge(
  z.object({
    providerType: z.literal('movies_provider'),
  }),
)

type PostRadarrSettingsFormData = z.infer<typeof postRadarrSettingsSchema>

export type RadarrSettings = PostRadarrSettingsFormData & {
  id: string
}

type RadarrInstanceInfo = {
  rootFolders: string[]
  qualityProfiles: ProviderQualityProfile[]
  tags: ProviderTag[]
}

type RadarrSettingsFormProps = {
  defaultSettings?: RadarrSettings
}

export const RadarrSettingsForm = ({ defaultSettings }: RadarrSettingsFormProps) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const [instanceInfo, setInstanceInfo] = useState<RadarrInstanceInfo | undefined>(undefined)
  const [isPortNeeded, setIsPortNeeded] = useState(!!defaultSettings?.port)

  const {
    register,
    formState: { errors },
    getValues,
    resetField,
    handleSubmit,
  } = useForm<PostRadarrSettingsFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(postRadarrSettingsSchema),
    defaultValues: { ...defaultSettings },
  })

  const testInstanceConnection = async () => {
    httpClient.post<RadarrInstanceInfo>('/settings/radarr/instance-info', getValues()).then((res) => {
      if (res.status === 200) {
        pushSuccess('Successful connection')
      } else if (res.status !== 200) {
        pushDanger('Cannot get instance info')
      }

      setInstanceInfo(res.data)
    })
  }

  const deleteSettings = () => {
    if (!defaultSettings) return

    httpClient.delete(`/settings/radarr/${defaultSettings?.id}`).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot delete configuration')
        return
      }

      pushSuccess('Configuration deleted')
      queryClient.invalidateQueries(['settings', 'radarr'])
    })
  }

  const onSubmitEdit = handleSubmit(async (data) => {
    if (!defaultSettings) return

    await httpClient.put<RadarrSettings>(`/settings/radarr${defaultSettings.id}`, data).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot update configuration')
        return
      }

      pushSuccess('Configuration updated')
      queryClient.invalidateQueries(['settings', 'radarr'])
    })
  })

  const onSubmitCreate = handleSubmit(async (data) => {
    await httpClient.post<RadarrSettings>('/settings/radarr', data).then((res) => {
      if (res.status === 409) {
        pushDanger('Config already exist')
        return
      }

      if (res.status !== 201) {
        pushDanger('Cannot create configuration')
        return
      }

      pushSuccess('Configuration created')
      queryClient.invalidateQueries(['settings', 'radarr'])
    })
  })

  useEffect(() => {
    if (!isPortNeeded) {
      resetField('port')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPortNeeded])

  return (
    <form onSubmit={defaultSettings ? onSubmitEdit : onSubmitCreate}>
      {defaultSettings && (
        <>
          <Checkbox label="Enabled" {...register('enabled')} />
          <Checkbox label="Set as default config" {...register('isDefault')} />
          <Input
            label="Config name"
            type="text"
            placeholder="For display usage"
            error={errors.name?.message}
            {...register('name')}
          />
        </>
      )}

      <Input
        label="API key"
        type="text"
        placeholder="Radarr instance API key"
        {...register('apiKey')}
        error={errors.apiKey?.message}
      />

      <Input label="Hostname or IP Address" type="text" error={errors.host?.message} {...register('host')} />

      <Input
        label={
          <label>
            Port <Checkbox checked={isPortNeeded} onChange={() => setIsPortNeeded(!isPortNeeded)} />
          </label>
        }
        type="number"
        placeholder="7878"
        error={errors.port?.message}
        disabled={!isPortNeeded}
        {...register('port')}
      />

      <div>
        <label>Version</label>
        <select {...register('version')}>
          <option value={3}>3</option>
        </select>
      </div>

      <Checkbox label="SSL" {...register('ssl')} />

      <Button onClick={() => testInstanceConnection()}>Get instance info</Button>

      {instanceInfo && (
        <>
          <div>
            <label>Default Root Folder</label>
            <select {...register('rootFolder')}>
              {instanceInfo.rootFolders.map((rf, index) => (
                <option key={index} value={rf}>
                  {rf}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Default Quality Profile</label>
            <select {...register('qualityProfileId')}>
              {instanceInfo.qualityProfiles.map((p, index) => (
                <option key={index} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label>Default Tags</label>
            <select multiple {...register('tags')}>
              {instanceInfo.tags.map((t, index) => (
                <option key={index} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>
        </>
      )}

      {defaultSettings && (
        <Button type="button" onClick={() => deleteSettings()}>
          Delete
        </Button>
      )}
      <Button type="submit">Save</Button>
    </form>
  )
}
