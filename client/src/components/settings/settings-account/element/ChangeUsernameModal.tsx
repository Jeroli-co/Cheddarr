import React from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { AuthContext } from "../../../../contexts/auth/AuthContext";
import { NotificationContext } from "../../../../contexts/notifications/NotificationContext";

type ChangeUsernameData = {
  readonly username: string;
};

const ChangeUsernameModal = () => {
  const { register, handleSubmit, errors } = useForm<ChangeUsernameData>();
  const [error, setError] = useState("");
  const { updateUsername } = useContext(AuthContext);
  const { pushSuccess } = useContext(NotificationContext);
  const history = useHistory();

  const onSubmit = handleSubmit((data) => {
    updateUsername(data.username).then((response) => {
      if (response.error !== null) {
        setError(response.error);
      } else {
        pushSuccess(response.message);
        closeModal();
      }
    });
  });

  const closeModal = () => {
    history.goBack();
  };

  return (
    <div
      className="ChangeUsernameModal modal is-active"
      data-testid="ChangeUsernameModal"
    >
      <div className="modal-background" onClick={closeModal} />

      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change your username</p>
          <button
            className="delete"
            aria-label="close"
            type="button"
            onClick={closeModal}
          />
        </header>

        <form onSubmit={onSubmit}>
          <section className="modal-card-body">
            <div className="field">
              <label className="label">New username</label>
              <div className="control has-icons-left">
                <input
                  name="username"
                  className={"input " + (errors["username"] ? "is-danger" : "")}
                  type="text"
                  placeholder="Enter your new username"
                  ref={register({
                    required: true,
                    minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                    maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                    pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value,
                  })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              {errors["username"] && errors["username"].type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
              {errors["username"] &&
                errors["username"].type === "minLength" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
                  </p>
                )}
              {errors["username"] &&
                errors["username"].type === "maxLength" && (
                  <p className="help is-danger">
                    {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
                  </p>
                )}
              {errors["username"] && errors["username"].type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}
                </p>
              )}
            </div>

            {error.length > 0 && <p className="help is-danger">{error}</p>}
          </section>

          <footer className="modal-card-foot">
            <button className="button is-secondary-button">
              Change username
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

export { ChangeUsernameModal };
