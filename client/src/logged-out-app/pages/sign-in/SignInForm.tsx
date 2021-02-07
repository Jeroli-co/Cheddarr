import React from "react";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link, Route, useLocation } from "react-router-dom";
import { routes } from "../../../router/routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../shared/enums/FormDefaultValidators";
import { ISignInFormData } from "../../models/ISignInFormData";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { PrimaryHero } from "../../../shared/components/layout/Hero";
import { PlexButton } from "../../../shared/components/PlexButton";
import { RowLayout2 } from "../../../shared/components/layout/Layouts";
import { SecondaryButton } from "../../../shared/components/Button";
import { PrimaryDivider } from "../../../shared/components/Divider";
import { usePlexAuth } from "../../../shared/contexts/PlexAuthContext";
import { SignUpButton } from "../../components/SignUpButton";
import { Row } from "../../../shared/components/layout/Row";

function useRedirectURI() {
  const query = new URLSearchParams(useLocation().search);
  return query.get("redirectURI");
}

const SignInForm = () => {
  const { signIn } = useAuthentication();
  const { signInWithPlex } = usePlexAuth();
  const { register, handleSubmit, errors } = useForm<ISignInFormData>();
  const redirectURI = useRedirectURI();

  const onSubmit = handleSubmit((data) => {
    redirectURI ? signIn(data, redirectURI) : signIn(data);
  });

  function initSignInWithPlex() {
    redirectURI ? signInWithPlex(redirectURI) : signInWithPlex();
  }

  return (
    <div className="SignInForm" data-testid="SignInForm">
      <PrimaryHero>Sign into your Cheddarr account</PrimaryHero>

      <br />

      <div className="columns is-mobile is-centered">
        <div className="column is-one-quarter-desktop is-half-tablet is-three-quarters-mobile">
          <form
            id="sign-in-form"
            onSubmit={onSubmit}
            autoCorrect="off"
            autoCapitalize="off"
            autoComplete="off"
          >
            <div className="field">
              <label>Username or email</label>
              <div className="control has-icons-left">
                <input
                  name="username"
                  className={
                    "input is-medium " + (errors["username"] ? "is-danger" : "")
                  }
                  type="text"
                  placeholder="Username or email"
                  ref={register({
                    required: true,
                    minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                    maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
                {errors.username && errors.username.type === "required" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </p>
                )}
                {errors.username && errors.username.type === "minLength" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
                  </p>
                )}
                {errors.username && errors.username.type === "maxLength" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
                  </p>
                )}
              </div>
            </div>

            <div className="field">
              <label>Password</label>
              <div className="control has-icons-left">
                <input
                  name="password"
                  className={
                    "input is-medium " + (errors["password"] ? "is-danger" : "")
                  }
                  type="password"
                  placeholder="Password"
                  ref={register({
                    required: true,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.password && errors.password.type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
              <p className="help">
                <Link to={routes.INIT_RESET_PASSWORD.url}>
                  Forgot your password ?
                </Link>
              </p>
            </div>

            <div className="field">
              <div className="control">
                <SecondaryButton type="submit" width="100%">
                  Sign in
                </SecondaryButton>
              </div>
            </div>
          </form>

          <PrimaryDivider />

          <RowLayout2 justifyContent="center">
            <PlexButton
              text="Sign in with Plex"
              onClick={() => initSignInWithPlex()}
            />
          </RowLayout2>

          <br />

          <Row justifyContent="space-around" alignItems="center">
            <p>Still not have an account ?</p>
            <SignUpButton />
          </Row>
        </div>
      </div>

      <Route
        exact
        path={routes.INIT_RESET_PASSWORD.url}
        component={routes.INIT_RESET_PASSWORD.component}
      />
    </div>
  );
};

export { SignInForm };
