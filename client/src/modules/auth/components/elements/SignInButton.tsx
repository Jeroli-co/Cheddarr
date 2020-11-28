import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { routes } from "../../../../router/routes";

type SignInButtonProps = {
  dataTestId: string;
};

export const SignInButton = ({ dataTestId }: SignInButtonProps) => {
  return (
    <Link
      className="button is-rounded is-secondary-button"
      to={routes.SIGN_IN.url}
      data-testid={dataTestId}
    >
      <span className="icon">
        <FontAwesomeIcon icon={faSignInAlt} />
      </span>
      <span>Sign in</span>
    </Link>
  );
};
