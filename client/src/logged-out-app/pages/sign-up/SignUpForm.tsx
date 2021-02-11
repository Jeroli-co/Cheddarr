import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faEnvelope, faKey } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { routes } from "../../../router/routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../shared/enums/FormDefaultValidators";
import { WaitingEmailConfirmation } from "./components/WaitingEmailConfirmation";
import { ISignUpFormData } from "../../models/ISignUpFormData";
import { IUser } from "../../../logged-in-app/pages/user-profile/models/IUser";
import { useAuthentication } from "../../contexts/AuthenticationContext";
import { Redirect } from "react-router";
import { PrimaryHero } from "../../../shared/components/layout/Hero";
import { PlexButton } from "../../../shared/components/PlexButton";
import { RowLayout2 } from "../../../shared/components/layout/Layouts";
import { SecondaryButton } from "../../../shared/components/Button";
import { PrimaryDivider } from "../../../shared/components/Divider";
import { usePlexAuth } from "../../../shared/contexts/PlexAuthContext";
import { SignInButton } from "../../components/SignInButton";
import { Row } from "../../../shared/components/layout/Row";

const SignUpForm = () => {
  const { register, handleSubmit, errors, watch } = useForm<ISignUpFormData>();
  const { signUp } = useAuthentication();
  const { signInWithPlex } = usePlexAuth();
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
      <PrimaryHero>Create a Cheddarr account</PrimaryHero>
      <br />

      <div className="columns is-mobile is-centered">
        <div className="column is-one-quarter-desktop is-half-tablet is-three-quarters-mobile">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* USERNAME */}
            <div className="field">
              <label>Username</label>
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
              <label>Email</label>
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
              <label>Password</label>
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
              <label>Confirm password</label>
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
                <SecondaryButton type="submit" width="100%">
                  Sign up
                </SecondaryButton>
              </div>
            </div>

            <PrimaryDivider />

            <RowLayout2 justifyContent="center">
              <PlexButton
                text="Sign in with Plex"
                onClick={() => signInWithPlex()}
              />
            </RowLayout2>

            <br />

            <Row justifyContent="space-around" alignItems="center">
              <p>Already have an account ?</p>
              <SignInButton />
            </Row>
          </form>
        </div>
      </div>
    </div>
  );
};

export { SignUpForm };