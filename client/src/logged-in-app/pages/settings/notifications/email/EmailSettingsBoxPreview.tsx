import { useState } from 'react'
import { ItemBox } from '../../../../../shared/components/ItemBox'
import { EditEmailSettingsModal } from './EditEmailSettingsModal'
import { EmailSettings } from './EmailSettingsForm'

type EmailSettingsBoxPreviewProps = {
  data: EmailSettings
}

export const EmailSettingsBoxPreview = ({ data }: EmailSettingsBoxPreviewProps) => {
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false)

  return (
    <>
      <ItemBox onClick={() => setIsSettingsModalOpen(true)}>Email</ItemBox>
      {isSettingsModalOpen && (
        <EditEmailSettingsModal closeModal={() => setIsSettingsModalOpen(false)} data={data} />
      )}
    </>
  )
}
