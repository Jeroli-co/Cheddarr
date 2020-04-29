import React from "react";
import { PlexConfig } from "./plex-config/PlexConfig";
import { PlexConfigContextProvider } from "../../../contexts/PlexConfigContext";
import { RadarrConfig } from "./radarr-config/RadarrConfig";
const SettingsConfigurations = (props) => {
  return (
    <div
      className="SettingsConfigurations container"
      data-testid="SettingsConfigurations"
    >
      <PlexConfigContextProvider>
        <PlexConfig location={props.location} />
      </PlexConfigContextProvider>
      <RadarrConfig />
    </div>
  );
};

export { SettingsConfigurations };
