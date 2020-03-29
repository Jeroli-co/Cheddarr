import React, {useContext, useState} from 'react';
import {SignInButton} from "./elements/SignInButton";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faEnvelope} from "@fortawesome/free-solid-svg-icons";
import {AuthContext} from "../../contexts/AuthContext";
import {useParams} from "react-router";

const WaitingEmailConfirmation = () => {

	const { resendConfirmation } = useContext(AuthContext);
	const [httpResponse, setHttpResponse] = useState(null);
	const { email } = useParams();

	const _onResendEmail = () => {
		resendConfirmation(email).then(res => { if (res) setHttpResponse(res) });
	};

	return (
		<section className="WaitingEmailConfirmation hero is-primary is-bold is-fullheight-with-navbar" data-testid="WaitingEmailConfirmation">
			<div className="hero-body">
				<div className="container has-text-centered">
					<h1 className="title is-1">
						One more step ! Your email needs to be confirmed...
					</h1>
					<hr/>
					<h2 className="subtitle">
						Please check your emails and click on the link provided to confirm your account
					</h2>

					<h2 className="subtitle">
						If you already confirmed your account, feel free to sign in to Cheddarr
					</h2>
					<h2 className="subtitle">
						If you have not received the confirmation email, Click on the button below
					</h2>
					<div className="buttons is-centered">
						<SignInButton/>
						<button className="button is-rounded is-primary" type="button" onClick={_onResendEmail}>
							<span className="icon">
								<FontAwesomeIcon icon={faEnvelope}/>
							</span>
							<span>Resend email</span>
						</button>
					</div>
					{ httpResponse && <p>{httpResponse.message}</p> }
				</div>
			</div>
		</section>
	);
};

export {
	WaitingEmailConfirmation
};

