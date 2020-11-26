import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NotificationContextProvider } from "./modules/notifications/NotificationContext";
import { Navbar } from "./modules/navbar/Navbar";
import { ThemeContextProvider } from "./utils/contexts/ThemeContext";
import { RouterSwitch } from "./router/RouterSwitch";
import { AuthContextProvider } from "./modules/auth/contexts/AuthContextProvider";
import { BrowserRouter } from "react-router-dom";

const App = () => {
  config.autoAddCss = false;

  return (
    <ThemeContextProvider>
      <NotificationContextProvider>
        <BrowserRouter>
          <AuthContextProvider>
            <Navbar />
            <RouterSwitch />
          </AuthContextProvider>
        </BrowserRouter>
      </NotificationContextProvider>
    </ThemeContextProvider>
  );
};

export { App };
