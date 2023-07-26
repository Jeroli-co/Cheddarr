import { useState } from "react";
import { IPaginated } from "../models/IPaginated";
import { useAPI } from "./useAPI";
import { useQuery, useQueryClient } from "react-query";
import hoursToMilliseconds from "date-fns/hoursToMilliseconds";

const useData = <T>(url: string) => {
  const { get } = useAPI();

  const fetchData = () => {
    return get<IPaginated<T>>(url).then((res) => {
      if (res.status === 200 && res.data) {
        return res.data;
      } else {
        return undefined;
      }
    });
  };

  const { data, isLoading } = useQuery<IPaginated<T>>([url], fetchData, {
    staleTime: hoursToMilliseconds(24),
  });

  return {
    data,
    isLoading,
  };
};

export const usePagination = <T = any>(queryPath: string) => {
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);

  const { data, isLoading } = useData<T>(queryPath + `?page=${page}`);
  const loadPrev = () => {
    const getPrevPage = () => {
      if (!data) return 1;
      return data.page > 1 ? data.page - 1 : data?.pages;
    };

    setPage(getPrevPage());
  };

  const loadNext = () => {
    const getNextPage = () => {
      if (!data) return 1;
      return data.page < data?.pages ? data.page + 1 : 1;
    };

    setPage(getNextPage());
  };

  const invalidate = () => {
    queryClient.invalidateQueries("todos");
  };
  const sortData = (compare: (first: T, second: T) => number) => {
    return data.results.sort(compare);
  };

  return {
    data,
    loadPrev,
    loadNext,
    updateData: invalidate,
    deleteData: invalidate,
    sortData,
    invalidate,
    isFirstPage: page === 1,
    isLastPage: page === data?.pages,
    isLoading,
  };
};
