import React from "react";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../../../shared/enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { useUserService } from "../../../../user-profile/hooks/useUserService";

const ChangeUsernameModal = () => {
  const { register, handleSubmit, errors } = useForm<{ username: string }>();
  const history = useHistory();
  const { updateUsername } = useUserService();

  const onSubmit = handleSubmit((data) => {
    updateUsername(data.username).then((res) => {
      if (res.status === 200) closeModal();
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
