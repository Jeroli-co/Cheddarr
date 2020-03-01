import React, {useContext, useState} from 'react';
import {faEnvelope, faKey, faSignInAlt, faUser} from "@fortawesome/free-solid-svg-icons";
import {faGoogle, faFacebook, faGithub, faGitlab, faSlack} from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from 'react-hook-form';
import { Link } from "react-router-dom";
import './SignIn.css';
import {AuthContext} from "../../../context/AuthContext";

const SignIn = () => {

	const { signIn } = useContext(AuthContext);
	const { register, handleSubmit, errors } = useForm();

	const [rememberMe, setRememberMe] = useState(false);
	const [showResetPassword, setShowResetPassword] = useState(false);

	const isInputInvalid = (inputName) => {
		return errors[inputName] ? "is-danger" : "";
	};

	const Headband = () => {
		return (
			<div className="hero is-primary">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h1 className="title">
							<p>Sign into your <span style={{ color: "orange" }}>Cheddarr</span> account</p>
						</h1>
					</div>
				</div>
			</div>
		)
	};

	const ResetPassword = () => {

		const { register, handleSubmit, errors } = useForm();

		const closeModal = () => {
			setShowResetPassword(false);
		};

		const getInputValidity = () => {
			return errors['email-to-reset-password'] ? "is-danger" : ""
		};

		return (
			<div className="modal is-active">
				<div className="modal-background" onClick={closeModal} />
				<div className="modal-card">
					<header className="modal-card-head">
						<p className="modal-card-title">Reset your password</p>
						<button className="delete" aria-label="close" onClick={closeModal}/>
					</header>
					<section className="modal-card-body">
						<form id="reset-password-form" onSubmit={handleSubmit(() => {console.log('submit valid')})}>
							<div className="field">
								<label className="label">Email</label>
								<div className="control has-icons-left">
									<input name="email-to-reset-password"
												 className={'input ' + getInputValidity()}
												 type="email"
												 placeholder="Enter a valid email"
												 ref={register({ required: true, pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/i })} />
									<span className="icon is-small is-left">
										<FontAwesomeIcon icon={faEnvelope} />
									</span>
								</div>
								{errors['email-to-reset-password'] && errors['email-to-reset-password'].type === 'required' && (
									<p className="help is-danger">This is required</p>
								)}
								{errors['email-to-reset-password'] && errors['email-to-reset-password'].type === 'pattern' && (
									<p className="help is-danger">This is not a valid email address</p>
								)}
							</div>
						</form>
					</section>
					<footer className="modal-card-foot">
						<button className="button is-info">Reset password</button>
						<button className="button" onClick={closeModal}>Cancel</button>
					</footer>
				</div>
			</div>
		);
	};

	return (
		<div className="SignIn">

			{
				showResetPassword && <ResetPassword/>
			}

			<Headband/>

			<br />

			<div className="columns is-mobile is-centered">
				<div className="column is-half">

					<h1 className="subtitle is-4">Sign in with</h1>

					<form id="sign-in-form" onSubmit={handleSubmit(signIn)}>

						<div className="field">
							<label className="label">Username or email</label>
							<div className="control has-icons-left">
								<input name="usernameOrEmail"
									className={'input ' + isInputInvalid('usernameOrEmail')}
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

					<h1 className="subtitle is-4">With an account you already possess</h1>

					<div className="buttons is-centered">
						<button className="button is-rounded" type="button">
							<span className="icon">
								<FontAwesomeIcon icon={faGoogle}/>
							</span>
							<span>Google</span>
						</button>
						<button className="button is-rounded is-info" type="button">
							<span className="icon">
								<FontAwesomeIcon icon={faFacebook}/>
							</span>
							<span>Facebook</span>
						</button>
						<button id="github-sign-in-button" className="button is-rounded" type="button">
							<span className="icon">
								<FontAwesomeIcon icon={faGithub}/>
							</span>
							<span>Github</span>
						</button>
						<button id="gitlab-sign-in-button" className="button is-rounded is-primary" type="button">
							<span className="icon">
								<FontAwesomeIcon icon={faGitlab}/>
							</span>
							<span>Gitlab</span>
						</button>
						<button className="button is-rounded is-primary" type="button">
							<span className="icon">
								<FontAwesomeIcon icon={faSlack}/>
							</span>
							<span>Slack</span>
						</button>
					</div>

					<div className="has-text-centered">
						<p className="is-size-7">Forgot your password ? <a onClick={() => setShowResetPassword(true)}>Click here to reset it</a></p>
						<p className="is-size-7">Still not have an account ? <Link to="/sign-up">Sign up</Link></p>
					</div>
				</div>
			</div>

		</div>
	);
};

export default SignIn;

