import React, {useContext, useState} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../context/AuthContext";
import {routes} from "../../../../../routes";

const ResetPasswordForm = (props) => {

  const { register, handleSubmit, errors, watch } = useForm();
  const { resetPassword } = useContext(AuthContext);
  const [status, setStatus] = useState(null);

  const onSubmit = (data) => {
    resetPassword(props.token, data).then((status) => {
      if (status === 200) {
        props.history.push(routes.SIGN_IN.url);
      } else {
        setStatus(status);
      }
    });
  };

  return (
    <div className="ResetPasswordForm" data-testid="ResetPasswordForm">
      <div className="columns is-mobile is-centered">
        <div className="column is-one-third">
          <form id="reset-password-form" className="PasswordForm" onSubmit={handleSubmit(onSubmit)}>
            <div className="field">
              <label className="label">New password</label>
              <div className="control has-icons-left">
                <input name="password"
                       className={'input ' + (errors['password'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Enter a strong password"
                       ref={register({ required: true, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/ })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password'] && errors['password'].type === 'required' && (
                <p className="help is-danger">Password is required (8 to 128 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character)</p>
              )}
              {errors['password'] && errors['password'].type === 'pattern' && (
                <p className="help is-danger">Your password must contain 8 to 128 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character</p>
              )}
            </div>

            <div className="field">
              <label className="label">Confirm new password</label>
              <div className="control has-icons-left">
                <input name="password-confirmation"
                       className={'input ' + (errors['password-confirmation'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Enter the same password"
                       ref={register({
                         required: true,
                         pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,128}$/,
                         validate: (value) => {
                          return value === watch('password');
                         }
                       })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'required' && (
                <p className="help is-danger">Please confirm your password</p>
              )}
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'pattern' && (
                <p className="help is-danger">Your password must contain 8 to 15 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character</p>
              )}
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'validate' && (
                <p className="help is-danger">Passwords are not equals</p>
              )}
            </div>

            { status && <div/> }

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
