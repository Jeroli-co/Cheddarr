import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";
import { Route, Switch } from "react-router-dom";
import { ThemeProvider } from "styled-components";
import { AuthContextWithRouterProvider } from "./contexts/AuthContext";
import { NotificationContextProvider } from "./contexts/NotificationContext";
import { Navbar } from "./elements/navbar/Navbar";
import { PrivateRoute } from "./router/PrivateRoute";
import { ProtectedRoute } from "./router/ProtectedRoute";
import { routes } from "./router/routes";

const App = () => {
  config.autoAddCss = false;

  const theme = {
    primary: "#f8813f",
    primaryLight: "#ff9761",
    primaryLighter: "#ffe3d4",
    secondary: "#f9c441",
    secondaryLight: "#ffd679",
    secondaryLighter: "#fff7c9",
    secondaryDark: "#9a702a",
    dark: "#4f4d4d",
    transparent: "rgba(198,198,198,0.17)",
    transparentDark: "rgba(146,146,146,0.5)",
    darkPlex: "#282a2d",
  };

  return (
    <ThemeProvider theme={theme}>
      <NotificationContextProvider>
        <AuthContextWithRouterProvider>
          <div className="App">
            <Navbar />

            <Switch>
              <Route
                exact
                path={routes.HOME.url}
                component={routes.HOME.component}
              />
              <Route
                exact
                path={routes.CONFIRM_EMAIL.url(":token")}
                component={routes.CONFIRM_EMAIL.component}
              />
              <Route
                exact
                path={routes.RESET_PASSWORD.url(":token")}
                component={routes.RESET_PASSWORD.component}
              />
              <Route
                exact
                path={routes.CONFIRM_PLEX_SIGNIN.url}
                component={routes.CONFIRM_PLEX_SIGNIN.component}
              />
              <ProtectedRoute
                path={routes.SIGN_IN.url}
                component={routes.SIGN_IN.component}
              />
              <ProtectedRoute
                exact
                path={routes.SIGN_UP.url}
                component={routes.SIGN_UP.component}
              />
              <ProtectedRoute
                exact
                path={routes.RESEND_EMAIL_CONFIRMATION.url}
                component={routes.RESEND_EMAIL_CONFIRMATION.component}
              />
              <PrivateRoute
                path={routes.USER_PROFILE.url}
                component={routes.USER_PROFILE.component}
              />
              <PrivateRoute
                exact
                path={routes.USER_FRIEND_PROFILE.url(":id")}
                component={routes.USER_FRIEND_PROFILE.component}
              />
              <PrivateRoute
                path={routes.USER_SETTINGS.url}
                component={routes.USER_SETTINGS.component}
              />
              <PrivateRoute
                exact
                path={routes.MOVIE.url(":id")}
                component={routes.MOVIE.component}
              />
              <PrivateRoute
                exact
                path={routes.SERIES.url(":id")}
                component={routes.SERIES.component}
              />
              <PrivateRoute
                exact
                path={routes.SEASON.url(":seriesId", ":seasonId")}
                component={routes.SEASON.component}
              />
              <PrivateRoute
                path={routes.SEARCH.url(":type", ":title")}
                component={routes.SEARCH.component}
              />
              <Route
                exact
                path={routes.BAD_REQUEST.url}
                component={routes.BAD_REQUEST.component}
              />
              <Route
                exact
                path={routes.NOT_FOUND.url}
                component={routes.NOT_FOUND.component}
              />
              <Route
                exact
                path={routes.INTERNAL_SERVER_ERROR.url}
                component={routes.INTERNAL_SERVER_ERROR.component}
              />
              <Route component={routes.NOT_FOUND.component} />
            </Switch>
          </div>
        </AuthContextWithRouterProvider>
      </NotificationContextProvider>
    </ThemeProvider>
  );
};

export { App };
