import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../utils/enums/FormDefaultValidators";
import { UserService } from "../../../../user/services/UserService";

type ResetPasswordFormProps = {
  token: string;
};

export interface IResetPasswordFormData {
  oldPassword: string;
  newPassword: string;
  passwordConfirmation: string;
}

const ResetPasswordForm = ({ token }: ResetPasswordFormProps) => {
  const { register, handleSubmit, errors, watch } = useForm<
    IResetPasswordFormData
  >();

  const onSubmit = handleSubmit((data) => {
    UserService.ResetPassword(token, data);
  });

  return (
    <div className="ResetPasswordForm" data-testid="ResetPasswordForm">
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <form
            id="reset-password-form"
            className="PasswordForm"
            onSubmit={onSubmit}
          >
            {/* NEW PASSWORD */}
            <div className="field">
              <label className="label">New password</label>
              <div className="control has-icons-left">
                <input
                  name="password"
                  className={"input " + (errors.newPassword ? "is-danger" : "")}
                  type="password"
                  placeholder="Enter a strong password"
                  ref={register({
                    required: true,
                    pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.newPassword && errors.newPassword.type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
              {errors.newPassword && errors.newPassword.type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                </p>
              )}
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="field">
              <label className="label">Confirm new password</label>
              <div className="control has-icons-left">
                <input
                  name="password-confirmation"
                  className={
                    "input " + (errors.passwordConfirmation ? "is-danger" : "")
                  }
                  type="password"
                  placeholder="Enter the same password"
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

            <div className="field">
              <div className="control">
                <button className="button is-link">Reset password</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export { ResetPasswordForm };
