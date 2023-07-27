import { useEffect, useState } from "react";
import { IPaginated } from "../models/IPaginated";
import { useAPI } from "./useAPI";
import { useQuery, useQueryClient } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

export type PaginationHookProps<TData> = {
  data: IPaginated<TData>;

  loadPrev: () => void;
  loadNext: () => void;
  isFirstPage: boolean;
  isLastPage: boolean;

  isLoading: boolean;
  isFetching: boolean;

  updateData: () => void;
  deleteData: () => void;
  invalidate: () => void;

  sortData: (compare: (first: TData, second: TData) => number) => TData[];
};

export const usePagination = <TData>(
  query: string,
): PaginationHookProps<TData> => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const { get } = useAPI();

  const fetchData = (page) => {
    return get<IPaginated<TData>>(query + `?page=${page}`).then(
      (res) => res.data,
    );
  };

  const { data, ...useQueryResult } = useQuery(
    [query, page],
    () => fetchData(page),
    {
      keepPreviousData: true,
      staleTime: hoursToMilliseconds(24),
    },
  );

  const hasMore = (p?: IPaginated<TData>) => p && p.page < p.pages;

  useEffect(() => {
    if (hasMore(data)) {
      queryClient.prefetchQuery([query, page + 1], () => fetchData(page + 1));
    }
  }, [data, page, queryClient]);

  const loadPrev = () => {
    setPage((old) => Math.max(old - 1, 1));
  };

  const loadNext = () => {
    setPage((old) => (hasMore(data) ? old + 1 : old));
  };

  const refetch = () => {
    queryClient.invalidateQueries(query);
  };

  const sortData = (compare: (first: TData, second: TData) => number) => {
    return data.results.sort(compare);
  };

  return {
    data,
    loadPrev,
    loadNext,
    updateData: refetch,
    deleteData: refetch,
    sortData,
    invalidate: refetch,
    isFirstPage: page === 1,
    isLastPage: page === data?.pages,
    ...useQueryResult,
  };
};
