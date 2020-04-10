import React from 'react';
import {PlexConfig} from "./plex-config/PlexConfig";

const SettingsConfigurations = (props) => {
  return (
    <div className="SettingsConfigurations container" data-testid="SettingsConfigurations">
      <PlexConfig location={props.location} />
    </div>
  )
};

export {
  SettingsConfigurations
}
