import {SignInButton} from "../../elements/SignInButton";
import React from "react";

const EmailConfirmed = () => {
	return (
		<section className="EmailConfirmed hero is-primary is-bold is-fullheight-with-navbar" data-testid="EmailConfirmed">
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
	);
};

export {
  EmailConfirmed
}