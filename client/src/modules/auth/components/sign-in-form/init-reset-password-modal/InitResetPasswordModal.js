import React, { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../utils/enums/FormDefaultValidators";
import { NotificationContext } from "../../../../notifications/contexts/NotificationContext";
import { useProfile } from "../../../../user/hooks/useProfile";

const InitResetPasswordModal = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { initResetPassword } = useProfile();
  const [httpError, setHttpError] = useState(null);
  const { pushInfo } = useContext(NotificationContext);

  const submitResetPassword = (data) => {
    initResetPassword(data).then((res) => {
      if (res) {
        switch (res.status) {
          case 200:
            pushInfo("Check your email to change your password");
            closeModal();
            return;
          default:
            setHttpError(res);
        }
      }
    });
  };

  const closeModal = () => {
    props.history.goBack();
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <form
          id="email-input-modal-form"
          onSubmit={handleSubmit(submitResetPassword)}
        >
          <header className="modal-card-head">
            <p className="modal-card-title">Reset your password</p>
            <button
              className="delete"
              aria-label="close"
              type="button"
              onClick={closeModal}
            />
          </header>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input
                  name="email"
                  className={"input " + (errors["email"] ? "is-danger" : "")}
                  type="email"
                  placeholder="Enter a valid email"
                  ref={register({
                    required: true,
                    maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                    pattern: FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {errors["email"] && errors["email"].type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
              {errors["email"] && errors["email"].type === "maxLength" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
                </p>
              )}
              {errors["email"] && errors["email"].type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.message}
                </p>
              )}
            </div>

            {httpError && <p className="help is-danger">{httpError.message}</p>}
          </section>
          <footer className="modal-card-foot">
            <button className="button is-info">Reset password</button>
            <button className="button" type="button" onClick={closeModal}>
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export { InitResetPasswordModal };
