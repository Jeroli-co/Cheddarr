import React from "react";
import { MediaRecentlyAddedType } from "./enums/MediaRecentlyAddedType";
import { usePlexConfig } from "../../../shared/contexts/PlexConfigContext";
import { MediaRecentlyAdded } from "./components/MediaRecentlyAdded";
import { MissingConfigHome } from "./MissingConfigHome";

export default function Home() {
  const { currentConfig } = usePlexConfig();

  if (currentConfig.data) {
    return (
      <div className="noselect">
        <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
        {/*<br/>
          <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />*/}
      </div>
    );
  } else {
    return <MissingConfigHome />;
  }
}
