import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../context/AuthContext";

const Authorize = (props) => {

	const { signIn } = useContext(AuthContext);
	useEffect(() => {
		signIn();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div className="Authorize" data-testid="Authorize" />;
};

export {
	Authorize
};

