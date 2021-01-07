import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { NotificationContextProvider } from "./shared/contexts/AlertContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeDynamicContextProvider } from "./shared/contexts/themes/ThemeDynamicContextProvider";
import { ThemeContextProvider } from "./shared/contexts/themes/ThemeContextProvider";
import { SessionContextProvider } from "./shared/contexts/SessionContext";
import { DynamicApp } from "./DynamicApp";

const App = () => {
  config.autoAddCss = false;

  return (
    <ThemeDynamicContextProvider>
      <ThemeContextProvider>
        <NotificationContextProvider>
          <BrowserRouter>
            <SessionContextProvider>
              <DynamicApp />
            </SessionContextProvider>
          </BrowserRouter>
        </NotificationContextProvider>
      </ThemeContextProvider>
    </ThemeDynamicContextProvider>
  );
};

export { App };
