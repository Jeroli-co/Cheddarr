import React, {useContext, useState} from 'react';
import {SignInButton} from "../element/sign-in-button/SignInButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../../context/AuthContext";
import {useParams} from "react-router";

const WaitingAccountConfirmation = () => {

	const { email } = useParams();
	const { resendConfirmation } = useContext(AuthContext);
	const [message, setMessage] = useState("");

	const sendEmail = (email) => {
		resendConfirmation(email).then((status) => {
			const message = status === 200 ? "The email has been resend" : "An error occured, please try again";
			setMessage(message);
		});
	};

	return (
		<div className="WaitingAccountConfirmation" data-testid="WaitingAccountConfirmation">
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							One more step ! Your account needs to be confirmed...
						</h1>
						<h2 className="subtitle">
							Please check your emails and click on the link provided to confirm your account
						</h2>

						<h2 className="subtitle">
							If you already confirmed your account, feel free to sign in to Cheddarr
						</h2>
						<h2 className="subtitle">
							If you have not received the confirmation email, Click on the button below
						</h2>
						<div className="buttons">
							<SignInButton/>
							<button className="button is-rounded is-primary" type="button" onClick={() => sendEmail(email)}>
								<span className="icon">
									<FontAwesomeIcon icon={faEnvelope}/>
								</span>
								<span>Resend email</span>
							</button>
							{ message !== "" && <span>{message}</span>}
						</div>
					</div>
				</div>
			</section>
		</div>
	);
}

export {
	WaitingAccountConfirmation
};

