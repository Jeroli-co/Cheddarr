import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NotificationContextProvider } from "./contexts/notifications/NotificationContext";
import { Navbar } from "./components/navbar/Navbar";
import { RouterSwitch } from "./router/RouterSwitch";
import { AuthContextProvider } from "./contexts/auth/AuthContextProvider";
import { BrowserRouter } from "react-router-dom";
import { ThemeDynamicContextProvider } from "./contexts/themes/ThemeDynamicContextProvider";
import { ThemeContextProvider } from "./contexts/themes/ThemeContextProvider";
import { PlexConfigContextProvider } from "./contexts/plex-config/PlexConfigContextProvider";

const App = () => {
  config.autoAddCss = false;

  return (
    <ThemeDynamicContextProvider>
      <ThemeContextProvider>
        <NotificationContextProvider>
          <BrowserRouter>
            <AuthContextProvider>
              <PlexConfigContextProvider>
                <Navbar />
                <RouterSwitch />
              </PlexConfigContextProvider>
            </AuthContextProvider>
          </BrowserRouter>
        </NotificationContextProvider>
      </ThemeContextProvider>
    </ThemeDynamicContextProvider>
  );
};

export { App };
