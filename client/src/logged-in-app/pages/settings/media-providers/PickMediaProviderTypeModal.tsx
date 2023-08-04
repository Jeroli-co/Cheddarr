import { useState } from 'react'
import { Modal } from '../../../../shared/components/layout/Modal'
import { H2 } from '../../../../shared/components/Titles'
import { Buttons } from '../../../../shared/components/layout/Buttons'
import { MediaProvidersTypes } from '../../../../shared/enums/MediaProvidersTypes'
import { Row } from '../../../../shared/components/layout/Row'
import { ItemBox } from '../../../../shared/components/ItemBox'
import { RadarrSettingsForm } from '../../../../components/RadarrSettingsForm'
import { Button } from '../../../../elements/button/Button'
import { SonarrSettingsForm } from '../../../../components/SonarrSettingsForm'

type PickMediaProvidersTypeModalProps = {
  closeModal: () => void
}

export const PickMediaProviderTypeModal = (props: PickMediaProvidersTypeModalProps) => {
  const [mediaProvidersTypePick, setMediaProvidersTypePick] = useState<MediaProvidersTypes | null>(
    null
  )

  const closeModal = () => {
    setMediaProvidersTypePick(null)
    props.closeModal()
  }

  return (
    <Modal close={() => closeModal()}>
      <header>
        {mediaProvidersTypePick && mediaProvidersTypePick === MediaProvidersTypes.RADARR && (
          <H2>Add Radarr configuration</H2>
        )}
        {mediaProvidersTypePick && mediaProvidersTypePick === MediaProvidersTypes.SONARR && (
          <H2>Add Sonarr configuration</H2>
        )}
        {!mediaProvidersTypePick && <H2>Choose a media server type</H2>}
      </header>

      {!mediaProvidersTypePick && (
        <>
          <section>
            <Row justifyContent="space-around">
              <ItemBox onClick={() => setMediaProvidersTypePick(MediaProvidersTypes.RADARR)}>
                Radarr
              </ItemBox>
              <ItemBox onClick={() => setMediaProvidersTypePick(MediaProvidersTypes.SONARR)}>
                Sonarr
              </ItemBox>
            </Row>
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
      {mediaProvidersTypePick === MediaProvidersTypes.RADARR && <RadarrSettingsForm />}
      {mediaProvidersTypePick === MediaProvidersTypes.SONARR && <SonarrSettingsForm />}
    </Modal>
  )
}
