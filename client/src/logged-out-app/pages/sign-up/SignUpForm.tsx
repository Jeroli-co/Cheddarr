import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { routes } from "../../../routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../shared/enums/FormDefaultValidators";
import logo from "../../../assets/plex.png";
import { WaitingEmailConfirmation } from "./components/WaitingEmailConfirmation";
import { ISignUpFormData } from "../../models/ISignUpFormData";
import { IUser } from "../../../logged-in-app/pages/user-profile/models/IUser";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { Redirect } from "react-router";

const SignUpForm = () => {
  const { register, handleSubmit, errors, watch } = useForm<ISignUpFormData>();
  const { signInWithPlex, signUp } = useAuthentication();
  const [user, setUser] = useState<IUser | null>(null);

  const onSubmit = (data: ISignUpFormData) => {
    signUp(data).then((res) => {
      if (res.data) setUser(res.data);
    });
  };

  if (user && !user.confirmed) {
    return <WaitingEmailConfirmation user={user} />;
  }

  if (user && user.confirmed) {
    return <Redirect to={routes.SIGN_IN.url()} />;
  }

  return (
    <div className="SignUpForm" data-testid="SignUpForm">
      <div className="hero is-primary">
        <div className="hero-body">
          <div className="container has-text-centered">
            <h1 className="title">
              <p>
                Create a <span className="has-text-secondary">Cheddarr</span>{" "}
                account
              </p>
            </h1>
          </div>
        </div>
      </div>

      <br />

      <div className="columns is-mobile is-centered">
        <div className="column is-one-quarter-desktop is-half-tablet is-three-quarters-mobile">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* USERNAME */}
            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left">
                <input
                  name="username"
                  className={
                    "input is-medium " + (errors.username ? "is-danger" : "")
                  }
                  type="text"
                  placeholder="Username"
                  ref={register({
                    required: true,
                    minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                    maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                    pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
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
              {errors.username && errors.username.type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}
                </p>
              )}
            </div>

            {/* EMAIL */}
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input
                  name="email"
                  className={
                    "input is-medium " + (errors.email ? "is-danger" : "")
                  }
                  type="email"
                  placeholder="Valid email"
                  ref={register({
                    required: true,
                    maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                    pattern: FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {errors.email && errors.email.type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
              {errors.email && errors.email.type === "maxLength" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
                </p>
              )}
              {errors.email && errors.email.type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.message}
                </p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input
                  name="password"
                  className={
                    "input is-medium " + (errors.password ? "is-danger" : "")
                  }
                  type="password"
                  placeholder="Strong password"
                  ref={register({
                    required: true,
                    pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.password && errors.password.type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                </p>
              )}
              {errors.password && errors.password.type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                </p>
              )}
            </div>

            {/* PASSWORD CONFIRMATION */}
            <div className="field">
              <label className="label">Confirm password</label>
              <div className="control has-icons-left">
                <input
                  name="passwordConfirmation"
                  className={
                    "input is-medium " +
                    (errors.passwordConfirmation ? "is-danger" : "")
                  }
                  type="password"
                  placeholder="Confirm password"
                  ref={register({
                    required: true,
                    validate: (value) => {
                      return value === watch("password");
                    },
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.passwordConfirmation &&
                errors.passwordConfirmation.type === "required" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </p>
                )}
              {errors.passwordConfirmation &&
                errors.passwordConfirmation.type === "validate" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}
                  </p>
                )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="field">
              <div className="control">
                <button
                  type="submit"
                  className="button is-fullwidth is-secondary-button"
                >
                  Sign up
                </button>
              </div>
            </div>

            <div className="is-divider" data-content="OR" />

            <div className="content has-text-centered">
              <button
                className="button has-background-dark-plex"
                type="button"
                onClick={() => signInWithPlex(routes.HOME.url)}
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
                <span>Sign up with Plex</span>
              </button>
            </div>

            <br />

            <div className="content has-text-centered">
              <p className="is-size-7">
                <Link to={routes.SIGN_IN.url()}>Already have an account ?</Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { SignUpForm };
