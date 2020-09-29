import { useApi } from "../../api/hooks/useApi";
import { MEDIA_TYPES } from "../enums/MediaTypes";

const useMediaService = () => {
  const searchUrl = "/search/";

  const { executeRequest, methods } = useApi();

  const getMediaById = async (
    media_type,
    tmdb_id,
    season_number = null,
    episode_number = null
  ) => {
    let url = searchUrl + media_type + "/" + tmdb_id + "/";
    if (season_number !== null) {
      url += MEDIA_TYPES.SEASONS + "/" + season_number + "/";
    }
    if (episode_number !== null) {
      url += MEDIA_TYPES.EPISODES + "/" + episode_number + "/";
    }
    const res = await executeRequest(methods.GET, url);
    switch (res.status) {
      case 200:
        return res;
      default:
        return null;
    }
  };

  return {
    getMediaById,
  };
};

export { useMediaService };
