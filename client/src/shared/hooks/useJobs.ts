import { IJob, JobActionsEnum } from '../models/IJob'
import { useAlert } from '../contexts/AlertContext'
import { useData } from '../../hooks/useData'
import httpClient from '../../http-client'
import { useQueryClient } from 'react-query'

export const useJobs = () => {
  const queryClient = useQueryClient()
  const { pushInfo, pushDanger } = useAlert()

  const { data, isLoading, isFetching } = useData<IJob[]>(['system', 'jobs'], '/system/jobs')

  const patchJob = (id: string, action: JobActionsEnum) => {
    httpClient.patch<IJob>(`/system/jobs${id}`, { action: action }).then((res) => {
      if (res.status !== 200) {
        pushDanger('Cannot patch job')
        return
      }

      pushInfo('Job state: ' + action)
      queryClient.invalidateQueries(['system', 'jobs'])
    })
  }

  return {
    jobs: data,
    isLoading,
    isFetching,
    patchJob,
  }
}
