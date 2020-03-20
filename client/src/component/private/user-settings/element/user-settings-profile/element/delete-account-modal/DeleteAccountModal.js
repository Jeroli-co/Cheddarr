import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey} from "@fortawesome/free-solid-svg-icons";
import {routes} from "../../../../../../../routes";

const DeleteAccountModal = ({ isActive, onClose, history }) => {

  const { register, handleSubmit, reset } = useForm();
  const { deleteAccount } = useContext(AuthContext);
  const [status, setStatus] = useState(null);

  const onSubmit = (data) => {
    deleteAccount(data).then((code) => {
      if (code === 200) {
        history.push(routes.SIGN_IN.url);
      } else {
        setStatus(code);
      }
    });
  };

  const closeModal = () => {
    reset();
    onClose();
  };

  return (
    <div className={'DeleteAccountModal modal ' + (isActive ? "is-active" : "")} data-testid="DeleteAccountModal">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Confirm your password</p>
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
                         placeholder="Enter your password"
                         ref={register} />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faKey} />
                  </span>
                </div>
              </div>

              { status && (
                  (status === 401 && <p className="help is-danger">Wrong password</p>)
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