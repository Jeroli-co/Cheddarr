import React, {useContext, useState} from 'react';
import {faKey, faUser} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useForm } from 'react-hook-form';
import {Link, Route, useLocation} from "react-router-dom";
import {AuthContext} from "../../../context/AuthContext";
import {routes} from "../../../routes";
import {FORM_DEFAULT_VALIDATOR} from "../../../formDefaultValidators";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SignInForm = (props) => {

	const { signIn } = useContext(AuthContext);
	const { register, handleSubmit, errors } = useForm();

	const [rememberMe, setRememberMe] = useState(false);
	const [httpResponse, setHttpResponse] = useState(null);
  const query = useQuery();

	const onSubmit = (data) => {
		signIn(data).then(res => {
			switch (res.status) {
				case 200:
					let redirectURI = query.get('redirectURI');
					redirectURI = redirectURI ? redirectURI : routes.HOME.url;
					props.history.push(redirectURI);
					return;
				case 400:
					setHttpResponse(res);
					return;
				case 401:
					setHttpResponse(res);
					return;
				default:
					break;
			}
		});
	};

	return (
		<div className="SignInForm" data-testid="SignInForm">

			<div className="hero is-primary">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h1 className="title">
							<p>Sign into your <span className="has-text-secondary">Cheddarr</span> account</p>
						</h1>
					</div>
				</div>
			</div>

			<br />

			<div className="columns is-mobile is-centered">
				<div className="column is-one-third-desktop is-half-tablet is-three-quarters-mobile">

					<form id="sign-in-form" onSubmit={handleSubmit(onSubmit)}>

						<div className="field">
							<label className="label">Username or email</label>
							<div className="control has-icons-left">
								<input name="usernameOrEmail"
									className={'input is-medium ' + (errors['usernameOrEmail'] ? "is-danger" : "")}
									type="text"
									placeholder="Enter your username or email"
									ref={register({
										required: true,
										minLength: FORM_DEFAULT_VALIDATOR.MIN_LENGTH.value,
										maxLength: FORM_DEFAULT_VALIDATOR.MAX_LENGTH.value,
									})}
								/>
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faUser} />
								</span>
								{errors['usernameOrEmail'] && errors['usernameOrEmail'].type === 'required' && (
									<p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
								)}
								{errors['usernameOrEmail'] && errors['usernameOrEmail'].type === 'minLength' && (
									<p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MIN_LENGTH.message}</p>
								)}
								{errors['usernameOrEmail'] && errors['usernameOrEmail'].type === 'maxLength' && (
									<p className="help is-danger">{FORM_DEFAULT_VALIDATOR.MAX_LENGTH.message}</p>
								)}
							</div>
						</div>

						<div className="field">
							<label className="label">Password</label>
							<div className="control has-icons-left">
								<input name="password"
									className={'input is-medium ' + (errors['password'] ? "is-danger" : "")}
									type="password"
									placeholder="Enter your password"
									ref={register({
										required: true,
										pattern: FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.value
									})} />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faKey} />
								</span>
							</div>
							{errors['password'] && errors['password'].type === 'required' && (
								<p className="help is-danger">{FORM_DEFAULT_VALIDATOR.REQUIRED.message}</p>
							)}
							{errors['password'] && errors['password'].type === 'pattern' && (
								<p className="help is-danger">{FORM_DEFAULT_VALIDATOR.PASSWORD_PATTERN.message}</p>
							)}
						</div>

						{ httpResponse && (
								(httpResponse.status === 400 && <p className="help is-danger">{httpResponse.message}</p>) ||
								(httpResponse.status === 401 && <p className="help is-danger">{httpResponse.message} <span className="has-link-style" onClick={() => props.history.push(routes.RESEND_EMAIL_CONFIRMATION.url)}>Click here</span> to resend the email</p>)
							)
						}

						<div className="field">
							<div className="control">
								<input id="remember" type="checkbox" name="remember" className="switch is-rounded is-small" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} ref={register} />
								<label htmlFor="remember">Remember me</label>
							</div>
						</div>

						<div className="field">
							<div className="control">
								<button className="button is-secondary-button">Sign in</button>
							</div>
						</div>

						<div className="field has-text-centered">
							<p className="is-size-7">Forgot your password ? <Link to={routes.INIT_RESET_PASSWORD.url}>Click here to reset it</Link></p>
							<p className="is-size-7">Still not have an account ? <Link to={routes.SIGN_UP.url}>Sign up</Link></p>
						</div>

					</form>

				</div>
			</div>

			<Route exact path={routes.INIT_RESET_PASSWORD.url} component={routes.INIT_RESET_PASSWORD.component} />

		</div>
	);
};

export {
	SignInForm
};

