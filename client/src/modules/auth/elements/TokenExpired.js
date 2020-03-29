import {SignUpButton} from "./SignUpButton";
import React from "react";

const TokenExpired = () => {
	return (
		<div className="TokenExpired hero is-primary is-bold is-fullheight-with-navbar" data-testid="TokenExpired">
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
		</div>
	);
};

export {
  TokenExpired
}