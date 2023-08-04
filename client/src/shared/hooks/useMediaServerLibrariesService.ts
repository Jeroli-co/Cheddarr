import { useAlert } from '../contexts/AlertContext'
import { IMediaServerLibrary } from '../models/IMediaServerConfig'
import { MediaServerTypes } from '../enums/MediaServersTypes'
import { useQueryClient } from 'react-query'
import { useData } from '../../hooks/useData'
import httpClient from '../../utils/http-client'

export type PlexServerLibrary = {
  libraryId: number
  name: string
  enabled: boolean
}

export const useMediaServerLibraries = (
  configId: string,
  mediaServerType: MediaServerTypes = MediaServerTypes.PLEX,
) => {
  const queryClient = useQueryClient()
  const { pushSuccess, pushDanger } = useAlert()

  const {
    data: libraries,
    isLoading,
    isFetching,
  } = useData<PlexServerLibrary[]>(
    ['settings', mediaServerType, configId, 'libraries'],
    `/settings/${mediaServerType}/${configId}/libraries`,
  )

  const updateLibrary = (library: IMediaServerLibrary) => {
    library.enabled = !library.enabled
    httpClient.patch(`/settings/${mediaServerType}/${configId}/libraries`, [library]).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot update library')
        return
      }

      pushSuccess('Library ' + library.name + ' updated')
      queryClient.invalidateQueries(['settings', mediaServerType, configId, 'libraries'])
    })
  }

  return { libraries, updateLibrary, isLoading, isFetching }
}
