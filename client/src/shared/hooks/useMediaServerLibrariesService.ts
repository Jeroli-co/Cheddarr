import { useAlert } from '../contexts/AlertContext'
import { IMediaServerLibrary } from '../models/IMediaServerConfig'
import { useMutation, useQueryClient } from 'react-query'
import { useData } from '../../hooks/useData'
import httpClient from '../../utils/http-client'
import { MediaServerEnum } from '../../schemas/media-servers'

export type PlexServerLibrary = {
  libraryId: number
  name: string
  enabled: boolean
}

export const useMediaServerLibraries = (configId: string, mediaServerType: MediaServerEnum) => {
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

  const updateMutation = useMutation({
    mutationFn: (library: IMediaServerLibrary) =>
      httpClient.patch(`/settings/${mediaServerType}/${configId}/libraries`, [library]).then(() => library),
    onSuccess: (library) => {
      pushSuccess('Library ' + library.name + ' updated')
      queryClient.invalidateQueries(['settings', mediaServerType, configId, 'libraries'])
    },
    onError: () => {
      pushDanger('Cannot update library')
    },
  })

  const updateLibrary = (library: IMediaServerLibrary) => {
    updateMutation.mutate(library)
  }

  return { libraries, updateLibrary, isLoading, isFetching }
}
