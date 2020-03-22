import React, {useContext, useEffect} from 'react';
import {AuthContext} from "../../../context/AuthContext";
import {routes} from "../../../routes";

const Authorize = (props) => {

	const { signIn } = useContext(AuthContext);

	useEffect(() => {
		signIn().then(() => props.history.push(routes.HOME.url));
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return <div className="Authorize" data-testid="Authorize" />;
};

export {
	Authorize
};
