import React, { useState } from "react";
import { PlexConfigContextProvider } from "../../contexts/PlexConfigContext";
import { SettingsAccount } from "./settings-account/SettingsAccount";
import { PlexConfig } from "./settings-providers/plex-config/PlexConfig";
import { RadarrConfig } from "./settings-providers/radarr-config/RadarrConfig";
import { SonarrConfig } from "./settings-providers/sonarr-config/SonarrConfig";
import styled from "styled-components";

const SettingsStyle = styled.div`
  margin: 1%;
`;

const tabsName = ["Account", "Plex", "Radarr", "Sonarr"];

const Settings = ({ location }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <SettingsStyle data-testid="Settings">
      <div className="tabs is-centered is-boxed is-medium">
        <ul>
          {tabsName.map((name, index) => (
            <li
              className={activeTab === index ? "is-active" : ""}
              onClick={() => setActiveTab(index)}
            >
              <a href={"#" + tabsName[index]}>{tabsName[index]}</a>
            </li>
          ))}
        </ul>
      </div>

      {activeTab === 0 && <SettingsAccount id={tabsName[0]} />}
      {activeTab === 1 && (
        <PlexConfigContextProvider>
          <PlexConfig id={tabsName[1]} location={location} />
        </PlexConfigContextProvider>
      )}
      {activeTab === 2 && <RadarrConfig id={tabsName[2]} />}
      {activeTab === 3 && <SonarrConfig id={tabsName[3]} />}
    </SettingsStyle>
  );
};

export { Settings };
