import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { routes } from "../../../../router/routes";

function SignUpButton(props) {
  return (
    <Link
      className="button is-rounded is-secondary-button"
      to={routes.SIGN_UP.url}
      data-testid={props["data-testid"]}
    >
      <span className="icon">
        <FontAwesomeIcon icon={faUserPlus} />
      </span>
      <span>Sign up</span>
    </Link>
  );
}

export { SignUpButton };
