import { Modal } from '../../../../../shared/components/layout/Modal'
import { H2 } from '../../../../../shared/components/Titles'
import { SonarrSettings, SonarrSettingsForm } from '../../../../../components/SonarrSettingsForm'

type EditSonarrSettingsModalProps = {
  closeModal: () => void
  data: SonarrSettings
}

export const EditSonarrSettingsModal = ({ closeModal, data }: EditSonarrSettingsModalProps) => {
  return (
    <Modal close={() => closeModal()}>
      <header>
        <H2>Edit {data.name}</H2>
      </header>

      <SonarrSettingsForm defaultSettings={data} />
    </Modal>
  )
}
