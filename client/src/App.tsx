import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NotificationContextProvider } from "./modules/notifications/NotificationContext";
import { Navbar } from "./modules/navbar/Navbar";
import { RouterSwitch } from "./router/RouterSwitch";
import { AuthContextProvider } from "./modules/auth/contexts/AuthContextProvider";
import { BrowserRouter } from "react-router-dom";
import { ThemeDynamicContextProvider } from "./modules/themes/ThemeDynamicContextProvider";
import { Theme } from "./modules/themes/Theme";

const App = () => {
  config.autoAddCss = false;

  return (
    <ThemeDynamicContextProvider>
      <Theme>
        <NotificationContextProvider>
          <BrowserRouter>
            <AuthContextProvider>
              <Navbar />
              <RouterSwitch />
            </AuthContextProvider>
          </BrowserRouter>
        </NotificationContextProvider>
      </Theme>
    </ThemeDynamicContextProvider>
  );
};

export { App };
