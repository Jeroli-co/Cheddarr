import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {TokenExpired} from "../element/token-expired/TokenExpired";
import {ResetPasswordForm} from "./element/reset-password-form/ResetPasswordForm";

const ResetPassword = () => {

	const { token } = useParams();
	const [statusCode, setStatusCode] = useState(null);
	const { checkResetPasswordToken } = useContext(AuthContext);

	useEffect(() => {
		checkResetPasswordToken(token).then((statusCode) => setStatusCode(statusCode))
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="ResetPassword" data-testid="ResetPassword">
			{
				statusCode &&
				(
					(statusCode === 410 && <TokenExpired/>) ||
					(statusCode === 200 &&
						<div>
							<div className="hero is-primary">
								<div className="hero-body">
									<div className="container has-text-centered">
										<h1 className="title">
											<p>Reset your <span className="has-text-secondary">Cheddarr</span> password account</p>
										</h1>
									</div>
								</div>
							</div>

							<br />

							<ResetPasswordForm token={token}/>

						</div>
					)
				)
			}
		</div>
	);
};

export {
	ResetPassword
};

