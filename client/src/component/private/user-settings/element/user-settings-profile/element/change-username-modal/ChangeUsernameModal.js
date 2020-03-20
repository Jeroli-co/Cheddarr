import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../../../../context/AuthContext";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {routes} from "../../../../../../../routes";

const ChangeUsernameModal = (props) => {

  const { register, handleSubmit, errors } = useForm();
  const { changeUsername } = useContext(AuthContext);
  const [status, setStatus] = useState(null);

  const onSubmit = (data) => {
    changeUsername(data).then((code) => {
      if (code === 200) {
        closeModal();
      } else {
        setStatus(code);
      }
    });
  };

  const closeModal = () => {
    props.history.push(routes.USER_SETTINGS.url + '/profile');
  };

  return (
    <div className="ChangeUsernameModal modal is-active"  data-testid="ChangeUsernameModal">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change your username</p>
          <button className="delete" aria-label="close" type="button" onClick={closeModal}/>
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="modal-card-body">

            <div className="field">
              <label className="label">New username</label>
              <div className="control has-icons-left">
                <input name="newUsername"
                       className={'input ' + (errors['newUsername'] ? "is-danger" : "")}
                       type="text"
                       placeholder="Enter your new username"
                       ref={register({ required: true })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              {errors['newUsername'] && errors['newUsername'].type === 'required' && (
                <p className="help is-danger">This is required</p>
              )}
            </div>

            { status && (
                (status === 409 && <p className="help is-danger">This username already exist</p>)
              )
            }

          </section>
          <footer className="modal-card-foot">
            <button className="button is-secondary-button">Change username</button>
            <button className="button" type="button" onClick={closeModal}>Cancel</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export {
  ChangeUsernameModal
}