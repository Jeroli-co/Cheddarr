import React from "react";
import { SignInButton } from "../../../components/SignInButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { IUser } from "../../../../logged-in-app/pages/user-profile/models/IUser";
import { useAuthentication } from "../../../contexts/AuthenticationContext";

type WaitingEmailConfirmationProps = {
  user: IUser;
};

const WaitingEmailConfirmation = ({ user }: WaitingEmailConfirmationProps) => {
  const { resendEmailConfirmation } = useAuthentication();

  return (
    <section
      className="WaitingEmailConfirmation hero is-primary is-bold is-fullheight-with-navbar"
      data-testid="WaitingEmailConfirmation"
    >
      <div className="hero-body">
        <div className="container has-text-centered">
          <h1 className="title is-1">
            One more step {user.username} ! Your email needs to be confirmed...
          </h1>
          <hr />
          <h2 className="subtitle">
            Please check your emails and click on the link provided to confirm
            your account
          </h2>

          <h2 className="subtitle">
            If you already confirmed your account, feel free to sign in to
            Cheddarr
          </h2>
          <h2 className="subtitle">
            If you have not received the confirmation email, Click on the button
            below
          </h2>
          <div className="buttons is-centered">
            <SignInButton />
            <button
              className="button is-rounded is-primary"
              type="button"
              onClick={() => resendEmailConfirmation(user.email)}
            >
              <span className="icon">
                <FontAwesomeIcon icon={faEnvelope} />
              </span>
              <span>Resend email</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export { WaitingEmailConfirmation };
