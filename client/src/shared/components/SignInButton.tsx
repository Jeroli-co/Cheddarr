import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useHistory } from "react-router";
import { PrimaryRoundedButton } from "./Button";
import { routes } from "../../router/routes";

export const SignInButton = () => {
  const history = useHistory();
  return (
    <PrimaryRoundedButton onClick={() => history.push(routes.SIGN_IN.url())}>
      <span className="left-icon">
        <FontAwesomeIcon icon={faSignInAlt} />
      </span>
      <span>Sign in</span>
    </PrimaryRoundedButton>
  );
};
