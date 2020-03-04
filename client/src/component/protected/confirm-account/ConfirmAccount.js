import React, {useContext, useEffect, useState} from 'react';
import './ConfirmAccount.css';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import {AccountConfirmed, TokenExpired, AlreadyConfirmed} from "../element/account-confirmation/AccountConfirmation";
import {NotFound} from "../../public/not-found/NotFound";

const ConfirmAccount = () => {

	const { token } = useParams();
	const { confirmAccount } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
	  if (code) { return }
		confirmAccount(token).then((statusCode) => {setCode(statusCode)});
	}, []);

	return (
		<div className="ConfirmAccount">
      { code &&
        (
          (code === '200' && <AccountConfirmed/>) ||
          (code === '409' && <AlreadyConfirmed/>) ||
          (code === '410' && <TokenExpired/>) ||
          (code === '404' && <NotFound/>)
        )
      }
		</div>
	);
};

export {
  ConfirmAccount
};

