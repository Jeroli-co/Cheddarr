import React from 'react';
import { SignInButton } from "../sign-in-button/SignInButton";
import { SignUpButton } from "../sign-up-button/SignUpButton";

const AlreadyConfirmed = () => {
	return (
		<section className="hero is-large is-primary is-bold">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						Oops this account has been already confirmed...
					</h1>
					<h2 className="subtitle">
						Please try to sign in
					</h2>
					<SignInButton/>
				</div>
			</div>
		</section>
	);
};

const AccountConfirmed = () => {
	return (
		<section className="hero is-large is-primary is-bold" data-testid="AccountConfirmed">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						Well done ! You confirmed your account !
					</h1>
					<h2 className="subtitle">
						Please try to sign in
					</h2>
					<SignInButton/>
				</div>
			</div>
		</section>
	);
};

const TokenExpired = () => {
	return (
		<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							Oops this link has expired...
						</h1>
						<h2 className="subtitle">
							Please try to sign up again
						</h2>
						<SignUpButton/>
					</div>
				</div>
			</section>
	);
};

export {
	AlreadyConfirmed,
	AccountConfirmed,
	TokenExpired
};

