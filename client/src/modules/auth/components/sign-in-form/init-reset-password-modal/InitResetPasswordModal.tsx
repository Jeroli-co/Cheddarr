import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../utils/enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { IAsyncResponse } from "../../../../api/models/IAsyncResponse";
import { UserService } from "../../../../user/services/UserService";

const InitResetPasswordModal = () => {
  const { register, handleSubmit, errors } = useForm<{ email: string }>();
  const [response, setResponse] = useState<IAsyncResponse | null>(null);

  const history = useHistory();

  const onSubmit = handleSubmit((data) => {
    UserService.InitResetPassword(data).then((res) => {
      if (res.error === null) {
        closeModal();
      } else {
        setResponse(res);
      }
    });
  });

  const closeModal = () => {
    history.goBack();
  };

  return (
    <div className="modal is-active">
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <form id="email-input-modal-form" onSubmit={onSubmit}>
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

            {response && response.error && (
              <p className="help is-danger">{response.error}</p>
            )}
          </section>
          <footer className="modal-card-foot">
            <button type="submit" className="button is-info">
              Reset password
            </button>
            <button type="button" className="button" onClick={closeModal}>
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export { InitResetPasswordModal };
