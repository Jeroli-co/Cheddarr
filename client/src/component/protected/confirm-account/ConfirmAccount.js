import React, {useContext, useEffect, useState} from 'react';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {AccountConfirmed, TokenExpired, AlreadyConfirmed} from "../element/account-confirmation/AccountConfirmation";
import {NotFound} from "../../public/errors/Errors";

const ConfirmAccount = () => {

	const { token } = useParams();
	const { confirmAccount } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
		confirmAccount(token).then((statusCode) => {setCode(statusCode)});
	}, []);

	return (
		<div className="ConfirmAccount" data-testid="ConfirmAccount">
      { code &&
        (
          (code === 200 && <AccountConfirmed/>) ||
          (code === 409 && <AlreadyConfirmed/>) ||
          (code === 410 && <TokenExpired/>) ||
          (code === 404 && <NotFound/>)
        )
      }
		</div>
	);
};

export {
  ConfirmAccount
};

