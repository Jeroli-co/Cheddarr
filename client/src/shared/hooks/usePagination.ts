import { useEffect, useState } from "react";
import { IPaginated } from "../models/IPaginated";
import { useAPI } from "./useAPI";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const usePagination = <T = any>(url: string, infiniteLoad: boolean) => {
  const [data, setData] = useState<IAsyncCall<IPaginated<T> | null>>(
    DefaultAsyncCall
  );
  const [loadDirection, setLoadDirection] = useState<"prev" | "next" | null>(
    null
  );
  const { get } = useAPI();

  const isFirstPage = () => {
    return data && data.data && data.data.page && data.data.page <= 1;
  };

  const isLastPage = () => {
    return (
      data &&
      data.data &&
      data.data.page &&
      data.data.totalPages &&
      data.data.page >= data.data.totalPages
    );
  };

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
    let urlWithPageQuery =
      url + ((url.includes("?") ? "&" : "?") + "page=" + page);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [loadDirection]);

  useEffect(() => {
    if (data.isLoading) {
      fetchData();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [data.isLoading]);

  const loadPrev = () => {
    let isNewPageLoaded = true;
    const totalPage = data.data && data.data.totalPages;
    if (totalPage && totalPage > 1) {
      if (!loadDirection) {
        setLoadDirection("prev");
      } else {
        if (!isFirstPage() || infiniteLoad) {
          setData({ ...data, isLoading: true });
        } else {
          isNewPageLoaded = false;
        }
      }
    }
    return isNewPageLoaded;
  };

  const loadNext = () => {
    let isNewPageLoaded = true;
    const totalPage = data.data && data.data.totalPages;
    if (totalPage && totalPage > 1) {
      if (!loadDirection) {
        setLoadDirection("next");
      } else {
        if (!isLastPage() || infiniteLoad) {
          setData({ ...data, isLoading: true });
        } else {
          isNewPageLoaded = false;
        }
      }
    }
    return isNewPageLoaded;
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
    isFirstPage,
    isLastPage,
  };
};
