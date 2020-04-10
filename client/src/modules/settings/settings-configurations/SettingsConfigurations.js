import React from 'react';
import {PlexConfig} from "./plex-config/PlexConfig";
import {PlexConfigContextProvider} from "../../../contexts/PlexConfigContext";

const SettingsConfigurations = (props) => {
  return (
    <div className="SettingsConfigurations container" data-testid="SettingsConfigurations">
      <PlexConfigContextProvider>
        <PlexConfig location={props.location} />
      </PlexConfigContextProvider>
    </div>
  )
};

export {
  SettingsConfigurations
}
