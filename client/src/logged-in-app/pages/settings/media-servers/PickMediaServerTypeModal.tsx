import { useState } from 'react'
import { Modal } from '../../../../shared/components/layout/Modal'
import { H2 } from '../../../../shared/components/Titles'
import { Buttons } from '../../../../shared/components/layout/Buttons'
import { Button } from '../../../../shared/components/Button'
import { MediaServerTypes } from '../../../../shared/enums/MediaServersTypes'
import { ItemBox } from '../../../../shared/components/ItemBox'
import { PlexSettingsForm } from './plex/PlexSettingsForm'

type PickMediaServerTypeModalProps = {
  closeModal: () => void
}

export const PickMediaServerTypeModal = (props: PickMediaServerTypeModalProps) => {
  const [mediaServersTypePick, setMediaServersTypePick] = useState<MediaServerTypes | null>(null)

  const closeModal = () => {
    setMediaServersTypePick(null)
    props.closeModal()
  }

  return (
    <Modal close={() => closeModal()}>
      <header>
        {mediaServersTypePick && mediaServersTypePick === MediaServerTypes.PLEX && (
          <H2>Add a Plex media server</H2>
        )}
        {!mediaServersTypePick && <H2>Choose a media server type</H2>}
      </header>

      {!mediaServersTypePick && (
        <>
          <section>
            <ItemBox onClick={() => setMediaServersTypePick(MediaServerTypes.PLEX)}>Plex</ItemBox>
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
      {mediaServersTypePick === MediaServerTypes.PLEX && <PlexSettingsForm />}
    </Modal>
  )
}
