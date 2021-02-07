import React from "react";
import { MediaRecentlyAddedType } from "./enums/MediaRecentlyAddedType";
import { usePlexConfig } from "../../contexts/PlexConfigContext";
import { MediaRecentlyAdded } from "./components/MediaRecentlyAdded";
import { MissingConfigHome } from "./MissingConfigHome";

export default function Home() {
  const { currentConfig } = usePlexConfig();

  if (currentConfig.data) {
    return (
      <div className="noselect">
        <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
        <br />
        <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
        <br />
        <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
      </div>
    );
  } else {
    return <MissingConfigHome />;
  }
}
