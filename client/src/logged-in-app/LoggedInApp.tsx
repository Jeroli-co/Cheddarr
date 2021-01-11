import React from "react";
import "@fortawesome/fontawesome-svg-core/styles.css";
import { PlexConfigContextProvider } from "./contexts/PlexConfigContext";
import { Navbar } from "./navbar/Navbar";
import { SwitchRoutes } from "./SwitchRoutes";

export default function LoggedInApp() {
  return (
    <PlexConfigContextProvider>
      <Navbar />
      <SwitchRoutes />
    </PlexConfigContextProvider>
  );
}
