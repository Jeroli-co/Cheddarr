import { useEffect, useState } from 'react'
import { Spinner } from '../../../../../shared/components/Spinner'
import { ComponentSizes } from '../../../../../shared/enums/ComponentSizes'
import { Divider } from '../../../../../shared/components/Divider'
import { PlexSettings, PlexSettingsForm } from './PlexSettingsForm'
import { LinkPlexAccount } from '../../../../../shared/components/LinkPlexAccount'
import { useLocation } from 'react-router-dom'
import { Input } from '../../../../../elements/Input'
import { H3 } from '../../../../../shared/components/Titles'
import { useData } from '../../../../../hooks/useData'

type AddPlexSettingsProps = {
  closeModal: () => void
}

export const AddPlexSettings = (props: AddPlexSettingsProps) => {
  const { data, isLoading, status } = useData<PlexSettings[]>(
    ['settings', 'plex', 'data'],
    '/settings/plex/servers'
  )
  const [selectedServerName, setSelectedServerName] = useState<string>('')
  const [selectedServerConfig, setSelectedServerConfig] = useState<PlexSettings | undefined>()
  const location = useLocation()

  useEffect(() => {
    if (selectedServerName) {
      const server = data && data.find((s) => s.serverName === selectedServerName)
      if (server) {
        setSelectedServerConfig(server)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedServerName])

  useEffect(() => {
    if (data && data.length > 0) {
      setSelectedServerName(data[0].serverName)
    }
  }, [data])

  return (
    <div>
      <div>
        {isLoading && <Spinner size={ComponentSizes.LARGE} />}
        {!isLoading && status === 'error' && <LinkPlexAccount redirectURI={location.pathname} />}
        {!isLoading && data && (
          <>
            <H3>Account servers</H3>
            <Input>
              <select
                value={selectedServerName}
                onChange={(e) => setSelectedServerName(e.target.value)}
              >
                {data.map((server, index) => {
                  return (
                    <option key={index} value={server.serverName}>
                      {server.serverName}
                    </option>
                  )
                })}
              </select>
            </Input>
          </>
        )}
      </div>

      <Divider />

      <PlexSettingsForm defaultSettings={selectedServerConfig} />
    </div>
  )
}
