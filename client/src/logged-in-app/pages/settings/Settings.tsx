import React from "react";
import { routes } from "../../../router/routes";
import { Redirect, Route, Switch, useLocation } from "react-router-dom";
import { Tabs } from "../../../experimentals/Tabs";
import { PageLayout } from "../../../experimentals/PageLayout";

const tabs = ["Account", "Plex", "Radarr", "Sonarr"];

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

  const getActiveTab = () => {
    const activeTab = tabs.find((t) => isActiveTab(t));
    return activeTab ? activeTab : tabs[0];
  };

  return (
    <PageLayout>
      <Tabs tabs={tabs} activeTab={getActiveTab()} />
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
    </PageLayout>
  );
};

export { Settings };
