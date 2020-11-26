import React, { useContext, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../utils/enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { UserService } from "../../../user/services/UserService";
import { NotificationContext } from "../../../notifications/NotificationContext";

export interface IChangePasswordModel {
  readonly oldPassword: string;
  readonly newPassword: string;
  readonly passwordConfirmation: string;
}

const ChangePasswordModal = () => {
  const { register, handleSubmit, errors, watch } = useForm<
    IChangePasswordModel
  >();
  const [httpError, setHttpError] = useState("");
  const history = useHistory();
  const { pushSuccess } = useContext(NotificationContext);

  const onSubmit = (data: IChangePasswordModel) => {
    UserService.ChangePassword(data).then((res) => {
      if (res.error === null) {
        pushSuccess("Password has change");
      } else {
        setHttpError(res.error);
      }
    });
  };

  const closeModal = () => {
    history.goBack();
  };

  return (
    <div
      className="ChangePasswordModal modal is-active"
      data-testid="ChangePasswordModal"
    >
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change your password</p>
          <button
            className="delete"
            aria-label="close"
            type="button"
            onClick={closeModal}
          />
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
          <section className="modal-card-body">
            {/* OLD PASSWORD */}
            <div className="field">
              <label className="label">Old password</label>
              <div className="control has-icons-left">
                <input
                  name="oldPassword"
                  className={
                    "input " + (errors["oldPassword"] ? "is-danger" : "")
                  }
                  type="password"
                  placeholder={"Enter your old password"}
                  ref={register({
                    required: true,
                    pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors["oldPassword"] &&
                errors["oldPassword"].type === "required" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </p>
                )}
              {errors["oldPassword"] &&
                errors["oldPassword"].type === "pattern" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                  </p>
                )}
            </div>

            {/* NEW PASSWORD */}
            <div className="field">
              <label className="label">New password</label>
              <div className="control has-icons-left">
                <input
                  name="newPassword"
                  className={
                    "input " + (errors["newPassword"] ? "is-danger" : "")
                  }
                  type="password"
                  placeholder="Enter a strong password"
                  ref={register({
                    required: true,
                    pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors["newPassword"] &&
                errors["newPassword"].type === "required" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </p>
                )}
              {errors["newPassword"] &&
                errors["newPassword"].type === "pattern" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                  </p>
                )}
            </div>

            {/* CONFIRM NEW PASSWORD */}
            <div className="field">
              <label className="label">Confirm new password</label>
              <div className="control has-icons-left">
                <input
                  name="passwordConfirmation"
                  className={
                    "input " + (errors.passwordConfirmation ? "is-danger" : "")
                  }
                  type="password"
                  placeholder="Confirm your new password"
                  ref={register({
                    required: true,
                    validate: (value) => {
                      return value === watch("newPassword");
                    },
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors.passwordConfirmation &&
                errors.passwordConfirmation.type === "required" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                  </p>
                )}
              {errors.passwordConfirmation &&
                errors.passwordConfirmation.type === "validate" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}
                  </p>
                )}
            </div>

            {httpError.length > 0 && (
              <p className="help is-danger">{httpError}</p>
            )}
          </section>
          <footer className="modal-card-foot">
            <button className="button is-secondary-button">
              Change password
            </button>
            <button className="button" type="button" onClick={closeModal}>
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export { ChangePasswordModal };
