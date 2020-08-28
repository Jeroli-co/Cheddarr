import React from "react";
import { FORM_DEFAULT_VALIDATOR } from "../../../forms/formDefaultValidators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { Pagination } from "./Pagination";

const UsernameInput = ({ onValidInput, defaultValue }) => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <form onSubmit={handleSubmit(onValidInput)}>
      <div className="field">
        <div className="control has-icons-left">
          <input
            name="username"
            className={
              "input is-large " + (errors["username"] ? "is-danger" : "")
            }
            type="text"
            placeholder="Username"
            defaultValue={defaultValue}
            ref={register({
              required: true,
              minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
              maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
              pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value,
            })}
          />
          <span className="icon is-left">
            <FontAwesomeIcon icon={faUser} />
          </span>
        </div>
      </div>
      {errors["username"] && errors["username"].type === "required" && (
        <p className="help is-danger">
          {FORM_DEFAULT_VALIDATOR.REQUIRED.message}
        </p>
      )}
      {errors["username"] && errors["username"].type === "minLength" && (
        <p className="help is-danger">
          {FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}
        </p>
      )}
      {errors["username"] && errors["username"].type === "maxLength" && (
        <p className="help is-danger">
          {FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}
        </p>
      )}
      {errors["username"] && errors["username"].type === "pattern" && (
        <p className="help is-danger">
          {FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}
        </p>
      )}

      <Pagination nextStepLabel="Email" />
    </form>
  );
};

export { UsernameInput };
