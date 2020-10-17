import { MEDIA_TYPES } from "../enums/MediaTypes";
import { HttpService } from "../../api/services/HttpService";
import { HTTP_METHODS } from "../../api/enums/HttpMethods";

const useMediaService = () => {
  const searchUrl = "/search/";

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
    const res = await HttpService.executeRequest(HTTP_METHODS.GET, url);
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
