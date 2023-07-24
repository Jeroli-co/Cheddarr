import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router";
import { PrimaryRoundedButton } from "./Button";
import { routes } from "../../routes";

export const SignInButton = () => {
  const navigate = useNavigate();
  return (
    <PrimaryRoundedButton onClick={() => navigate(routes.SIGN_IN.url())}>
      <span className="left-icon">
        <FontAwesomeIcon icon={faSignInAlt} />
      </span>
      <span>Sign in</span>
    </PrimaryRoundedButton>
  );
};
