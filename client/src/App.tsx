import React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AlertContextProvider } from "./shared/contexts/AlertContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeContextProvider } from "./shared/contexts/ThemeContextProvider";
import { SessionContextProvider } from "./shared/contexts/SessionContext";
import { DynamicApp } from "./DynamicApp";
import PlexAuthContextProvider from "./shared/contexts/PlexAuthContext";

const App = () => {
  config.autoAddCss = false;

  return (
    <div className="App">
      <ThemeContextProvider>
        <AlertContextProvider>
          <BrowserRouter>
            <SessionContextProvider>
              <PlexAuthContextProvider>
                <DynamicApp />
              </PlexAuthContextProvider>
            </SessionContextProvider>
          </BrowserRouter>
        </AlertContextProvider>
      </ThemeContextProvider>
    </div>
  );
};

export { App };
