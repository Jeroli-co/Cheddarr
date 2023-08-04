import { Modal } from '../../../../../shared/components/layout/Modal'
import { H2 } from '../../../../../shared/components/Titles'
import { EmailSettings, EmailSettingsForm } from './EmailSettingsForm'

type EditEmailSettingsModalProps = {
  closeModal: () => void
  data: EmailSettings
}

export const EditEmailSettingsModal = ({ data, closeModal }: EditEmailSettingsModalProps) => {
  return (
    <Modal close={() => closeModal()}>
      <header>
        <H2>Edit email smtp server</H2>
      </header>

      <EmailSettingsForm defaultSettings={data} />
    </Modal>
  )
}
