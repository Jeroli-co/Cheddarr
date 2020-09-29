import { useMediaService } from "./useMediaService";
import { useEffect, useState } from "react";

const useMedia = (media_type, tmdb_id, season_number, episode_number) => {
  const [media, setMedia] = useState(null);
  const { getMediaById } = useMediaService();
  useEffect(() => {
    getMediaById(media_type, tmdb_id, season_number, episode_number).then(
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

export { useMedia };
