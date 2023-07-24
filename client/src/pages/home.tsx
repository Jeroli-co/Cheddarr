import { usePlexConfig } from "../shared/contexts/PlexConfigContext";
import { MediaSlider } from "../components/MediaSlider";
import { APIRoutes } from "../shared/enums/APIRoutes";
import { MediaTypes } from "../shared/enums/MediaTypes";

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { configs } = usePlexConfig();
  return (
    <>
      {!configs.isLoading && configs.data && configs.data.length > 0 && (
        <>
          <MediaSlider
            title="Movies recently added"
            url={APIRoutes.GET_MEDIA_RECENTLY_ADDED(MediaTypes.MOVIES)}
            hasToGetFullMedia
          />
          <MediaSlider
            title="Series recently added"
            url={APIRoutes.GET_MEDIA_RECENTLY_ADDED(MediaTypes.SERIES)}
            hasToGetFullMedia
          />
        </>
      )}
      <MediaSlider
        title="Popular movies"
        url={APIRoutes.GET_MEDIA_POPULAR(MediaTypes.MOVIES)}
      />
      <MediaSlider
        title="Popular series"
        url={APIRoutes.GET_MEDIA_POPULAR(MediaTypes.SERIES)}
      />
      <MediaSlider
        title="Upcoming movies"
        url={APIRoutes.GET_MEDIA_UPCOMING(MediaTypes.MOVIES)}
      />
    </>
  );
};
