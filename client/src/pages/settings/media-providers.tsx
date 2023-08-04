import { useState } from 'react'
import { H1 } from '../../shared/components/Titles'
import { Row } from '../../shared/components/layout/Row'
import { AddItemBox, SpinnerItemBox } from '../../shared/components/ItemBox'
import { RadarrSettingsBoxPreview } from '../../logged-in-app/pages/settings/media-providers/radarr/RadarrSettingsBoxPreview'
import { SonarrSettingsBoxPreview } from '../../logged-in-app/pages/settings/media-providers/sonarr/SonarrSettingsBoxPreview'
import { PickMediaProviderTypeModal } from '../../logged-in-app/pages/settings/media-providers/PickMediaProviderTypeModal'
import { useRadarrSettings, useSonarrSettings } from '../../hooks/useProvidersSettings'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isPickMediaProvidersTypeModalOpen, setIsPickMediaProvidersTypeModalOpen] = useState(false)

  const { data: radarrSettings, isLoading: isRadarrSettingsLoading } = useRadarrSettings()
  const { data: sonarrSettings, isLoading: isSonarrSettingsLoading } = useSonarrSettings()

  return (
    <div>
      <H1>Configure your media providers</H1>
      <Row>
        <AddItemBox onClick={() => setIsPickMediaProvidersTypeModalOpen(true)} />
        {isRadarrSettingsLoading && <SpinnerItemBox />}
        {!isRadarrSettingsLoading &&
          radarrSettings?.map((config, index) => {
            return <RadarrSettingsBoxPreview key={index} data={config} />
          })}
        {isSonarrSettingsLoading && <SpinnerItemBox />}
        {!isSonarrSettingsLoading &&
          sonarrSettings?.map((config, index) => {
            return <SonarrSettingsBoxPreview key={index} data={config} />
          })}
      </Row>
      {isPickMediaProvidersTypeModalOpen && (
        <PickMediaProviderTypeModal
          closeModal={() => setIsPickMediaProvidersTypeModalOpen(false)}
        />
      )}
    </div>
  )
}
