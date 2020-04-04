import React from 'react';
import {PlexConfig} from "../../plex/PlexConfig";

const SettingsConfigurations = (props) => {
  return (
    <div className="SettingsConfigurations container" data-testid="SettingsConfigurations">
      <h1 className="title is-1">Plex</h1>
      <hr/>
      <PlexConfig {...props} />
    </div>
  )
};

export {
  SettingsConfigurations
}