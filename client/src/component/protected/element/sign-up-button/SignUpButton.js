import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function SignUpButton() {
	return (
		<Link className="button is-rounded is-secondary-button" to="/sign-up" data-testid="SignUpButton">
			<span className="icon">
				<FontAwesomeIcon icon={faUserPlus}/>
			</span>
			<span>Sign up</span>
		</Link>
	);
}

export {
	SignUpButton
};

