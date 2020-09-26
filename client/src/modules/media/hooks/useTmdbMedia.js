import { useMediaService } from "./useMediaService";
import { useEffect, useState } from "react";

const useTmdbMedia = (media_type, tmdb_id) => {
  const [media, setMedia] = useState(null);
  const { getMediaByTmdbId } = useMediaService();
  useEffect(() => {
    getMediaByTmdbId(media_type, tmdb_id).then((res) => {
      if (res) setMedia(res.data);
    });
  }, [tmdb_id]);
  return media;
};

export { useTmdbMedia };
