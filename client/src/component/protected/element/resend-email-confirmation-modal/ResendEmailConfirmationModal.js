import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {FORM_DEFAULT_VALIDATOR} from "../../../../formDefaultValidators";

const ResendEmailConfirmationModal = (props) => {

	const { register, handleSubmit, errors, setValue } = useForm();
  const { resendConfirmation } = useContext(AuthContext);
  const [httpResponse, setHttpResponse] = useState(null);

  const submitResendConfirmAccount = (data) => {
    resendConfirmation(data['email']).then(res => {
      switch (res.status) {
        case 200:
          setValue('email', '');
        case 400:
          setHttpResponse(res);
          return
      }
    })
  };

  const closeModal = () => {
    props.history.goBack();
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <form id="email-input-modal-form" onSubmit={handleSubmit(submitResendConfirmAccount)}>
          <header className="modal-card-head">
            <p className="modal-card-title">Resend account confirmation email</p>
            <button className="delete" aria-label="close" type="button" onClick={closeModal}/>
          </header>
          <section className="modal-card-body">
              <div className="field">
                <label className="label">Email</label>
                <div className="control has-icons-left">
                  <input name="email"
                         className={'input ' + (errors['email'] ? "is-danger" : "")}
                         type="email"
                         placeholder="Enter a valid email"
                         ref={register({
                           required: true,
                           maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                           pattern: FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.value
                         })}
                  />
                  <span className="icon is-small is-left">
                    <FontAwesomeIcon icon={faEnvelope} />
                  </span>
                </div>
                {errors['email'] && errors['email'].type === 'required' && (
                  <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
                )}
                {errors['email'] && errors['email'].type === 'maxLength' && (
                  <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</p>
                )}
                {errors['email'] && errors['email'].type === 'pattern' && (
                  <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.message}</p>
                )}
              </div>

            { httpResponse && (
								(httpResponse.status === 400 && <p className="help is-danger">{httpResponse.message}</p>) ||
								(httpResponse.status === 200 && <p className="help is-success">{httpResponse.message}</p>)
							)
						}

          </section>
          <footer className="modal-card-foot">
            <button className="button is-info">Send</button>
            <button className="button" type="button" onClick={closeModal}>Cancel</button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export {
	ResendEmailConfirmationModal
};

