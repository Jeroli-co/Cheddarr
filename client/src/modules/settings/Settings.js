import React, { useEffect, useState } from "react";
import "./Settings.scss";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";
import { Route } from "react-router";
import { PlexConfigContextProvider } from "../../contexts/PlexConfigContext";

const Settings = ({ location }) => {
  const [activeLink, setActiveLink] = useState("");

  useEffect(() => {
    setActiveLink(location.pathname);
  }, [location.pathname]);

  return (
    <div className="Settings" data-testid="Settings">
      <div className="tabs is-centered is-boxed is-medium">
        <ul>
          <li
            className={
              activeLink === routes.USER_SETTINGS.url ||
              activeLink === routes.USER_SETTINGS_ACCOUNT.url
                ? "is-active"
                : ""
            }
          >
            <Link to={routes.USER_SETTINGS_ACCOUNT.url}>
              <p>Account</p>
            </Link>
          </li>
          <li
            className={
              activeLink === routes.USER_SETTINGS_PLEX.url ? "is-active" : ""
            }
          >
            <Link to={routes.USER_SETTINGS_PLEX.url}>
              <p>Plex</p>
            </Link>
          </li>
          <li
            className={
              activeLink === routes.USER_SETTINGS_RADARR.url ? "is-active" : ""
            }
          >
            <Link to={routes.USER_SETTINGS_RADARR.url}>
              <p>Radarr</p>
            </Link>
          </li>
          <li
            className={
              activeLink === routes.USER_SETTINGS_SONARR.url ? "is-active" : ""
            }
          >
            <Link to={routes.USER_SETTINGS_SONARR.url}>
              <p>Sonarr</p>
            </Link>
          </li>
        </ul>
      </div>
      <Route
        exact
        path={routes.USER_SETTINGS.url}
        component={routes.USER_SETTINGS_ACCOUNT.component}
      />
      <Route
        exact
        path={routes.USER_SETTINGS_ACCOUNT.url}
        component={routes.USER_SETTINGS_ACCOUNT.component}
      />
      <PlexConfigContextProvider>
        <Route
          exact
          path={routes.USER_SETTINGS_PLEX.url}
          component={routes.USER_SETTINGS_PLEX.component}
        />
      </PlexConfigContextProvider>
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
    </div>
  );
};

export { Settings };
