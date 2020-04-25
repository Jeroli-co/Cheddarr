import { useApi } from "./useApi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const usePlex = () => {
  const providerUrl = "/provider/plex/";
  const moviesUrl = providerUrl + "movies/";
  const seriesUrl = providerUrl + "series/";

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);

  const getMoviesRecentlyAdded = async () => {
    const res = await executeRequest(methods.GET, moviesUrl + "recent/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getSeriesRecentlyAdded = async () => {
    const res = await executeRequest(methods.GET, seriesUrl + "recent/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getOnDeck = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "onDeck/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getMovie = async (id) => {
    const res = await executeRequest(methods.GET, moviesUrl + id + "/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getMoviesRecentlyAdded,
    getSeriesRecentlyAdded,
    getOnDeck,
    getMovie,
  };
};

export { usePlex };
