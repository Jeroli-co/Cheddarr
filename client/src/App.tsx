import * as React from "react";
import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AlertContextProvider } from "./shared/contexts/AlertContext";
import { BrowserRouter } from "react-router-dom";
import { ThemeContext } from "./shared/contexts/ThemeContext";
import { SessionContextProvider } from "./shared/contexts/SessionContext";
import PlexAuthContextProvider from "./shared/contexts/PlexAuthContext";
import { PageLoader } from "./shared/components/PageLoader";
import { QueryClient, QueryClientProvider } from "react-query";

const queryClient = new QueryClient();

const MainRouter = React.lazy(() => import("./pages/router"));

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  config.autoAddCss = false;

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeContext>
        <AlertContextProvider>
          <BrowserRouter>
            <SessionContextProvider>
              <PlexAuthContextProvider>
                <React.Suspense fallback={<PageLoader />}>
                  <MainRouter />
                </React.Suspense>
              </PlexAuthContextProvider>
            </SessionContextProvider>
          </BrowserRouter>
        </AlertContextProvider>
      </ThemeContext>
    </QueryClientProvider>
  );
};
