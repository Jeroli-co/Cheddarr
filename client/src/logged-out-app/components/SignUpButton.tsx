import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { routes } from "../../router/routes";

type SignUpButtonProps = {
  dataTestId: string;
};

export const SignUpButton = ({ dataTestId }: SignUpButtonProps) => {
  return (
    <Link
      className="button is-rounded is-secondary-button"
      to={routes.SIGN_UP.url}
      data-testid={dataTestId}
    >
      <span className="icon">
        <FontAwesomeIcon icon={faUserPlus} />
      </span>
      <span>Sign up</span>
    </Link>
  );
};
