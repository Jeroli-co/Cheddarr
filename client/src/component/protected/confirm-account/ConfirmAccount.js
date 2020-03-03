import React, {useContext, useEffect, useState} from 'react';
import './ConfirmAccount.css';
import {useParams} from "react-router";
import {AuthContext} from "../../../context/AuthContext";
import AccountConfirmed from "./element/account-confirmed/AccountConfirmed";
import AlreadyConfirmed from "./element/already-confirmed/AlreadyConfirmed";
import TokenExpired from "../element/token-expired/TokenExpired";
import NotFound from "../../public/not-found/NotFound";

const ConfirmAccount = () => {

	const { token } = useParams();
	const { confirmAccount } = useContext(AuthContext);
  const [code, setCode] = useState(null);

	useEffect(() => {
	  if (code) { return }
		confirmAccount(token).then((statusCode) => {setCode(statusCode)});
	}, []);

  console.log('code:' + code);
  console.log('token:' + token);

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

export default ConfirmAccount;

