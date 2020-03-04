import React from 'react';
import './SignUpButton.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function SignUpButton() {
	return (
		<Link className="button is-rounded is-primary" to="/sign-up">
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

