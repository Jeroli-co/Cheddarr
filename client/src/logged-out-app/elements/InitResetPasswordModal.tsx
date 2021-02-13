import React from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FORM_DEFAULT_VALIDATOR } from "../../shared/enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { useAPI } from "../../shared/hooks/useAPI";
import { APIRoutes } from "../../shared/enums/APIRoutes";
import { useAlert } from "../../shared/contexts/AlertContext";
import { Modal } from "../../shared/components/Modal";

const InitResetPasswordModal = () => {
  const { register, handleSubmit, errors } = useForm<{ email: string }>();

  const history = useHistory();

  const { put } = useAPI();
  const { pushSuccess, pushDanger } = useAlert();

  const onSubmit = handleSubmit((data) => {
    put(APIRoutes.INIT_RESET_PASSWORD, data).then((res) => {
      if (res.status === 200) {
        pushSuccess("Reset password initiate, check your email");
        closeModal();
      } else if (res.status === 404) {
        pushDanger("Email doesn't exist");
      } else {
        pushDanger("Cannot reset password");
      }
    });
  });

  const closeModal = () => {
    history.goBack();
  };

  return (
    <Modal isOpen={true}>
      <div className="modal-header">hehe</div>
      <div className="modal-body">
        <form onSubmit={onSubmit}>
          <header className="modal-card-head">
            <p className="modal-card-title">Reset your password</p>
            <button
              className="delete"
              aria-label="close"
              type="button"
              onClick={closeModal}
            />
          </header>
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
          <footer className="modal-footer">
            <button type="submit" className="button is-info">
              Reset password
            </button>
            <button type="button" className="button" onClick={closeModal}>
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </Modal>
  );
};

export { InitResetPasswordModal };
