import React from "react";
import { useSession } from "./shared/contexts/SessionContext";
import { LoggedInApp } from "./logged-in-app/LoggedInApp";
import { LoggedOutApp } from "./logged-out-app/LoggedOutApp";

export const DynamicApp = () => {
  const {
    session: { isAuthenticated, isLoading },
  } = useSession();

  if (isLoading) {
    return <div />;
  }

  return isAuthenticated ? <LoggedInApp /> : <LoggedOutApp />;
};
