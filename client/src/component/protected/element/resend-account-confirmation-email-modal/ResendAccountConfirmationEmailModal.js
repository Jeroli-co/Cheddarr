import React, {useContext, useState} from 'react';
import {useForm} from "react-hook-form";
import {AuthContext} from "../../../../context/AuthContext";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";

const ResendAccountConfirmationEmailModal = ({ isActive, onClose }) => {

	const { register, handleSubmit, errors, setValue } = useForm();
		const { resendConfirmation } = useContext(AuthContext);
		const [status, setStatus] = useState(null);

		const submitResendConfirmAccount = (data) => {
		  resendConfirmation(data['email']).then((status) => {
		    if (status === 200)
		      setValue('email', '');
		    setStatus(status)
		  })
    };

		const closeModal = () => {
		  onClose();
		  setValue('email', '');
    };

		return (
			<div className={'modal ' + (isActive ? "is-active" : "")}>
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
                           ref={register({ required: true, maxLength: 128, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i })} />
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
                  {status && status === 400 && (
                    <p className="help is-danger">This email doesn't exist</p>
                  )}
                  {status && status === 200 && (
                    <p className="help is-success">Email has been send ! Check your inbox</p>
                  )}
                </div>
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
	ResendAccountConfirmationEmailModal
};

