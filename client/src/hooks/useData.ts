import { UseQueryOptions, useQuery } from 'react-query'
import httpClient from '../utils/http-client'
import hoursToMilliseconds from 'date-fns/hoursToMilliseconds'
import { AxiosError, AxiosResponse } from 'axios'

export const useData = <TData>(
  queryKey: string[],
  url: string,
  options?: UseQueryOptions<TData>,
  successCallback?: (res: AxiosResponse<TData>) => void,
  errorCallback?: (err: AxiosError) => void,
) => {
  const fetchData = () => {
    return httpClient
      .get<TData>(url)
      .then((res) => {
        if (successCallback) {
          successCallback(res)
        }

        return res.data
      })
      .catch((err) => {
        if (errorCallback) {
          errorCallback(err)
        }

        return Promise.reject(err)
      })
  }

  return useQuery<TData>(queryKey, fetchData, {
    staleTime: options?.staleTime ?? hoursToMilliseconds(24),
    ...options,
  })
}
