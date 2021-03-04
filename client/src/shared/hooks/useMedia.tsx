import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { useAlert } from "../contexts/AlertContext";
import { IMedia } from "../models/IMedia";
import { SearchFilters } from "../enums/SearchFilters";
import { IPaginated } from "../models/IPaginated";
import { useEffect, useRef, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";

export const useMedia = (title: string, type: SearchFilters, page: number) => {
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

    // @ts-ignore
    timer.current = setTimeout(() => {
      setMedia(DefaultAsyncCall);
    }, 800);
  }, [title]);

  useEffect(() => {
    setMedia(DefaultAsyncCall);
  }, [type, page]);

  useEffect(() => {
    if (media.isLoading) {
      fetchMedia();
    }
  }, [media]);

  return media;
};
