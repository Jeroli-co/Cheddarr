import { useState } from 'react'
import { EditPlexSettingsModal } from './EditPlexSettingsModal'
import { ItemBox } from '../../../../../shared/components/ItemBox'
import { isEmpty } from '../../../../../utils/strings'
import { PlexSettings } from './PlexSettingsForm'

type PlexSettingsBoxPreviewProps = {
  data: PlexSettings
}

export const PlexSettingsBoxPreview = ({ data }: PlexSettingsBoxPreviewProps) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)
  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>
        {isEmpty(data.name) ? data.serverName : data.name}
      </ItemBox>
      {isSettingsModalOpen && (
        <EditPlexSettingsModal closeModal={() => setIsSettingsModalOpen(false)} data={data} />
      )}
    </>
  )
}
