import React, { useEffect } from "react";
import { useParams } from "react-router";
import { useAuthentication } from "../../shared/contexts/AuthenticationContext";

const ConfirmEmail = () => {
  const { token } = useParams<{ token: string }>();
  const { confirmEmail } = useAuthentication();

  useEffect(() => {
    confirmEmail(token);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <div />;
};

export { ConfirmEmail };
