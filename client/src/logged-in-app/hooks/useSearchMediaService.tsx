import { useAPI } from "../../shared/hooks/useAPI";
import { ISearchMediaResult } from "../pages/search/models/ISearchMediaResult";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { ISearchedSeries } from "../pages/search/models/ISearchedMedias";
import { useAlert } from "../../shared/contexts/AlertContext";

export const useSearchMediaService = () => {
  const { get } = useAPI();
  const { pushDanger } = useAlert();

  const getAllMediaByTitle = (title: string) => {
    return get<ISearchMediaResult>(
      APIRoutes.GET_ALL_MEDIA_BY_TITLE(title)
    ).then((res) => {
      if (res.status !== 200) {
        pushDanger("Cannot get list of media");
      }
      return res;
    });
  };

  const getSeriesById = (tvdbId: number) => {
    return get<ISearchedSeries>(APIRoutes.GET_SERIES_BY_ID(tvdbId)).then(
      (res) => {
        if (res.status !== 200) {
          pushDanger("Cannot get series");
        }
        return res;
      }
    );
  };

  return {
    getAllMediaByTitle,
    getSeriesById,
  };
};
