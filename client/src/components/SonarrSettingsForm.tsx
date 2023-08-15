import { useEffect, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useMutation } from 'react-query'
import { Input } from '../elements/Input'
import { Button } from '../elements/button/Button'
import { SonarrSettings, SonarrInstanceInfo, PostSonarrSettings } from '../schemas/media-servers'
import { useAlert } from '../shared/contexts/AlertContext'
import httpClient from '../utils/http-client'
import { ControlledCheckbox } from '../elements/Checkbox'
import { Switch } from '../elements/Switch'
import { NewDivider } from '../shared/components/Divider'

type SonarrSettingsFormProps = {
  defaultSettings?: SonarrSettings
}

export const SonarrSettingsForm = ({ defaultSettings }: SonarrSettingsFormProps) => {
  const { pushDanger, pushSuccess } = useAlert()

  const [isPortNeeded, setIsPortNeeded] = useState(!!defaultSettings?.port)

  const {
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useFormContext<PostSonarrSettings>()

  const onPortNeededChange = () => {
    if (isPortNeeded) setValue('port', undefined)
    setIsPortNeeded(!isPortNeeded)
  }

  const instanceInfoMutation = useMutation({
    mutationFn: () => {
      const data = getValues()
      return httpClient.post<SonarrInstanceInfo>('/settings/sonarr/instance-info', data).then((res) => res.data)
    },
    onSuccess: (data) => {
      const defaultRootFolder = data.rootFolders?.[0]
      if (defaultRootFolder) setValue('rootFolder', defaultRootFolder)

      const defaultAnimRootFolder = data.animeRootFolders?.[0]
      if (defaultAnimRootFolder) setValue('animeRootFolder', defaultAnimRootFolder)

      const defaultQualityProfileID = data.qualityProfiles?.[0].id
      if (defaultQualityProfileID) setValue('qualityProfileId', defaultQualityProfileID)

      const defaultAnimeQualityProfileID = data.animeQualityProfiles?.[0].id
      if (defaultAnimeQualityProfileID) setValue('animeQualityProfileId', defaultAnimeQualityProfileID)

      const defaultTag = data.tags?.map((tag) => tag.id)
      if (defaultTag.length) setValue('tags', defaultTag)

      const defaultAnimeTag = data.animeTags?.map((tag) => tag.id)
      if (defaultAnimeTag.length) setValue('animeTags', defaultAnimeTag)

      if (!defaultSettings) pushSuccess('Successful connection')
    },
    onError: (err) => {
      console.error(err)
      pushDanger('Cannot get instance info')
    },
  })

  useEffect(() => {
    if (defaultSettings) instanceInfoMutation.mutate()
  }, [])

  return (
    <div className="space-y-6">
      {defaultSettings && (
        <>
          <ControlledCheckbox label="Enabled" name="enabled" />
          <ControlledCheckbox label="Set as default config" name="isDefault" />
          <Input
            label="Config name"
            type="text"
            placeholder="For display usage"
            error={errors.name?.message}
            {...register('name')}
          />
        </>
      )}

      <Input value="series_provider" hidden {...register('providerType')} className="hidden" />

      <Input
        label="API key"
        type="text"
        placeholder="Sonarr instance API key"
        error={errors.apiKey?.message}
        {...register('apiKey')}
      />

      <Input label="Hostname or IP Address" type="text" error={errors.host?.message} {...register('host')} />

      <div className="flex flex-col gap-3">
        <Switch label="Port needed ?" checked={isPortNeeded} onChange={() => onPortNeededChange()} />
        {isPortNeeded && (
          <Input
            type="number"
            placeholder="7878"
            error={errors.port?.message}
            disabled={!isPortNeeded}
            {...register('port')}
          />
        )}
      </div>

      <div className="flex flex-col gap-3">
        <label htmlFor="version">Version</label>
        <Controller
          name="version"
          render={({ field: { onChange, ...rest } }) => {
            return (
              <select id="version" onChange={(e) => onChange(parseInt(e.target.value))} {...rest}>
                <option value={3}>3</option>
              </select>
            )
          }}
        />
      </div>

      <ControlledCheckbox label="SSL" name="ssl" />

      <Button isLoading={instanceInfoMutation.isLoading} onClick={() => instanceInfoMutation.mutate()}>
        Get instance info
      </Button>

      {instanceInfoMutation.data && (
        <>
          <NewDivider />

          <div className="flex flex-col gap-3">
            <label htmlFor="rootFolder">Default Root Folder</label>
            <select id="rootFolder" {...register('rootFolder')}>
              {instanceInfoMutation.data.rootFolders.map((rf, index) => (
                <option key={index} value={rf}>
                  {rf}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="animeRootFolder">Default Root Folder (Anime)</label>
            <select id="animeRootFolder" {...register('animeRootFolder')}>
              {instanceInfoMutation.data.animeRootFolders.map((rf, index) => (
                <option key={index} value={rf}>
                  {rf}
                </option>
              ))}
            </select>
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="qualityProfileId">Default Quality Profile</label>
            <Controller
              name="qualityProfileId"
              render={({ field: { onChange, ...rest } }) => {
                return (
                  <select id="qualityProfileId" onChange={(e) => onChange(parseInt(e.target.value))} {...rest}>
                    {instanceInfoMutation.data.qualityProfiles.map((p, index) => (
                      <option key={index} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )
              }}
            />
          </div>

          <div className="flex flex-col gap-3">
            <label htmlFor="animeQualityProfileId">Default Quality Profile</label>
            <Controller
              name="animeQualityProfileId"
              render={({ field: { onChange, ...rest } }) => {
                return (
                  <select id="animeQualityProfileId" onChange={(e) => onChange(parseInt(e.target.value))} {...rest}>
                    {instanceInfoMutation.data.animeQualityProfiles.map((p, index) => (
                      <option key={index} value={p.id}>
                        {p.name}
                      </option>
                    ))}
                  </select>
                )
              }}
            />
          </div>

          {instanceInfoMutation.data.tags.length > 0 ? (
            <div className="flex flex-col gap-3">
              <label htmlFor="tags">Default Tags</label>
              <select id="tags" multiple {...register('tags')}>
                {instanceInfoMutation.data.tags.map((t, index) => (
                  <option key={index} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-warning">Define tags to add them to your configurations</p>
          )}

          {instanceInfoMutation.data.animeTags.length > 0 ? (
            <div className="flex flex-col gap-3">
              <label htmlFor="animeTags">Default Tags</label>
              <select id="animeTags" multiple {...register('animeTags')}>
                {instanceInfoMutation.data.animeTags.map((t, index) => (
                  <option key={index} value={t.id}>
                    {t.name}
                  </option>
                ))}
              </select>
            </div>
          ) : (
            <p className="text-warning">Define anime tags to add them to your configurations</p>
          )}
        </>
      )}
    </div>
  )
}
