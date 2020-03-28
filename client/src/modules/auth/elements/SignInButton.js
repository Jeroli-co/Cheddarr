import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";
import {routes} from "../../../router/routes";

function SignInButton() {
	return (
		<Link className="button is-rounded is-secondary-button" to={routes.SIGN_IN.url} data-testid="SignInButton">
			<span className="icon">
				<FontAwesomeIcon icon={faSignInAlt}/>
			</span>
			<span>Sign in</span>
		</Link>
	);
}

export {
	SignInButton
};

