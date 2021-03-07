import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IMedia } from "../models/IMedia";
import { SearchFilters } from "../enums/SearchFilters";
import { IPaginated } from "../models/IPaginated";
import { useEffect, useRef, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const useSearchMedia = (
  title: string,
  type: SearchFilters,
  page: number
) => {
  const [media, setMedia] = useState<IAsyncCall<IPaginated<IMedia> | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const timer = useRef(null);

  const fetchMedia = () => {
    get<IPaginated<IMedia>>(
      APIRoutes.GET_MEDIA(title, page, type !== SearchFilters.ALL ? type : null)
    ).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get list of media");
      } else {
        setMedia(res);
      }
    });
  };

  useEffect(() => {
    if (timer.current) {
      // @ts-ignore
      clearTimeout(timer.current);
    }

    if (!media.isLoading) {
      // @ts-ignore
      timer.current = setTimeout(() => {
        setMedia(DefaultAsyncCall);
      }, 800);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  useEffect(() => {
    if (!media.isLoading) {
      setMedia(DefaultAsyncCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, page]);

  useEffect(() => {
    if (media.isLoading) {
      fetchMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media]);

  return media;
};
