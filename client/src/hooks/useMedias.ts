import { useEffect, useState } from "react";
import { MediasTypes } from "../enums/MediasTypes";
import { IMediaServerMedia } from "../models/IMediaServerMedia";
import { SearchService } from "../services/SearchService";

const useMedias = (mediaType: MediasTypes, tmdbId: number) => {
  const [media, setMedia] = useState<IMediaServerMedia | null>(null);
  useEffect(() => {
    SearchService.GetMediaById(mediaType, tmdbId).then((res) => {
      if (res.error === null) setMedia(res.data);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdbId]);
  return media;
};

export { useMedias };
