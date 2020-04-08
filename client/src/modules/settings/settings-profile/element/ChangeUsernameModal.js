import React, {useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {useForm} from "react-hook-form";
import {faUser} from "@fortawesome/free-regular-svg-icons";
import {FORM_DEFAULT_VALIDATOR} from "../../../../forms/formDefaultValidators";
import {useProfile} from "../../../../hooks/useProfile";

const ChangeUsernameModal = (props) => {

  const { register, handleSubmit, errors } = useForm();
  const { changeUsername } = useProfile();
  const [httpError, setHttpError] = useState(null);

  const onSubmit = async (data) => {
    const res = await changeUsername(data);
    if (res) {
      switch (res.status) {
        case 200:
          closeModal();
          return;
        default:
          setHttpError(res);
      }
    }
  };

  const closeModal = () => {
    props.history.goBack();
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
                       ref={register({
                         required: true,
                         minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                         maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                         pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value
                       })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              {errors['newUsername'] && errors['newUsername'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['newUsername'] && errors['newUsername'].type === 'minLength' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}</p>
              )}
              {errors['newUsername'] && errors['newUsername'].type === 'maxLength' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</p>
              )}
              {errors['newUsername'] && errors['newUsername'].type === 'pattern' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}</p>
              )}
            </div>

            { httpError && (
                (httpError.status === 409 && <p className="help is-danger">{httpError.message}</p>)
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