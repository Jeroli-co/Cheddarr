import { useEffect, useState } from "react";
import { DefaultAsyncCall, IAsyncCall } from "../models/IAsyncCall";
import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IMedia } from "../models/IMedia";
import { MediaTypes } from "../enums/MediaTypes";

export const useMedia = (type: MediaTypes, mediaId: number | string) => {
  const [media, setMedia] = useState<IAsyncCall<IMedia | null>>(
    DefaultAsyncCall
  );
  const { get } = useAPI();

  const fetchMedia = () => {
    get<IMedia>(
      type === MediaTypes.MOVIES
        ? APIRoutes.GET_MOVIE(mediaId)
        : APIRoutes.GET_SERIES(mediaId)
    ).then((res) => {
      if (res.status === 200) {
        setMedia(res);
      }
    });
  };

  useEffect(() => {
    if (!media.isLoading) {
      setMedia(DefaultAsyncCall);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mediaId]);

  useEffect(() => {
    if (media.isLoading) {
      fetchMedia();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [media.isLoading]);

  return media;
};
