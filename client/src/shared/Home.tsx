import React from "react";
import { useSession } from "./contexts/SessionContext";
import { default as LoggedInHome } from "../logged-in-app/pages/home/Home";
import { default as LoggedOutHome } from "../logged-out-app/pages/Home";

export const Home = () => {
  const {
    session: { isAuthenticated },
  } = useSession();

  if (isAuthenticated) {
    return <LoggedInHome />;
  } else {
    return <LoggedOutHome />;
  }
};
