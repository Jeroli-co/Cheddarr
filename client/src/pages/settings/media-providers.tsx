import { useState } from 'react'
import { PickMediaProviderTypeModal } from '../../components/PickMediaProviderTypeModal'
import { useRadarrSettings, useSonarrSettings } from '../../hooks/useProvidersSettings'
import { Title } from '../../elements/Title'
import { SettingsPreviewCard } from '../../components/ConfigPreviewCard'
import { Icon } from '../../shared/components/Icon'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from '../../shared/components/Spinner'
import { MediaProviderEnum, MediaProviderSettings } from '../../schemas/media-servers'
import { EditMediaProviderSettingsModal } from '../../components/EditMediaProviderSettingsModal'

type MediaProviderSettingsPreviewCardProps = {
  type: MediaProviderEnum
  data: MediaProviderSettings
}

const MediaProviderSettingsPreviewCard = ({ data, type }: MediaProviderSettingsPreviewCardProps) => {
  const [isOpen, setIsOpen] = useState(false)
  return (
    <>
      <SettingsPreviewCard onClick={() => setIsOpen(true)}>{data?.name}</SettingsPreviewCard>
      <EditMediaProviderSettingsModal type={type} isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
    </>
  )
}

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isOpen, setIsOpen] = useState(false)

  const {
    data: radarrSettings,
    isLoading: isRadarrSettingsLoading,
    isFetching: isRadarrSettingsFetching,
  } = useRadarrSettings()

  const {
    data: sonarrSettings,
    isLoading: isSonarrSettingsLoading,
    isFetching: isSonarrSettingsFetching,
  } = useSonarrSettings()

  return (
    <>
      <Title as="h1">Configure your media providers</Title>

      <div className="space-y-8">
        <p>Link your Radarr and Sonarr instance to your Cheddarr server.</p>

        <SettingsPreviewCard onClick={() => setIsOpen(true)} className="w-full">
          <Icon icon={faPlus} size="xl" />
        </SettingsPreviewCard>

        <div>
          <Title as="h2">Current configurations</Title>

          {(isRadarrSettingsLoading ||
            isRadarrSettingsFetching ||
            isSonarrSettingsLoading ||
            isSonarrSettingsFetching) && (
            <SettingsPreviewCard className="border-0">
              <Spinner size="sm" />
            </SettingsPreviewCard>
          )}

          <div className="flex items-center gap-3">
            {!isRadarrSettingsLoading &&
              radarrSettings?.map((config, index) => (
                <MediaProviderSettingsPreviewCard type={MediaProviderEnum.RADARR} key={index} data={config} />
              ))}

            {!isSonarrSettingsLoading &&
              sonarrSettings?.map((config, index) => (
                <MediaProviderSettingsPreviewCard type={MediaProviderEnum.SONARR} key={index} data={config} />
              ))}
          </div>
        </div>
      </div>

      <PickMediaProviderTypeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
