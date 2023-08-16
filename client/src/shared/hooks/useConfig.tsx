import { useAlert } from '../contexts/AlertContext'
import { IConfig } from '../models/IConfig'
import { APIRoutes } from '../enums/APIRoutes'
import { useData } from '../../hooks/useData'
import { useMutation, useQueryClient } from 'react-query'
import httpClient from '../../utils/http-client'

export const useConfig = () => {
  const queryClient = useQueryClient()
  const { pushDanger, pushSuccess } = useAlert()

  const { data } = useData<IConfig>(['system', 'config'], '/system/config')

  const updateMutation = useMutation({
    mutationFn: (payload: Partial<IConfig>) => httpClient.patch<IConfig>(APIRoutes.CONFIG, payload),
    onSuccess: () => {
      pushSuccess('Config updated')
      queryClient.invalidateQueries(['system', 'config'])
    },
    onError: () => {
      pushDanger('Cannot update config')
    },
  })

  const updateConfig = (payload: Partial<IConfig>, message?: { success?: string; error?: string }) => {
    updateMutation.mutate(payload)
  }

  return {
    config: data,
    updateConfig,
  }
}
