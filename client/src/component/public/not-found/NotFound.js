import React from 'react';
import './NotFound.css';
import SignUpButton from "../../protected/element/token-expired/TokenExpired";

const NotFound = () => {
	return (
		<section className="hero is-large is-primary is-bold">
			<div className="hero-body">
				<div className="container">
					<h1 className="title">
						404 ! Oops the resource has not been found...
					</h1>
					<SignUpButton/>
				</div>
			</div>
		</section>
	);
};

export default NotFound;

