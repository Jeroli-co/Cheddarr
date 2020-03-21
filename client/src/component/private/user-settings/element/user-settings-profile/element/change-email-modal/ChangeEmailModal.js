import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../../../context/AuthContext";
import {routes} from "../../../../../../../routes";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

const ChangeEmailModal = (props) => {

  const { register, handleSubmit, errors } = useForm();
  const { changeEmail } = useContext(AuthContext);
  const [status, setStatus] = useState(null);

  const onSubmit = (data) => {
    changeEmail(data).then(code => setStatus(code));
  };

  const closeModal = () => {
    props.history.push(routes.USER_SETTINGS.url + '/profile');
  };

  return (
    <div className="ChangeEmailModal modal is-active"  data-testid="ChangeEmailModal">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change your email</p>
          <button className="delete" aria-label="close" type="button" onClick={closeModal}/>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="modal-card-body">

            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input name="email"
                       className={'input ' + (errors['email'] ? "is-danger" : "")}
                       type="email"
                       placeholder="Enter a valid email"
                       ref={register({ required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {errors['email'] && errors['email'].type === 'required' && (
                <p className="help is-danger">This is required</p>
              )}
              {errors['email'] && errors['email'].type === 'pattern' && (
                <p className="help is-danger">This is not a valid email address</p>
              )}
            </div>

            { status && (
                (status === 409 && <p className="help is-danger">This email is already register</p>) ||
                (status === 200 && <p className="help is-succes">Confirm your email with by clicking on the link we sent to you</p>)
              )
            }

          </section>
          <footer className="modal-card-foot">
            <button className="button is-secondary-button">Change email</button>
            <button className="button" type="button" onClick={closeModal}>Cancel</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export {
  ChangeEmailModal
}