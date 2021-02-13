import React, { useEffect } from "react";
import { useParams } from "react-router";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { useAPI } from "../../shared/hooks/useAPI";
import { useAlert } from "../../shared/contexts/AlertContext";

type ResetPasswordRouteParams = {
  token: string;
};

const ResetPassword = () => {
  const { token } = useParams<ResetPasswordRouteParams>();
  const { get } = useAPI();
  const { pushDanger } = useAlert();
  useEffect(() => {
    get(APIRoutes.GET_RESET_PASSWORD_TOKEN_VALIDITY(token)).then((res) => {
      if (res.status !== 200) {
        pushDanger("Expired");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="ResetPassword" data-testid="ResetPassword">
      <div>
        <div className="hero is-primary">
          <div className="hero-body">
            <div className="container has-text-centered">
              <h1 className="title">
                <p>
                  Reset your{" "}
                  <span className="has-text-secondary">Cheddarr</span> password
                  account
                </p>
              </h1>
            </div>
          </div>
        </div>

        <br />

        <ResetPasswordForm token={token} />
      </div>
    </div>
  );
};

export { ResetPassword };
