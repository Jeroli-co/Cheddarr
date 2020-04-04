import React from 'react';
import {PlexConfig} from "./components/plex-config/PlexConfig";
import {PlexConfigContextProvider} from "../../../contexts/PlexConfigContext";

const SettingsConfigurations = (props) => {
  return (
    <div className="SettingsConfigurations container" data-testid="SettingsConfigurations">
      <h1 className="title is-1">Plex</h1>
      <hr/>
      <PlexConfigContextProvider>
        <PlexConfig location={props.location} />
      </PlexConfigContextProvider>
    </div>
  )
};

export {
  SettingsConfigurations
}