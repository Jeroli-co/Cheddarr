import * as React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { routes } from "../../../../router/routes";
import { FORM_DEFAULT_VALIDATOR } from "../../../../utils/enums/FormDefaultValidators";
import { useHistory } from "react-router";
import { UserService } from "../../../user/services/UserService";

const DeleteAccountModal = () => {
  const { register, handleSubmit, errors } = useForm<{ password: string }>();
  const [httpError, setHttpError] = useState("");
  const history = useHistory();

  const onSubmit = (data: { password: string }) => {
    UserService.DeleteAccount(data).then((res) => {
      if (res.error === null) {
        history.push(routes.SIGN_UP.url);
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
      className="DeleteAccountModal modal is-active"
      data-testid="DeleteAccountModal"
    >
      <div className="modal-background" onClick={closeModal} />
      <div className="modal-card">
        <header className="modal-card-head">
          <p className="modal-card-title">
            Are you sure you want to delete your account ?
          </p>
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
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input
                  name="password"
                  className="input"
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
              {errors["password"] && errors["password"].type === "required" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
                </p>
              )}
              {errors["password"] && errors["password"].type === "pattern" && (
                <p className="help is-danger">
                  {FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}
                </p>
              )}
            </div>

            {httpError.length > 0 && (
              <p className="help is-danger">{httpError}</p>
            )}
          </section>
          <footer className="modal-card-foot">
            <button className="button is-danger">Delete account</button>
            <button className="button" type="button" onClick={closeModal}>
              Cancel
            </button>
          </footer>
        </form>
      </div>
    </div>
  );
};

export { DeleteAccountModal };
