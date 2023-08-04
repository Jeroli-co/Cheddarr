import { useState } from 'react'
import { EditRadarrSettingsModal } from './EditRadarrSettingsModal'
import { ItemBox } from '../../../../../shared/components/ItemBox'
import { isEmpty } from '../../../../../utils/strings'
import { RadarrSettings } from '../../../../../components/RadarrSettingsForm'

type RadarrSettingsBoxPreviewProps = {
  data: RadarrSettings
}

export const RadarrSettingsBoxPreview = ({ data }: RadarrSettingsBoxPreviewProps) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>
        {isEmpty(data.name) ? 'Radarr' : data.name}
      </ItemBox>
      {isSettingsModalOpen && (
        <EditRadarrSettingsModal closeModal={() => setIsSettingsModalOpen(false)} data={data} />
      )}
    </>
  )
}
