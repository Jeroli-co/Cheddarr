import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import React from "react";
import { NotificationContextProvider } from "./modules/notifications/contexts/NotificationContext";
import { Navbar } from "./modules/navbar/Navbar";
import { ThemeContextProvider } from "./utils/contexts/ThemeContext";
import { RouterSwitch } from "./router/RouterSwitch";
import { AuthContextProvider } from "./modules/auth/contexts/AuthContext";

const App = () => {
  config.autoAddCss = false;

  return (
    <ThemeContextProvider>
      <NotificationContextProvider>
        <AuthContextProvider>
          <Navbar />
          <RouterSwitch />
        </AuthContextProvider>
      </NotificationContextProvider>
    </ThemeContextProvider>
  );
};

export { App };
