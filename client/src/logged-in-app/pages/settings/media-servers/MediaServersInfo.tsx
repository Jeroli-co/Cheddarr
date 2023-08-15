import styled from 'styled-components'
import { MediaServerTypes } from '../../../../shared/enums/MediaServersTypes'
import { PrimaryIconButton } from '../../../../shared/components/Button'
import { Icon } from '../../../../shared/components/Icon'
import { faSync } from '@fortawesome/free-solid-svg-icons'
import { Spinner } from '../../../../shared/components/Spinner'
import { useMediaServerLibraries } from '../../../../shared/hooks/useMediaServerLibrariesService'
import { PrimaryDivider } from '../../../../shared/components/Divider'
import { H2, H3 } from '../../../../shared/components/Titles'
import { IJob, JobActionsEnum } from '../../../../shared/models/IJob'
import { APIRoutes } from '../../../../shared/enums/APIRoutes'
import { useAPI } from '../../../../shared/hooks/useAPI'
import { useAlert } from '../../../../shared/contexts/AlertContext'
import { Checkbox } from '../../../../elements/Checkbox'
import { PlexSettings } from '../../../../schemas/media-servers'

const Header = styled.div`
  border-top-left-radius: 6px;
  border-top-right-radius: 6px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: ${({ theme }) => theme.primaryLight};
`

const Item = styled.div`
  padding: 20px;
  border-left: 1px solid ${({ theme }) => theme.primary};
  border-right: 1px solid ${({ theme }) => theme.primary};
  border-bottom: 1px solid ${({ theme }) => theme.primary};
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
`

const ItemHeader = styled(Header)`
  border-bottom-right-radius: 6px;
  border-bottom-left-radius: 6px;
  background: ${({ theme }) => theme.primary};
`

const Libraries = styled.div`
  padding: 20px;
`

type MediaServerInfoProps = {
  configId: string
  serverName: string
  serverId: string
  mediaServerType: MediaServerTypes
}

const MediaServerInfo = ({ configId, mediaServerType, serverId, serverName }: MediaServerInfoProps) => {
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
    <Item>
      <ItemHeader>
        <H2>{serverName}</H2>
        <PrimaryIconButton type="button" onClick={() => fullSync(serverId)}>
          <Icon icon={faSync} />
        </PrimaryIconButton>
      </ItemHeader>
      <Libraries>
        <H3>Libraries</H3>
        {isLoading || (isFetching && <Spinner />)}
        {!isLoading &&
          !isFetching &&
          libraries &&
          libraries.map((l) => (
            <Checkbox key={l.name} label={l.name} checked={l.enabled} onChange={() => updateLibrary(l)} />
          ))}
      </Libraries>
    </Item>
  )
}

type MediaServersInfoProps = {
  data: PlexSettings[]
}

export const MediaServersInfo = ({ data }: MediaServersInfoProps) => {
  return (
    <div>
      <Header>
        <p>Server name</p>
        <p>Actions</p>
      </Header>
      {data.map((c, index) => (
        <span key={index}>
          <MediaServerInfo
            key={index}
            configId={c.id}
            serverName={c.name ?? 'Unknown'}
            serverId={c.serverId}
            mediaServerType={MediaServerTypes.PLEX}
          />
          {index !== data.length - 1 && <PrimaryDivider />}
        </span>
      ))}
    </div>
  )
}
