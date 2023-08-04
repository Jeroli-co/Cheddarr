import { useState } from 'react'
import { H1 } from '../../shared/components/Titles'
import { Row } from '../../shared/components/layout/Row'
import { AddItemBox } from '../../shared/components/ItemBox'
import { FullWidthTag } from '../../shared/components/FullWidthTag'
import { PrimaryDivider } from '../../shared/components/Divider'
import { PlexSettingsBoxPreview } from '../../logged-in-app/pages/settings/media-servers/plex/PlexSettingsBoxPreview'
import { MediaServersInfo } from '../../logged-in-app/pages/settings/media-servers/MediaServersInfo'
import { PickMediaServerTypeModal } from '../../logged-in-app/pages/settings/media-servers/PickMediaServerTypeModal'
import { useData } from '../../hooks/useData'
import { PlexSettings } from '../../logged-in-app/pages/settings/media-servers/plex/PlexSettingsForm'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const [isPickMediaServersTypeModalOpen, setIsPickMediaServersTypeModalOpen] = useState(false)

  const { data } = useData<PlexSettings[]>(['settings', 'plex'], '/settings/plex')

  return (
    <div>
      <FullWidthTag>More media servers will be supported soon</FullWidthTag>
      <br />
      <H1>Configure your media servers</H1>
      <br />
      <Row>
        <AddItemBox onClick={() => setIsPickMediaServersTypeModalOpen(true)} />
        {data?.map((plexSettings, index) => {
          return <PlexSettingsBoxPreview key={index} data={plexSettings} />
        })}
      </Row>
      {isPickMediaServersTypeModalOpen && (
        <PickMediaServerTypeModal closeModal={() => setIsPickMediaServersTypeModalOpen(false)} />
      )}
      <PrimaryDivider />
      {data && <MediaServersInfo data={data} />}
    </div>
  )
}
