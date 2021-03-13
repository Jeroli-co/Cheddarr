import { useEffect, useState } from "react";
import { IPaginated } from "../models/IPaginated";
import { useAPI } from "./useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const usePagination = <T = any>(url: string) => {
  const [data, setData] = useState<IAsyncCall<IPaginated<T> | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  const fetchData = () => {
    const page = data.data && data.data.page ? data.data.page + 1 : 1;
    let urlWithPageQuery = url;
    if (url.includes("?")) {
      urlWithPageQuery = urlWithPageQuery + "&page=" + page;
    } else {
      urlWithPageQuery = urlWithPageQuery + "?page=" + page;
    }
    get<IPaginated<T>>(urlWithPageQuery).then((res) => {
      if (res.status === 200 && res.data) {
        setData(res);
      } else {
        setData({ ...DefaultAsyncCall, isLoading: false });
      }
    });
  };

  useEffect(() => {
    if (data.isLoading) {
      fetchData();
    }
  }, [data.isLoading]);

  const loadPrev = () => {
    const load = data.data && data.data.page > 1;
    if (load) {
      setData({ ...data, isLoading: true });
    }
    return !!load;
  };

  const loadNext = () => {
    const load = data.data && data.data.page <= data.data.totalPages;
    if (load) {
      setData({ ...data, isLoading: true });
    }
    return !!load;
  };

  return {
    data,
    loadPrev,
    loadNext,
  };
};
