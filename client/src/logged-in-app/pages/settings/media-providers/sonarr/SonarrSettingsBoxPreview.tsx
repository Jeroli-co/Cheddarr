import { useState } from 'react'
import { EditSonarrSettingsModal } from './EditSonarrSettingsModal'
import { ItemBox } from '../../../../../shared/components/ItemBox'
import { isEmpty } from '../../../../../utils/strings'
import { SonarrSettings } from '../../../../../components/SonarrSettingsForm'

type SonarrSettingsBoxPreviewProps = {
  data: SonarrSettings
}

export const SonarrSettingsBoxPreview = ({ data }: SonarrSettingsBoxPreviewProps) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>
        {isEmpty(data.name) ? 'Sonarr' : data.name}
      </ItemBox>
      {isSettingsModalOpen && (
        <EditSonarrSettingsModal closeModal={() => setIsSettingsModalOpen(false)} data={data} />
      )}
    </>
  )
}
