import React from "react";
import { SignInButton } from "../../shared/components/SignInButton";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { IUser } from "../../shared/models/IUser";
import { useAuthentication } from "../../shared/contexts/AuthenticationContext";
import { PrimaryHero } from "../../shared/components/layout/Hero";
import { H1, H2 } from "../../shared/components/Titles";
import { Buttons } from "../../shared/components/layout/Buttons";
import { PrimaryRoundedButton } from "../../shared/components/Button";
import { Icon } from "../../shared/components/Icon";

type WaitingEmailConfirmationProps = {
  user: IUser;
};

export const WaitingEmailConfirmation = ({
  user,
}: WaitingEmailConfirmationProps) => {
  const { resendEmailConfirmation } = useAuthentication();

  return (
    <PrimaryHero>
      <H1>
        One more step {user.username} ! Your email needs to be confirmed...
      </H1>
      <hr />
      <H2>
        Please check your emails and click on the link provided to confirm your
        account
      </H2>

      <H2>
        If you already confirmed your account, feel free to sign in to Cheddarr
      </H2>
      <H2>
        If you have not received the confirmation email, Click on the button
        below
      </H2>
      <Buttons>
        <SignInButton />
        <PrimaryRoundedButton
          type="button"
          onClick={() => resendEmailConfirmation(user.email)}
        >
          <span className="icon">
            <Icon icon={faEnvelope} />
          </span>
          <span>Resend email</span>
        </PrimaryRoundedButton>
      </Buttons>
    </PrimaryHero>
  );
};
