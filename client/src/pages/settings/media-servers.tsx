import { useState } from 'react'
import { useData } from '../../hooks/useData'
import { Info } from '../../elements/Info'
import { Title } from '../../elements/Title'
import { faEdit, faPlus, faSync } from '@fortawesome/free-solid-svg-icons'
import { Icon } from '../../shared/components/Icon'
import { SettingsPreviewCard } from '../../components/ConfigPreviewCard'
import { MediaServerEnum, PlexSettings } from '../../schemas/media-servers'
import { PickMediaServerTypeModal } from '../../components/PickMediaServerTypeModal'
import { Spinner } from '../../shared/components/Spinner'
import { EditMediaServerSettingsModal } from '../../components/EditMediaServerSettingsModal'
import { useMediaServerLibraries } from '../../shared/hooks/useMediaServerLibrariesService'
import { useAPI } from '../../shared/hooks/useAPI'
import { useAlert } from '../../shared/contexts/AlertContext'
import { APIRoutes } from '../../shared/enums/APIRoutes'
import { IJob, JobActionsEnum } from '../../shared/models/IJob'
import { Button } from '../../elements/button/Button'
import { Checkbox } from '../../elements/Checkbox'

type MediaServerInfoProps = {
  configId: string
  serverName: string
  serverId: string
  mediaServerType: MediaServerEnum
}

const MediaServerInfo = ({ configId, mediaServerType, serverId }: MediaServerInfoProps) => {
  const { libraries, updateLibrary, isLoading, isFetching } = useMediaServerLibraries(configId, mediaServerType)
  const { patch } = useAPI()
  const { pushInfo, pushDanger } = useAlert()

  const fullSync = (serverId: string) => {
    patch<IJob>(APIRoutes.JOBS('plex-full-sync'), {
      action: JobActionsEnum.RUN,
      params: { serverId: serverId },
    }).then((res) => {
      if (res.status === 200) {
        pushInfo('Full sync is running')
      } else {
        pushDanger('Cannot run full sync')
      }
    })
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <span>Libraries</span>
        <Button mode="square" variant="outlined" size="sm" onClick={() => fullSync(serverId)}>
          <Icon icon={faSync} />
        </Button>
      </div>

      {isLoading || (isFetching && <Spinner />)}

      {!isLoading && !isFetching && libraries?.length && (
        <div className="flex flex-col gap-2">
          {libraries.map((l) => (
            <Checkbox
              key={l.name}
              label={l.name}
              checked={l.enabled}
              onClick={() => updateLibrary({ ...l, enabled: !l.enabled })}
            />
          ))}
        </div>
      )}
    </div>
  )
}

type MediaServerSettingsPreviewCardProps = {
  type: MediaServerEnum
  data: PlexSettings
}

const MediaServerSettingsPreviewCard = ({ data, type }: MediaServerSettingsPreviewCardProps) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <SettingsPreviewCard className="flex flex-col gap-4">
        <div className="w-full flex items-center justify-between gap-3">
          <span> {data?.name ?? data.serverName}</span>
          <Button mode="square" size="sm" onClick={() => setIsOpen(true)}>
            <Icon icon={faEdit} />
          </Button>
        </div>

        <MediaServerInfo
          configId={data.id}
          serverName={data.name ?? 'Unknown'}
          serverId={data.serverId}
          mediaServerType={MediaServerEnum.PLEX}
        />
      </SettingsPreviewCard>
      <EditMediaServerSettingsModal type={type} isOpen={isOpen} onClose={() => setIsOpen(false)} data={data} />
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

          {data?.length ? (
            <div className="flex items-center gap-3">
              {data?.map((plexSettings, index) => {
                return <MediaServerSettingsPreviewCard key={index} type={MediaServerEnum.PLEX} data={plexSettings} />
              })}
            </div>
          ) : (
            <p>You have no media servers configured</p>
          )}
        </div>
      </div>

      <PickMediaServerTypeModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  )
}
