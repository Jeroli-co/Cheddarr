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

const SignInForm = () => {
  const { signIn, signInWithPlex } = useContext(AuthContext);
  const { register, handleSubmit, errors } = useForm();
  const query = useQuery();
  const [redirectURI, setRedirectURI] = useState(null);
  const [errorDetail, setErrorDetail] = useState(null);

  useEffect(() => {
    let redirectURIQuery = query.get("redirectURI");
    redirectURIQuery = redirectURIQuery ? redirectURIQuery : routes.HOME.url;
    setRedirectURI(redirectURIQuery);
  }, [query]);

  const onSubmit = (data) => {
    signIn(data, redirectURI).then((detail) => {
      if (detail) {
        setErrorDetail(detail);
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
                {errors["username"] &&
                  errors["username"].type === "required" && (
                    <p className="help is-danger">
                      {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                    </p>
                  )}
                {errors["username"] &&
                  errors["username"].type === "minLength" && (
                    <p className="help is-danger">
                      {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
                    </p>
                  )}
                {errors["username"] &&
                  errors["username"].type === "maxLength" && (
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

            {errorDetail && (
              <div className="field">
                <div className="control">
                  <p className="help is-danger">{errorDetail}</p>
                </div>
              </div>
            )}

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
