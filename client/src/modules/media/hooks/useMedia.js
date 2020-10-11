import { useMediaService } from "./useMediaService";
import { useEffect, useState } from "react";

const useMedia = (media_type, tmdb_id, season_number, episode_number) => {
  const [media, setMedia] = useState({ data: null, isLoaded: false });
  const { getMediaById } = useMediaService();
  useEffect(() => {
    getMediaById(media_type, tmdb_id, season_number, episode_number).then(
      (data) => {
        if (data) {
          setMedia({ data: data, isLoaded: true });
        } else {
          setMedia({ ...media, isLoaded: true });
        }
      }
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tmdb_id, season_number, episode_number]);
  return media;
};

export { useMedia };
