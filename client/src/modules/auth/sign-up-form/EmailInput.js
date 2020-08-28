import React from "react";
import { FORM_DEFAULT_VALIDATOR } from "../../../forms/formDefaultValidators";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { useForm } from "react-hook-form";
import { Pagination } from "./Pagination";

const EmailInput = ({ onPrevious, onValidInput, defaultValue }) => {
  const { register, handleSubmit, errors } = useForm();

  return (
    <form onSubmit={handleSubmit(onValidInput)}>
      <div className="field">
        <div className="control has-icons-left">
          <input
            name="email"
            className={"input is-large " + (errors["email"] ? "is-danger" : "")}
            type="email"
            placeholder="Email"
            autoFocus={true}
            defaultValue={defaultValue}
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
      <Pagination
        onPrevious={{ label: "Username", action: onPrevious }}
        nextStepLabel="Password"
      />
    </form>
  );
};

export { EmailInput };
