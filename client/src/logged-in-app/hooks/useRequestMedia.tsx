import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import {
  IMovieRequest,
  ISeriesRequest,
} from "../pages/requests/models/IMediaRequest";
import {
  IMovieRequestCreate,
  ISeriesRequestCreate,
} from "../pages/requests/models/IRequestCreate";
import { useAlert } from "../../shared/contexts/AlertContext";

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
