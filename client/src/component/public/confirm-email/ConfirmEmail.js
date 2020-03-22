import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {EmailConfirmed} from "./element/EmailConfirmed";
import {AlreadyConfirmed} from "../../protected/element/already-confirmed/AlreadyConfirmed";
import {TokenExpired} from "../../protected/element/token-expired/TokenExpired";

const ConfirmEmail = () => {

	const { token } = useParams();
	const { confirmEmail } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
		confirmEmail(token).then(res => {
			switch (res.status) {
				case 200:
				case 201:
				case 409:
				case 410:
					setCode(res.status);
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

