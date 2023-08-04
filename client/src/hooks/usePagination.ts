import { useEffect, useState } from 'react'
import { IPaginated } from '../shared/models/IPaginated'
import { UseQueryOptions, useQuery, useQueryClient } from 'react-query'
import hoursToMilliseconds from 'date-fns/hoursToMilliseconds'
import httpClient from '../utils/http-client'

export type PaginationHookProps<TData> = {
  data?: IPaginated<TData>

  loadPrev: () => void
  loadNext: () => void
  loadPage: (value: number) => void
  loadPerPage: (value: number) => void
  isFirstPage: boolean
  isLastPage: boolean
  firstPage: number
  lastPage: number

  page: number
  perPage: number

  isLoading: boolean
  isFetching: boolean

  updateData: () => void
  deleteData: () => void
  invalidate: () => void

  sortData: (compare: (first: TData, second: TData) => number) => TData[]
}

export const usePagination = <TData, TError = unknown>(
  queryKeys: (string | number)[],
  queryURL: string,
  querySearchParams?: string,
  options?: UseQueryOptions<IPaginated<TData>, TError, IPaginated<TData>, (string | number)[]>,
): PaginationHookProps<TData> => {
  const queryClient = useQueryClient()

  const firstPage = 1

  const [paginationState, setPaginationState] = useState({
    page: firstPage,
    perPage: 20,
  })

  const paginatedQueryKeys = [...queryKeys, paginationState.page, paginationState.perPage]

  const fetchData = (p: number, nb: number, sp?: string) => {
    return httpClient
      .get<IPaginated<TData>>(`${queryURL}?page=${p}&per_page=${nb}${sp ? `&${sp}` : ''}`)
      .then((res) => res.data)
  }

  const { data, ...useQueryResult } = useQuery(
    paginatedQueryKeys,
    () => fetchData(paginationState.page, paginationState.perPage, querySearchParams),
    {
      keepPreviousData: true,
      staleTime: hoursToMilliseconds(24),
      ...options,
    },
  )

  const isFirstPage = paginationState.page === firstPage
  const lastPage = data?.totalPages ?? firstPage
  const isLastPage = paginationState.page === lastPage

  const hasMore = (p?: IPaginated<TData>) => p && p.page < p.totalPages

  useEffect(() => {
    if (!isLastPage) {
      queryClient.prefetchQuery([...queryKeys, paginationState.page + 1, paginationState.perPage], () =>
        fetchData(paginationState.page + 1, paginationState.perPage, querySearchParams),
      )
    }
  }, [queryClient, data, paginationState.page, paginationState.perPage, querySearchParams])

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
  }, [paginationState])

  const loadPrev = () => {
    setPaginationState((old) => ({ ...old, page: Math.max(old.page - 1, 1) }))
  }

  const loadNext = () => {
    setPaginationState((old) => (hasMore(data ?? undefined) ? { ...old, page: old.page + 1 } : old))
  }

  const loadPage = (value: number) => {
    if (value >= firstPage && value <= lastPage) setPaginationState({ ...paginationState, page: value })
  }

  const loadPerPage = (value: number) => {
    setPaginationState({ page: firstPage, perPage: value })
  }

  const refetch = () => {
    queryClient.invalidateQueries(paginatedQueryKeys)
  }

  const sortData = (compare: (first: TData, second: TData) => number) => {
    return data?.results.sort(compare) ?? []
  }

  return {
    data: data ?? undefined,
    loadPrev,
    loadNext,
    loadPage,
    loadPerPage,
    isFirstPage,
    isLastPage,
    firstPage,
    lastPage,
    page: paginationState.page,
    perPage: paginationState.perPage,
    updateData: refetch,
    deleteData: refetch,
    sortData,
    invalidate: refetch,
    ...useQueryResult,
  }
}
