import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../router/routes";
import { SecondaryRoundedButton } from "../../experimentals/Button";
import { useHistory } from "react-router-dom";

export const SignUpButton = () => {
  const history = useHistory();
  return (
    <SecondaryRoundedButton onClick={() => history.push(routes.SIGN_UP.url)}>
      <span className="left-icon">
        <FontAwesomeIcon icon={faUserPlus} />
      </span>
      <span>Sign up</span>
    </SecondaryRoundedButton>
  );
};
