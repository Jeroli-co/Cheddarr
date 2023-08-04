import { UseQueryOptions, useQuery } from 'react-query'
import httpClient from '../http-client'
import hoursToMilliseconds from 'date-fns/hoursToMilliseconds'

export const useData = <TData>(
  queryKey: string[],
  url: string,
  options?: UseQueryOptions<TData>
) => {
  const fetchData = () => {
    return httpClient.get<TData>(url).then((res) => res.data)
  }

  return useQuery<TData>(queryKey, fetchData, {
    staleTime: options?.staleTime ?? hoursToMilliseconds(24),
    ...options,
  })
}
