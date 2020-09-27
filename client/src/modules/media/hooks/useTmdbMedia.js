import { useMediaService } from "./useMediaService";
import { useEffect, useState } from "react";

const useTmdbMedia = (media_type, tmdb_id, season_number, episode_number) => {
  const [media, setMedia] = useState(null);
  const { getMediaByTmdbId } = useMediaService();
  useEffect(() => {
    getMediaByTmdbId(media_type, tmdb_id, season_number, episode_number).then(
      (res) => {
        if (res) {
          setMedia(res.data);
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdb_id, season_number, episode_number]);
  return media;
};

export { useTmdbMedia };
