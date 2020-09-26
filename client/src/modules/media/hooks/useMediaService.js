import { useApi } from "../../../hooks/useApi";

const useMediaService = () => {
  const searchUrl = "/search/";

  const { executeRequest, methods } = useApi();

  const getMediaByTmdbId = async (media_type, tmdb_id) => {
    const res = await executeRequest(
      methods.GET,
      searchUrl + media_type + "/" + tmdb_id + "/"
    );
    switch (res.status) {
      case 200:
        return res;
      default:
        return null;
    }
  };

  return {
    getMediaByTmdbId,
  };
};

export { useMediaService };
