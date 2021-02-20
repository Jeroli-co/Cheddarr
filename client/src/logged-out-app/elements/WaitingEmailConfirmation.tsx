import React, { useState } from "react";
import { faEnvelope, faSignInAlt } from "@fortawesome/free-solid-svg-icons";
import { PrimaryHero } from "../../shared/components/layout/Hero";
import { H1 } from "../../shared/components/Titles";
import { Buttons } from "../../shared/components/layout/Buttons";
import { PrimaryRoundedButton } from "../../shared/components/Button";
import { Icon } from "../../shared/components/Icon";
import { InitResetPasswordModal } from "./InitResetPasswordModal";
import { CenteredContent } from "../../shared/components/layout/CenteredContent";
import { useHistory } from "react-router-dom";
import { routes } from "../../router/routes";

type WaitingEmailConfirmationProps = {
  closePanel?: () => void;
};

export const WaitingEmailConfirmation = (
  props: WaitingEmailConfirmationProps
) => {
  const [isInitPasswordModalOpen, setIsInitPasswordModalOpen] = useState(false);
  const history = useHistory();

  return (
    <>
      <PrimaryHero>
        <H1>One more step ! Your email needs to be confirmed...</H1>
      </PrimaryHero>
      <CenteredContent height="40vh">
        <p>
          Please check your emails and click on the link provided to confirm
          your account
        </p>
        <br />
        <p>
          If you already confirmed your account, feel free to sign in to
          Cheddarr
        </p>
        <br />
        <p>
          If you have not received the confirmation email, Click on the button
          below
        </p>
        <br />
        <Buttons>
          <PrimaryRoundedButton
            type="button"
            onClick={() =>
              props.closePanel
                ? props.closePanel()
                : history.push(routes.SIGN_IN.url())
            }
          >
            <span className="icon">
              <Icon icon={faSignInAlt} />
            </span>
            <span>Sign in</span>
          </PrimaryRoundedButton>
          <PrimaryRoundedButton
            type="button"
            onClick={() => setIsInitPasswordModalOpen(true)}
          >
            <span className="icon">
              <Icon icon={faEnvelope} />
            </span>
            <span>Resend email</span>
          </PrimaryRoundedButton>
        </Buttons>
      </CenteredContent>
      <InitResetPasswordModal
        isOpen={isInitPasswordModalOpen}
        closeModal={() => setIsInitPasswordModalOpen(false)}
      />
    </>
  );
};
