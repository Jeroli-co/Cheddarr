import React from "react";
import { MediaRecentlyAddedType } from "./enums/MediaRecentlyAddedType";
import { usePlexConfig } from "../../contexts/PlexConfigContext";
import { MediaRecentlyAdded } from "./components/MediaRecentlyAdded";
import { MissingConfigHome } from "./MissingConfigHome";
import { PrimaryDivider } from "../../../experimentals/Divider";

export default function Home() {
  const { currentConfig } = usePlexConfig();

  if (currentConfig.data) {
    return (
      <div className="noselect">
        <MediaRecentlyAdded type={MediaRecentlyAddedType.ON_DECK} />
        <PrimaryDivider />
        <MediaRecentlyAdded type={MediaRecentlyAddedType.MOVIES} />
        <PrimaryDivider />
        <MediaRecentlyAdded type={MediaRecentlyAddedType.SERIES} />
      </div>
    );
  } else {
    return <MissingConfigHome />;
  }
}
