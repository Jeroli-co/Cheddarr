import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { AuthenticationContextProvider } from "../shared/contexts/AuthenticationContext";
import { SwitchRoutes } from "./SwitchRoutes";
import { Navbar } from "./Navbar";

export const LoggedOutApp = () => {
  return (
    <AuthenticationContextProvider>
      <Navbar />
      <SwitchRoutes />
    </AuthenticationContextProvider>
  );
};
