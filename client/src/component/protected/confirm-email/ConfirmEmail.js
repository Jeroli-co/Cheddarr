import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {EmailConfirmed} from "./element/EmailConfirmed";
import {AlreadyConfirmed} from "./element/AlreadyConfirmed";
import {TokenExpired} from "../element/token-expired/TokenExpired";

const ConfirmEmail = () => {

	const { token } = useParams();
	const { confirmEmail } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
		confirmEmail(token).then((statusCode) => {setCode(statusCode)});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="ConfirmEmail" data-testid="ConfirmEmail">
      { code &&
        (
          ((code === 200 || code === 201) && <EmailConfirmed/>) ||
          (code === 409 && <AlreadyConfirmed/>) ||
          (code === 410 && <TokenExpired/>)
        )
      }
		</div>
	);
};

export {
  ConfirmEmail
};

