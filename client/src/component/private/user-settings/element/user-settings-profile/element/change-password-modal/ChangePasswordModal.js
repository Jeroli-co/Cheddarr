import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../../../context/AuthContext";
import {FORM_DEFAULT_VALIDATOR} from "../../../../../../../formDefaultValidators";
import {routes} from "../../../../../../../routes";

const ChangePasswordModal = (props) => {

  const { register, handleSubmit, errors, watch } = useForm();
  const { changePassword, isOauthOnly } = useContext(AuthContext);
  const [httpResponse, setHttpResponse] = useState(null);

  const onSubmit = (data) => {
    if (isOauthOnly && data["oldPassword"] === "")
      data["oldPassword"] = "oldPassword";
    changePassword(data).then(res => {
      switch (res.status) {
        case 200:
          props.history.push(routes.SIGN_IN.url);
          return;
        case 400:
          setHttpResponse(res);
          return;
        default:
          return;
      }
    });
  };

  const closeModal = () => {
    props.history.goBack();
  };

  return (
    <div className="ChangePasswordModal modal is-active" data-testid="ChangePasswordModal">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change your password</p>
          <button className="delete" aria-label="close" type="button" onClick={closeModal}/>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="modal-card-body">

            { /* OLD PASSWORD */ }
            <div className="field">
              <label className="label">Old password</label>
              <div className="control has-icons-left">
                <input name="oldPassword"
                       className={'input ' + (errors['oldPassword'] ? "is-danger" : "")}
                       type="password"
                       placeholder={isOauthOnly ? "••••••••" : "Enter your old password"}
                       disabled={isOauthOnly}
                       ref={register({
                         required: !isOauthOnly,
                         pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value
                       })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['oldPassword'] && errors['oldPassword'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['oldPassword'] && errors['oldPassword'].type === 'pattern' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}</p>
              )}
            </div>

            { /* NEW PASSWORD */ }
            <div className="field">
              <label className="label">New password</label>
              <div className="control has-icons-left">
                <input name="newPassword"
                       className={'input ' + (errors['newPassword'] ? "is-danger" : "")}
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
              {errors['newPassword'] && errors['newPassword'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['newPassword'] && errors['newPassword'].type === 'pattern' && (
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
                       placeholder="Confirm your new password"
                       ref={register({
                         required: true,
                         validate: (value) => { return value === watch('newPassword') }
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

            { httpResponse && (
                (httpResponse.status === 400 && <p className="help is-danger">{httpResponse.message}</p>)
              )
            }

          </section>
          <footer className="modal-card-foot">
            <button className="button is-secondary-button">Change password</button>
            <button className="button" type="button" onClick={closeModal}>Cancel</button>
          </footer>
        </form>
      </div>
    </div>
  )
};

export {
  ChangePasswordModal
}