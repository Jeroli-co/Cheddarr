import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { AuthContext } from "../contexts/AuthContext";
import Spinner from "../../../utils/elements/Spinner";
import { SignInButton } from "./elements/SignInButton";
import { MESSAGES } from "../../../utils/enums/Messages";

const ConfirmEmail = () => {
  const { token } = useParams();
  const { confirmEmail } = useContext(AuthContext);
  const [requestDetail, setRequestDetail] = useState({
    error: null,
    loading: true,
  });

  useEffect(() => {
    confirmEmail(token).then((detail) =>
      setRequestDetail({ error: detail, loading: false })
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (requestDetail.loading) return <Spinner />;

  const text = requestDetail.error
    ? requestDetail.error
    : MESSAGES.EMAIL_CONFIRMED;

  return (
    <section className="hero is-primary is-bold is-fullheight-with-navbar">
      <div className="hero-body">
        <div className="container">
          <h1 className="title">{text}</h1>
          <h2 className="subtitle">Please try to sign in</h2>
          <SignInButton />
        </div>
      </div>
    </section>
  );
};

export { ConfirmEmail };
