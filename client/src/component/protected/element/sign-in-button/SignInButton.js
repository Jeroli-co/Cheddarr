import React from 'react';
import './SignInButton.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function SignInButton() {
	return (
		<Link className="button is-rounded is-primary" to="/sign-in">
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

