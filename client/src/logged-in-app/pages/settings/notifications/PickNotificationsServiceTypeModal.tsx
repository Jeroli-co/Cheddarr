import { useState } from 'react'
import { Modal } from '../../../../shared/components/layout/Modal'
import { H2 } from '../../../../shared/components/Titles'
import { Buttons } from '../../../../shared/components/layout/Buttons'
import { Button } from '../../../../shared/components/Button'
import { ItemBox } from '../../../../shared/components/ItemBox'
import { NotificationsServicesTypes } from '../../../../shared/enums/NotificationsServicesTypes'
import { EmailSettingsForm } from './email/EmailSettingsForm'

type PickNotificationsServiceTypeModalProps = {
  closeModal: () => void
}

export const PickNotificationsServiceTypeModal = (
  props: PickNotificationsServiceTypeModalProps
) => {
  const [notificationsServiceTypePick, setNotificationsServiceTypePick] =
    useState<NotificationsServicesTypes | null>(null)

  const closeModal = () => {
    setNotificationsServiceTypePick(null)
    props.closeModal()
  }

  return (
    <Modal close={() => closeModal()}>
      <header>
        {notificationsServiceTypePick &&
          notificationsServiceTypePick === NotificationsServicesTypes.EMAIL && (
            <H2>Add email smtp server</H2>
          )}
        {!notificationsServiceTypePick && <H2>Choose a notifications service type</H2>}
      </header>

      {!notificationsServiceTypePick && (
        <>
          <section>
            <ItemBox
              onClick={() => setNotificationsServiceTypePick(NotificationsServicesTypes.EMAIL)}
            >
              Email
            </ItemBox>
          </section>
          <footer>
            <Buttons>
              <Button type="button" onClick={() => closeModal()}>
                Cancel
              </Button>
            </Buttons>
          </footer>
        </>
      )}
      {notificationsServiceTypePick === NotificationsServicesTypes.EMAIL && <EmailSettingsForm />}
    </Modal>
  )
}
