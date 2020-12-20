import React, { useContext } from "react";
import { InternalServerError } from "./InternalServerError";
import { AuthContext } from "../../contexts/auth/AuthContext";
import { Redirect } from "react-router-dom";
import { routes } from "../../router/routes";

type ErrorProps = {
  status: number;
};

export const ErrorHandler = ({ status }: ErrorProps) => {
  const { invalidSession } = useContext(AuthContext);

  switch (status) {
    case 401:
      invalidSession();
      return <Redirect to={routes.SIGN_IN.url} />;
    default:
      return <InternalServerError />;
  }
};
