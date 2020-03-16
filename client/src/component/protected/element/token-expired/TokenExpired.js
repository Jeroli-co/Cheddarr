import {SignUpButton} from "../../element/sign-up-button/SignUpButton";
import React from "react";

const TokenExpired = () => {
	return (
		<div className="TokenExpired" data-testid="TokenExpired">
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
		</div>
	);
};

export {
  TokenExpired
}