import React, {useContext, useState} from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faEnvelope, faKey} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import { useForm } from 'react-hook-form'
import {AuthContext} from "../../../context/AuthContext";
import {routes} from "../../../routes";
import {FORM_DEFAULT_VALIDATOR} from "../../../formDefaultValidators";

const SignUpForm = (props) => {

  const { register, handleSubmit, errors, watch } = useForm();
  const { signUp } = useContext(AuthContext);
  const [httpResponse, setHttpResponse] = useState(null);

  const onSubmit = (data) => {
    signUp(data).then(res => {
      switch (res.status) {
        case 201:
          props.history.push(routes.WAIT_EMAIL_CONFIRMATION.url);
          return;
        case 409:
          setHttpResponse(res);
          return;
        default:
          return;
      }
    });
  };

	return (
		<div className="SignUpForm" data-testid="SignUpForm">

      <div className="hero is-primary">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h1 className="title">
							<p>Create a <span className="has-text-secondary">Cheddarr</span> account</p>
						</h1>
					</div>
				</div>
			</div>

			<br />

			<div className="columns is-mobile is-centered">
				<div className="column is-one-third">

          <h5 className="subtitle is-5">Create your account</h5>

          <form onSubmit={handleSubmit(onSubmit)}>

            {/* USERNAME */}
            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left">
                <input name="username"
                       className={'input is-medium ' + (errors['username'] ? "is-danger" : "")}
                       type="text"
                       placeholder="Enter a username"
                       ref={register({
                         required: true,
                         minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
                         maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                         pattern: FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.value
                       })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              {errors['username'] && errors['username'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['username'] && errors['username'].type === 'minLength' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}</p>
              )}
              {errors['username'] && errors['username'].type === 'maxLength' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</p>
              )}
              {errors['username'] && errors['username'].type === 'pattern' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.USERNAME_PATTERN.message}</p>
              )}
            </div>


            {/* EMAIL */}
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input name="email"
                       className={'input is-medium ' + (errors['email'] ? "is-danger" : "")}
                       type="email"
                       placeholder="Enter a valid email"
                       ref={register({
                         required: true,
                         maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
                         pattern: FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.value
                       })}
                />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {errors['email'] && errors['email'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['email'] && errors['email'].type === 'maxLength' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</p>
              )}
              {errors['email'] && errors['email'].type === 'pattern' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.EMAIL_PATTERN.message}</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input name="password"
                       className={'input is-medium ' + (errors['password'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Enter a strong password"
                       ref={register({ required: true, pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password'] && errors['password'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}</p>
              )}
              {errors['password'] && errors['password'].type === 'pattern' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}</p>
              )}
            </div>

            {/* PASSWORD CONFIRMATION */}
            <div className="field">
              <label className="label">Confirm password</label>
              <div className="control has-icons-left">
                <input name="password-confirmation"
                       className={'input is-medium ' + (errors['password-confirmation'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Confirm your password"
                       ref={register({
                         required: true,
                         validate: (value) => {
                           return value === watch('password');
                         }
                       })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'required' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
              )}
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'validate' && (
                <p className="help is-danger">{FORM_DEFAULT_VALIDATOR.WATCH_PASSWORD.message}</p>
              )}
            </div>

            { httpResponse && (
                (httpResponse.status === 409 && <p className="help is-danger">{httpResponse.message}</p>)
              )
            }

            {/* SUBMIT BUTTON */}
            <div className="field">
              <div className="control">
                <button className="button is-secondary-button">Sign up</button>
              </div>
            </div>

            <div className="field">
              <div className="control has-text-centered">
                <p className="is-size-7">Already have an account ? <Link to={routes.SIGN_IN.url}>Sign in</Link></p>
              </div>
            </div>

          </form>

				</div>
			</div>

		</div>
	);
}

export {
  SignUpForm
};

