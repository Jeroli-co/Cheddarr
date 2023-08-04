import { useEffect, useState } from 'react'
import { IPaginated } from '../shared/models/IPaginated'
import { useQuery, useQueryClient } from 'react-query'
import hoursToMilliseconds from 'date-fns/hoursToMilliseconds'
import httpClient from '../http-client'

export type PaginationHookProps<TData> = {
  data?: IPaginated<TData>

  loadPrev: () => void
  loadNext: () => void
  isFirstPage: boolean
  isLastPage: boolean

  isLoading: boolean
  isFetching: boolean

  updateData: () => void
  deleteData: () => void
  invalidate: () => void

  sortData: (compare: (first: TData, second: TData) => number) => TData[]
}

export const usePagination = <TData>(
  queryKeys: string[],
  queryURL: string
): PaginationHookProps<TData> => {
  const queryClient = useQueryClient()

  const [page, setPage] = useState(1)

  const fetchData = (page: number) => {
    return httpClient.get<IPaginated<TData>>(queryURL + `?page=${page}`).then((res) => res.data)
  }

  const { data, ...useQueryResult } = useQuery([...queryKeys, page], () => fetchData(page), {
    keepPreviousData: true,
    staleTime: hoursToMilliseconds(24),
  })

  const hasMore = (p?: IPaginated<TData>) => p && p.page < p.pages

  useEffect(() => {
    if (hasMore(data ?? undefined)) {
      queryClient.prefetchQuery([...queryKeys, page + 1], () => fetchData(page + 1))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data, page, queryClient])

  const loadPrev = () => {
    setPage((old) => Math.max(old - 1, 1))
  }

  const loadNext = () => {
    setPage((old) => (hasMore(data ?? undefined) ? old + 1 : old))
  }

  const refetch = () => {
    queryClient.invalidateQueries([...queryKeys])
  }

  const sortData = (compare: (first: TData, second: TData) => number) => {
    return data?.results.sort(compare) ?? []
  }

  return {
    data: data ?? undefined,
    loadPrev,
    loadNext,
    updateData: refetch,
    deleteData: refetch,
    sortData,
    invalidate: refetch,
    isFirstPage: page === 1,
    isLastPage: page === data?.pages,
    ...useQueryResult,
  }
}
