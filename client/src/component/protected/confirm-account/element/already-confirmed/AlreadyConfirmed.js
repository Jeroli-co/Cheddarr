import React from 'react';
import './AlreadyConfirmed.css';
import SignInButton from "../../ConfirmAccount";

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

export default AlreadyConfirmed;

