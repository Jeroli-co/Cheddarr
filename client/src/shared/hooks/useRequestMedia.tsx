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
    post<IMovieRequest>(APIRoutes.CREATE_REQUEST_MOVIE, request).then((res) => {
      if (res.status === 201) {
        pushSuccess("Movie requested");
      } else {
        pushDanger("Cannot request movie");
      }
    });
  };

  const requestSeries = (request: ISeriesRequestCreate) => {
    post<ISeriesRequest>(APIRoutes.CREATE_REQUEST_SERIES, request).then(
      (res) => {
        if (res.status === 201) {
          pushSuccess("Series requested");
        } else {
          pushDanger("Cannot request series");
        }
      }
    );
  };

  return {
    requestMovie,
    requestSeries,
  };
};
