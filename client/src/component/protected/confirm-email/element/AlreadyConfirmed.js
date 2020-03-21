import {SignInButton} from "../../element/sign-in-button/SignInButton";
import React from "react";

const AlreadyConfirmed = () => {
	return (
		<div className="AlreadyConfirmed" data-testid="AlreadyConfirmed">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							Oops this email has been already confirmed...
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
  AlreadyConfirmed
}