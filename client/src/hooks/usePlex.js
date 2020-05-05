import { useApi } from "./useApi";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";

const usePlex = () => {
  const providerUrl = "/provider/plex/";
  const moviesUrl = providerUrl + "movies/";
  const seriesUrl = providerUrl + "series/";

  const { executeRequest, methods } = useApi();
  const { handleError } = useContext(AuthContext);

  const getPlexStatus = async () => {
    const res = await executeRequest(methods.GET, providerUrl + "status/");
    switch (res.status) {
      case 200:
        return !!res.data.status;
      default:
        return false;
    }
  };

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

  const getSeries = async (id) => {
    const res = await executeRequest(methods.GET, seriesUrl + id + "/");
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getSeason = async (seriesId, seasonNumber) => {
    const res = await executeRequest(
      methods.GET,
      seriesUrl + seriesId + "/seasons/" + seasonNumber + "/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getEpisode = async (seriesId, seasonNumber, episodeNumber) => {
    const res = await executeRequest(
      methods.GET,
      seriesUrl +
        seriesId +
        "/seasons/" +
        seasonNumber +
        "/episodes/" +
        episodeNumber +
        "/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  return {
    getPlexStatus,
    getMoviesRecentlyAdded,
    getSeriesRecentlyAdded,
    getOnDeck,
    getMovie,
    getSeries,
    getSeason,
    getEpisode,
  };
};

export { usePlex };
