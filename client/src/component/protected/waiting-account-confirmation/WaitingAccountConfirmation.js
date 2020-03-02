import React, {useContext} from 'react';
import './WaitingAccountConfirmation.css';
import SignInButton from "../element/sign-in-button/SignInButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../context/AuthContext";
import {useParams} from "react-router";

const WaitingAccountConfirmation = () => {

	const { resendConfirmation } = useContext(AuthContext);
	const { email } = useParams();

	return (
		<section className="hero is-large is-primary is-bold">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						One more step ! Account still need confirmation...
					</h1>
					<h2 className="subtitle">
						Please check your emails and click on the link provided to confirm your account
					</h2>
					<h2 className="subtitle">
						If you already confirm your account, feel free to sign in to Cheddarr
					</h2>
					<SignInButton/>
					<h2 className="subtitle">
						If you have not receive the confirmation email, <a>Click here to resend it</a>
					</h2>
					<button className="button is-rounded is-primary" type="button" onClick={resendConfirmation(email)}>
						<span className="icon">
							<FontAwesomeIcon icon={faEnvelope}/>
						</span>
						<span>Resend email</span>
					</button>
				</div>
			</div>
		</section>
	);
}

export default WaitingAccountConfirmation;
