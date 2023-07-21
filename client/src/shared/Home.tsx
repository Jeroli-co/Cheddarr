import React from "react";
import { useSession } from "./contexts/SessionContext";
import { default as LoggedInHome } from "../logged-in-app/pages/Home";
import { Navigate } from "react-router-dom";
import { routes } from "../router/routes";

export const Home = () => {
  const {
    session: { isAuthenticated },
  } = useSession();

  if (isAuthenticated) {
    return <LoggedInHome />;
  } else {
    return <Navigate to={routes.SIGN_IN.url()} />;
  }
};

export default Home
