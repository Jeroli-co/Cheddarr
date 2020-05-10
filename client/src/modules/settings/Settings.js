import React from "react";
import { PlexConfigContextProvider } from "../../contexts/PlexConfigContext";
import styled from "styled-components";
import { routes } from "../../router/routes";
import { Link, Redirect, Route, Switch, useLocation } from "react-router-dom";

const SettingsStyle = styled.div`
  margin: 1%;
`;

const tabsName = ["Account", "Plex", "Radarr", "Sonarr"];

const Settings = () => {
  const url = routes.USER_SETTINGS.url;
  const location = useLocation();

  if (location.pathname === url || location.pathname === url + "/") {
    return <Redirect to={routes.USER_SETTINGS_ACCOUNT.url} />;
  }

  const isActiveTab = (name) => {
    return (
      location.pathname === url + "/" + name.toLowerCase() ||
      location.pathname === url + "/" + name.toLowerCase() + "/"
    );
  };

  return (
    <SettingsStyle data-testid="Settings">
      <div className="tabs is-centered is-boxed is-medium">
        <ul>
          {tabsName.map((name, index) => (
            <li key={index} className={isActiveTab(name) ? "is-active" : ""}>
              <Link to={routes.USER_SETTINGS.url + "/" + name.toLowerCase()}>
                {name}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <PlexConfigContextProvider>
        <Switch>
          <Route
            path={routes.USER_SETTINGS_ACCOUNT.url}
            component={routes.USER_SETTINGS_ACCOUNT.component}
          />
          <Route
            exact
            path={routes.USER_SETTINGS_PLEX.url}
            component={routes.USER_SETTINGS_PLEX.component}
          />
          <Route
            exact
            path={routes.USER_SETTINGS_RADARR.url}
            component={routes.USER_SETTINGS_RADARR.component}
          />
          <Route
            exact
            path={routes.USER_SETTINGS_SONARR.url}
            component={routes.USER_SETTINGS_SONARR.component}
          />
          <Route render={() => <Redirect to={routes.NOT_FOUND.url} />} />
        </Switch>
      </PlexConfigContextProvider>
    </SettingsStyle>
  );
};

export { Settings };
