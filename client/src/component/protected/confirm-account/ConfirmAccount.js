import React, {useEffect, useState} from 'react';
import './ConfirmAccount.css';
import {useParams} from "react-router";
import axios from 'axios';
import SignUpButton from "../element/sign-up-button/SignUpButton";
import SignInButton from "../element/sign-in-button/SignInButton";

const ConfirmAccount = () => {

	const messageTypes = {
		EXPIRED: '410',
		ALREADY_CONFIRMED: '409',
		ACCOUNT_CONFIRMED: 'account_confirmed',
		NOT_FOUND: '404'
	};

	const { token } = useParams();

	const [state, setState] = useState('');

	useEffect(() => {
		axios.get('/api/confirm/' + token)
		.then(() => {
			setState(messageTypes.ACCOUNT_CONFIRMED);
		})
		.catch((e) => {
			const errorArray = e.toString().split(' ');
			const statusCode = errorArray[errorArray.length - 1];
			switch (statusCode) {
				case messageTypes.ALREADY_CONFIRMED:
					setState(messageTypes.ALREADY_CONFIRMED);
					break;
				case messageTypes.EXPIRED:
					setState(messageTypes.EXPIRED);
					break;
				default:
					setState(messageTypes.NOT_FOUND);
			}
		});
	}, []);

	const TokenExpired = () => {
		return (
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
		)
	};

	const AlreadyConfirmed = () => {
		return (
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							Oops this account has been already confirmed...
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

	const AccountConfirmed = () => {
		return (
			<section className="hero is-large is-primary is-bold">
				<div className="hero-body">
					<div className="container">
						<h1 className="title">
							Well done ! You confirmed your account !
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

	return (
		<div className="ConfirmAccount">
			{ state &&
				(state === messageTypes.EXPIRED && <TokenExpired/>) ||
				(state === messageTypes.ALREADY_CONFIRMED && <AlreadyConfirmed/>) ||
				(state === messageTypes.ACCOUNT_CONFIRMED && <AccountConfirmed/>) ||
				(state === messageTypes.NOT_FOUND && <p>404</p>)
			}
		</div>
	);
};

export default ConfirmAccount;

