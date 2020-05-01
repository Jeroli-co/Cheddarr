import React from "react";
import { PlexConfig } from "./plex-config/PlexConfig";
import { PlexConfigContextProvider } from "../../../contexts/PlexConfigContext";
import { RadarrConfig } from "./radarr-config/RadarrConfig";
import { SonarrConfig } from "./sonarr-config/SonarrConfig";
const SettingsConfigurations = (props) => {
  return (
    <div
      className="SettingsConfigurations container"
      data-testid="SettingsConfigurations"
    >
      <PlexConfigContextProvider>
        <PlexConfig location={props.location} />
      </PlexConfigContextProvider>
      <hr />
      <RadarrConfig />
      <hr />
      <SonarrConfig />
    </div>
  );
};

export { SettingsConfigurations };
