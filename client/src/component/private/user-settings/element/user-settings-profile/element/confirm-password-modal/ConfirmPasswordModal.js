import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";

const ConfirmPasswordModal = ({ isActive, onClose, callback }) => {

  const { register, handleSubmit, errors, reset } = useForm();
  const { username, checkPassword } = useContext(AuthContext);
  const [status, setStatus] = useState(null);

  const _onSubmit = (data) => {
    checkPassword({username: username, password: data.password}).then((code) => {
      if (code === 200) {
        closeModal();
      } else {
        setStatus(code);
      }
    });
  };

  const closeModal = () => {
    callback();
    reset();
    onClose();
  };

  return (
    <div className={'ConfirmPasswordModal modal ' + (isActive ? "is-active" : "")} data-testid="ConfirmPasswordModal">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirm your password</p>
          <button className="delete" aria-label="close" type="button" onClick={closeModal}/>
        </header>
        <form onSubmit={handleSubmit(_onSubmit)}>
          <section className="modal-card-body">
              <div className="field">
                <label className="label">Password</label>
                <div className="control has-icons-left">
                  <input name="password"
                         className={'input ' + (errors['password'] ? "is-danger" : "")}
                         type="password"
                         placeholder="Enter your password"
                         ref={register} />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faKey} />
                  </span>
                </div>
                <span className="is-size-7">* if you signed up with a third party service leave this field empty</span>
              </div>

              { status && (
                  (status === 401 && <p className="help is-danger">Wrong password</p>)
                )
              }

          </section>
          <footer className="modal-card-foot">
            <button className="button is-secondary-button">Confirm password</button>
            <button className="button" type="button" onClick={closeModal}>Cancel</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export {
  ConfirmPasswordModal
}