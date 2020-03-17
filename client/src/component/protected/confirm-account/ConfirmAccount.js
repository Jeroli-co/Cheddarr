import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {AccountConfirmed} from "./element/AccountConfirmed";
import {AlreadyConfirmed} from "./element/AlreadyConfirmed";
import {TokenExpired} from "../element/token-expired/TokenExpired";

const ConfirmAccount = () => {

	const { token } = useParams();
	const { confirmAccount } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
		confirmAccount(token).then((statusCode) => {setCode(statusCode)});
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return (
		<div className="ConfirmAccount" data-testid="ConfirmAccount">
      { code &&
        (
          (code === 201 && <AccountConfirmed/>) ||
          (code === 409 && <AlreadyConfirmed/>) ||
          (code === 410 && <TokenExpired/>)
        )
      }
		</div>
	);
};

export {
  ConfirmAccount
};

