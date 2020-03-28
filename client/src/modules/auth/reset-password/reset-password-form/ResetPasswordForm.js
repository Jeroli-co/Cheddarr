import React, {useContext} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../contexts/AuthContext";
import {FORM_DEFAULT_VALIDATOR} from "../../../../forms/formDefaultValidators";

const ResetPasswordForm = (props) => {

  const { register, handleSubmit, errors, watch } = useForm();
  const { resetPassword } = useContext(AuthContext);

  const onSubmit = (data) => { resetPassword(props.token, data) };

  return (
    <div className="ResetPasswordForm" data-testid="ResetPasswordForm">
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <form id="reset-password-form" className="PasswordForm" onSubmit={handleSubmit(onSubmit)}>

            { /* NEW PASSWORD */ }
            <div className="field">
              <label className="label">New password</label>
              <div className="control has-icons-left">
                <input name="password"
                       className={'input ' + (errors['password'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Enter a strong password"
                       ref={register({
                         required: true,
                         pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value
                       })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password'] && errors['password'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['password'] && errors['password'].type === 'pattern' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}</p>
              )}
            </div>

            { /* CONFIRM NEW PASSWORD */ }
            <div className="field">
              <label className="label">Confirm new password</label>
              <div className="control has-icons-left">
                <input name="password-confirmation"
                       className={'input ' + (errors['password-confirmation'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Enter the same password"
                       ref={register({
                         required: true,
                         validate: (value) => {
                          return value === watch('password');
                         }
                       })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'validate' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}</p>
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

export {
  ResetPasswordForm
}
