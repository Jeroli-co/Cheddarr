import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { ProviderQualityProfile, ProviderTag, postMediaProviderSettingsSchema } from './RadarrSettingsForm'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useQueryClient } from 'react-query'
import { useAlert } from '../shared/contexts/AlertContext'
import httpClient from '../utils/http-client'
import { Checkbox } from '../elements/checkbox/Checkbox'
import { Input } from '../elements/Input'
import { Button } from '../elements/button/Button'

const postSonarrSettingsSchema = postMediaProviderSettingsSchema.merge(
  z.object({
    providerType: z.literal('series_provider'),
    animeRootFolder: z.string({ required_error: 'Anime root folder is required' }).trim(),
    animeQualityProfileId: z.string({ required_error: 'Anime quality profile is required' }).trim(),
    animeTags: z.array(z.string()),
  }),
)

type PostSonarrSettingsFormData = z.infer<typeof postSonarrSettingsSchema>

export type SonarrSettings = PostSonarrSettingsFormData & {
  id: string
}

type SonarrInstanceInfo = {
  rootFolders: string[]
  animeRootFolders: string[]
  qualityProfiles: ProviderQualityProfile[]
  animQualityProfiles: ProviderQualityProfile[]
  tags: ProviderTag[]
}

type SonarrSettingsFormProps = {
  defaultSettings?: SonarrSettings
}

export const SonarrSettingsForm = ({ defaultSettings }: SonarrSettingsFormProps) => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const [instanceInfo, setInstanceInfo] = useState<SonarrInstanceInfo | undefined>(undefined)
  const [isPortNeeded, setIsPortNeeded] = useState(!!defaultSettings?.port)

  const {
    register,
    formState: { errors },
    getValues,
    resetField,
    handleSubmit,
  } = useForm<PostSonarrSettingsFormData>({
    mode: 'onSubmit',
    resolver: zodResolver(postSonarrSettingsSchema),
    defaultValues: { ...defaultSettings },
  })

  const testInstanceConnection = async () => {
    httpClient.post<SonarrInstanceInfo>('/settings/sonarr/instance-info', getValues()).then((res) => {
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

    httpClient.delete(`/settings/sonarr/${defaultSettings?.id}`).then((res) => {
      if (res.status === 200) {
        pushSuccess('Configuration deleted')
      } else {
        pushDanger('Cannot delete configuration')
      }

      queryClient.invalidateQueries(['settings', 'sonarr'])
    })
  }

  const onSubmitEdit = handleSubmit(async (data) => {
    if (!defaultSettings) return

    await httpClient.put<SonarrSettings>(`/settings/sonarr${defaultSettings.id}`, data).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot update configuration')
        return undefined
      }

      pushSuccess('Configuration updated')
      queryClient.invalidateQueries(['settings', 'sonarr'])
    })
  })

  const onSubmitCreate = handleSubmit(async (data) => {
    await httpClient.post<SonarrSettings>('/settings/sonarr', data).then((res) => {
      if (res.status === 409) {
        pushDanger('Config already exist')
        return undefined
      }

      if (res.status !== 201) {
        pushDanger('Cannot create configuration')
        return undefined
      }

      pushSuccess('Configuration created')
      queryClient.invalidateQueries(['settings', 'sonarr'])
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
        placeholder="Sonarr instance API key"
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
            <label>Default Root Folder (Anime)</label>
            <select {...register('animeRootFolder')}>
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
            <label>Default Quality Profile (Anime)</label>
            <select {...register('animeQualityProfileId')}>
              {instanceInfo.qualityProfiles.map((p, index) => (
                <option key={index} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label> Default Tags</label>
            <select multiple {...register('tags')}>
              {instanceInfo &&
                instanceInfo.tags.map((t, index) => (
                  <option key={index} value={t.id}>
                    {t.name}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label> Default Tags (Anime)</label>
            <select multiple {...register('animeTags')}>
              {instanceInfo.tags.map((t, index) => (
                <option key={index} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </div>

          {defaultSettings && (
            <Button type="button" onClick={() => deleteSettings()}>
              Delete
            </Button>
          )}
          <Button type="submit">Save</Button>
        </>
      )}
    </form>
  )
}
