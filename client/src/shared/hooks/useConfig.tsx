import { useAPI } from './useAPI'
import { useAlert } from '../contexts/AlertContext'
import { IConfig } from '../models/IConfig'
import { APIRoutes } from '../enums/APIRoutes'
import { useData } from '../../hooks/useData'
import { useQueryClient } from 'react-query'

export const useConfig = () => {
  const queryClient = useQueryClient()
  const { patch } = useAPI()
  const { pushDanger, pushSuccess } = useAlert()

  const { data } = useData<IConfig>(['system', 'config'], '/system/config')

  const updateConfig = (payload: Partial<IConfig>) => {
    return patch<IConfig>(APIRoutes.CONFIG, payload).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot update config')
        return
      }

      pushSuccess('Config updated')
      queryClient.invalidateQueries(['system', 'config'])
    })
  }

  return {
    config: data,
    updateConfig,
  }
}
