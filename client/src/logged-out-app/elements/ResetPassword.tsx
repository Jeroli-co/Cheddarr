import React, { useEffect } from "react";
import { useParams } from "react-router";
import { ResetPasswordForm } from "./ResetPasswordForm";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { useAPI } from "../../shared/hooks/useAPI";
import { useAlert } from "../../shared/contexts/AlertContext";
import { PrimaryHero } from "../../shared/components/layout/Hero";
import { H1 } from "../../shared/components/Titles";
import { useHistory } from "react-router";

type ResetPasswordRouteParams = {
  token: string;
};

const ResetPassword = () => {
  const { token } = useParams<ResetPasswordRouteParams>();
  const { get } = useAPI();
  const { pushDanger } = useAlert();
  const history = useHistory();
  useEffect(() => {
    get(APIRoutes.GET_RESET_PASSWORD_TOKEN_VALIDITY(token)).then((res) => {
      if (res.status !== 202) {
        pushDanger("Expired");
        history.push("/");
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <PrimaryHero>
        <H1>Reset your Cheddarr password account</H1>
      </PrimaryHero>
      <br />
      <ResetPasswordForm token={token} />
    </div>
  );
};

export { ResetPassword };
