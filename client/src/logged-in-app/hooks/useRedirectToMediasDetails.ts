import { useHistory } from "react-router-dom";
import { MediaTypes } from "../enums/MediaTypes";
import { routes } from "../../routes";
import {
  IMediasServerMedias,
  isMediaServerEpisode,
} from "../pages/plex-media/models/IMediasServerMedias";
import { IMediaSearchResult } from "../navbar/components/search-bar/models/IMediaSearchResult";

export const useRedirectToMediasDetails = () => {
  const history = useHistory();

  const redirectToMediaPage = (
    medias: IMediasServerMedias | IMediaSearchResult
  ) => {
    let url = "";
    if (medias.type === MediaTypes.SHOW) {
      url = routes.SERIES.url(medias.id.toString());
    } else if (medias.type === MediaTypes.MOVIE) {
      url = routes.MOVIE.url(medias.id.toString());
    } else if (
      medias.type === MediaTypes.EPISODE &&
      isMediaServerEpisode(medias)
    ) {
      url = routes.SERIES.url(medias.seriesId.toString());
    }
    history.push(url);
  };

  return {
    redirectToMediaPage,
  };
};
