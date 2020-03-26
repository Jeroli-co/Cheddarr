import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../contexts/AuthContext";
import {TokenExpired} from "../elements/TokenExpired";
import {ResetPasswordForm} from "./reset-password-form/ResetPasswordForm";
import {AlreadyConfirmed} from "../elements/AlreadyConfirmed";

const ResetPassword = () => {

	const { token } = useParams();
	const [httpResponse, setHttpResponse] = useState(null);
	const { checkResetPasswordToken } = useContext(AuthContext);

	useEffect(() => {
		checkResetPasswordToken(token).then(res => {
			setHttpResponse(res);
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="ResetPassword" data-testid="ResetPassword">
			{
				httpResponse &&
				(
					(httpResponse.status === 410 && <TokenExpired/>) ||
					(httpResponse.status === 403 && <AlreadyConfirmed/>) ||
					(httpResponse.status === 200 &&
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

							<ResetPasswordForm token={token} />

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

