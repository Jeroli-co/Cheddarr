import { useAPI } from "./useAPI";
import { APIRoutes } from "../enums/APIRoutes";
import { IMovieRequest, ISeriesRequest } from "../models/IMediaRequest";
import {
  IMovieRequestCreate,
  ISeriesRequestCreate,
} from "../models/IRequestCreate";
import { useAlert } from "../contexts/AlertContext";

export const useRequestMedia = () => {
  const { post } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const requestMovie = (request: IMovieRequestCreate) => {
    return post<IMovieRequest>(APIRoutes.CREATE_REQUEST_MOVIE, request).then(
      (res) => {
        if (res.status === 201) {
          pushSuccess("Movie requested");
        } else if (res.status === 409) {
          pushDanger("Movie already requested");
        } else {
          pushDanger("Cannot request movie");
        }
        return res;
      }
    );
  };

  const requestSeries = (request: ISeriesRequestCreate) => {
    return post<ISeriesRequest>(APIRoutes.CREATE_REQUEST_SERIES, request).then(
      (res) => {
        if (res.status === 201) {
          pushSuccess("Series requested");
        } else if (res.status === 409) {
          pushDanger("Series already requested");
        } else {
          pushDanger("Cannot request series");
        }
        return res;
      }
    );
  };

  return {
    requestMovie,
    requestSeries,
  };
};
