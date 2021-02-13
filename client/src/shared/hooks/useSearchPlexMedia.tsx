import { useEffect, useState } from "react";
import { IMediaSearchResult } from "../models/IMediaSearchResult";
import { DefaultAsyncData, IAsyncData } from "../models/IAsyncData";
import { APIRoutes } from "../enums/APIRoutes";
import { useAPI } from "./useAPI";
import { usePlexConfig } from "../contexts/PlexConfigContext";
import { MediaTypes } from "../enums/MediaTypes";

export const useSearchPlexMedia = (mediaType: MediaTypes, title: string) => {
  const [media, setMedia] = useState<IAsyncData<IMediaSearchResult[] | null>>(
    DefaultAsyncData
  );
  const { get } = useAPI();
  const { currentConfig } = usePlexConfig();

  useEffect(() => {
    if (currentConfig.data) {
      const url =
        mediaType === MediaTypes.MOVIES
          ? APIRoutes.SEARCH_PLEX_MOVIES(currentConfig.data.id, title)
          : mediaType === MediaTypes.SERIES
          ? APIRoutes.SEARCH_PLEX_SERIES(currentConfig.data.id, title)
          : "";
      get<IMediaSearchResult[]>(url).then((res) => {
        if (res.status === 200 && res.data) {
          setMedia({ data: res.data, isLoading: false });
        } else {
          setMedia({ data: null, isLoading: false });
        }
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  return media;
};
