import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../contexts/AuthContext";
import {EmailConfirmed} from "./email-confirmed/EmailConfirmed";
import {AlreadyConfirmed} from "../elements/AlreadyConfirmed";
import {TokenExpired} from "../elements/TokenExpired";

const ConfirmEmail = () => {

	const { token } = useParams();
	const { confirmEmail } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
		confirmEmail(token).then(res => {
			switch (res.status) {
				case 200:
					setCode(res.status);
					return;
				case 403:
					setCode(res.status);
					return;
				case 410:
					setCode(res.status);
					return;
				default:
					return;
			}
		});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="ConfirmEmail" data-testid="ConfirmEmail">
      { code &&
        (
          ((code === 200 || code === 201) && <EmailConfirmed/>) ||
          (code === 403 && <AlreadyConfirmed/>) ||
          (code === 410 && <TokenExpired/>)
        )
      }
		</div>
	);
};

export {
  ConfirmEmail
};

