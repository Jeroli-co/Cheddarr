import React, { useContext, useEffect, useState } from "react";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { Link, Route, useLocation } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";
import { routes } from "../../../router/routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../utils/enums/FormDefaultValidators";
import logo from "../../../assets/plex.png";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SignInForm = (props) => {
  const { signIn, signInWithPlex } = useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm();
  const [rememberMe, setRememberMe] = useState(false);
  const [httpError, setHttpError] = useState(null);
  const query = useQuery();
  const [redirectURI, setRedirectURI] = useState(null);

  useEffect(() => {
    let redirectURI = query.get("redirectURI");
    redirectURI = redirectURI ? redirectURI : routes.HOME.url;
    setRedirectURI(redirectURI);
  }, [query]);

  const onSubmit = (data) => {
    signIn(data, redirectURI).then((res) => {
      if (res) {
        switch (res.status) {
          case 200:
            return;
          default:
            setHttpError(res);
        }
      }
    });
  };

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
          <form id="sign-in-form" onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label className="label">Username or email</label>
              <div className="control has-icons-left">
                <input
                  name="usernameOrEmail"
                  className={
                    "input is-medium " +
                    (errors["usernameOrEmail"] ? "is-danger" : "")
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
                {errors["usernameOrEmail"] &&
                  errors["usernameOrEmail"].type === "required" && (
                    <p className="help is-danger">
                      {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                    </p>
                  )}
                {errors["usernameOrEmail"] &&
                  errors["usernameOrEmail"].type === "minLength" && (
                    <p className="help is-danger">
                      {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
                    </p>
                  )}
                {errors["usernameOrEmail"] &&
                  errors["usernameOrEmail"].type === "maxLength" && (
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
              {errors["password"] && errors["password"].type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
            </div>

            {httpError &&
              ((httpError.status === 401 && (
                <p className="help is-danger">{httpError.message}</p>
              )) ||
                (httpError.status === 400 && (
                  <p className="help is-danger">
                    {httpError.message}{" "}
                    <span
                      className="has-link-style"
                      onClick={() =>
                        props.history.push(routes.RESEND_EMAIL_CONFIRMATION.url)
                      }
                    >
                      Click here
                    </span>{" "}
                    to resend the email
                  </p>
                )))}

            <div className="field">
              <div className="control">
                <input
                  id="remember"
                  type="checkbox"
                  name="remember"
                  className="switch is-rounded is-small"
                  checked={rememberMe}
                  onChange={() => setRememberMe(!rememberMe)}
                  ref={register}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
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
              onClick={() => signInWithPlex(redirectURI)}
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
