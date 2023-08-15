import { useState } from 'react'
import { Divider, NewDivider } from '../../shared/components/Divider'
import { useData } from '../../hooks/useData'
import { Info } from '../../elements/Info'
import { Title } from '../../elements/Title'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../../shared/components/Icon'
import { SettingsPreviewCard } from '../../components/ConfigPreviewCard'
import { Modal, ModalProps } from '../../elements/modal/Modal'
import { PlexSettings } from '../../schemas/media-servers'
import { MediaServersInfo } from '../../logged-in-app/pages/settings/media-servers/MediaServersInfo'
import { PickMediaServerTypeModal } from '../../logged-in-app/pages/settings/media-servers/PickMediaServerTypeModal'
import { PlexSettingsForm } from '../../logged-in-app/pages/settings/media-servers/plex/PlexSettingsForm'
import { Spinner } from '../../shared/components/Spinner'

type PlexSettingsPreviewCardProps = {
  data: PlexSettings
}

const PlexSettingsPreviewCard = ({ data }: PlexSettingsPreviewCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <SettingsPreviewCard onClick={() => setIsOpen(true)}>{data?.name ?? data.serverName}</SettingsPreviewCard>
      <Modal isOpen={isOpen} onClose={() => setIsOpen(false)} title={`Edit ${data.serverName}`}>
        <PlexSettingsForm defaultSettings={data} />
      </Modal>
    </>
  )
}

export default () => {
  const [isOpen, setIsOpen] = useState(false)

  const { data, isLoading, isFetching } = useData<PlexSettings[]>(['settings', 'plex'], '/settings/plex')

  return (
    <>
      <Title as="h1">Configure your media servers</Title>

      <div className="space-y-8">
        <Info>More media servers will be supported soon</Info>

        <SettingsPreviewCard onClick={() => setIsOpen(true)} className="w-full">
          <Icon icon={faPlus} size="xl" />
        </SettingsPreviewCard>

        <div>
          <Title as="h2">Current configurations</Title>

          {(isLoading || isFetching) && (
            <SettingsPreviewCard className="border-0">
              <Spinner size="sm" />
            </SettingsPreviewCard>
          )}

          <div className="flex items-center gap-3">
            {data?.map((plexSettings, index) => {
              return <PlexSettingsPreviewCard key={index} data={plexSettings} />
            })}
          </div>
        </div>

        {data && data.length > 0 && (
          <>
            <NewDivider />
            <MediaServersInfo data={data} />
          </>
        )}
      </div>

      <PickMediaServerTypeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
