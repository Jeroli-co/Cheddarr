import React from 'react';
import './TokenExpired.css';
import SignUpButton from "../sign-up-button/SignUpButton";

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

export default TokenExpired;

