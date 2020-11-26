import React, { useEffect, useState } from "react";
import { useParams } from "react-router";
import { ResetPasswordForm } from "./reset-password-form/ResetPasswordForm";
import { IAsyncResponse } from "../../../api/models/IAsyncResponse";
import { UserService } from "../../../user/services/UserService";

type ResetPasswordRouteParams = {
  token: string;
};

const ResetPassword = () => {
  const { token } = useParams<ResetPasswordRouteParams>();
  const [response, setResponse] = useState<IAsyncResponse | null>(null);

  useEffect(() => {
    UserService.CheckResetPasswordToken(token).then((res) => {
      if (res) setResponse(res);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ResetPassword" data-testid="ResetPassword">
      {response && response.error !== null && (
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
