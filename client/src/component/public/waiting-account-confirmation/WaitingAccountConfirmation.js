import React from 'react';
import './WaitingAccountConfirmation.css';
import SignInButton from "../confirm-account/ConfirmAccount";

const WaitingAccountConfirmation = () => {
	return (
		<section className="hero is-large is-primary is-bold">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						One more step ! Account still need confirmation...
					</h1>
					<h2 className="subtitle">
						Please check your emails and click on the link provided to confirm your account
					</h2>
					<h2 className="subtitle">
						If you already confirm your account, feel free to sign in to Cheddarr
					</h2>
					<SignInButton/>
				</div>
			</div>
		</section>
	);
}

export default WaitingAccountConfirmation;

