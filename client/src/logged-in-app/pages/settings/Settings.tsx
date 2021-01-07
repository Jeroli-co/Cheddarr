import React from "react";
import { routes } from "../../../routes";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";
import styled from "styled-components";

const tabsName = ["Account", "Plex", "Radarr", "Sonarr"];

const SettingsStyle = styled.div`
  display: flex;
  padding: 10px;

  .settings-content: {
    flex-grow: 4;
  }
`;

const Settings = () => {
  const url = routes.SETTINGS.url;
  const location = useLocation();

  if (location.pathname === url || location.pathname === url + "/") {
    return <Redirect to={routes.SETTINGS_ACCOUNT.url} />;
  }

  const isActiveTab = (name: string) => {
    return (
      location.pathname === url + "/" + name.toLowerCase() ||
      location.pathname === url + "/" + name.toLowerCase() + "/"
    );
  };

  return (
    <SettingsStyle data-testid="Settings">
      <div>
        <div className="settings-content tabs is-centered is-boxed is-medium">
          <ul>
            {tabsName.map((name, index) => (
              <li key={index} className={isActiveTab(name) ? "is-active" : ""}>
                <Link to={routes.SETTINGS.url + "/" + name.toLowerCase()}>
                  {name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <Switch>
          <Route
            path={routes.SETTINGS_ACCOUNT.url}
            component={routes.SETTINGS_ACCOUNT.component}
          />
          <Route
            exact
            path={routes.SETTINGS_PLEX.url}
            component={routes.SETTINGS_PLEX.component}
          />
          <Route
            exact
            path={routes.SETTINGS_RADARR.url}
            component={routes.SETTINGS_RADARR.component}
          />
          <Route
            exact
            path={routes.SETTINGS_SONARR.url}
            component={routes.SETTINGS_SONARR.component}
          />
        </Switch>
      </div>
    </SettingsStyle>
  );
};

export { Settings };
