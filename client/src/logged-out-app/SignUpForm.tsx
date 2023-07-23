import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../shared/enums/FormDefaultValidators";
import { ISignUpFormData } from "../shared/models/ISignUpFormData";
import { useAuthentication } from "../shared/contexts/AuthenticationContext";
import { PrimaryHero } from "../shared/components/layout/Hero";
import { PlexButton } from "../shared/components/PlexButton";
import { SecondaryButton } from "../shared/components/Button";
import { PrimaryDivider } from "../shared/components/Divider";
import { usePlexAuth } from "../shared/contexts/PlexAuthContext";
import { SignInButton } from "../shared/components/SignInButton";
import { Row } from "../shared/components/layout/Row";
import { InputField } from "../shared/components/inputs/InputField";
import { HelpDanger } from "../shared/components/Help";
import { CenteredContent } from "../shared/components/layout/CenteredContent";

const SignUpForm = () => {
  const { register, handleSubmit, errors, watch } = useForm<ISignUpFormData>();
  const { signUp } = useAuthentication();
  const { signInWithPlex } = usePlexAuth();

  const onSubmit = (data: ISignUpFormData) => {
    signUp(data);
  };

  return (
    <div>
      <PrimaryHero>Sign up to Cheddarr</PrimaryHero>
      <br />

      <div className="columns is-mobile is-centered">
        <div className="column is-one-quarter-desktop is-half-tablet is-three-quarters-mobile">
          <form onSubmit={handleSubmit(onSubmit)}>
            {/* USERNAME */}
            <InputField withIcon>
              <label>Username</label>
              <div className="with-left-icon">
                <input
                  name="username"
                  type="text"
                  placeholder="Username"
                  ref={register({
                    required: true,
                    minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                    maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                    pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value,
                  })}
                />
                <span className="icon">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              {errors.username && errors.username.type === "required" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </HelpDanger>
              )}
              {errors.username && errors.username.type === "minLength" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
                </HelpDanger>
              )}
              {errors.username && errors.username.type === "maxLength" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
                </HelpDanger>
              )}
              {errors.username && errors.username.type === "pattern" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}
                </HelpDanger>
              )}
            </InputField>

            {/* PASSWORD */}
            <InputField withIcon>
              <label>Password</label>
              <div className="with-left-icon">
                <input
                  name="password"
                  type="password"
                  placeholder="Strong password"
                  ref={register({
                    required: true,
                    pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                  })}
                />
                <span className="icon">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.password && errors.password.type === "required" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                </HelpDanger>
              )}
              {errors.password && errors.password.type === "pattern" && (
                <HelpDanger>
                  {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                </HelpDanger>
              )}
            </InputField>

            {/* PASSWORD CONFIRMATION */}
            <InputField withIcon>
              <label>Confirm password</label>
              <div className="with-left-icon">
                <input
                  name="passwordConfirmation"
                  type="password"
                  placeholder="Confirm password"
                  ref={register({
                    required: true,
                    validate: (value) => {
                      return value === watch("password");
                    },
                  })}
                />
                <span className="icon">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.passwordConfirmation &&
                errors.passwordConfirmation.type === "required" && (
                  <HelpDanger>
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </HelpDanger>
                )}
              {errors.passwordConfirmation &&
                errors.passwordConfirmation.type === "validate" && (
                  <HelpDanger>
                    {FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}
                  </HelpDanger>
                )}
            </InputField>

            <br />

            {/* SUBMIT BUTTON */}
            <SecondaryButton type="submit" width="100%">
              Sign up
            </SecondaryButton>

            <PrimaryDivider />

            <CenteredContent>
              <PlexButton
                text="Sign up with Plex"
                onClick={() => signInWithPlex()}
              />
            </CenteredContent>

            <br />

            <Row justifyContent="space-around" alignItems="center">
              <p>Already have an account ?</p>
              <SignInButton />
            </Row>
          </form>
        </div>
      </div>
      <br />
    </div>
  );
};

export { SignUpForm };
