import { Modal } from '../../../../../shared/components/layout/Modal'
import { H2 } from '../../../../../shared/components/Titles'
import { PlexSettings, PlexSettingsForm } from './PlexSettingsForm'

export type EditPlexSettingsModalProps = {
  closeModal: () => void
  data: PlexSettings
}

export const EditPlexSettingsModal = ({ closeModal, data }: EditPlexSettingsModalProps) => {
  return (
    <Modal close={() => closeModal()}>
      <header>
        <H2>Edit {data.serverName}</H2>
      </header>

      <PlexSettingsForm defaultSettings={data} />
    </Modal>
  )
}
