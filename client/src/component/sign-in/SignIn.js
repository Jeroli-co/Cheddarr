import React from 'react';
import './SignIn.css';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faKey, faUser} from "@fortawesome/free-solid-svg-icons";
import {Link} from "react-router-dom";

function SignIn() {

	const onSubmit = data => console.log(data);

	return (
		<div className="SignIn">

			<div className="hero is-primary">
				<div className="hero-body">
					<div className="container has-text-centered">
						<h1 className="title">
							<p>Sign into your <span style={{color: "orange"}}>Cheddarr</span> account</p>
						</h1>
					</div>
				</div>
			</div>

			<br />

			<div className="columns is-mobile is-centered">
				<div className="column is-half">

					<form id="sign-in-form" onSubmit={onSubmit}>

						<div className="field">
							<label className="label">Username or email</label>
							<div className="control has-icons-left">
								<input className="input" type="text" placeholder="Enter your username or email" />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faUser} />
								</span>
							</div>
						</div>

						<div className="field">
							<label className="label">Password</label>
							<div className="control has-icons-left">
								<input className="input" type="password" placeholder="Enter a strong password" />
								<span className="icon is-small is-left">
									<FontAwesomeIcon icon={faKey} />
								</span>
							</div>
						</div>

						<div className="field is-grouped">
							<div className="control">
								<button className="button is-link">Sign in</button>
							</div>
							<div className="control">
								<p className="is-size-7">Still not have an account ? <Link to="/sign-up">Sign up</Link></p>
							</div>
						</div>

					</form>

				</div>
			</div>

		</div>
	);
}

export default SignIn;

