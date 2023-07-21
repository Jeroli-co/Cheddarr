import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../router/routes";
import { PrimaryRoundedButton } from "./Button";
import { useNavigate } from "react-router-dom";

export const SignUpButton = () => {
  const navigate = useNavigate();
  return (
    <PrimaryRoundedButton onClick={() => navigate(routes.SIGN_UP.url)}>
      <span className="left-icon">
        <FontAwesomeIcon icon={faUserPlus} />
      </span>
      <span>Sign up</span>
    </PrimaryRoundedButton>
  );
};
