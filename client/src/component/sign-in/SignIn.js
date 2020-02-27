import { faKey, faUser } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from 'react';
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import { signIn } from '../../service/auth/authService';
import './SignIn.css';
function SignIn() {

	const onSubmit = (data) => {
		signIn(data)
	}

	const { register, handleSubmit, errors } = useForm();
	const isInputInvalid = (inputName) => {
		return errors[inputName] ? "is-danger" : "";
	};

	return (
		<div className="SignIn">

			<div className="hero is-primary">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h1 className="title">
							<p>Sign into your <span style={{ color: "orange" }}>Cheddarr</span> account</p>
						</h1>
					</div>
				</div>
			</div>

			<br />

			<div className="columns is-mobile is-centered">
				<div className="column is-half">

					<form id="sign-in-form" onSubmit={handleSubmit(onSubmit)}>

						<div className="field">
							<label className="label">Username or email</label>
							<div className="control has-icons-left">
								<input name="login"
									className={'input ' + isInputInvalid('login')}
									type="text"
									placeholder="Enter your username or email"
									ref={register({ required: true })} />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faUser} />
								</span>
								{errors['login'] && (
									<p className="help is-danger">Username or email is required</p>
								)}
							</div>
						</div>

						<div className="field">
							<label className="label">Password</label>
							<div className="control has-icons-left">
								<input name="password"
									className={'input ' + isInputInvalid('password')}
									type="password"
									placeholder="Enter your password"
									ref={register({ required: true })} />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faKey} />
								</span>
							</div>
							{errors['password'] && errors['password'].type === 'required' && (
								<p className="help is-danger">Password is required </p>
							)}
						</div>

						<div className="field is-grouped">
							<div className="control">
								<button className="button is-link">Sign in</button>
							</div>
							<div className="control">
								<p className="is-size-7">Still not have an account ? <Link to="/sign-up">Sign up</Link></p>
							</div>
						</div>

					</form>

				</div>
			</div>

		</div>
	);
}

export default SignIn;

