import React from "react";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link, Route, useLocation } from "react-router-dom";
import { routes } from "../../../routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../shared/enums/FormDefaultValidators";
import { ISignInFormData } from "../../models/ISignInFormData";
import { useAuthentication } from "../../contexts/AuthenticationContext";

const logo = require("../../../assets/plex.png");

function useRedirectURI() {
  const query = new URLSearchParams(useLocation().search);
  return query.get("redirectURI");
}

const SignInForm = () => {
  const { signIn, signInWithPlex } = useAuthentication();
  const { register, handleSubmit, errors } = useForm<ISignInFormData>();
  const redirectURI = useRedirectURI();

  const onSubmit = handleSubmit((data) => {
    redirectURI ? signIn(data, redirectURI) : signIn(data);
  });

  return (
    <div className="SignInForm" data-testid="SignInForm">
      <div className="hero is-primary">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              <p>
                Sign into your{" "}
                <span className="has-text-secondary">Cheddarr</span> account
              </p>
            </h1>
          </div>
        </div>
      </div>

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
              <label className="label">Username or email</label>
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
              <label className="label">Password</label>
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
            </div>

            <div className="field">
              <div className="control">
                <button
                  type="submit"
                  className="button is-fullwidth is-secondary-button"
                >
                  Sign in
                </button>
              </div>
            </div>
          </form>

          <div className="is-divider" data-content="OR" />

          <div className="content has-text-centered">
            <button
              className="button has-background-dark-plex"
              type="button"
              onClick={() => signInWithPlex()}
            >
              <span className="icon">
                <img
                  className="icon-left"
                  src={logo}
                  alt="Plex logo"
                  width="30px"
                  height="30px"
                />
              </span>
              <span>Sign in with Plex</span>
            </button>
          </div>

          <br />

          <div className="content has-text-centered">
            <p className="is-size-7">
              <Link to={routes.INIT_RESET_PASSWORD.url}>
                Forgot your password ?
              </Link>
            </p>
            <p className="is-size-7">
              <Link to={routes.SIGN_UP.url}>Still not have an account ?</Link>
            </p>
          </div>
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
