import { Modal } from '../../../../../shared/components/layout/Modal'
import { H2 } from '../../../../../shared/components/Titles'
import { RadarrSettings, RadarrSettingsForm } from '../../../../../components/RadarrSettingsForm'

type EditRadarrSettingsModalProps = {
  closeModal: () => void
  data: RadarrSettings
}

export const EditRadarrSettingsModal = ({ closeModal, data }: EditRadarrSettingsModalProps) => {
  return (
    <Modal close={() => closeModal()}>
      <header>
        <H2>Edit {data.name}</H2>
      </header>

      <RadarrSettingsForm defaultSettings={data} />
    </Modal>
  )
}
