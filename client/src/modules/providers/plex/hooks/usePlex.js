import { useContext } from "react";
import { AuthContext } from "../../../auth/contexts/AuthContext";
import { HTTP_METHODS } from "../../../api/enums/HttpMethods";
import { HttpService } from "../../../api/services/HttpService";

const usePlex = () => {
  const providerUrl = "/media-servers/plex/";
  const moviesUrl = providerUrl + "movies/";
  const seriesUrl = providerUrl + "series/";
  const seasonUrl = providerUrl + "seasons/";
  const episodeUrl = providerUrl + "episodes/";

  const { handleError } = useContext(AuthContext);

  const getPlexStatus = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      providerUrl + "status/"
    );
    switch (res.status) {
      case 200:
        return !!res.data.status;
      default:
        return false;
    }
  };

  const getMoviesRecentlyAdded = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      moviesUrl + "recent/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getSeriesRecentlyAdded = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      seriesUrl + "recent/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getOnDeck = async () => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      providerUrl + "on-deck/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getMovie = async (id) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      moviesUrl + id + "/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getSeries = async (id) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      seriesUrl + id + "/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getSeason = async (seasonId) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      seasonUrl + seasonId + "/"
    );
    switch (res.status) {
      case 200:
        return res.data;
      default:
        handleError(res);
        return null;
    }
  };

  const getEpisode = async (episodeId) => {
    const res = await HttpService.executeRequest(
      HTTP_METHODS.GET,
      episodeUrl + episodeId + "/"
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
