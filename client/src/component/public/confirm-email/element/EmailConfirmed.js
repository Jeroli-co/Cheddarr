import {SignInButton} from "../../../protected/element/sign-in-button/SignInButton";
import React from "react";

const EmailConfirmed = () => {
	return (
		<div className="EmailConfirmed" data-testid="EmailConfirmed">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							Well done ! You confirmed your email !
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
  EmailConfirmed
}