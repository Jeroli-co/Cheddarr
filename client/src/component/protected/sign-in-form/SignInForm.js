import React, {useContext, useState} from 'react';
import {faKey, faUser} from "@fortawesome/free-solid-svg-icons";
import {faGoogle, faFacebook} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import {AuthContext} from "../../../context/AuthContext";
import {InitResetPasswordModal} from "../element/init-reset-password-modal/InitResetPasswordModal";
import {ResendAccountConfirmationEmailModal} from "../element/resend-account-confirmation-email-modal/ResendAccountConfirmationEmailModal";

const SignInForm = () => {

	const { signIn, signInWithGoogle, signInWithFacebook } = useContext(AuthContext);
	const { register, handleSubmit, errors } = useForm();

	const [rememberMe, setRememberMe] = useState(false);
	const [showResetPassword, setShowResetPassword] = useState(false);
	const [showResendConfirmAccount, setShowResendConfirmAccount] = useState(false);
	const [status, setStatus] = useState(null);

	const onSubmit = (data) => {
		signIn(data).then((status) => setStatus(status));
	};

	return (
		<div className="SignInForm" data-testid="SignInForm">

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
				<div className="column is-one-quarter">

					<form id="sign-in-form" onSubmit={handleSubmit(onSubmit)}>

						<div className="field">
							<label className="label">Username or email</label>
							<div className="control has-icons-left">
								<input name="usernameOrEmail"
									className={'input ' + (errors['usernameOrEmail'] ? "is-danger" : "")}
									type="text"
									placeholder="Enter your username or email"
									ref={register({ required: true })} />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faUser} />
								</span>
								{errors['usernameOrEmail'] && (
									<p className="help is-danger">Username or email is required</p>
								)}
							</div>
						</div>

						<div className="field">
							<label className="label">Password</label>
							<div className="control has-icons-left">
								<input name="password"
									className={'input ' + (errors['password'] ? "is-danger" : "")}
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

						{ status &&
							(status === 400 && <p className="help is-danger">Unable to sign in. Wrong credentials...</p>) ||
							(status === 401 && <p className="help is-danger">Account need to be confirmed. Please check your inbox or <a onClick={() => setShowResendConfirmAccount(true)}>Click here</a> to resend the email</p>)
						}

						<div className="field">
							<div className="control">
								<input id="remember" type="checkbox" name="remember" className="switch is-rounded is-small" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} ref={register} />
								<label htmlFor="remember">Remember me</label>
							</div>
						</div>

						<div className="field">
							<div className="control">
								<button className="button is-link">Sign in</button>
							</div>
						</div>

					</form>

					<div className="is-divider" data-content="OR"/>

					<h1 className="subtitle is-5">Sign in with</h1>

					<div className="buttons">
						<button className="button is-rounded" type="button" onClick={signInWithGoogle}>
							<span className="icon">
								<FontAwesomeIcon icon={faGoogle}/>
							</span>
							<span>Google</span>
						</button>
						<button className="button is-rounded is-info" type="button" onClick={signInWithFacebook}>
							<span className="icon">
								<FontAwesomeIcon icon={faFacebook}/>
							</span>
							<span>Facebook</span>
						</button>
					</div>

					<div className="has-text-centered">
						<p className="is-size-7">Forgot your password ? <a onClick={() => setShowResetPassword(true)}>Click here to reset it</a></p>
						<p className="is-size-7">Still not have an account ? <Link to="/sign-up">Sign up</Link></p>
					</div>

				</div>
			</div>

			<ResendAccountConfirmationEmailModal isActive={showResendConfirmAccount} onClose={() => setShowResendConfirmAccount(false)} />
			<InitResetPasswordModal isActive={showResetPassword} onClose={() => setShowResetPassword(false)} />

		</div>
	);
};

export {
	SignInForm
};

