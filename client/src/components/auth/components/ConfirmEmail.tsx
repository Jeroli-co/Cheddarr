import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import Spinner from "../../elements/Spinner";
import { SignInButton } from "./elements/SignInButton";
import { MESSAGES } from "../../../enums/Messages";
import { IAsyncResponse } from "../../../models/IAsyncResponse";
import { AuthService } from "../../../services/AuthService";

const ConfirmEmail = () => {
  const { token } = useParams<{ token: string }>();
  const [response, setResponse] = useState<IAsyncResponse | null>(null);

  useEffect(() => {
    AuthService.confirmEmail(token).then((res) => setResponse(res));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (response === null) return <Spinner />;

  const text = response.error ? response.error : MESSAGES.EMAIL_CONFIRMED;

  return (
    <section className="hero is-primary is-bold is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{text}</h1>
          <h2 className="subtitle">Please try to sign in</h2>
          <SignInButton dataTestId="confirm-email-sign-in-button" />
        </div>
      </div>
    </section>
  );
};

export { ConfirmEmail };
