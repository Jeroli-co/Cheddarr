import {SignInButton} from "../../element/sign-in-button/SignInButton";
import React from "react";

const AccountConfirmed = () => {
	return (
		<div className="AccountConfirmed" data-testid="AccountConfirmed">
			<section className="hero is-large is-primary is-bold">
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
		</div>
	);
};

export {
  AccountConfirmed
}