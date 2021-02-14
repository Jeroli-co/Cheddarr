import React from "react";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../shared/enums/FormDefaultValidators";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { useAlert } from "../../shared/contexts/AlertContext";
import { PrimaryButton } from "../../shared/components/Button";
import { Icon } from "../../shared/components/Icon";
import { HelpDanger } from "../../shared/components/Help";
import { InputField } from "../../shared/components/inputs/InputField";

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
  const { post } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const onSubmit = handleSubmit((data) => {
    post(APIRoutes.RESET_PASSWORD(token), data).then((res) => {
      if (res.status === 200) {
        pushSuccess("Password has been reset");
      } else {
        pushDanger("Cannot reset password");
      }
    });
  });

  return (
    <div>
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <form
            id="reset-password-form"
            className="PasswordForm"
            onSubmit={onSubmit}
          >
            {/* NEW PASSWORD */}
            <InputField withIcon>
              <label className="label">New password</label>
              <div className="with-icon-left">
                <input
                  name="password"
                  type="password"
                  placeholder="Enter a strong password"
                  ref={register({
                    required: true,
                    pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                  })}
                />
                <span className="icon">
                  <Icon icon={faKey} />
                </span>
              </div>
            </InputField>
            {errors.newPassword && errors.newPassword.type === "required" && (
              <HelpDanger>{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</HelpDanger>
            )}
            {errors.newPassword && errors.newPassword.type === "pattern" && (
              <HelpDanger>
                {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
              </HelpDanger>
            )}

            {/* CONFIRM NEW PASSWORD */}
            <InputField>
              <label className="label">Confirm new password</label>
              <div className="with-icon-left">
                <input
                  name="password-confirmation"
                  type="password"
                  placeholder="Enter the same password"
                  ref={register({
                    required: true,
                    validate: (value) => {
                      return value === watch("password");
                    },
                  })}
                />
                <span className="icon">
                  <Icon icon={faKey} />
                </span>
              </div>
            </InputField>
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

            <PrimaryButton type="submit">Reset password</PrimaryButton>
          </form>
        </div>
      </div>
    </div>
  );
};

export { ResetPasswordForm };
