import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { FORM_DEFAULT_VALIDATOR } from "../../../../utils/enums/FormDefaultValidators";
import { useProfile } from "../../../user/profile/hooks/useProfile";

const ChangeEmailModal = (props) => {
  const { register, handleSubmit, errors } = useForm();
  const { changeEmail } = useProfile();
  const [httpError, setHttpError] = useState(null);

  const onSubmit = async (data) => {
    const res = await changeEmail(data);
    if (res) {
      if (res.status !== 200) {
        setHttpError(res);
      } else {
        closeModal();
      }
    }
  };

  const closeModal = () => {
    props.history.goBack();
  };

  return (
    <div
      className="ChangeEmailModal modal is-active"
      data-testid="ChangeEmailModal"
    >
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">Change your email</p>
          <button
            className="delete"
            aria-label="close"
            type="button"
            onClick={closeModal}
          />
        </header>
        <form onSubmit={handleSubmit(onSubmit)}>
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

            {httpError && (
              <p className="help is-danger" data-testid="ErrorText">
                {httpError.message}
              </p>
            )}
          </section>
          <footer className="modal-card-foot">
            <button
              className="button is-secondary-button"
              data-testid="ChangeEmailSubmitButton"
            >
              Change email
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

export { ChangeEmailModal };
