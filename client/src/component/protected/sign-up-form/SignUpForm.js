import React, {useContext} from 'react';
import './SignUpForm.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUser, faEnvelope, faKey} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import { useForm } from 'react-hook-form'
import {AuthContext} from "../../../context/AuthContext";

const SignUpForm = () => {

  const { register, handleSubmit, errors, watch } = useForm();
  const { signUp } = useContext(AuthContext);

	return (
		<div className="SignUp">

      <div className="hero is-primary">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h1 className="title">
							<p>Create a <span style={{color: "orange"}}>Cheddarr</span> account</p>
						</h1>
					</div>
				</div>
			</div>

			<br />

			<div className="columns is-mobile is-centered">
				<div className="column is-half">

          <form onSubmit={handleSubmit(signUp)}>

            {/* LAST NAME */}
            <div className="field">
              <label className="label">Last name</label>
              <div className="control">
                <input name="lastName"
                       className={'input ' + (errors['lastName'] ? "is-danger" : "")}
                       type="text"
                       placeholder="Enter your last name"
                       ref={register({ required: true })}/>
              </div>
              {errors['lastName'] && (
                <p className="help is-danger">This field is required</p>
              )}
            </div>

            {/* FIRST NAME */}
            <div className="field">
              <label className="label">First name</label>
              <div className="control">
                <input name="firstName"
                       className={'input ' + (errors['firstName'] ? "is-danger" : "")}
                       type="text"
                       placeholder="Enter your first name"
                       ref={register({ required: true })} />
              </div>
              {errors['firstName'] && (
                <p className="help is-danger">This field is required</p>
              )}
            </div>

            {/* USERNAME */}
            <div className="field">
              <label className="label">Username</label>
              <div className="control has-icons-left">
                <input name="username"
                       className={'input ' + (errors['username'] ? "is-danger" : "")}
                       type="text"
                       placeholder="Enter a username"
                       ref={register({ required: true })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faUser} />
                </span>
              </div>
              {errors['username'] && (
                <p className="help is-danger">This is required</p>
              )}
            </div>

            {/* EMAIL */}
            <div className="field">
              <label className="label">Email</label>
              <div className="control has-icons-left">
                <input name="email"
                       className={'input ' + (errors['email'] ? "is-danger" : "")}
                       type="email"
                       placeholder="Enter a valid email"
                       ref={register({ required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faEnvelope} />
                </span>
              </div>
              {errors['email'] && errors['email'].type === 'required' && (
                <p className="help is-danger">This is required</p>
              )}
              {errors['email'] && errors['email'].type === 'pattern' && (
                <p className="help is-danger">This is not a valid email address</p>
              )}
            </div>

            {/* PASSWORD */}
            <div className="field">
              <label className="label">Password</label>
              <div className="control has-icons-left">
                <input name="password"
                       className={'input ' + (errors['password'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Enter a strong password"
                       ref={register({ required: true, pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/ })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password'] && errors['password'].type === 'required' && (
                <p className="help is-danger">Password is required (8 to 15 characters which contain at least one lowercase letter, one uppercase letter, one numeric digit, and one special character)</p>
              )}
              {errors['password'] && errors['password'].type === 'pattern' && (
                <p className="help is-danger">Your password must contain 8 to 15 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character</p>
              )}
            </div>

            {/* PASSWORD CONFIRMATION */}
            <div className="field">
              <label className="label">Confirm password</label>
              <div className="control has-icons-left">
                <input name="password-confirmation"
                       className={'input ' + (errors['password-confirmation'] ? "is-danger" : "")}
                       type="password"
                       placeholder="Confirm your password"
                       ref={register({
                         required: true,
                         pattern: /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/,
                         validate: (value) => {
                          return value === watch('password');
                         }
                       })} />
                <span className="icon is-small is-left">
                  <FontAwesomeIcon icon={faKey} />
                </span>
              </div>
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'required' && (
                <p className="help is-danger">Please confirm your password</p>
              )}
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'pattern' && (
                <p className="help is-danger">Your password must contain 8 to 15 characters with at least one lowercase letter, one uppercase letter, one numeric digit, and one special character</p>
              )}
              {errors['password-confirmation'] && errors['password-confirmation'].type === 'validate' && (
                <p className="help is-danger">Passwords are not equals</p>
              )}
            </div>

            {/* SUBMIT BUTTON */}
            <div className="field">
              <div className="control">
                <button className="button is-link">Sign up</button>
              </div>
            </div>

            <div className="field">
              <div className="control has-text-centered">
                <p className="is-size-7">Already have an account ? <Link to="/sign-in">Sign in</Link></p>
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

