import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AlertContextProvider } from "./shared/contexts/AlertContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeContext } from "./shared/contexts/ThemeContext";
import { SessionContextProvider } from "./shared/contexts/SessionContext";
import PlexAuthContextProvider from "./shared/contexts/PlexAuthContext";
import { MainRouter } from "./router/new-router/MainRouter";

export const App = () => {
  config.autoAddCss = false;

  return (
    <div className="App">
      <ThemeContext>
        <AlertContextProvider>
          <BrowserRouter>
            <SessionContextProvider>
              <PlexAuthContextProvider>
                <MainRouter />
              </PlexAuthContextProvider>
            </SessionContextProvider>
          </BrowserRouter>
        </AlertContextProvider>
      </ThemeContext>
    </div>
  );
};
