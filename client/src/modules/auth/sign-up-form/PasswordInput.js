import React from "react";
import { FORM_DEFAULT_VALIDATOR } from "../../../forms/formDefaultValidators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { Pagination } from "./Pagination";

const PasswordInput = ({ onPrevious, onValidInput, defaultValue }) => {
  const { register, handleSubmit, errors, watch } = useForm();

  return (
    <form onSubmit={handleSubmit(onValidInput)}>
      <div className="field">
        <div className="control has-icons-left">
          <input
            name="password"
            className={
              "input is-large " + (errors["password"] ? "is-danger" : "")
            }
            type="password"
            placeholder="Strong password"
            autoFocus={true}
            defaultValue={defaultValue}
            ref={register({
              required: true,
              pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value,
            })}
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faKey} />
          </span>
        </div>
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

      <div className="field">
        <div className="control has-icons-left">
          <input
            name="password-confirmation"
            className={
              "input is-large " +
              (errors["password-confirmation"] ? "is-danger" : "")
            }
            type="password"
            placeholder="Confirm password"
            ref={register({
              required: true,
              validate: (value) => {
                return value === watch("password");
              },
            })}
          />
          <span className="icon is-small is-left">
            <FontAwesomeIcon icon={faKey} />
          </span>
        </div>
      </div>
      {errors["password-confirmation"] &&
        errors["password-confirmation"].type === "required" && (
          <p className="help is-danger">
            {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
          </p>
        )}
      {errors["password-confirmation"] &&
        errors["password-confirmation"].type === "validate" && (
          <p className="help is-danger">
            {FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}
          </p>
        )}
      <Pagination
        onPrevious={{ label: "Email", action: onPrevious }}
        nextStepLabel="Avatar"
      />
    </form>
  );
};

export { PasswordInput };
