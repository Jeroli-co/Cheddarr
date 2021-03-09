import React from "react";
import { usePlexConfig } from "../../../shared/contexts/PlexConfigContext";
import { MediaCarouselWidget } from "../../../shared/components/media/MediaCarouselWidget";
import { MissingConfigHome } from "./MissingConfigHome";
import { APIRoutes } from "../../../shared/enums/APIRoutes";
import { MediaTypes } from "../../../shared/enums/MediaTypes";

export default function Home() {
  const { currentConfig } = usePlexConfig();

  if (!currentConfig.isLoading && !currentConfig.data) {
    return <MissingConfigHome />;
  } else if (!currentConfig.isLoading && currentConfig.data) {
    return (
      <div className="noselect">
        <MediaCarouselWidget
          title="Movies recently added"
          url={APIRoutes.GET_MEDIA_RECENTLY_ADDED(MediaTypes.MOVIES)}
        />
        <br />
        <MediaCarouselWidget
          title="Series recently added"
          url={APIRoutes.GET_MEDIA_RECENTLY_ADDED(MediaTypes.SERIES)}
        />
        <br />
        <MediaCarouselWidget
          title="Popular movies"
          url={APIRoutes.GET_MEDIA_POPULAR(MediaTypes.MOVIES)}
        />
        <br />
        <MediaCarouselWidget
          title="Popular series"
          url={APIRoutes.GET_MEDIA_POPULAR(MediaTypes.SERIES)}
        />
        <br />
        <MediaCarouselWidget
          title="Upcoming movies"
          url={APIRoutes.GET_MEDIA_UPCOMING(MediaTypes.MOVIES)}
        />
      </div>
    );
  } else {
    return <div />;
  }
}
