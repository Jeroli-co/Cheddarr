import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {routes} from "../../../../../../../routes";
import {FORM_DEFAULT_VALIDATOR} from "../../../../../../../formDefaultValidators";

const DeleteAccountModal = (props) => {

  const { register, handleSubmit, errors } = useForm();
  const { deleteAccount, isOauthOnly } = useContext(AuthContext);
  const [httpResponse, setHttpResponse] = useState(null);

  const onSubmit = (data) => {
    if (isOauthOnly && data["password"] === "")
      data["password"] = "password";
    deleteAccount(data).then(res => {
      switch (res.status) {
        case 200:
          props.history.push(routes.SIGN_UP.url);
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
    props.history.push(routes.USER_SETTINGS.url + '/profile');
  };

  return (
    <div className="DeleteAccountModal modal is-active" data-testid="DeleteAccountModal">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Are you sure you want to delete your account ?</p>
          <button className="delete" aria-label="close" type="button" onClick={closeModal}/>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="modal-card-body">

            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input name="password"
                       className="input"
                       type="password"
                       placeholder={isOauthOnly ? "••••••••" : "Enter your old password"}
                       disabled={isOauthOnly}
                       ref={register({
                         required: !isOauthOnly,
                         pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value })}
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

            { httpResponse && (
                (httpResponse.status === 400 && <p className="help is-danger">{httpResponse.message}</p>)
              )
            }

          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger">Delete account</button>
            <button className="button" type="button" onClick={closeModal}>Cancel</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export {
  DeleteAccountModal
}