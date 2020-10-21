import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ResetPasswordForm } from "./reset-password-form/ResetPasswordForm";
import { useProfile } from "../../../user/hooks/useProfile";

const ResetPassword = () => {
  const { token } = useParams();
  const { checkResetPasswordToken } = useProfile();
  const [httpResponse, setHttpResponse] = useState(null);

  useEffect(() => {
    checkResetPasswordToken(token).then((res) => {
      if (res) setHttpResponse(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ResetPassword" data-testid="ResetPassword">
      {httpResponse && httpResponse.status === 200 && (
        <div>
          <div className="hero is-primary">
            <div className="hero-body">
              <div className="container has-text-centered">
                <h1 className="title">
                  <p>
                    Reset your{" "}
                    <span className="has-text-secondary">Cheddarr</span>{" "}
                    password account
                  </p>
                </h1>
              </div>
            </div>
          </div>

          <br />

          <ResetPasswordForm token={token} />
        </div>
      )}
    </div>
  );
};

export { ResetPassword };
