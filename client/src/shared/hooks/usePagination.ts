import { useEffect, useState } from "react";
import { IPaginated } from "../models/IPaginated";
import { useAPI } from "./useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const usePagination = <T = any>(url: string) => {
  const [data, setData] = useState<IAsyncCall<IPaginated<T> | null>>(
    DefaultAsyncCall
  );
  const [loadDirection, setLoadDirection] = useState<"prev" | "next" | null>(
    null
  );
  const { get } = useAPI();

  const getPageToLoad = () => {
    if (data.data && loadDirection) {
      if (loadDirection === "prev") {
        if (data.data.page <= 1) {
          return data.data.totalPages;
        } else {
          return data.data.page - 1;
        }
      } else if (loadDirection === "next") {
        if (data.data.page === data.data.totalPages) {
          return 1;
        } else {
          return data.data.page + 1;
        }
      }
    }
    return 1;
  };

  const fetchData = () => {
    const page = getPageToLoad();
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
    if (loadDirection) {
      setData({ ...data, isLoading: true });
    }
  }, [loadDirection]);

  useEffect(() => {
    if (data.isLoading) {
      fetchData();
    }
  }, [data.isLoading]);

  const loadPrev = () => {
    if (!loadDirection) {
      setLoadDirection("prev");
    } else {
      setData({ ...data, isLoading: true });
    }
  };

  const loadNext = () => {
    if (!loadDirection) {
      setLoadDirection("next");
    } else {
      setData({ ...data, isLoading: true });
    }
  };

  const updateData = (
    findElement: (e: T) => boolean,
    updateElement: (e: T) => void
  ) => {
    if (data.data) {
      let dataTmp = data.data.results;
      const index = dataTmp.findIndex((e) => findElement(e));
      if (index !== -1) {
        updateElement(dataTmp[index]);
        setData({ ...data, data: { ...data.data, results: dataTmp } });
      }
    }
  };

  const deleteData = (pred: (e: T) => boolean) => {
    if (data.data) {
      let dataTmp = data.data.results;
      const index = dataTmp.findIndex((e) => pred(e));
      if (index !== -1) {
        dataTmp.splice(index, 1);
        setData({ ...data, data: { ...data.data, results: dataTmp } });
      }
    }
  };

  const sortData = (compare: (first: T, second: T) => number) => {
    if (data.data) {
      let dataTmp = data.data.results;
      dataTmp.sort(compare);
      setData({ ...data, data: { ...data.data, results: dataTmp } });
    }
  };

  return {
    data,
    loadPrev,
    loadNext,
    updateData,
    deleteData,
    sortData,
  };
};
